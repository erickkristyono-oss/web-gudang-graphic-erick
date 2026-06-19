document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Gudang Graphic Siap!");

    // Contoh interaksi sederhana: efek scroll pada navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        })
    });
});