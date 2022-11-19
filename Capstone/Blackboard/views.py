from dataclasses import asdict
from datetime import datetime
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from .models import *
from .forms import *

# Create your views here.

def index(request):
  blackboards = Blackboard.objects.all().order_by('-date')
  blackboard_query = blackboards[0]
  recipes = list(blackboards[0].recipes.all())
  starters = []
  mains = []
  desserts = []
  for recipe in recipes:
    if recipe.type == 'Starter':
      starters.append(recipe)
    elif recipe.type == 'Main':
      mains.append(recipe)
    elif recipe.type == 'Dessert':
      desserts.append(recipe)
  blackboard = [*starters, *mains, *desserts]
  context = {
   'blackboard': blackboard,
   'date' : blackboard_query.date
  }
  return render(request, 'Blackboard/index.html', context)

def login_view(request):
  if request.method == 'POST':
    # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("staff"))
        else:
            return render(request, "Blackboard/login.html", {
                "message": "Invalid username and/or password."
            })
  else:
    return render(request,'Blackboard/login.html')

def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("index"))

@login_required(login_url = '/login')
def staff(request, model = None, pk = None):
  ingredients = Ingredient.objects.all()
  key_ingredients = KeyIngredient.objects.all()
  pastas = Pasta.objects.all()
  ingredient_form = IngredientForm()
  recipe_form = RecipeForm()
  blackboard_form = BlackboardForm()
  user = request.user
  context = {
    'key_ingredients': key_ingredients,
    'ingredients':ingredients,
    'pastas':pastas,
    'user_type': user.type,
    'ingredient_form': ingredient_form,
    'recipe_form':recipe_form,
    'blackboard_form':blackboard_form
  }
  # Deleting items
  if pk != None:
    if model == 'Blackboard.recipe':
      Recipe.objects.get(pk = pk).delete()
    elif model == 'ingredient':
      Ingredient.objects.get(id = pk).delete()
    elif model == 'keyingredient':
      KeyIngredient.objects.get(pk = pk).delete()
    elif model == 'pasta':
      Blackboard.objects.get(pk = pk).delete()
    elif model == 'Blackboard.blackboard':
      Blackboard.objects.get(pk = pk).delete()
    return HttpResponseRedirect(reverse("staff"))
  
  # Adding items to DB
  if request.method == 'POST':
    
    # Processing Pasta/Ingredient/KeyIngredient
    if model == 'ingredient':
      form = IngredientForm(request.POST)
      if form.is_valid():
        item = form.cleaned_data
        if item['type'] == 'Ingredient':
          Ingredient.objects.create(name=item['name'])
        elif item['type'] == 'KeyIngredient':
          KeyIngredient.objects.create(name=item['name'])
        elif item['type'] == 'Pasta':
          Pasta.objects.create(name=item['name'])
      # Passing new form to context to display errors
      else:
        context['ingredient_form'] = form
        context['ingredient_show'] = 'show'
    
    # Processing Recipe      
    elif model == 'recipe':
      form = RecipeForm(request.POST)
      if form.is_valid():
        form.save()
      # Passing new form to context to display errors
      # and new key value pair to have popup displayed
      # at reload
      else:
        context['recipe_form'] = form
        context['recipe_show'] = 'show'
    
    # Processing Blackboard
    elif model == 'blackboard':
      form = BlackboardForm(request.POST)
      if form.is_valid():
        form.save()
      # Passing new form to context to display errors
      else:
        context['blackboard_form'] = form
        context['blackboard_show'] = 'show'

  return render(request, 'Blackboard/staff.html',context)

# API Views
def get_items(request, db_item):
  if request.method == 'GET':
    if db_item == 'recipes':
      query = Recipe.objects.all()
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys=True, indent=2), safe=False)
    elif db_item == 'ingredients':
      ingredients = list(Ingredient.objects.all())
      key_ing = list(KeyIngredient.objects.all())
      pastas = list(Pasta.objects.all())
      query = [*ingredients, *key_ing, * pastas]
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys=True, indent=2), safe=False)
    elif db_item == 'blackboards':
      query = Blackboard.objects.all()
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys = True, indent = 2), safe = False)
  