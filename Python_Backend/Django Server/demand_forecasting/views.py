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

        # Parse product summary data
        product_summary_data = product_summary_response.json()

        # Step 2: Prepare the data
        # Convert data to a pandas DataFrame
        df = pd.DataFrame(product_summary_data)

        # Filter sales transactions only
        df_sales = df[df['transactionType'] == 'sale']

        # Convert the 'date' field to datetime
        df_sales['date'] = pd.to_datetime(df_sales['date'])

        # Aggregate sales by product and day
        df_grouped = df_sales.groupby([df_sales['date'].dt.date, 'productName']).agg({
            'quantity': 'sum',
            'amount': 'sum'
        }).reset_index()

        # Convert dates back to strings for JSON serialization
        df_grouped['date'] = df_grouped['date'].astype(str)

        # Step 3: Save the prepared data to a JSON file
        product_summary_prepared = df_grouped.to_dict(orient='records')
        file_path = os.path.join(os.path.dirname(__file__), 'prepared_product_summary.json')
        
        try:
            with open(file_path, 'w') as json_file:
                json.dump(product_summary_prepared, json_file, indent=4)
            
            # Return a success message to frontend
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

        # Step 1: Load data into a DataFrame
        df = pd.DataFrame(product_summary_data)

        # Convert 'date' column back to datetime
        df['date'] = pd.to_datetime(df['date'])

        # Step 2: Resample data to weekly frequency, summing up sales for each product
        df_weekly = df.groupby([pd.Grouper(key='date', freq='W'), 'productName']).agg({
            'quantity': 'sum',
            'amount': 'sum'
        }).reset_index()

        # Step 3: Apply ARIMA model for each product
        forecasts = {}

        for product in df_weekly['productName'].unique():
            # Filter data for the current product
            product_data = df_weekly[df_weekly['productName'] == product].set_index('date')

            # We focus on 'quantity' as the target for forecasting
            product_sales = product_data['quantity']

            # Fit ARIMA model
            model = ARIMA(product_sales, order=(5, 1, 0))  # Example ARIMA(5,1,0) model
            model_fit = model.fit()

            # Forecast for the next 4 weeks
            forecast = model_fit.forecast(steps=4)

            # Convert forecast to a dictionary with dates and quantities
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