from django.contrib import admin
from django.urls import path
from trends.views import TrendView
from news_summary.views import NewsSummary  
from demand_forecasting.views import ProductSummaryView, WeeklyForecastView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/trends/', TrendView.as_view(), name='trends'),
    path('api/news_summary/', NewsSummary.as_view(), name='news_summary'),  # Added missing comma
    path('api/fetch_summary/', ProductSummaryView.as_view(), name='fetch_summary'),
    path('api/forecast/', WeeklyForecastView.as_view(), name='forecast'),
]
