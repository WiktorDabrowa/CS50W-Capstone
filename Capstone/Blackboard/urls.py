from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('login', views.login_view, name='login'),
  path('logout', views.logout_view, name='logout'),
  path('new_blackboard', views.new_blackboard, name='new_blackboard'),
  path('browse', views.browse, name='browse')
]