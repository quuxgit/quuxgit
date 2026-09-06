const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    const fdx = mouseX - followerX;
    const fdy = mouseY - followerY;
    
    followerX += fdx * 0.08;
    followerY += fdy * 0.08;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, .card, .tag');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursor.style.background = 'rgba(255, 255, 255, 0.1)';
        cursorFollower.style.width = '14px';
        cursorFollower.style.height = '14px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'transparent';
        cursorFollower.style.width = '8px';
        cursorFollower.style.height = '8px';
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            if (entry.target.classList.contains('tech-progress')) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .about-card, .showcase-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
});

document.querySelectorAll('.tech-progress').forEach(progress => {
    observer.observe(progress);
});

let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('.glass-header');
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateX(-50%) translateY(-100px)';
            } else {
                header.style.transform = 'translateX(-50%) translateY(0)';
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });
        
        ticking = true;
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const cards = document.querySelectorAll('.card, .about-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

const floatElements = document.querySelectorAll('.float-circle');
floatElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 7}s`;
});

const maskedText = document.querySelector('.masked-text');
let liquidIntensity = 0;
let liquidAnimationFrame = null;

maskedText.addEventListener('mousemove', (e) => {
    const rect = maskedText.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
    liquidIntensity = Math.max(0, 1 - distance / maxDistance);
});

maskedText.addEventListener('mouseleave', () => {
    liquidIntensity = 0;
});

function animateLiquid(time) {
    if (liquidIntensity > 0.01) {
        const wave1 = Math.sin(time * 0.003) * liquidIntensity;
        const wave2 = Math.cos(time * 0.004) * liquidIntensity;
        const wave3 = Math.sin(time * 0.005) * liquidIntensity;
        
        const scaleX = 1 + wave1 * 0.02;
        const scaleY = 1 + wave2 * 0.03;
        const skewX = wave3 * 1.5;
        const blur = Math.abs(wave1) * liquidIntensity;
        
        maskedText.style.transform = `scale(${scaleX}, ${scaleY}) skew(${skewX}deg)`;
        maskedText.style.filter = `blur(${blur}px)`;
    } else {
        const currentTransform = maskedText.style.transform || 'scale(1, 1) skew(0deg)';
        const currentBlur = parseFloat(maskedText.style.filter?.match(/blur\((.+?)px\)/)?.[1] || 0);
        
        if (currentTransform !== 'scale(1, 1) skew(0deg)' || currentBlur > 0.01) {
            const match = currentTransform.match(/scale\((.+?),\s*(.+?)\)\s*skew\((.+?)deg\)/);
            if (match) {
                const scaleX = parseFloat(match[1]);
                const scaleY = parseFloat(match[2]);
                const skewX = parseFloat(match[3]);
                
                const newScaleX = scaleX + (1 - scaleX) * 0.1;
                const newScaleY = scaleY + (1 - scaleY) * 0.1;
                const newSkewX = skewX * 0.9;
                const newBlur = currentBlur * 0.9;
                
                maskedText.style.transform = `scale(${newScaleX}, ${newScaleY}) skew(${newSkewX}deg)`;
                maskedText.style.filter = `blur(${newBlur}px)`;
            }
        }
    }
    
    liquidAnimationFrame = requestAnimationFrame(animateLiquid);
}

liquidAnimationFrame = requestAnimationFrame(animateLiquid);

const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;

const startYear = 2023;
const yearsExperience = currentYear - startYear;
document.getElementById('years-experience').textContent = yearsExperience + '+';

const qualityToggle = document.getElementById('quality-toggle');
const qualityPanel = document.getElementById('quality-panel');
const qualitySlider = document.getElementById('quality-slider');
const qualityIndicators = document.querySelectorAll('.quality-indicator');
const shaderCanvas = document.getElementById('shader-canvas');

qualityToggle.addEventListener('click', () => {
    qualityPanel.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!qualityToggle.contains(e.target) && !qualityPanel.contains(e.target)) {
        qualityPanel.classList.remove('active');
    }
});

function updateQuality(value) {
    document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
    
    qualityIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        const level = parseInt(indicator.dataset.level);
        if (value >= level - 25 && value <= level + 25) {
            indicator.classList.add('active');
        }
    });
    
    if (value < 33) {
        document.body.classList.add('quality-low');
        shaderCanvas.style.display = 'none';
        liquidIntensity = 0;
        maskedText.style.transform = 'scale(1, 1) skew(0deg)';
        maskedText.style.filter = 'none';
        if (liquidAnimationFrame) {
            cancelAnimationFrame(liquidAnimationFrame);
            liquidAnimationFrame = null;
        }
    } else if (value < 66) {
        document.body.classList.add('quality-medium');
        shaderCanvas.style.display = 'block';
        shaderCanvas.style.opacity = '0.5';
        if (!liquidAnimationFrame) {
            liquidAnimationFrame = requestAnimationFrame(animateLiquid);
        }
    } else {
        document.body.classList.add('quality-high');
        shaderCanvas.style.display = 'block';
        shaderCanvas.style.opacity = '1';
        if (!liquidAnimationFrame) {
            liquidAnimationFrame = requestAnimationFrame(animateLiquid);
        }
    }
    
    localStorage.setItem('visualQuality', value);
}

qualitySlider.addEventListener('input', (e) => {
    updateQuality(parseInt(e.target.value));
});

qualityIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const level = parseInt(indicator.dataset.level);
        qualitySlider.value = level;
        updateQuality(level);
    });
});

const savedQuality = localStorage.getItem('visualQuality');
if (savedQuality !== null) {
    qualitySlider.value = savedQuality;
    updateQuality(parseInt(savedQuality));
} else {
    updateQuality(100);
}

