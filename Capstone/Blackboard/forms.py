from .models import Ingredient, Recipe, Blackboard, KeyIngredient, Pasta
from django.forms import ModelForm

class IngredientForm(ModelForm):
  class Meta:
    model = Ingredient
    fields = ['name']

class RecipeForm(ModelForm):
  class Meta:
    model = Recipe
    fields = '__all__'
    
class BlackboardForm(ModelForm):
  class Meta:
    model = Blackboard
    fields = '__all__'
    
class KeyIngredientForm(ModelForm):
  class Meta:
    model = KeyIngredient
    fields = '__all__'
    
class PastaForm(ModelForm):
  class Meta:
    model = Pasta
    fields = '__all__'
    
