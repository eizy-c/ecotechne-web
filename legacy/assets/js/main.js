document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    
    // Toggle menu
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
    
    // Cerrar menú on click
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });

    // Navbar ambient change on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-xl', 'bg-brand-dark/95');
        } else {
            nav.classList.remove('shadow-xl', 'bg-brand-dark/95');
        }
    });
});
