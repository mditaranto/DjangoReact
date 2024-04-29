from django.urls import path
from . import views

from django.urls import path
from . import views

urlpatterns = [
    # Order
    path('orders/', views.OrderListCreate.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetail.as_view(), name='order-detail'),
  
]