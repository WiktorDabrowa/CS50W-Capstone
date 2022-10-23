document.addEventListener('DOMContentLoaded', () =>{
  
})

function Nav(obj){
  let type = obj.dataset.type
  const nav = document.getElementById('nav_div')
  const button = document.getElementById('menu_button')
  if (type === 'open'){
    nav.style.width = '15em'
    button.dataset.type = 'close'
  } else if (type === 'close') {
    nav.style.width = '0'
    button.dataset.type = 'open'
  }
}
