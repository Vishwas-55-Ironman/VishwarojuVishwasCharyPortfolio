/* 
  ================================================
  Vishwas Portfolio - Main Script
  Handles: Animations, Scroll interactions, Background canvas
  ================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarEffect();
    initExpandableCards();
    initStatsCounter();
    initCanvasBackground();
});

/* 1. Scroll Fade-In Animations (Intersection Observer) */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                
                // Trigger stats counter if it's the summary section
                if (entry.target.id === 'summary') {
                    startStatsCounter();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(section => {
        observer.observe(section);
    });
}

/* 2. Sticky Navbar Glass Effect */
function initNavbarEffect() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 11, 16, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '0';
        } else {
            navbar.style.background = 'rgba(10, 11, 16, 0.4)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '10px 0';
        }
    });

    // Initial check
    if (window.scrollY > 50) {
        navbar.style.padding = '0';
    } else {
        navbar.style.padding = '10px 0';
    }
}

/* 3. Expandable Experience Cards */
function initExpandableCards() {
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const content = e.target.closest('.timeline-body').querySelector('.hidden-content');
            const isOpen = content.classList.contains('open');
            
            // Close all others
            document.querySelectorAll('.hidden-content.open').forEach(el => {
                if (el !== content) {
                    el.classList.remove('open');
                    el.closest('.timeline-body').querySelector('.expand-btn').classList.remove('open');
                    el.closest('.timeline-body').querySelector('.expand-btn').innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
                }
            });

            // Toggle current
            if (isOpen) {
                content.classList.remove('open');
                btn.classList.remove('open');
                btn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
            } else {
                content.classList.add('open');
                btn.classList.add('open');
                btn.innerHTML = 'Close Details <i class="fas fa-chevron-down"></i>';
            }
        });
    });
}

/* 4. Stats Counter Animation */
let countsStarted = false;
function startStatsCounter() {
    if (countsStarted) return;
    countsStarted = true;
    
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };

        if (counter.getAttribute('data-target')) {
            updateCount();
        }
    });
}

/* 5. Minimalist CAD/Mechanical Background Canvas */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let widthCanvas, heightCanvas;

    function resize() {
        widthCanvas = window.innerWidth;
        heightCanvas = window.innerHeight;
        canvas.width = widthCanvas;
        canvas.height = heightCanvas;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Data for particles (representing nodes in a CAD mesh)
    const particles = [];
    const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100); // Responsive amount
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * widthCanvas,
            y: Math.random() * heightCanvas,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, widthCanvas, heightCanvas);
        
        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > widthCanvas) p.vx *= -1;
            if (p.y < 0 || p.y > heightCanvas) p.vy *= -1;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connections (wireframe mesh effect)
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - dist/1000})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        // Add subtle parallax based on scroll
        const scrollY = window.scrollY;
        canvas.style.transform = `translateY(${scrollY * 0.2}px)`;
        
        requestAnimationFrame(draw);
    }
    
    draw();
}
