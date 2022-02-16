const list = document.querySelector('.list');
const links = document.querySelector('.links');

list.addEventListener('click', function(){
    links.classList.toggle('active');
    list.classList.toggle('active');
})
window.addEventListener('resize', () => {
    links.classList.remove('active');
    list.classList.remove('active');
})