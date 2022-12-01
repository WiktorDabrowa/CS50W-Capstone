document.addEventListener('DOMContentLoaded', async () =>{
  // Index animation delay
  const index_recipes = document.querySelectorAll('.index_slidein')
  for (i = 0; i < index_recipes.length; i++) {
    let item = index_recipes[i]
    item.style.animationDelay = 1 + i*0.2+'s'
  }

  // Get data from async call and add HTML elements
    // Get recipes
    const recipes = await get_db_item('recipes')
    present_data(recipes)
  // Get blackboards
    const blackboards = await get_db_item('blackboards')
    present_data(blackboards)
  // Get ingredients
    const ingredients = await get_db_item('ingredients')
    present_data(ingredients)

  // Add Event listeners
  const tabs = document.querySelectorAll('.staff_tab')
  const dropdown_action_buttons = document.querySelectorAll('.action_dropbtn')
  dropdown_action_buttons.forEach(btn => {
    btn.addEventListener('click', toggle_display)
  })
  const dropdown_buttons = document.querySelectorAll('.dropbtn')
  console.log(dropdown_buttons)
  dropdown_buttons.forEach(btn => {
    btn.addEventListener('click', toggle_display)
  })
  const dropdown_filters = document.querySelectorAll('.checkbox_filter')
  dropdown_filters.forEach(input =>{
    input.addEventListener('keyup', dropdown_filter)
  })
  tabs.forEach(tab => {
    console.log(tab)
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
  const actions = document.querySelectorAll('.delete_btn')
  actions.forEach(btn => {
    btn.addEventListener('click', () => delete_entry(btn.dataset.item))
    }
  )
  const validate_btns = document.querySelectorAll('.validate_btn')
  validate_btns.forEach(btn => {
    btn.addEventListener('click', () => validate_blackboard(btn.dataset.item))
  })

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
// Navigation menu toggle
function nav_toggle_new() {
  const nav = document.getElementById('nav_div')
  const main = document.getElementById('main_page')
  nav.classList.toggle('open')
  main.classList.toggle('main_open')
}

// Display selected tab in staff.html
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
      const div_outer = document.createElement('div')
      const div = document.createElement('div')
      const name = document.createElement('div')
      const keyingredient = document.createElement('div')
      const type = document.createElement('div')
      const season = document.createElement('div')
      const ing = document.createElement('div')
      const price = document.createElement('div')
      const pasta = document.createElement('div')
      const del_btn = document.createElement('button')
      const del_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const del_path_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const del_path_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
       // Assign classes for CSS styling
       div_outer.classList.add('relative')
       div.classList.add('item_container')
       name.classList.add('recipe_name','column', 'first', 'wide')
       keyingredient.classList.add('recipe_keyingredient','column', 'wide')
       type.classList.add('recipe_type','column','slim')
       season.classList.add('recipe_season','column','slim')
       ing.classList.add('recipe_ingredient','column','wide')
       price.classList.add('recipe_price','column','slim')
       pasta.classList.add('recipe_pasta','column','slim')
       del_btn.classList.add('delete_btn')
       del_btn.dataset.item = `${item['model']}:${item['pk']}`
       del_svg.setAttribute('width', '16')
       del_svg.setAttribute('height', '16')
       del_svg.setAttribute('viewBox', '0 0 16 16')
       del_svg.setAttribute('fill', 'currentColor')
       del_path_1.setAttribute('d','M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' )
       del_path_2.setAttribute('fill-rule', 'evenodd')
       del_path_2.setAttribute('d','M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z')
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
       del_svg.append(del_path_1, del_path_2)
       del_btn.append(del_svg)
       wrapper.append(div_outer)
       div_outer.append(div)
       div_outer.append(del_btn)
       div.append(name, season,type, keyingredient, ing, pasta, price);
  
  })
  } else if ( tab === 'blackboard') {
    // Code for blackboards
    const user_type = JSON.parse(document.getElementById('user_type').textContent)
    data.reverse()
    data.forEach(item => {
      const fields = item['fields']
      console.log(item['fields'])
      const wrapper = document.getElementById('blackboards_wrapper');
      // Create elements
      const div_outer = document.createElement('div')
      const div = document.createElement('div')
      const date = document.createElement('div')
      const recipes = document.createElement('div')
      const del_btn = document.createElement('button')
      const validate_btn = document.createElement('button')
      const validate_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const validate_path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const del_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const del_path_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const del_path_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      // Assign CSS classes
      validate_btn.classList.add('validate_btn')
      validate_btn.setAttribute('id', `validate_${item['id']}`)
      validate_btn.dataset.item = item['pk']
      validate_btn.type = 'button'
      div_outer.classList.add('relative')
      div.classList.add('item_container')
      if (fields['is_validated']) {
        div.classList.add('validated')
      } else {
        div.classList.add('not_validated')
      }
      date.classList.add('blackboard_date','column','first', 'ultra-slim')
      recipes.classList.add('blackboards_date','column','wide')
      validate_svg.setAttribute('width', '16')
      validate_svg.setAttribute('height', '16')
      validate_svg.setAttribute('viewBox', '0 0 16 16')
      validate_svg.setAttribute('fill', 'currentColor')
      validate_path.setAttribute('d','M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z')
      del_btn.classList.add('delete_btn')
      del_btn.dataset.item = `${item['model']}:${item['pk']}`
      del_svg.setAttribute('width', '16')
      del_svg.setAttribute('height', '16')
      del_svg.setAttribute('viewBox', '0 0 16 16')
      del_svg.setAttribute('fill', 'currentColor')
      del_path_1.setAttribute('d','M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' )
      del_path_2.setAttribute('fill-rule', 'evenodd')
      del_path_2.setAttribute('d','M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z')
      // Populate with data
      date.innerHTML = fields['date']
      recipes.innerHTML = fields['recipes']
      // Place elements in document
      validate_svg.append(validate_path)
      validate_btn.append(validate_svg)
      del_svg.append(del_path_1, del_path_2)
      del_btn.append(del_svg)
      wrapper.append(div_outer)
      div_outer.append(div)
      if (!(fields['is_validated']) && user_type === 'Boss') {
        div_outer.append(validate_btn)
      } else if (!(fields['is_validated'])) {
      } else {
        div_outer.append(del_btn)
      }
      div.append(date,recipes)
      
    })
  } else {
    // Code for Ingredients/KeyIngredients/Pastas
    data.forEach(item => {
      const fields = item['fields']
      const wrapper = document.getElementById('ingredients_wrapper')
      // Create elements 
      const div_outer = document.createElement('div')
      const div = document.createElement('div')
      const type = document.createElement('div')
      const name = document.createElement('div')
      const del_btn = document.createElement('button')
      const del_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const del_path_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const del_path_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      // Assign classes
      div_outer.classList.add('relative')
      div.classList.add('item_container')
      type.classList.add('ingredients_type', 'column', 'type','ultra-slim', 'first')
      name.classList.add('ingredients_name', 'column', 'name', 'wide')
      del_btn.classList.add('delete_btn')
      del_btn.dataset.item = `${item.model.slice(11)}:${item['pk']}`
      del_svg.setAttribute('width', '16')
      del_svg.setAttribute('height', '16')
      del_svg.setAttribute('viewBox', '0 0 16 16')
      del_svg.setAttribute('fill', 'currentColor')
      del_path_1.setAttribute('d','M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' )
      del_path_2.setAttribute('fill-rule', 'evenodd')
      del_path_2.setAttribute('d','M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z')
      //Populate with data
      type.innerHTML = item.model.slice(11).charAt(0).toUpperCase() + item.model.slice(12)
      console.log(type.innerHTML)
      name.innerHTML = fields['name']
      // Place elements in document
      del_svg.append(del_path_1, del_path_2)
      del_btn.append(del_svg)
      wrapper.append(div_outer)
      div_outer.append(div, del_btn)
      div.append(type, name)
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

function delete_entry(entry) {
  console.log(`deleting ${entry}`)
  let array = entry.split(':')
  let model = array[0]
  let pk = array[1]
  window.location.href = `/staff/${model}/${pk}`
}

function validate_blackboard(entry) {
  console.log('validating blackboard nr.' + entry)
  window.location.href = `/validate/${entry}`
}