import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from pytrends.request import TrendReq
from django.http import JsonResponse
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class TrendView(APIView):
    def post(self, request):
        categories = request.data.get('categories', [])
        timespan = request.data.get('timespan', 'last_month')
        country = request.data.get('country', '')

        if not categories:
            return JsonResponse({'error': 'At least one category is required'}, status=400)

        pytrends = TrendReq(hl='en-US')

        # Map timespan to correct Google Trends API format
        if timespan == 'last_hour':
            timeframe = 'now 1-H'
        elif timespan == 'last_day':
            timeframe = 'now 1-d'
        elif timespan == 'last_week':
            timeframe = 'now 7-d'
        elif timespan == 'last_month':
            timeframe = 'today 1-m'
        elif timespan == 'last_3_months':
            timeframe = 'today 3-m'
        elif timespan == 'last_year':
            timeframe = 'today 12-m'
        else:
            return JsonResponse({'error': 'Invalid timespan'}, status=400)

        try:
            pytrends.build_payload(categories, cat=0, timeframe=timeframe, geo=country, gprop='')
            interest_over_time = pytrends.interest_over_time()

            if interest_over_time.empty:
                return JsonResponse({'error': 'No trend data available for the categories'}, status=400)

            # Resample data based on timespan
            if len(interest_over_time) > 100:
                if timespan == 'last_hour':
                    interest_over_time = interest_over_time.resample('1T').mean()  # Every minute
                elif timespan == 'last_day':
                    interest_over_time = interest_over_time.resample('15T').mean()  # Every 15 minutes
                elif timespan == 'last_week':
                    interest_over_time = interest_over_time.resample('2H').mean()
                elif timespan == 'last_month':
                    interest_over_time = interest_over_time.resample('12H').mean()
                elif timespan == 'last_3_months':
                    interest_over_time = interest_over_time.resample('D').mean()
                elif timespan == 'last_year':
                    interest_over_time = interest_over_time.resample('4D').mean()  # Every 4 days

            chart_data = interest_over_time.reset_index().to_dict('records')

            logger.debug('Chart Data Response: %s', chart_data)
            return Response({'chartData': chart_data})

        except Exception as e:
            logger.exception("An error occurred in TrendView: %s", str(e))
            return JsonResponse({'error': str(e)}, status=500)