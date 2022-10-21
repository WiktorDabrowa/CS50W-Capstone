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
  
class KeyIngredient():
  name = models.CharField(max_lenght=50)
  def __str__(self):
    return self.name
  
class Ingredient():
  name = models.CharField(max_length = 50)
  def __str__(self):
    return self.name
  
class Pasta():
  name = models.CharField(max_length = 50)
  def __str__(self):
    return self.name
  
class Recipe():
  season_choices = [
    ('Spring','Spring'),
    ('Summer','Summer'),
    ('Fall','Fall'),
    ('Winter','Winter')
  ]
  name = models.CharField(max_lenght = 50)
  season = models.CharField(max_length = 10,
                            choices = season_choices,
                            blank=True)
  pasta = models.ForeignKey(Pasta, on_delete=models.PROTECT)
  key_ingredients = models.ManyToManyField(KeyIngredient)
  ingredients = models.ManyToManyField(Ingredient)
  price = models.DecimalField(max_digits = 5, decimal_places = 2)
  
  def __str__(self):
    return self.name
  