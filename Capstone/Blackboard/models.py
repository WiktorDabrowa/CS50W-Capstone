from enum import unique
from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
  type_choices = [
    ('Boss','Boss'),
    ('Cook','Cook'),
  ]
  type = models.CharField(
    max_length = 9,
    choices = type_choices,
    default='Cook')
  class Meta:
    app_label = 'Blackboard'
    

class KeyIngredientManager(models.Manager):
  def get_by_natural_key(self,name):
    return self.get(name=name)  
class KeyIngredient(models.Model):
  name = models.CharField(max_length=50)
  objects = KeyIngredientManager()
  def __str__(self):
    return self.name
  def natural_key(self):
    return (self.name)
  
class IngredientManager(models.Manager):
  def get_by_natural_key(self,name):
    return self.get(name=name)
class Ingredient(models.Model):
  name = models.CharField(max_length = 50)
  objects = IngredientManager()
  def __str__(self):
    return self.name 
  def natural_key(self):
    return (self.name)
  
class PastaManager(models.Manager):
  def get_by_natural_key(self,name):
    return self.get(name=name)
class Pasta(models.Model):
  name = models.CharField(max_length = 50)
  objects = PastaManager()
  def __str__(self):
    return self.name
  def natural_key(self):
    return (self.name)

class Recipe(models.Model):
  season_choices = [
    ('Spring','Spring'),
    ('Summer','Summer'),
    ('Fall','Fall'),
    ('Winter','Winter')
  ]
  type_choices = [
    ('Starter', 'Starter'),
    ('Main', 'Main'),
    ('Dessert', 'Dessert')
  ]
  name = models.CharField(max_length = 50, unique=True)
  season = models.CharField(max_length = 10,
                            choices = season_choices,
                            blank=True)
  pasta = models.ForeignKey(Pasta, on_delete=models.PROTECT,null=True,blank=True) 
  key_ingredients = models.ManyToManyField(KeyIngredient)
  ingredients = models.ManyToManyField(Ingredient)
  price = models.DecimalField(max_digits = 5, decimal_places = 2)
  type = models.CharField(max_length = 15, choices = type_choices, default='Main')
  
  def __str__(self):
    return self.name
  
  def natural_key(self):
    return (self.name)
  
class Blackboard(models.Model):
  date = models.DateField(auto_now_add = True, unique=True)
  recipes = models.ManyToManyField(Recipe)
  
  def __str__(self):
    return str(self.date)