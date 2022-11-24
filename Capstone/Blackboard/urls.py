from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('login', views.login_view, name='login'),
  path('logout', views.logout_view, name='logout'),
  path('staff', views.staff, name='staff'),
  path('staff/<str:model>', views.staff, name='staff'),
  path('staff/<str:model>/<int:pk>', views.staff, name='staff'),
  path('validate/<int:id>', views.validate_blackboard, name = 'validate'),
  
  #path('add_item/<str:model>',views.add_item, name='add_item'),
  
  #API Routes
  path('get_items/<str:db_item>', views.get_items, name='API')
  ]