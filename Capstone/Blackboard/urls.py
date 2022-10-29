from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('login', views.login_view, name='login'),
  path('logout', views.logout_view, name='logout'),
  path('staff', views.staff, name='staff'),
  
  #ADI Routes
  path('get_items/<str:db_item>', views.get_items, name='API')
  ]