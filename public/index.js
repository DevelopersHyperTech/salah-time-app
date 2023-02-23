const navbar = document.getElementById('nav')
const container = document.getElementById('container')
navbar.addEventListener('click',function(){
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active')
        container.classList.remove('nav-active')
    } else {
        navbar.classList.add('active')
        container.classList.add('nav-active')
    }
})

document.addEventListener('click', function(event) {
    if(navbar.classList.contains('active') &&   !event.target.isEqualNode(navbar) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
        container.classList.remove('nav-active')
    }
  });
