document.addEventListener('DOMContentLoaded', () =>{
  const tabs = document.querySelectorAll('.staff_tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => Select(tab.id))
  })
})

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

function Select(tab){
  console.log(`Tab ${tab} Selected`)
  var selected = []
  selected.push(tab)
  console.log(selected)
  document.querySelectorAll('.staff_tab').forEach(tab => {
  if (selected.includes(`${tab.id}`)){
    tab.dataset.mode = 'selected';
    document.getElementById(`${tab.id}_div`).style.display = 'block'
  } else {
    tab.dataset.mode = 'not_selected';
    document.getElementById(`${tab.id}_div`).style.display = 'none'
  }
})
}

function get_db_item(item){
  fetch(`/get_items/${item}`)
  .then(response => response.json())
  .then(items => {
    console.log(items);

    
});
}