# Web app for pasta bar

This web app is inspired by my previous work place, which was a pasta bar that except regular menu items
had a blackboard with daily additional dishes.
These items changed regulary and had to be thought of at the start of the shift and messaged to the boss for his approval. These dishes would regulary repeat and there was no database except for photos of previous blackboards, which is what inspired me to create this application.

# Functionality

## For customers
  Customers can view latest blackboard online, without coming to the restaurant. There they can see:
 - Name of the dish
 - It`s ingredients
 - Type of dish( Starter / Main / Dessert )
 - Price

## For staff
  Cooks have acces to the staff view, in which they can browse existing ingredients, recipes,blackboards and create new instances of these models. Latest blackboard is displayed to the index page for customers to see.

# Documentation

  ## Models - models.py

  ### User

  Custom User built on Django AbstractUser model, that includes additional field: **type**. Type has 2 options:
  - Cook - has acces to staff view, can browse and create items in the database
  - Boss - has all of the Cooks entitlements and additionally can validate new blackboards

  ### Key Ingredient
  
  This is one of 3 ingredient models. There is only one field in all of these models (**name**) . It represents characteristic ingredients, that aren't always on hand in restaurant or play a main role in the dish and define it.
  This model will be the most used in filtering the database by cooks.

  ### Ingredient

  Next of the 3 ingredient models. It represents basic ingredients that are commonly found in dishes (Tomatoes, Garlic, Basil etc.). Mostly used for customer information.

  ### Pasta

  Last of the 3 ingredients models. Optional field, that represents pasta used in the dish. Used both for customer information and filtering.

  ### Recipe

  Model representing a dish. It is defined by these fields:
  - **Name**
  - **Season** - optional field that describes seasonality of the dish's ingredients
  - **Pasta**, **Key ingredient**, **Ingredient** - foreign keys to previously mentioned models
  - **Price**
  - **Type** - Starter / Main / Dessert 

  ### Blackboard 

  Represents set of **recipes** that are avaible at the restaurant on the day represented by **date** field

  ## Forms - forms.py

  This file contains ModelForms for all of the models.
  Some of these forms are customized with cunstom widgets

  ## Views views.py

  ### index

  Gets latest validated blackboard and rearanges it in the order:
  - Starters
  - Mains
  - Desserts
  then displays it on the landing page

  ### login_view and logout_view

  Login and logout for users. 
  Users can only be created by superuser

  ### staff

  Manages all of the data in the database:
  - Create instances of models
  - Delete instances
  Additionaly passes ModelForms to template.
  This whole view is wrapped in @login_required decorator for safety.
  **Note:** I decided against having the option to edit instances, as there is a reason for slightly different recipes to exist( one key_ingredient or ingredient changed ) in the database, because there might be a situation in which not all of the ingredient are at hand in the restaurant.

  ### get_items
  This view send data serialized into JSON format to the browser

  ## Admin - admin.py 
  Admin page with registerd models and additional field in User model
  
  ## JavaScript - script.js

  All of the logic happening in the browser.
  Functionality :
   - On DOMContentLoad sets animation delays for index.html, gets the data from the server and displays it, adds event listeners
   - **function** input_filter - filtering of the displayed data in staff.html with input tag
   - **function** select_filter - same as previous but with select tag
   - **function** get_db_item - asyncronous function fetching data from the API view
   - **functions** nav_toggle_menu, Select, toggle_display - handling popups and navigation menu
   - **function** present_data - after data is fetched with get_db_item it`s passed to this function to be displayed in the proper Tab in the staff.html DOM
   - **function** dropdown_filter - filter used in dropdown lists in forms for easier browsing
   - **function** present_checkbox_input - used in blackboard form, displays selected recipes in the popup for clarity
   - **function** delete_entry - redirects to url used for entry deletion 

  ## CSS - styles.css
  Styling and responsiveness for the page

  ## Templates
  
  ### layout.html 
  Contains head tag and navigation menu, every template extend it
  ### index.html 
  Display of the current blackboard
  ### login.html
  Login page
  ### staff.html
  Seperate navigation with tabs displayed and hidden with JS.
  All of the forms and database is avaible here

# Distinctiveness and Complexity 

My project is based on very particular problem from my profesional life and could be used to solve it.
Although it could be described as database browser, I think it satisfies the requirements:

- ## Distinctiveness 
None of the previous projects were based of similiar premise

- ## Complexity 
This project has been built by me from ground up to fit with the particular problem and it is a combination of all of the knowledge i gained from previous projects. I decided this app to be heavy on Frontend, so i had to learn a lot of new features:
- asyncronous functions (JS)
- deepend my knowledge of calling functions (JS)
- data filtering (JS)
- variable scope (JS)
- responsiveness (CSS) 
- more complex selectors (CSS)


On the backend side i had to learn about;
- customizing admin page
- customizing widgets for forms to make them more comfortable for the user (ex. ManyToMany field representation in templates)
- model serialization and natural_key
- optional parameters in view functions

# How to run
All you have to do is download the files and start the server in the correctn directory with: "python manage.py runserver 0.0.0.0:8000" so it is accesible on your mobile phone ( if it`s connected to the same network).
This project is submited with dummy data, ready for presentation, you can acces all of the functionality with this user/password pairs:
1. Cook/Cookpassword
2. Boss/Bosspassword
3. superuser: admin/admin\