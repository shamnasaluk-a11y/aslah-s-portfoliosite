// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Sticky Navigation on Scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Trigger animations for elements already in view on load
document.addEventListener("DOMContentLoaded", () => {
    // A small timeout ensures initial rendering is complete
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, 100);
});

// Reservation Form Handling
const reservationForm = document.getElementById('reservation-form');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('res-name').value;
        const email = document.getElementById('res-email').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const size = document.getElementById('res-size').value;
        
        const message = `New Reservation Request:\n\n` +
                        `Name: ${name}\n` +
                        `Email: ${email}\n` +
                        `Date: ${date}\n` +
                        `Time: ${time}\n` +
                        `Party Size: ${size}`;
        
        // Store reservation in localStorage for the Employee dashboard
        const newReservation = { name, email, date, time, size, timestamp: new Date().toISOString() };
        const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        existingReservations.push(newReservation);
        localStorage.setItem('reservations', JSON.stringify(existingReservations));

        // Alert user of success and reset form
        alert('Thank you! Your reservation has been successfully booked.');
        reservationForm.reset();
    });
}

// Scroll-based Hero Animation
const canvas = document.getElementById('hero-canvas');
const context = canvas ? canvas.getContext('2d') : null;
const heroSection = document.getElementById('home');
const heroContent = document.querySelector('.hero-content');

const frameCount = 240;
const currentFrame = index => (
  `images/hero section/ezgif-2b9cd08694743ab5-png-split (1)/ezgif-frame-${index.toString().padStart(3, '0')}.png`
);

const images = [];
let animationReady = false;

if (canvas && heroSection) {
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (images.length > 0) {
            renderFrame(lastIndex);
        }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let loadedCount = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                animationReady = true;
            }
        };
        if (i === 1) {
            img.addEventListener('load', () => renderFrame(0));
        }
        images.push(img);
    }
    
    setTimeout(() => { animationReady = true; }, 3000); 

    let lastIndex = 0;
    
    const renderFrame = (index) => {
        const img = images[index];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        
        lastIndex = index;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;
        
        if (canvasRatio > imgRatio) {
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener('scroll', () => {
        if (!images.length) return;
        
        const scrollTop = window.scrollY;
        const heroTop = heroSection.offsetTop;
        const heroHeight = heroSection.offsetHeight;
        const maxScroll = heroHeight - window.innerHeight;
        
        let scrollFraction = (scrollTop - heroTop) / maxScroll;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));
        
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        requestAnimationFrame(() => {
            renderFrame(frameIndex);
            
            if (heroContent) {
                const opacity = 1 - (scrollFraction * 2.5);
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = `translateY(${scrollFraction * 100}px)`;
            }
        });
    });
}
