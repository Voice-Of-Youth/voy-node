// Hamburger Menu Functionality

const menu = document.querySelector('#mobile-bar-icon')
const menuLinks = document.querySelector('.navbar-menu')

menu.addEventListener('click', ()=> {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
})

menuLinks.addEventListener('click', ()=> {
    const menuBars = document.querySelector('.is-active');
    if(menuBars) {
        menu.classList.toggle('is-active')
        menuLinks.classList.remove('active')
    }
})

