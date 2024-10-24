# views.py
from django.http import JsonResponse
from django.views import View
import requests
import json
import os
import pandas as pd
from datetime import datetime
from statsmodels.tsa.arima.model import ARIMA

class ProductSummaryView(View):
    def get(self, request):
        username = request.GET.get('username', 'johndoe')
        password = request.GET.get('password', 'password123')
        
        # Create a session and login
        session = requests.Session()
        login_url = "http://localhost:5000/api/v1/auth/login"
        login_response = session.post(
            login_url, 
            json={"username": username, "password": password}
        )

        if login_response.status_code != 200:
            return JsonResponse({
                'success': False,
                'message': f"Login failed. Status code: {login_response.status_code}"
            }, status=401)

        # Get token and fetch product summary
        token = login_response.json().get('token')
        session.headers.update({
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        })
        
        product_summary_url = "http://localhost:5000/api/v1/transactions?sort=-date"
        product_summary_response = session.get(product_summary_url)

        if product_summary_response.status_code != 200:
            return JsonResponse({
                'success': False,
                'message': f"Failed to fetch data. Status code: {product_summary_response.status_code}"
            }, status=500)

        product_summary_data = product_summary_response.json()

        # Step 2: Prepare the data
        df = pd.DataFrame(product_summary_data)

        df_sales = df[df['transactionType'] == 'sale']

        df_sales['date'] = pd.to_datetime(df_sales['date'])

        df_grouped = df_sales.groupby([df_sales['date'].dt.date, 'productName']).agg({
            'quantity': 'sum',
            'amount': 'sum'
        }).reset_index()

        df_grouped['date'] = df_grouped['date'].astype(str)

        # Step 3: Save the prepared data to a JSON file
        product_summary_prepared = df_grouped.to_dict(orient='records')
        file_path = os.path.join(os.path.dirname(__file__), 'prepared_product_summary.json')
        
        try:
            with open(file_path, 'w') as json_file:
                json.dump(product_summary_prepared, json_file, indent=4)
            
            return JsonResponse({
                'success': True,
                'message': f"Data successfully aggregated and saved to {file_path}"
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f"Error saving data: {str(e)}"
            }, status=500)


class WeeklyForecastView(View):
    def get(self, request):
        # Load the pre-processed data
        file_path = os.path.join(os.path.dirname(__file__), 'prepared_product_summary.json')
        try:
            with open(file_path, 'r') as json_file:
                product_summary_data = json.load(json_file)
        except FileNotFoundError:
            return JsonResponse({
                'success': False,
                'message': f"Pre-processed data not found at {file_path}"
            }, status=500)


        df = pd.DataFrame(product_summary_data)

        df['date'] = pd.to_datetime(df['date'])

        df_weekly = df.groupby([pd.Grouper(key='date', freq='W'), 'productName']).agg({
            'quantity': 'sum',
            'amount': 'sum'
        }).reset_index()

        #ARIMA model for each product
        forecasts = {}

        for product in df_weekly['productName'].unique():
            product_data = df_weekly[df_weekly['productName'] == product].set_index('date')

            product_sales = product_data['quantity']

            model = ARIMA(product_sales, order=(5, 1, 0))
            model_fit = model.fit()s
            forecast = model_fit.forecast(steps=4)

            forecast_dates = pd.date_range(start=product_sales.index[-1], periods=5, freq='W')[1:]
            forecasts[product] = {
                'dates': forecast_dates.strftime('%Y-%m-%d').tolist(),
                'forecast': forecast.tolist()
            }

        # Step 4: Return the forecast data as JSON
        return JsonResponse({
            'success': True,
            'forecasts': forecasts
        })
