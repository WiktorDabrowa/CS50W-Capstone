document.addEventListener('DOMContentLoaded', async () =>{
  const tabs = document.querySelectorAll('.staff_tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => Select(tab.id))
  })
  const input_filters = document.querySelectorAll('.filter.input')
  input_filters.forEach( filter =>{
    filter.addEventListener('click', input_filter)
    console.log('Added event listener')
  })
  const select_filters = document.querySelectorAll('.filter.select')
  select_filters.forEach( filter => {
    filter.addEventListener('change', select_filter)
    console.log('Added event listener')
  })
  // Get data from async call
    // Get recipes
      const recipes = await get_db_item('recipes')
      present_data(recipes)
      console.log(typeof recipes)
    // Get blackboards
      //let blackboards = await get_db_item('blackboards')
      //present_data(blackboards)
    // Get ingredients
      //let ingredients = await get_db_item('ingredients')
      //present_data(ingredients)
})

// Query Filters
  async function input_filter(obj) {
    const input = this
    // Determine what model to filter:
    if(this.dataset.model === 'recipe'){
      // Get data from DB

      let data = await get_db_item('recipe')

      // Determine what filter to apply:
      
    } else if (this.dataset.model === 'blackboard') {
      // Code for blackboard
    } else {
      // Code for ingredients
    }
  }
  async function select_filter(obj) {
  const select = this
  // Determine what model to filter:
  if (this.dataset.model === 'recipe'){
    // Get data from DB:

    let data = await get_db_item('recipes')

    // Determine what filter to apply:
    console.log(this)
    // Filter by type:
    if (this.dataset.name === 'type') {
      if (select.value === '') {
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      }
      else {
        let new_data = data.filter( function (el) {
          return el.fields.type === select.value 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      }
    }
    // Filter by season 
    else if (this.dataset.name === 'season') {
      if (select.value === ''){
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      } else {
        let new_data = data.filter( function (el) {
          return el.fields.season === select.value || el.fields.season === '' 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      }
    } 
    // Filter by pasta
    else if (this.dataset.name === 'pasta') {
      console.log('filtruje po makaronie')
      if (select.value === ''){
        new_data = data
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      } else if ( select.value === 'no pasta') {
        let new_data = data.filter( function(el) {
          return el.fields.pasta === null
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      } else {
        let new_data = data.filter( function (el) {
          return el.fields.pasta === select.value 
        })
        document.getElementById('recipe_wrapper').innerHTML = ''
        present_data(new_data)
        console.log(new_data)
      }
    }
  } else if ( this.dataset.model ==='blackboard') {
    // Code for blackboard
  } else {
    // Code for ingredients
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
    document.getElementById(`${tab.id}_div`).style.display = 'block';
  } else {
    tab.dataset.mode = 'not_selected';
    document.getElementById(`${tab.id}_div`).style.display = 'none'
  }
})
}

// display data
function present_data(data) {

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
       div.classList.add('recipe_container','column')
       name.classList.add('recipe_name','column')
       keyingredient.classList.add('recipe_keyingredient','column')
       type.classList.add('recipe_type','column')
       season.classList.add('recipe_season','column')
       ing.classList.add('recipe_ingredient','column')
       price.classList.add('recipe_price','column')
       pasta.classList.add('recipe_pasta','column')
       // Populate with data
       name.innerHTML = fields['name']
       keyingredient.innerHTML = fields['key_ingredients']
       type.innerHTML = fields['type']
       season.innerHTML = fields['season']
       ing.innerHTML = fields['ingredients']
       price.innerHTML = fields['price']
       pasta.innerHTML = fields['pasta']
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
  } else {
    // Code for Ingredients/KeyIngredients/Pastas
  }
  
}
