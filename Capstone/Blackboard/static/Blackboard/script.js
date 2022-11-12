document.addEventListener('DOMContentLoaded', async () =>{
  const tabs = document.querySelectorAll('.staff_tab')
  const dropdown_buttons = document.querySelectorAll('.dropbtn')
  dropdown_buttons.forEach(btn => {
    btn.addEventListener('click', toggle_display)
  })
  const dropdown_filters = document.querySelectorAll('.checkbox_filter')
  dropdown_filters.forEach(input =>{
    input.addEventListener('keyup', dropdown_filter)
  })
  tabs.forEach(tab => {
    tab.addEventListener('click', () => Select(tab.id))
  })
  const input_filters = document.querySelectorAll('.filter.input')
  input_filters.forEach( filter =>{
    filter.addEventListener('keyup', input_filter)
  })
  const select_filters = document.querySelectorAll('.filter.select')
  select_filters.forEach( filter => {
    filter.addEventListener('change', select_filter)
  })
  const dropdowns = document.querySelectorAll('.dropdown')
  dropdowns.forEach(menu => {
    menu.addEventListener('click', present_checkbox_input)
  })
  const popup_buttons = document.querySelectorAll('.popup_button')
  popup_buttons.forEach(button => {
    button.addEventListener('click', toggle_display)
  })
  // Get data from async call and add HTML elements
    // Get recipes
      const recipes = await get_db_item('recipes')
      present_data(recipes)
      console.log(typeof recipes)
    // Get blackboards
      let blackboards = await get_db_item('blackboards')
      present_data(blackboards)
    // Get ingredients
      let ingredients = await get_db_item('ingredients')
      present_data(ingredients)
      console.log(ingredients)
})

// Query Filters
  async function input_filter(obj) {
    const input = this
    // Determine what model to filter:
    if(this.dataset.model === 'recipe'){
      // Get data from DB

      let data = await get_db_item('recipes')

      // Determine what filter to apply:

      // Filter by name:
      if (input.dataset.name === 'name'){
        
        let new_data = data.filter( function(el) {
          console.log(el)
          return el.fields.name.toLowerCase().includes(input.value.toLowerCase())
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      } 
      // Filter by Key Ingredient:
      else if (input.dataset.name === 'key_ingredient') {
        let new_data = data.filter( function (el){
          return el.fields.key_ingredients.some(function (key_ingredient){
            return key_ingredient.toLowerCase().includes(input.value.toLowerCase())
          })
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
      // Filter by Ingredients
      else if (input.dataset.name === 'ingredients') {
        let new_data = data.filter( function (el){
          return el.fields.ingredients.some(function (ingredient){
            return ingredient.toLowerCase().includes(input.value.toLowerCase())
          })
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
      
    } else if (this.dataset.model === 'blackboard') {
      // Code for blackboard
      let data = await get_db_item('blackboards')
      // Determine what filter to apply:
      
      if (input.dataset.name === 'date') {
        let new_data = data.filter( function(el) {
          return el.fields.date.includes(input.value)
        })
        document.getElementById('blackboards_wrapper').innerHTML = ''
        present_data(new_data)
      } else {
        let new_data = data.filter( function (el){
          return el.fields.recipes.some(function (recipe){
              return recipe.toLowerCase().includes(input.value.toLowerCase())
            }
          )
        })
        document.getElementById('blackboards_wrapper').innerHTML = ''
        present_data(new_data)
      }
    } else {
      // Code for ingredients
      let data = await get_db_item('ingredients')
      // Only 1 input filter to apply
      let new_data = data.filter(function(el) {
        return el.fields.name.toLowerCase().includes(input.value.toLowerCase())
      })
      document.getElementById('ingredients_wrapper').innerHTML = ''
      present_data(new_data)
    }
  }
  async function select_filter(obj) {
  const select = this
  // Determine what model to filter:
  if (this.dataset.model === 'recipe'){
    // Get data from DB:

    let data = await get_db_item('recipes')

    // Determine what filter to apply:
  
    // Filter by type:
    if (this.dataset.name === 'type') {
      if (select.value === '') {
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
      else {
        let new_data = data.filter( function (el) {
          return el.fields.type === select.value 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
    }
    // Filter by season 
    else if (this.dataset.name === 'season') {
      console.log(select.value)
      if (select.value === ''){
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      } else {
        let new_data = data.filter( function (el) {
          return el.fields.season === select.value || el.fields.season === '' 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
    } 
    // Filter by pasta
    else if (this.dataset.name === 'pasta') {
      if (select.value === ''){
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      } else if ( select.value === 'no pasta') {
        let new_data = data.filter( function(el) {
          return el.fields.pasta === null
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      } else {
        let new_data = data.filter( function (el) {
          return el.fields.pasta === select.value 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
      }
    }
  } else {
    // Code for ingredients
    let data = await get_db_item('ingredients')
    // Only 1 select filter to apply:
    let new_data = data.filter( function(el) {
      return el.model.slice(11).toLowerCase() === select.value.toLowerCase()
    })
    document.getElementById('ingredients_wrapper').innerHTML = ''
    present_data(new_data)
  }
  }

// Get data from server and convert it to JSON
async function get_db_item(item){
  const response = await fetch(`/get_items/${item}`,{
    method: 'GET'
  })
  let data = await response.json()
  let json = JSON.parse(data)
  return json
}

// Navigation menu 
function nav_toggle(obj){
  let type = obj.dataset.type
  const nav = document.getElementById('nav_div')
  const button = document.getElementById('menu_button')
  const main = document.getElementById('main_page')
  if (type === 'open'){
    nav.style.width = '15em';
    main.style.marginLeft= '15em'
    button.dataset.type = 'close'
  } else if (type === 'close') {
    nav.style.width = '0';
    main.style.marginLeft = '0'
    main.style.flex = '1'
    button.dataset.type = 'open'
  }
}

// Display selected tab
function Select(tab){
  console.log(`Tab ${tab} Selected`)
  let selected = []
  selected.push(tab)
  document.querySelectorAll('.staff_tab').forEach(async tab => {
  if (selected.includes(`${tab.id}`)){
    tab.dataset.mode = 'selected';
    document.getElementById(`${tab.id}_div`).style.display = 'flex';
  } else {
    tab.dataset.mode = 'not_selected';
    document.getElementById(`${tab.id}_div`).style.display = 'none'
  }
})
}

// display data
function present_data(data) {
  console.log(data)
  // Extract what model we received to ensure we
  // put it in the right tab
  let id = data[0]['model']
  let tab = id.slice(11)
  if ( tab === 'recipe'){
    data.forEach(item => {
      const fields = item['fields']
      const wrapper = document.getElementById('recipe_wrapper');
      // Create elements
      const div = document.createElement('div')
      const name = document.createElement('div')
      const keyingredient = document.createElement('div')
      const type = document.createElement('div')
      const season = document.createElement('div')
      const ing = document.createElement('div')
      const price = document.createElement('div')
      const pasta = document.createElement('div')
       // Assign classes for CSS styling
       div.classList.add('item_container')
       name.classList.add('recipe_name','column', 'first', 'wide')
       keyingredient.classList.add('recipe_keyingredient','column', 'wide')
       type.classList.add('recipe_type','column','slim')
       season.classList.add('recipe_season','column','slim')
       ing.classList.add('recipe_ingredient','column','wide')
       price.classList.add('recipe_price','column','slim')
       pasta.classList.add('recipe_pasta','column','slim')
       // Populate with data
       name.innerHTML = fields['name']
       keyingredient.innerHTML = fields['key_ingredients']
       type.innerHTML = fields['type']
       if (fields['season'] === ''){
        season.innerHTML = '-'
       } else {
       season.innerHTML = fields['season']
       }
       ing.innerHTML = fields['ingredients']
       price.innerHTML = fields['price']
       if (fields['pasta'] === null) {
        pasta.innerHTML = '-'
       } else {
       pasta.innerHTML = fields['pasta']
       }
       // Place elements in document
       wrapper.append(div)
       div.append(name);
       div.append(season);
       div.append(type);
       div.append(keyingredient);
       div.append(ing);
       div.append(pasta);
       div.append(price);
  })
  } else if ( tab === 'blackboard') {
    // Code for blackboards
    data.forEach(item => {
      const fields = item['fields']
      const wrapper = document.getElementById('blackboards_wrapper');
      // Create elements
      const div = document.createElement('div')
      const date = document.createElement('div')
      const recipes = document.createElement('div')
      // Assign CSS classes
      div.classList.add('item_container')
      date.classList.add('blackboard_date','column','first', 'ultra-slim')
      recipes.classList.add('blackboards_date','column','wide')
      // Populate with data
      date.innerHTML = fields['date']
      recipes.innerHTML = fields['recipes']
      // Place elements in document
      wrapper.append(div)
      div.append(date)
      div.append(recipes)
    })
  } else {
    // Code for Ingredients/KeyIngredients/Pastas
    data.forEach(item => {
      const fields = item['fields']
      const wrapper = document.getElementById('ingredients_wrapper')
      // Create elements 
      const div = document.createElement('div')
      const type = document.createElement('div')
      const name = document.createElement('div')
      // Assign classes
      div.classList.add('item_container')
      type.classList.add('ingredients_type', 'column', 'type','ultra-slim', 'first')
      name.classList.add('ingredients_name', 'column', 'name', 'wide')
      //Populate with data
      type.innerHTML = item.model.slice(11).charAt(0).toUpperCase() + item.model.slice(12)
      name.innerHTML = fields['name']
      // Place elements in document
      wrapper.append(div)
      div.append(type)
      div.append(name)
    })
  }
  
}

// toggle dropdown menu display
function toggle_display() {
  const popup = document.getElementById(`${this.dataset.assignedto}`)
  popup.classList.toggle('show');
  this.parentElement.querySelector('button').classList.toggle('active')
}

// Filtering through dropdown menu
function dropdown_filter() {
  const div = this.parentElement
  const filter = this.value.toLowerCase()
  const items = div.querySelectorAll('label')
  items.forEach(item => {
    const text = item.textContent.toLowerCase()
    if ( text.indexOf(filter) > -1) {
      item.style.display = ''
    } else {
      item.style.display = 'none'
    }
  })
}

function present_checkbox_input() {
  // Everytime dropdown menu gets clicked,
  // Iterate through inputs with type checkbox
  // and display them in input field for presentation
  // if they are checked
  const checkboxes = this.querySelectorAll('input[type="checkbox"]')
  const labels = this.querySelectorAll('label')
  const parent = this.parentElement
  const popup = parent.parentElement.parentElement
  const input = parent.querySelector('input')
  let str = ''
  console.log(this)
  // if checkboxes.length = 0 widget is radiobuttons
  if (checkboxes.length === 0) {
    const radio = this.querySelectorAll('input[type="radio"]')
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        let item = labels[i].textContent
        input.value = item
      }
    }
  } else {
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked ){
      let item = labels[i].textContent
      str += `${item},`
    }
  }
  input.value = str
}
  if ( this.id === 'dropdown_recipes') {
    const staging_container = popup.querySelector('#blackboard_add_staging')
    staging_container.innerHTML = ''
    let recipes = str.split(',\n')
    recipes[0] = recipes[0].slice(1)
    for (i = 0 ; i < recipes.length; i++) {
      const div = document.createElement('div')
      div.innerHTML = recipes[i]
      staging_container.append(div)
    }
  }
}
