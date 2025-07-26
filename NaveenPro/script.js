// DOM Elements
const navMobileBtn = document.querySelector('.nav-mobile-btn');
const navMobile = document.querySelector('.nav-mobile');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const homeText = document.querySelector('.home-text');
const sceneContainer = document.querySelector('.scene-container');
const photoFrameDesktop = document.querySelector('.photo-frame-desktop');
const contactForm = document.getElementById('contactForm');

// Navigation State
let currentPage = 'home';
let isMobileMenuOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initialize3DScene();
    initializeAnimations();
    initializeContactForm();
    initializeSmoothScrolling();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    navMobileBtn.addEventListener('click', toggleMobileMenu);
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initialize page based on hash
    handleHashChange();
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    navMobile.classList.toggle('active', isMobileMenuOpen);
    
    // Update button icon
    const icon = navMobileBtn.querySelector('i');
    icon.className = isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
}

function handleNavClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const page = href.substring(1);
    
    // Update URL
    window.location.hash = href;
    
    // Close mobile menu
    if (isMobileMenuOpen) {
        toggleMobileMenu();
    }
}

function handleHashChange() {
    const hash = window.location.hash || '#home';
    const page = hash.substring(1);
    
    if (page !== currentPage) {
        switchPage(page);
    }
}

function switchPage(page) {
    // Update active states
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Show new page
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    const targetNavLink = document.querySelector(`[data-page="${page}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }
    
    currentPage = page;
    
    // Special handling for home page animations
    if (page === 'home') {
        setTimeout(() => {
            initializeHomeAnimations();
        }, 100);
    }
}

// 3D Scene Functions
let scene, camera, renderer, cube, sphere;
let animationId;

function initialize3DScene() {
    const canvas = document.getElementById('scene3d');
    if (!canvas) return;
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
    
    // Create rotating cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.7
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    
    // Create floating sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.8
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-3, 0, 1);
    scene.add(sphere);
    
    // Add welcome text (simplified as a plane with texture)
    createWelcomeText();
    
    // Start animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createWelcomeText() {
    // Create a simple text plane (in a real app, you'd use TextGeometry or a sprite)
    const textGeometry = new THREE.PlaneGeometry(4, 1);
    const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, -3, 0);
    scene.add(textMesh);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate cube
    if (cube) {
        cube.rotation.x = Math.sin(time) * 0.3;
        cube.rotation.y += 0.01;
        cube.rotation.z = Math.cos(time) * 0.2;
        
        // Add floating effect
        cube.position.y = Math.sin(time * 2) * 0.2;
    }
    
    // Rotate sphere
    if (sphere) {
        sphere.rotation.y += 0.005;
        sphere.position.y = Math.sin(time * 1.5) * 0.2;
    }
    
    // Auto-rotate camera
    camera.position.x = Math.cos(time * 0.5) * 8;
    camera.position.z = Math.sin(time * 0.5) * 8;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const canvas = document.getElementById('scene3d');
    if (!canvas) return;
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

// Animation Functions
function initializeAnimations() {
    // Initialize home page animations
    if (currentPage === 'home') {
        initializeHomeAnimations();
    }
}

function initializeHomeAnimations() {
    // Animate home text
    if (homeText) {
        setTimeout(() => {
            homeText.classList.add('loaded');
        }, 500);
    }
    
    // Animate 3D scene
    if (sceneContainer) {
        setTimeout(() => {
            sceneContainer.classList.add('loaded');
        }, 800);
    }
    
    // Animate photo frame
    if (photoFrameDesktop) {
        setTimeout(() => {
            photoFrameDesktop.classList.add('loaded');
        }, 1100);
    }
}

// Contact Form Functions
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add focus effects to form inputs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
    
    // Reset form
    contactForm.reset();
}

function handleInputFocus(e) {
    e.target.style.borderColor = '#a855f7';
    e.target.style.boxShadow = '0 0 0 2px rgba(168, 85, 247, 0.2)';
}

function handleInputBlur(e) {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    e.target.style.boxShadow = 'none';
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #9333ea, #06b6d4)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .info-item');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize intersection observer when DOM is ready
document.addEventListener('DOMContentLoaded', initializeIntersectionObserver);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .skill-card,
    .project-card,
    .info-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .skill-card.animate-in,
    .project-card.animate-in,
    .info-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Cleanup function for 3D scene
function cleanup3DScene() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup3DScene);