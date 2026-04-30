// IEEE GTB4CEC Student Branch - Enhanced JavaScript with JSON Data Loading

// Global variables
let currentData = {
    events: [],
    news: [],
    team: [],
    computerSociety: null,
    wie: null,
    gallery: [],
    contacts: null,
    faq: []
};

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="loading"></div>
                <p class="mt-3 text-muted">Loading...</p>
            </div>
        `;
    }
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <p class="text-muted">${message}</p>
            </div>
        `;
    }
}

// Data Loading Functions
async function loadJSON(filename) {
    try {
        const response = await fetch(`data/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

// Homepage Data Loading
async function loadHomepageData() {
    try {
        // Load recent news
        const newsData = await loadJSON('news.json');
        if (newsData && newsData.news) {
            currentData.news = newsData.news;
            displayRecentNews(newsData.news.slice(0, 3));
        }

        // Load upcoming events
        const eventsData = await loadJSON('events.json');
        if (eventsData && eventsData.events) {
            currentData.events = eventsData.events;
            const upcomingEvents = eventsData.events.filter(event => event.is_upcoming).slice(0, 3);
            displayUpcomingEvents(upcomingEvents);
        }

        // Initialize counter animations
        initializeCounters();

    } catch (error) {
        console.error('Error loading homepage data:', error);
    }
}

// Recent News Display
function displayRecentNews(news) {
    const container = document.getElementById('recent-news');
    if (!container) return;

    if (!news || news.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <p class="text-muted">No news updates available at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = news.map((item, index) => `
        <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm">
                ${item.image_url ? `<img src="${item.image_url}" class="card-img-top" alt="${item.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${truncateText(item.content, 150)}</p>
                    <small class="text-muted">${formatDate(item.date)}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Upcoming Events Display
function displayUpcomingEvents(events) {
    const container = document.getElementById('upcoming-events');
    if (!container) return;

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <p class="text-muted">No upcoming events scheduled at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map((event, index) => `
        <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm event-card">
                ${event.image_url ? `<img src="${event.image_url}" class="card-img-top event-image" alt="${event.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${truncateText(event.description, 100)}</p>
                    <p class="text-muted">
                        <i class="fas fa-calendar me-2"></i>${formatDate(event.date)}
                        ${event.time ? `<br><i class="fas fa-clock me-2"></i>${event.time}` : ''}
                        <br><i class="fas fa-map-marker-alt me-2"></i>${event.location}
                    </p>
                    <a href="events.html" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 20);
    };

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Computer Society Data Loading
async function loadComputerSocietyData() {
    try {
        const data = await loadJSON('computer_society.json');
        if (data) {
            currentData.computerSociety = data;
            displayComputerSocietyInfo(data);
            displayCSLeadership(data.leadership);
            displayCSActivities(data.activities);
            displayCSAchievements(data.achievements);
        }
    } catch (error) {
        console.error('Error loading Computer Society data:', error);
    }
}

function displayComputerSocietyInfo(data) {
    const description = document.querySelector('.chapter-description');
    const mission = document.querySelector('.mission-text');
    const vision = document.querySelector('.vision-text');

    if (description) description.textContent = data.chapter_info.description;
    if (mission) mission.textContent = data.chapter_info.mission;
    if (vision) vision.textContent = data.chapter_info.vision;
}

function displayCSLeadership(leadership) {
    const container = document.getElementById('leadership-cards');
    if (!container || !leadership) return;

    container.innerHTML = leadership.map((member, index) => `
        <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm team-card">
                <img src="${member.image_url}" class="card-img-top team-photo" alt="${member.name}">
                <div class="card-body text-center">
                    <h5 class="card-title cs-color">${member.name}</h5>
                    <p class="text-muted">${member.position}</p>
                    <p class="card-text">${member.year}</p>
                    <small class="text-muted">${member.bio}</small>
                    <div class="mt-3">
                        ${member.linkedin ? `<a href="${member.linkedin}" class="text-cs me-2"><i class="fab fa-linkedin"></i></a>` : ''}
                        
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayCSActivities(activities) {
    const container = document.getElementById('activities-grid');
    if (!container || !activities) return;

    container.innerHTML = activities.map((activity, index) => `
        <div class="col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title cs-color">${activity.title}</h5>
                    <p class="card-text">${activity.description}</p>
                    <small class="text-muted">Frequency: ${activity.frequency}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function displayCSAchievements(achievements) {
    const container = document.getElementById('achievements-list');
    if (!container || !achievements) return;

    container.innerHTML = achievements.map((achievement, index) => `
        <div class="col-md-6 mb-3" data-aos="slide-right" data-aos-delay="${index * 100}">
            <div class="d-flex align-items-center">
                <i class="fas fa-trophy text-white me-3 fa-lg"></i>
                <p class="text-white mb-0">${achievement}</p>
            </div>
        </div>
    `).join('');
}

// WIE Data Loading
async function loadWIEData() {
    try {
        const data = await loadJSON('wie.json');
        if (data) {
            currentData.wie = data;
            displayWIEInfo(data);
            displayWIELeadership(data.leadership);
            displayWIEPrograms(data.programs);
            displayWIEAchievements(data.achievements);
            displayWIEStats(data.statistics);
        }
    } catch (error) {
        console.error('Error loading WIE data:', error);
    }
}

function displayWIEInfo(data) {
    const description = document.querySelector('.chapter-description');
    const mission = document.querySelector('.mission-text');
    const vision = document.querySelector('.vision-text');

    if (description) description.textContent = data.chapter_info.description;
    if (mission) mission.textContent = data.chapter_info.mission;
    if (vision) vision.textContent = data.chapter_info.vision;
}

function displayWIEStats(stats) {
    const container = document.getElementById('wie-stats');
    if (!container || !stats) return;

    container.innerHTML = `
        <div class="col-6 text-center mb-3">
            <div class="stat-number">${stats.active_members}</div>
            <div class="stat-label">Active Members</div>
        </div>
        <div class="col-6 text-center mb-3">
            <div class="stat-number">${stats.workshops_conducted}</div>
            <div class="stat-label">Workshops</div>
        </div>
        <div class="col-6 text-center">
            <div class="stat-number">${stats.students_mentored}</div>
            <div class="stat-label">Students Mentored</div>
        </div>
        <div class="col-6 text-center">
            <div class="stat-number">${stats.scholarships_awarded}</div>
            <div class="stat-label">Certifications</div>
        </div>
    `;
}

function displayWIELeadership(leadership) {
    const container = document.getElementById('leadership-cards');
    if (!container || !leadership) return;

    container.innerHTML = leadership.map((member, index) => `
        <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm team-card">
                <img src="${member.image_url}" class="card-img-top team-photo" alt="${member.name}">
                <div class="card-body text-center">
                    <h5 class="card-title wie-color">${member.name}</h5>
                    <p class="text-muted">${member.position}</p>
                    <p class="card-text">${member.year}</p>
                    <small class="text-muted">${member.bio}</small>
                    
                    <div class="mt-3">
                        ${member.linkedin ? `<a href="${member.linkedin}" class="text-wie me-2"><i class="fab fa-linkedin"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayWIEPrograms(programs) {
    const container = document.getElementById('programs-grid');
    if (!container || !programs) return;

    container.innerHTML = programs.map((program, index) => `
        <div class="col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title wie-color">${program.title}</h5>
                    <p class="card-text">${program.description}</p>
                    <small class="text-muted">Frequency: ${program.frequency}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function displayWIEAchievements(achievements) {
    const container = document.getElementById('achievements-list');
    if (!container || !achievements) return;

    container.innerHTML = achievements.map((achievement, index) => `
        <div class="col-md-6 mb-3" data-aos="slide-right" data-aos-delay="${index * 100}">
            <div class="d-flex align-items-center">
                <i class="fas fa-award wie-color me-3 fa-lg"></i>
                <p class="mb-0">${achievement}</p>
            </div>
        </div>
    `).join('');
}

// Team Data Loading
async function loadTeamData() {
    try {
        const data = await loadJSON('team.json');
        if (data) {
            currentData.team = data;
            displayFaculty(data.faculty);
            displayExecutiveCommittee(data.executive_committee);
        }
    } catch (error) {
        console.error('Error loading team data:', error);
    }
}

function displayFaculty(faculty) {
    const container = document.getElementById('faculty-section');
    if (!container || !faculty) return;

    container.innerHTML = faculty.map(member => `
        <div class="col-md-6 mb-4" data-aos="fade-up">
            <div class="card h-100 shadow-lg faculty-card">
                <img src="${member.image_url}" class="card-img-top team-photo" alt="${member.name}">
                <div class="card-body text-center">
                    <h4 class="card-title text-primary">${member.name}</h4>
                    <p class="text-muted">${member.position}</p>
                    <p class="card-text">${member.department}</p>
                    <p class="text-muted">${member.bio}</p>
                    <small class="text-primary">Specialization: ${member.specialization}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function displayExecutiveCommittee(committee) {
    const container = document.getElementById('executive-committee');
    if (!container || !committee) return;

    container.innerHTML = committee.map((member, index) => `
        <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm team-card">
                <img src="${member.image_url}" class="card-img-top team-photo" alt="${member.name}">
                <div class="card-body text-center">
                    <h5 class="card-title text-primary">${member.name}</h5>
                    <p class="text-muted">${member.position}</p>
                    <p class="card-text">${member.year}</p>
                    <small class="text-muted">${member.bio}</small>
                    <div class="mt-3">
                        ${member.linkedin ? `<a href="${member.linkedin}" class="text-primary me-2"><i class="fab fa-linkedin"></i></a>` : ''}
                        
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Events Data Loading
async function loadEventsData() {
    try {
        const data = await loadJSON('events.json');
        if (data && data.events) {
            currentData.events = data.events;
            displayEvents(data.events);
        }
    } catch (error) {
        console.error('Error loading events data:', error);
    }
}

function displayEvents(events) {
    const upcomingContainer = document.getElementById('upcoming-events-list');
    const pastContainer = document.getElementById('past-events-list');

    const upcomingEvents = events.filter(event => event.is_upcoming);
    const pastEvents = events.filter(event => !event.is_upcoming);

    if (upcomingContainer) {
        displayEventsList(upcomingEvents, upcomingContainer, 'upcoming');
    }

    if (pastContainer) {
        displayEventsList(pastEvents, pastContainer, 'past');
    }
}

function displayEventsList(events, container, type) {
    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <p class="text-muted">No ${type} events available.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map((event, index) => `
        <div class="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm event-card">
                ${event.image_url ? `<img src="${event.image_url}" class="card-img-top event-image" alt="${event.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description}</p>
                    <div class="event-meta">
                        <p class="text-muted mb-1">
                            <i class="fas fa-calendar me-2"></i>${formatDate(event.date)}
                            ${event.time ? ` at ${event.time}` : ''}
                        </p>
                        <p class="text-muted mb-1">
                            <i class="fas fa-map-marker-alt me-2"></i>${event.location}
                        </p>
                        ${event.category ? `<span class="badge bg-primary">${event.category}</span>` : ''}
                    </div>
                        ${event.registration_required && event.is_upcoming && event.registration_link ? `
                        <a href="${event.registration_link}" target="_blank" class="btn btn-primary mt-3">
                            <i class="fas fa-external-link-alt me-1"></i>Register Now
                        </a>
                    ` : event.registration_required && event.is_upcoming ? `
                        <button class="btn btn-primary mt-3" onclick="registerForEvent(${event.id})">
                            Register Now
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// News Data Loading
async function loadNewsData() {
    try {
        const data = await loadJSON('news.json');
        if (data && data.news) {
            currentData.news = data.news;
            displayNewsList(data.news);
        }
    } catch (error) {
        console.error('Error loading news data:', error);
    }
}

function displayNewsList(news) {
    const container = document.getElementById('news-list');
    if (!container) return;

    if (!news || news.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <p class="text-muted">No news articles available.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = news.map((item, index) => `
        <div class="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card h-100 shadow-sm">
                ${item.image_url ? `<img src="${item.image_url}" class="card-img-top" alt="${item.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${truncateText(item.content, 200)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${formatDate(item.date)}</small>
                        ${item.is_featured ? `<span class="badge bg-warning">Featured</span>` : ''}
                    </div>
                    <small class="text-muted">By ${item.author || 'IEEE GTB4CEC'}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// FAQ Data Loading
async function loadFAQData() {
    try {
        const data = await loadJSON('faq.json');
        if (data && data.faqs) {
            currentData.faq = data.faqs;
            displayFAQ(data.faqs);
            initializeFAQSearch(data.faqs);
        }
    } catch (error) {
        console.error('Error loading FAQ data:', error);
    }
}

function displayFAQ(faqs) {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = faqs.map((faq, index) => `
        <div class="accordion-item" data-category="${faq.category}">
            <h2 class="accordion-header" id="heading${faq.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse${faq.id}" aria-expanded="false">
                    ${faq.question}
                </button>
            </h2>
            <div id="collapse${faq.id}" class="accordion-collapse collapse" 
                 data-bs-parent="#faq-accordion">
                <div class="accordion-body">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `).join('');
}

function initializeFAQSearch(faqs) {
    const searchInput = document.getElementById('faq-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFAQs = faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm) || 
            faq.answer.toLowerCase().includes(searchTerm)
        );
        displayFAQ(filteredFAQs);
    });
}

// Gallery Data Loading
async function loadGalleryData() {
    try {
        const data = await loadJSON('gallery.json');
        if (data && data.gallery) {
            currentData.gallery = data.gallery;
            displayGallery(data.gallery);
            initializeGalleryFilters(data.gallery);
        }
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
}

function displayGallery(images) {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    container.innerHTML = images.map((image, index) => `
        <div class="col-md-4 mb-4 gallery-item" data-category="${image.category}" 
             data-aos="zoom-in" data-aos-delay="${index * 50}">
            <div class="card h-100 shadow-sm">
                <img src="${image.image_url}" class="card-img-top gallery-image" 
                     alt="${image.title}" onclick="openLightbox('${image.image_url}', '${image.title}')">
                <div class="card-body">
                    <h6 class="card-title">${image.title}</h6>
                    <small class="text-muted">${formatDate(image.date)}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeGalleryFilters(images) {
    const categories = [...new Set(images.map(img => img.category))];
    const filterContainer = document.getElementById('gallery-filters');
    
    if (filterContainer) {
        filterContainer.innerHTML = `
            <button class="btn btn-outline-primary active" onclick="filterGallery('all')">All</button>
            ${categories.map(cat => `
                <button class="btn btn-outline-primary" onclick="filterGallery('${cat}')">
                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            `).join('')}
        `;
    }
}

function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('#gallery-filters button');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            item.style.display = 'none';
        }
    });
}

// Contact Form Handling
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Simulate form submission (in real app, this would go to a server)
    console.log('Contact form submitted:', contactData);
    
    // Show success message
    showAlert('Your message has been sent successfully! We will get back to you soon.', 'success');
    form.reset();
}

// Event Registration
function registerForEvent(eventId) {
    // In a real application, this would open a registration modal or redirect to a registration form
    console.log(`Registering for event ${eventId}`);
    showAlert('Registration functionality will be available soon!', 'info');
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || document.body;
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// Lightbox functionality
function openLightbox(imageUrl, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <img src="${imageUrl}" alt="${title}">
            <div class="lightbox-caption">${title}</div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = 'auto';
    }
}

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip invalid selectors like '#' or empty hrefs
            if (href && href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add scrolled class to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Set up contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Export functions for global access
window.loadHomepageData = loadHomepageData;
window.loadComputerSocietyData = loadComputerSocietyData;
window.loadWIEData = loadWIEData;
window.loadTeamData = loadTeamData;
window.loadEventsData = loadEventsData;
window.loadNewsData = loadNewsData;
window.loadFAQData = loadFAQData;
window.loadGalleryData = loadGalleryData;
window.filterGallery = filterGallery;
window.registerForEvent = registerForEvent;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;