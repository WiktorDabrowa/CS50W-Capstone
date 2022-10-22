from datetime import datetime
from django.shortcuts import render, HttpResponse

from .models import Blackboard

# Create your views here.

def index(request):
  # Login Option for Staff
  # Blackboard for visitors
  blackboards = Blackboard.objects.all()
  blackboard = blackboards[0]
  context = {
   'blackboard': blackboard
  }
  return render(request, 'Blackboard/index.html', context)

def login(request):
  # redirect to views.staff
  pass

#@login_required
def staff(request):
  # All of the CRUD operations
  # if user.type = 'Boss' ...
  pass

