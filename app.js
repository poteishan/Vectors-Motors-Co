// app.js - Vectors ATV Website with Booking Chatbot Integration

// ==================== 3D MODEL VIEWER FUNCTIONALITY ====================
const open3DButton = document.getElementById('open3D');
const modelSlide = document.getElementById('modelSlide');
const closeModelButton = document.getElementById('closeModel');
// Remove the duplicate body declaration - it's already declared at the top

if (open3DButton && modelSlide) {
    open3DButton.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Show the 3D model modal
        modelSlide.classList.add('active');
        body.classList.add('no-scroll');

        // Hide any other open sections
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.classList.remove('show');
        }

        // Hide mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
        }
    });
}

if (closeModelButton && modelSlide) {
    closeModelButton.addEventListener('click', function () {
        modelSlide.classList.remove('active');
        body.classList.remove('no-scroll');
    });
}

// Close 3D model when clicking outside
if (modelSlide) {
    modelSlide.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
}

// Close 3D model with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modelSlide.classList.contains('active')) {
        modelSlide.classList.remove('active');
        body.classList.remove('no-scroll');
    }
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', function () {
    const button = document.querySelector('[onclick="toggleFullscreen()"] i');
    if (button) {
        if (document.fullscreenElement) {
            button.className = 'fas fa-compress';
        } else {
            button.className = 'fas fa-expand';
        }
    }
});

// Function to toggle fullscreen
function toggleFullscreen() {
    const modelViewer = document.querySelector('model-viewer');
    if (!modelViewer) return;

    if (!document.fullscreenElement) {
        if (modelViewer.requestFullscreen) {
            modelViewer.requestFullscreen();
        } else if (modelViewer.webkitRequestFullscreen) {
            modelViewer.webkitRequestFullscreen();
        } else if (modelViewer.msRequestFullscreen) {
            modelViewer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // ==================== WEBSITE FUNCTIONALITY ====================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const productsToggle = document.getElementById('products-toggle');
    const productsSection = document.getElementById('products-section');
    const closeProducts = document.getElementById('close-products');
    const body = document.body;

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            // Toggle the 'show' class on nav-links
            navLinks.classList.toggle('show');
        });
    }

    // Toggle Products Section
    if (productsToggle) {
        productsToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle products section
            productsSection.classList.toggle('show');

            // Add/remove no-scroll class to body
            body.classList.toggle('no-scroll');

            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }

            // Scroll to top of products section
            if (productsSection.classList.contains('show')) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Close Products Section
    if (closeProducts) {
        closeProducts.addEventListener('click', function () {
            productsSection.classList.remove('show');
            body.classList.remove('no-scroll');
        });
    }

    // Close products section when clicking outside on mobile
    if (window.innerWidth <= 768) {
        document.addEventListener('click', function (e) {
            if (!productsSection.contains(e.target) &&
                !productsToggle.contains(e.target) &&
                productsSection.classList.contains('show')) {
                productsSection.classList.remove('show');
                body.classList.remove('no-scroll');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't prevent default for products toggle
            if (this.id !== 'products-toggle') {
                e.preventDefault();
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#products-toggle') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }

                // Close products section if open
                if (productsSection.classList.contains('show')) {
                    productsSection.classList.remove('show');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Add hover effect to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Product Categories Toggle Functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const categoryCards = document.querySelectorAll('.category-card');

    if (toggleButtons.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                toggleButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-category');

                // Filter category cards
                categoryCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        // Show card with animation
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        // Hide card with animation
                        card.classList.add('hidden');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 500);
                    }
                });
            });
        });
    }

    // Enhanced hover effects for category cards
    categoryCards.forEach(card => {
        const image = card.querySelector('.category-image img');
        const overlay = card.querySelector('.category-overlay');

        card.addEventListener('mouseenter', function () {
            // Add subtle scale to image
            image.style.transform = 'scale(1.1)';

            // Show overlay smoothly
            overlay.style.opacity = '1';

            // Add glow effect
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function () {
            // Reset image
            image.style.transform = 'scale(1)';

            // Hide overlay
            overlay.style.opacity = '0';

            // Reset shadow
            this.style.boxShadow = 'var(--shadow)';
        });
    });

    // Platform access button interactions
    const platformBtns = document.querySelectorAll('.platform-access .btn, .access-platform .btn');
    platformBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (this.classList.contains('btn-outline')) {
                // For demo button
                e.preventDefault();
                alert('This would launch a product demo video in a full implementation.');
            }
        });
    });

    // Current year for footer
    const yearElement = document.querySelector('footer .footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        // On desktop, show the nav links normally
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        }
        // On mobile, hide the nav links unless they're already open
        else {
            if (navLinks.style.display !== 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });

    // Close products section on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && productsSection.classList.contains('show')) {
            productsSection.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    // ==================== BOOKING CHATBOT INTEGRATION ====================

    const SERVICE_PRICES = {
        "Regular Service": 1500,
        "Full Service": 6000,
        "Brake Overhaul": 3000,
        "Suspension Repair": 4500
    };


    // Initialize chatbot when page loads
    initBookingChatbot();

    // Show welcome notification after 3 seconds
    setTimeout(() => {
        const badge = document.getElementById('chatbotBadge');
        const chatbotContainer = document.getElementById('chatbotContainer');
        if (badge && !chatbotContainer.classList.contains('active')) {
            badge.style.display = 'flex';
            badge.textContent = '!';
        }
    }, 3000);

    // Console log for development
    console.log('Vectors ATV Website loaded successfully.');
});

// ==================== BOOKING CHATBOT FUNCTIONS ====================

// Configuration
const CONFIG = {
    company: {
        name: "Vectors Motors",
        phone: "1800-VECTORS-1",
        email: "service@vectorsmotors.com",
        address: "123 Auto Nagar, Delhi"
    },
    services: {
        regular: { name: "Regular Service", price: 1500, time: "2-3 hours" },
        maintenance: { name: "Routine Maintenance", price: 3500, time: "3-4 hours" },
        suspension: { name: "Suspension Repair", price: 4500, time: "4-5 hours" },
        brakes: { name: "Brake Overhaul", price: 3000, time: "3-4 hours" },
        full: { name: "Full Service", price: 6000, time: "5-6 hours" }
    },
    parts: {
        engine: [
            { name: "Oil Filter", price: 250 },
            { name: "Engine Oil (1L)", price: 400 },
            { name: "Spark Plug", price: 300 },
            { name: "Carburetor", price: 2500 }
        ],
        brakes: [
            { name: "Brake Pads (Front)", price: 800 },
            { name: "Brake Pads (Rear)", price: 900 },
            { name: "Brake Disc (Front)", price: 1200 },
            { name: "Brake Disc (Rear)", price: 1500 }
        ],
        tires: [
            { name: "ATV Tire (Front)", price: 4500 },
            { name: "ATV Tire (Rear)", price: 5200 }
        ]
    }
};

// Application State
const state = {
    booking: {
        step: 0,
        name: "",
        phone: "",
        vehicle: "",
        service: "",
        date: "",
        issue: "",
        parts: []
    },
    ai: {
        currentCategory: null,
        currentQuestion: null,
        conversation: [],
        mode: "demo"
    },
    ui: {
        activeSection: "categories",
        lastCategory: null,
        isMobile: window.innerWidth <= 768
    }
};


// DOM Elements
const elements = {
    bookingMessages: document.getElementById('bookingMessages'),
    bookingInput: document.getElementById('bookingInput'),
    statusName: document.getElementById('statusName'),
    statusService: document.getElementById('statusService'),
    statusDate: document.getElementById('statusDate'),

    aiMessages: document.getElementById('aiMessages'),
    aiInput: document.getElementById('aiInput'),
    modelSelect: document.getElementById('modelSelect'),

    categorySection: document.getElementById('categorySection'),
    questionSection: document.getElementById('questionSection'),
    followupSection: document.getElementById('followupSection'),

    questionGrid: document.getElementById('questionGrid'),
    followupGrid: document.getElementById('followupGrid'),
    questionCategoryTitle: document.getElementById('questionCategoryTitle'),
    backToCategories: document.getElementById('backToCategories'),

    quickBook: document.getElementById('quickBook'),
    quickQuote: document.getElementById('quickQuote'),
    quickHelp: document.getElementById('quickHelp'),
    quickBrochure: document.getElementById('quickBrochure'),

    pdfModal: document.getElementById('pdfModal'),
    closeModal: document.getElementById('closeModal'),
    downloadPDF: document.getElementById('downloadPDF'),
    pdfContent: document.getElementById('pdfContent')
};


// Check if mobile device
function checkMobile() {
    state.ui.isMobile = window.innerWidth <= 768;
    if (state.ui.isMobile) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// Handle window resize
function handleResize() {
    checkMobile();
    adjustButtonGrids();
}

// Adjust button grids based on screen size
function adjustButtonGrids() {
    const grids = document.querySelectorAll('.button-grid');
    grids.forEach(grid => {
        if (state.ui.isMobile) {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        }
    });
}

// ==================== BOOKING SYSTEM ====================
function startBookingSystem() {
    clearBookingMessages();
    showBookingMessage("👋 Welcome to Vectors Motors ATV Service!", "bot");
    showBookingMessage("I'll help you book a service appointment. Let's get started!", "bot");

    setTimeout(() => askBookingQuestion(), 800);
}


// Input Functions

function submitName() {
    const name = document.getElementById('nameInput').value.trim();

    if (!name || name.length < 2) {
        showError("Please enter a valid name (min 2 characters)");
        return;
    }

    state.booking.name = name;
    state.booking.step = 1;
    showBookingMessage(name, "user");
    updateStatus("name", name);
    setTimeout(() => askBookingQuestion(), 500);
}


function submitPhone() {
    const phone = document.getElementById('phoneInput').value.trim();

    if (!phone || !/^\d{10}$/.test(phone)) {
        showError("Please enter a valid 10-digit phone number");
        return;
    }

    state.booking.phone = phone;
    state.booking.step = 2;
    showBookingMessage(phone, "user");
    setTimeout(() => askBookingQuestion(), 500);
}

function showServiceButtons() {
    const buttons = [
        { text: "🛢️ Regular Service", value: "regular", details: "₹1,500 • 2-3 hours" },
        { text: "📋 Routine Maintenance", value: "maintenance", details: "₹3,500 • 3-4 hours" },
        { text: "🔧 Suspension Repair", value: "suspension", details: "₹4,500 • 4-5 hours" },
        { text: "🛑 Brake Overhaul", value: "brakes", details: "₹3,000 • 3-4 hours" },
        { text: "⚡ Full Service", value: "full", details: "₹6,000 • 5-6 hours" }
    ];
    renderButtonGrid(buttons, handleServiceSelection, "booking");
}

function showDateButtons() {
    const today = new Date();
    const buttons = [];

    for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const day = date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const isoDate = date.toISOString().split('T')[0];

        buttons.push({
            text: `${day}, ${dateStr}`,
            value: isoDate
        });
    }


    buttons.push({ text: "Other Date", action: "showDatePicker" });
    renderButtonGrid(buttons, handleDateSelection, "booking");
}


function showConfirmation() {
    const booking = state.booking;
    const service = CONFIG.services[booking.service];
    const partsTotal = booking.parts.reduce((sum, part) => sum + part.price, 0);
    const total = service.price + partsTotal;

    const html = `
        <div class="confirmation-card">
            <h3><i class="fas fa-check-circle"></i> Booking Summary</h3>
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="label">Name:</span>
                    <span class="value">${booking.name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">${booking.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Vehicle:</span>
                    <span class="value">${booking.vehicle}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Service:</span>
                    <span class="value">${service.name} - ₹${service.price}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">${booking.date}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Issue:</span>
                    <span class="value">${booking.issue}</span>
                </div>
                ${booking.parts.length > 0 ? `<div class="detail-row">
                    <span class="label">Parts:</span>
                    <span class="value">${booking.parts.map(p => p.name).join(', ')}</span>
                </div>` : ''}
                <div class="detail-row total">
                    <span class="label">Total Amount:</span>
                    <span class="value">₹${total}</span>
                </div>
            </div>
        </div>
    `;

    elements.bookingMessages.innerHTML += html;

    const buttons = [
        { text: "✅ Confirm Booking", action: "confirmBooking" },
        { text: "✏️ Edit Details", action: "editBooking" },
        { text: "📄 Download Summary", action: "downloadSummary" }
    ];
    renderButtonGrid(buttons, handleConfirmation, "booking");
}

// Button Handlers
function handleVehicleSelection(value, action) {
    if (action === "showCustomVehicle") {
        showCustomInput("Enter registration number:", value => {
            state.booking.vehicle = value;
            state.booking.step = 4;
            showBookingMessage(value, "user");
            setTimeout(() => askBookingQuestion(), 500);
        });
    } else {
        state.booking.vehicle = value;
        state.booking.step = 4;
        showBookingMessage(value, "user");
        setTimeout(() => askBookingQuestion(), 500);
    }
}

function handleServiceSelection(value) {
    const service = CONFIG.services[value];
    state.booking.service = value;
    state.booking.step = 5;
    showBookingMessage(service.name, "user");
    updateStatus("service", service.name);
    setTimeout(() => askBookingQuestion(), 500);
}

function handleIssueSelection(value, action) {
    if (action === "showCustomIssue") {
        showCustomInput("Describe the issue:", value => {
            state.booking.issue = value;
            state.booking.step = 6;
            showBookingMessage(value, "user");
            setTimeout(() => askBookingQuestion(), 500);
        });
    } else {
        state.booking.issue = value;
        state.booking.step = 6;
        showBookingMessage(value, "user");
        setTimeout(() => askBookingQuestion(), 500);
    }
}

function handleDateSelection(value, action) {
    if (action === "showDatePicker") {
        showCustomDatePicker();
    } else {
        const date = new Date(value);
        const dateStr = date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        state.booking.date = dateStr;
        state.booking.step = 7;
        showBookingMessage(dateStr, "user");
        updateStatus("date", dateStr);
        setTimeout(() => askBookingQuestion(), 500);
    }
}

function handleConfirmation(value, action) {
    if (action === "confirmBooking") {
        completeBooking();
    } else if (action === "editBooking") {
        state.booking.step = 0;
        clearBookingMessages();
        startBookingSystem();
    } else if (action === "downloadSummary") {
        generatePDFReport();
    }
}

// ==================== AI CHAT SYSTEM ====================
function setupAIListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            selectCategory(category);
        });
    });

    // Back to categories
    elements.backToCategories.addEventListener('click', () => {
        showCategorySection();
    });

    // Model selector
    elements.modelSelect.addEventListener('change', (e) => {
        state.ai.mode = e.target.value;
        showAIMessage(`Switched to ${e.target.options[e.target.selectedIndex].text}`, "bot");
    });
}

function selectCategory(category) {
    state.ai.currentCategory = category;
    const categoryData = KNOWLEDGE_BASE[category];

    if (!categoryData) return;

    // Update UI
    elements.questionCategoryTitle.innerHTML = `
        <i class="fas fa-${getCategoryIcon(category)}"></i>
        ${categoryData.title}
    `;

    // Show questions
    showQuestionSection();

    // Clear and render questions
    elements.questionGrid.innerHTML = "";
    categoryData.questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = q.text;
        btn.onclick = () => selectQuestion(q);
        elements.questionGrid.appendChild(btn);
    });

    // Show AI message
    showAIMessage(`Here are common questions about ${categoryData.title.toLowerCase()}:`, "bot");
}

function selectQuestion(question) {
    state.ai.currentQuestion = question;

    // Show question
    showAIMessage(question.text, "user");

    // Show typing indicator
    showTypingIndicator("ai", true);

    setTimeout(() => {
        showTypingIndicator("ai", false);
        showAIMessage(question.answer, "bot");

        // Check for action
        if (question.action) {
            executeAction(question.action);
        }

        // Show follow-up questions if available
        if (question.followups && question.followups.length > 0) {
            setTimeout(() => {
                showFollowupQuestions(question.followups);
            }, 300);
        }
    }, 1000);
}

function showFollowupQuestions(followups) {
    elements.followupGrid.innerHTML = "";

    followups.forEach(followup => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = followup;
        btn.onclick = () => {
            showAIMessage(followup, "user");
            showTypingIndicator("ai", true);

            setTimeout(() => {
                showTypingIndicator("ai", false);
                const response = generateFollowupResponse(followup);
                showAIMessage(response, "bot");
            }, 800);
        };
        elements.followupGrid.appendChild(btn);
    });

    // Show followup section
    showFollowupSection();
}

function generateFollowupResponse(question) {
    const responses = {
        "What oil brand is best?": "We recommend Motul or Shell for ATV engines. Both offer excellent protection and performance.",
        "Can I do it myself?": "Yes! Basic maintenance like oil changes can be DIY. We recommend our DIY kit for ₹1,000 with all tools.",
        "Oil change service cost": "Oil change service: ₹1,500 including oil, filter, and inspection.",
        "Battery is fine, still won't start": "Check fuel pump, ignition coil, and starter relay. Might need professional diagnostics.",
        "Regular service cost": "Regular service: ₹1,500. Includes oil, filter, and 20-point inspection.",
        "default": "For detailed information about this, I recommend visiting our service center or calling 1800-VECTORS-1."
    };

    return responses[question] || responses.default;
}

function executeAction(action) {
    switch (action) {
        case "startBooking":
            showAIMessage("Let me help you book a service...", "bot");
            selectCategory("booking");
            break;
        case "startQuote":
            const quote = generateQuickQuote();
            showAIMessage(quote, "bot");
            break;
    }
}

// ==================== QUICK ACTIONS ====================
function setupQuickActions() {
    elements.quickBook.addEventListener('click', () => {
        selectCategory("booking");
    });

    elements.quickQuote.addEventListener('click', () => {
        const quote = generateQuickQuote();
        showAIMessage("📋 Instant Quote Generated", "bot");
        setTimeout(() => {
            showAIMessage(quote, "bot");
        }, 300);
    });

    elements.quickHelp.addEventListener('click', () => {
        showAIMessage("🚨 EMERGENCY ASSISTANCE\n\n• Call: 1800-VECTORS-1 (24/7)\n• WhatsApp: +91 98765 43210\n• Free pickup within 50km\n\nWe'll dispatch a technician immediately!", "bot");
    });

    elements.quickBrochure.addEventListener('click', () => {
        generatePDFBrochure();
    });
}

function generateQuickQuote() {
    const services = Object.values(CONFIG.services);
    const randomService = services[Math.floor(Math.random() * services.length)];

    return `📋 INSTANT QUOTE\n\n` +
        `Service: ${randomService.name}\n` +
        `Price: ₹${randomService.price}\n` +
        `Time: ${randomService.time}\n\n` +
        `📍 Includes:\n` +
        `• Complete inspection\n` +
        `• Genuine parts (if needed)\n` +
        `• 6-month warranty\n` +
        `• Free pickup within 20km\n\n` +
        `💡 Want to book this service?`;
}

// ==================== UI HELPERS ====================
function showCategorySection() {
    elements.categorySection.classList.add('active');
    elements.questionSection.classList.remove('active');
    elements.followupSection.classList.remove('active');
    state.ai.currentCategory = null;
}

function showQuestionSection() {
    elements.categorySection.classList.remove('active');
    elements.questionSection.classList.add('active');
    elements.followupSection.classList.remove('active');
}

function showFollowupSection() {
    elements.categorySection.classList.remove('active');
    elements.questionSection.classList.remove('active');
    elements.followupSection.classList.add('active');
}

// Message Functions
function showBookingMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (text.includes('\n')) {
        const lines = text.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            bubble.appendChild(p);
        });
    } else {
        bubble.innerHTML = `<p>${text}</p>`;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    elements.bookingMessages.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        elements.bookingMessages.scrollTop = elements.bookingMessages.scrollHeight;
    }, 100);
}

function showAIMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const formattedText = text.replace(/\n/g, '<br>');
    bubble.innerHTML = `<p>${formattedText}</p>`;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    elements.aiMessages.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        elements.aiMessages.scrollTop = elements.aiMessages.scrollHeight;
    }, 100);
}

function renderButtonGrid(buttons, handler, type) {
    const container = type === "booking" ? elements.bookingInput : elements.aiInput;
    container.innerHTML = "";

    const grid = document.createElement('div');
    grid.className = 'button-grid';

    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = type === "booking" ? 'booking-btn' : 'question-btn';

        if (type === "booking") {
            btn.innerHTML = button.text;
            if (button.details) {
                const details = document.createElement('div');
                details.className = 'btn-details';
                details.textContent = button.details;
                btn.appendChild(details);
            }

            btn.onclick = () => {
                if (button.action) {
                    handler(button.value, button.action);
                } else {
                    handler(button.value);
                }
            };
        } else {
            btn.textContent = button.text || button;
            btn.onclick = () => handler(button.value || button);
        }

        grid.appendChild(btn);
    });

    container.appendChild(grid);
}

function clearBookingMessages() {
    elements.bookingMessages.innerHTML = "";
}

function clearBookingInput() {
    elements.bookingInput.innerHTML = "";
}

function updateStatus(type, value) {
    switch (type) {
        case "name":
            elements.statusName.textContent = value;
            break;
        case "service":
            elements.statusService.textContent = value;
            break;
        case "date":
            elements.statusDate.textContent = value;
            break;
    }
}

function showTypingIndicator(type, show) {
    let indicator;
    if (type === "ai") {
        indicator = document.getElementById('aiTyping');
    } else {
        indicator = document.getElementById('bookingTyping');
    }

    if (indicator) {
        if (show) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    const inputContainer = elements.bookingInput.querySelector('.input-container');
    if (inputContainer) {
        inputContainer.prepend(errorDiv);
    } else {
        elements.bookingInput.prepend(errorDiv);
    }

    setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.remove();
    }, 3000);
}

// ==================== UTILITY FUNCTIONS ====================
function getCategoryIcon(category) {
    const icons = {
        maintenance: 'oil-can',
        troubleshooting: 'tools',
        parts: 'cog',
        service: 'calendar-alt',
        safety: 'shield-alt',
        booking: 'calendar-check'
    };
    return icons[category] || 'question-circle';
}

function getPartDetails(partId) {
    const partsMap = {
        oil_filter: { name: "Oil Filter", price: 250 },
        brake_pads: { name: "Brake Pads", price: 800 },
        spark_plug: { name: "Spark Plug", price: 300 },
        tire_front: { name: "ATV Tire (Front)", price: 4500 },
        tire_rear: { name: "ATV Tire (Rear)", price: 5200 },
        battery: { name: "Battery", price: 2500 }
    };
    return partsMap[partId];
}

function showCustomInput(placeholder, callback) {
    const modal = document.createElement('div');
    modal.className = 'custom-input-modal';

    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 400px;">
            <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 16px;">
                <i class="fas fa-edit"></i> ${placeholder}
            </h3>
            <input type="text" 
                   id="customInput" 
                   placeholder="${placeholder}"
                   style="width: 100%; padding: 12px; border: 2px solid var(--border); 
                   border-radius: 8px; margin-bottom: 15px; font-size: 14px;">
            <div style="display: flex; gap: 10px;">
                <button id="submitCustom" style="flex:1; background: var(--primary); color: white; 
                        border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Submit
                </button>
                <button id="cancelCustom" style="flex:1; background: var(--light); color: var(--dark); 
                        border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        document.getElementById('customInput').focus();
    }, 100);

    document.getElementById('submitCustom').onclick = () => {
        const value = document.getElementById('customInput').value.trim();
        if (value && callback) {
            callback(value);
        }
        document.body.removeChild(modal);
    };

    document.getElementById('cancelCustom').onclick = () => {
        document.body.removeChild(modal);
    };

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
        }
        if (e.key === 'Enter' && document.activeElement.id === 'customInput') {
            document.getElementById('submitCustom').click();
        }
    });
}

function showCustomDatePicker() {
    const modal = document.createElement('div');
    modal.className = 'custom-input-modal';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 400px;">
            <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 16px;">
                <i class="fas fa-calendar"></i> Select Date
            </h3>
            <input type="date" 
                   id="datePicker" 
                   min="${minDate}"
                   style="width: 100%; padding: 12px; border: 2px solid var(--border); 
                   border-radius: 8px; margin-bottom: 15px; font-size: 14px;">
            <div style="display: flex; gap: 10px;">
                <button id="submitDate" style="flex:1; background: var(--primary); color: white; 
                        border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Select
                </button>
                <button id="cancelDate" style="flex:1; background: var(--light); color: var(--dark); 
                        border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        document.getElementById('datePicker').focus();
    }, 100);

    document.getElementById('submitDate').onclick = () => {
        const date = document.getElementById('datePicker').value;
        if (date) {
            handleDateSelection(date);
        }
        document.body.removeChild(modal);
    };

    document.getElementById('cancelDate').onclick = () => {
        document.body.removeChild(modal);
    };
}

function showDetailedParts() {
    clearBookingInput();

    let html = '<h4 style="color: var(--primary); margin-bottom: 10px; font-size: 15px;">Select Parts</h4>';

    // Add parts by category
    for (const category in CONFIG.parts) {
        html += `<div style="margin-bottom: 15px;">
                    <h5 style="color: #666; margin-bottom: 5px; font-size: 13px;">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">`;

        CONFIG.parts[category].forEach(part => {
            html += `<button class="booking-btn" onclick="addPartToBooking('${part.name}', ${part.price})">
                        ${part.name} - ₹${part.price}
                     </button>`;
        });

        html += '</div></div>';
    }

    html += `
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="submit-btn" onclick="finishPartsSelection()" style="flex: 1;">
                <i class="fas fa-check"></i> Done
            </button>
            <button class="skip-btn" onclick="skipParts()" style="flex: 1;">
                <i class="fas fa-times"></i> Skip Parts
            </button>
        </div>
    `;

    elements.bookingInput.innerHTML = html;
}

function addPartToBooking(name, price) {
    state.booking.parts.push({ name, price });
    showBookingMessage(`Added: ${name} (₹${price})`, "user");
}

function finishPartsSelection() {
    state.booking.step = 8;
    setTimeout(() => askBookingQuestion(), 500);
}

function skipParts() {
    state.booking.parts = [];
    state.booking.step = 8;
    showBookingMessage("Skipped parts selection", "user");
    setTimeout(() => askBookingQuestion(), 500);
}

function completeBooking() {
    const bookingId = 'VM' + Date.now().toString().slice(-6);

    showBookingMessage("✅ Booking Confirmed!", "bot");
    showBookingMessage(`Thank you ${state.booking.name}! Your booking ID: ${bookingId}`, "bot");
    showBookingMessage("We'll contact you within 24 hours to confirm.", "bot");
    saveBookingForPDF();

    // ===== FIX: Save booking to localStorage =====
    try {
        // Get service details from CONFIG
        const serviceDetails = CONFIG.services[state.booking.service] || {
            name: state.booking.service,
            price: 0
        };

        // Create complete booking object
        const completeBookingData = {
            ...state.booking,
            bookingId: bookingId,
            serviceDetails: serviceDetails,
            timestamp: new Date().toISOString(),
            parts: state.booking.parts || []
        };

        // Save to localStorage
        saveBookingForPDF();
        console.log('Booking saved to localStorage:', completeBookingData);
    } catch (error) {
        console.error('Error saving booking to localStorage:', error);
    }
    // ===== END FIX =====

    // Add download button
    elements.bookingInput.innerHTML = `
        <div class="input-container" style="text-align: center;">
            <p style="margin-bottom: 15px; color: var(--primary); font-weight: 600;">Download your booking summary:</p>
            <button class="submit-btn" onclick="generatePDFReport()" style="width: 100%;">
                <i class="fas fa-download"></i> Download Booking Summary
            </button>
        </div>
    `;
}

function saveBookingToLocalStorage() {
    try {
        const bookingData = {
            ...state.booking,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('vectors-last-booking', JSON.stringify(bookingData));
    } catch (error) {
        console.error('Error saving booking to localStorage:', error);
    }
}

// Then update each step completion function to call saveBookingToLocalStorage():
// For example, in submitName, submitPhone, etc.:

function submitName() {
    const name = document.getElementById('nameInput').value.trim();

    if (!name || name.length < 2) {
        showError("Please enter a valid name (min 2 characters)");
        return;
    }

    state.booking.name = name;
    state.booking.step = 1;
    showBookingMessage(name, "user");
    updateStatus("name", name);

    setTimeout(() => askBookingQuestion(), 500);
}

function resetBooking() {
    // Clear current booking state
    state.booking = {
        step: 0,
        name: "", phone: "", vehicle: "",
        service: "", date: "", issue: "", parts: []
    };

    // Clear status display
    elements.statusName.textContent = "Not Started";
    elements.statusService.textContent = "No Service";
    elements.statusDate.textContent = "No Date";

    // Restart booking system
    startBookingSystem();
}

// ==================== PDF GENERATION ====================
function generatePDFReport() {

    const booking = JSON.parse(
        localStorage.getItem("vectors-booking")
    );

    if (!booking) {
        alert("Booking details not found.");
        return;
    }


    const service =
        CONFIG.services[booking.service] || { name: booking.service, price: 0 };

    const partsTotal = (booking.parts || []).reduce(
        (sum, p) => sum + (p.price || 0), 0
    );

    const total = service.price + partsTotal;

    const html = `
<div style="
    font-family: 'Open Sans', Arial, sans-serif;
    padding: 30px;
    max-width: 700px;
    margin: auto;
    color: #333;
">

    <!-- HEADER -->
    <div style="text-align:center; margin-bottom:25px;">
        <h2 style="margin:0; letter-spacing:1px;">🚗 VECTORS MOTORS</h2>
        <p style="margin-top:5px; color:#777;">Service Booking Confirmation</p>
    </div>

    <hr style="border:none; border-top:1px solid #ddd; margin-bottom:25px;">

    <!-- BOOKING DETAILS -->
    <h3 style="color:#2c3e50; margin-bottom:15px;">Booking Details</h3>

    <table style="width:100%; border-collapse:collapse; font-size:15px;">
        <tr>
            <td style="padding:8px 0;"><strong>Booking ID:</strong></td>
            <td style="padding:8px 0; text-align:right;">VM${Date.now().toString().slice(-8)}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;"><strong>Customer:</strong></td>
            <td style="padding:8px 0; text-align:right;">${booking.name}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;"><strong>Service:</strong></td>
            <td style="padding:8px 0; text-align:right;">${service.name}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;"><strong>Date:</strong></td>
            <td style="padding:8px 0; text-align:right;">${booking.date}</td>
        </tr>
    </table>

    <!-- COST BREAKDOWN -->
    <div style="
        background:#fff3ec;
        padding:20px;
        border-radius:8px;
        margin-top:30px;
    ">
        <h3 style="color:#ff6b35; margin-bottom:15px;">Cost Breakdown</h3>

        <table style="width:100%; border-collapse:collapse;">
            <tr>
                <td style="padding:10px 0;">Service Charge</td>
                <td style="padding:10px 0; text-align:right;">₹${service.price}</td>
            </tr>

            <tr style="background:#ff6b35; color:white; font-weight:bold;">
                <td style="padding:14px 0;">TOTAL AMOUNT</td>
                <td style="padding:14px 0; text-align:right;">₹${booking.price}</td>
            </tr>
        </table>
    </div>

    <!-- FOOTER -->
    <div style="text-align:center; margin-top:35px; font-size:13px; color:#666;">
        <p>Thank you for choosing <strong>Vectors Motors</strong>!</p>
        <p>Service Center: DYPCET, Vectors Motors & Co, Kolhapur - 416002</p>
        <p>Contact: 1800-VECTORS-1</p>
    </div>

</div>
`;


    const temp = document.createElement("div");
    temp.innerHTML = html;

    html2pdf().from(temp).save("Vectors-Booking.pdf");
}

function generatePDFBrochure() {
    const pdfContent = document.getElementById('pdfContent');
    const pdfModal = document.getElementById('pdfModal');

    if (!pdfContent || !pdfModal) return;

    // Clear any previous content
    pdfContent.innerHTML = '';

    // Create brochure HTML
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1a3a5f;">
                <h1 style="color: #1a3a5f; margin-bottom: 5px; font-size: 28px; font-family: 'Allerta Stencil', sans-serif;">🏍️ VECTORS MOTORS</h1>
                <h2 style="color: #666; margin-top: 0; font-size: 20px;">ATV Service Price List & Brochure</h2>
                <p style="color: #888; font-size: 14px;">Effective Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            
            <!-- Service Packages -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1a3a5f; border-left: 4px solid #e63946; padding-left: 10px; font-size: 20px; margin-bottom: 20px; font-family: 'Allerta Stencil', sans-serif;">
                    📋 SERVICE PACKAGES
                </h3>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #1a3a5f; color: white;">
                                <th style="padding: 12px; text-align: left; font-weight: bold;">Service Type</th>
                                <th style="padding: 12px; text-align: right; font-weight: bold;">Price</th>
                                <th style="padding: 12px; text-align: center; font-weight: bold;">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(CONFIG.services).map(service => `
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 12px; font-weight: 600;">${service.name}</td>
                                    <td style="padding: 12px; text-align: right; color: #e63946; font-weight: bold;">₹${service.price.toLocaleString('en-IN')}</td>
                                    <td style="padding: 12px; text-align: center; color: #666;">${service.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Parts Pricing -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1a3a5f; border-left: 4px solid #2a9d8f; padding-left: 10px; font-size: 20px; margin-bottom: 20px; font-family: 'Allerta Stencil', sans-serif;">
                    ⚙️ GENUINE PARTS PRICING
                </h3>
                
                ${Object.keys(CONFIG.parts).map(category => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        return `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #444; font-size: 16px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
                                ${categoryName} Parts
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                                ${CONFIG.parts[category].map(part => `
                                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px;">
                                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${part.name}</div>
                                        <div style="color: #e63946; font-weight: bold; font-size: 16px;">₹${part.price.toLocaleString('en-IN')}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
            
            <!-- Maintenance Schedule -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1a3a5f; border-left: 4px solid #ffb703; padding-left: 10px; font-size: 20px; margin-bottom: 20px; font-family: 'Allerta Stencil', sans-serif;">
                    🔧 MAINTENANCE SCHEDULE
                </h3>
                <div style="background: #fff9e6; border-radius: 8px; padding: 20px;">
                    <ul style="margin: 0; padding-left: 20px; color: #555;">
                        <li style="margin-bottom: 8px;"><strong>Oil Change:</strong> Every 50 hours or 6 months</li>
                        <li style="margin-bottom: 8px;"><strong>Air Filter:</strong> Every 100 hours or annually</li>
                        <li style="margin-bottom: 8px;"><strong>Spark Plugs:</strong> Every 200 hours or 2 years</li>
                        <li style="margin-bottom: 8px;"><strong>Brake Fluid:</strong> Annually</li>
                        <li style="margin-bottom: 8px;"><strong>Coolant:</strong> Every 2 years</li>
                        <li style="margin-bottom: 8px;"><strong>Tire Pressure:</strong> Check before every ride</li>
                        <li><strong>Chain Lubrication:</strong> Every 10 hours of operation</li>
                    </ul>
                </div>
            </div>
            
            <!-- Contact Info -->
            <div style="background: linear-gradient(135deg, #1a3a5f 0%, #2a9d8f 100%); color: white; border-radius: 8px; padding: 25px; text-align: center;">
                <h3 style="margin-top: 0; font-size: 22px; margin-bottom: 15px; font-family: 'Allerta Stencil', sans-serif;">WHY CHOOSE VECTORS MOTORS?</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 24px; margin-bottom: 5px;">✓</div>
                        <div>15+ Years Experience</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; margin-bottom: 5px;">✓</div>
                        <div>Genuine Parts</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; margin-bottom: 5px;">✓</div>
                        <div>6-Month Warranty</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; margin-bottom: 5px;">✓</div>
                        <div>24/7 Support</div>
                    </div>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">📞 CONTACT US</div>
                    <div style="margin-bottom: 5px;"><strong>Phone:</strong> 1800-VECTORS-1</div>
                    <div style="margin-bottom: 5px;"><strong>Email:</strong> service@vectorsmotors.com</div>
                    <div><strong>Address:</strong> 123 Auto Nagar, Delhi - 110020</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
                <p>This is a computer-generated document. Prices are subject to change without notice.</p>
                <p>Document generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
        </div>
    `;
    // Create a temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempDiv.style.padding = '40px';
    tempDiv.innerHTML = html;

    // Generate and download PDF
    html2pdf()
        .from(tempDiv)
        .set({
            margin: [15, 15, 15, 15],
            filename: `Vectors-Motors-Brochure-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .save()
        .then(() => {
            // Show success message
            if (typeof showBookingMessage === 'function') {
                showBookingMessage("✅ Brochure downloaded successfully!", "bot");
            } else if (typeof showAIMessage === 'function') {
                showAIMessage("✅ Brochure downloaded successfully!", "bot");
            }
        })
        .catch(error => {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        });

    // Show in modal as well
    pdfContent.innerHTML = html;
    showPDFModal();
}

function showPDFModal() {
    elements.pdfModal.classList.add('active');
}

function setupModal() {
    const closeModal = document.getElementById('closeModal');
    const pdfModal = document.getElementById('pdfModal');
    const downloadPDF = document.getElementById('downloadPDF');

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            pdfModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (pdfModal) {
        pdfModal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }

    // Download PDF - This is for the modal download button
    if (downloadPDF) {
        downloadPDF.addEventListener('click', function () {
            const element = document.createElement('div');
            element.innerHTML = elements.pdfContent.innerHTML;
            element.style.width = '794px';
            element.style.padding = '40px';

            html2pdf()
                .from(element)
                .set({
                    margin: [10, 10, 10, 10],
                    filename: 'vectors-booking-confirmation.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                })
                .save();
        });
    }

}

function saveBookingForPDF() {
    const booking = {
        name: document.getElementById('statusName').textContent,
        service: document.getElementById('statusService').textContent,
        date: document.getElementById('statusDate').textContent
    };

    localStorage.setItem(
        "vectors-booking",
        JSON.stringify(booking)
    );
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);

// Expose functions for inline onclick handlers
window.addPartToBooking = addPartToBooking;
window.finishPartsSelection = finishPartsSelection;
window.skipParts = skipParts;
window.generatePDFReport = generatePDFReport;