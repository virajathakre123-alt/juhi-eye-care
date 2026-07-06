from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('appointment-requests/', views.submit_appointment_request, name='submit_appointment_request'),
    path('appointment-requests/pending/', views.pending_appointment_requests, name='pending_appointment_requests'),
    path('appointment-requests/<int:pk>/approve/', views.approve_appointment_request, name='approve_appointment_request'),
    path('appointment-requests/<int:pk>/reject/', views.reject_appointment_request, name='reject_appointment_request'),
]
