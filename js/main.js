// ===== MAIN JAVASCRIPT FILE =====

// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const projectsGrid = document.getElementById('projects-grid');

// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
        
        // Update toggle button icon
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Store in localStorage
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// ===== NAVIGATION MANAGEMENT =====
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        // Add event listeners
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-page');
                this.navigateToSection(targetSection);
            });
        });

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll events for navbar styling
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigateToSection(hash);
        });

        // Initialize with current hash or default to home
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateToSection(hash);
    }

    navigateToSection(sectionName) {
        // Hide all sections
        pageSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === sectionName) {
                link.classList.add('active');
            }
        });

        // Update URL hash
        window.location.hash = sectionName;

        // Close mobile menu
        this.closeMobileMenu();

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }

    handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// ===== PROJECTS MANAGER =====
class ProjectsManager {
    constructor() {
        this.projects = [
            {
                title: "My portfolio website",
                description: "Modern, responsive personal portfolio website showcasing my projects and certifications. Built with HTML5, CSS3, and vanilla JavaScript, featuring dark mode by default, smooth animations, and a professional layout optimized for GitHub Pages deployment.",
                icon: "fas fa-shield-alt",
                language: "HTML/CSS/JS",
                stars: 0,
                forks: 0,
                url: "https://github.com/jeroSampayo/jeroSampayo.github.io",
                isPrivate: false,
                readme: `## 🔒 Portfolio

A modern, responsive personal portfolio website showcasing my projects and certifications.

### 🛠 Technologies Used

- HTML5: Semantic markup with accessibility features
- CSS3: Modern styling with CSS Grid, Flexbox, and custom properties
- JavaScript (ES6+): Vanilla JS with modern features and modular architecture
- GitHub Pages: Optimized for static hosting deployment

### ✨ Features

- Dark Mode First: Cybersecurity aesthetic with theme toggle
- Responsive Design: Mobile-first approach with touch-friendly navigation

### 🚀 Deployment

This portfolio is designed to be deployed as a GitHub Pages project, in order to practice my web development skills and to showcase my projects in a professional manner.`
            }
        ];
        
        this.init();
    }

    init() {
        this.renderProjects();
    }

    renderProjects() {
        if (!projectsGrid) return;

        projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card fade-in-up" ${project.isPrivate ? '' : `onclick="window.open('${project.url}', '_blank')"`}>
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${project.icon}"></i>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    ${project.isPrivate ? '<span class="private-badge">Private</span>' : ''}
                </div>
                <div class="project-readme">
                    ${project.readme ? project.readme.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : ''}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <div class="project-stats">
                        <span class="project-stat">
                            <i class="fas fa-star"></i>
                            ${project.stars}
                        </span>
                        <span class="project-stat">
                            <i class="fas fa-code-branch"></i>
                            ${project.forks}
                        </span>
                        <span class="project-stat">
                            <i class="fas fa-circle"></i>
                            ${project.language}
                        </span>
                        ${project.isPrivate ? '<span class="project-stat"><i class="fas fa-lock"></i> Private</span>' : ''}
                    </div>
                    ${!project.isPrivate ? `<a href="${project.url}" class="project-link" target="_blank" onclick="event.stopPropagation()">
                        <i class="fab fa-github"></i>
                        View
                    </a>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.project-card, .cert-card, .detail-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    static getRandomColor() {
        const colors = [
            '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', 
            '#f59e0b', '#ef4444', '#ec4899', '#8b5a2b'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// ===== TERMINAL ANIMATION =====
class TerminalAnimation {
    constructor() {
        this.init();
    }

    init() {
        const typingElement = document.querySelector('.typing');
        if (!typingElement) return;

        const commands = [
            'nmap -sS 192.168.1.0/24',
            'python3 exploit.py',
            'wireshark -i eth0',
            'msfconsole',
            'whoami'
        ];

        let commandIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentCommand = commands[commandIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentCommand.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentCommand.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentCommand.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                typeSpeed = 500; // Pause before next command
            }

            setTimeout(typeWriter, typeSpeed);
        };

        // Start the animation after a delay
        setTimeout(typeWriter, 2000);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const projectsManager = new ProjectsManager();
    const animationManager = new AnimationManager();
    const terminalAnimation = new TerminalAnimation();

    // Add smooth scrolling to all internal links
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

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Console welcome message
    console.log(`
    %c🔒 Welcome to Jerónimo Miras Portfolio! 🔒
    
    %cSOC Analyst | Computer Engineering Student
    Built with modern web technologies and security best practices.
    
    %cGitHub: https://github.com/jeroSampayo
    `, 
    'color: #3b82f6; font-size: 20px; font-weight: bold;',
    'color: #64748b; font-size: 14px;',
    'color: #10b981; font-size: 12px;'
    );
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Portfolio loaded in ${loadTime}ms`);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// ===== SEO ENHANCEMENTS =====
// Update page title based on current section
function updatePageTitle(sectionName) {
    const titles = {
        'home': 'Jerónimo Miras - Cyber Security Portfolio',
        'about': 'Jerónimo Miras - About Me',
        'projects': 'Jerónimo Miras - Projects',
        'certifications': 'Jerónimo Miras - Certifications'
    };
    
    document.title = titles[sectionName] || 'Jerónimo Miras - Cyber Security Portfolio';
}

// Export for global access (if needed)
window.PortfolioApp = {
    ThemeManager,
    NavigationManager,
    ProjectsManager,
    AnimationManager,
    Utils
}; 
