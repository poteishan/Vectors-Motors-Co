// app.js - Vectors ATV Website with Booking Chatbot Integration
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

function initBookingChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbot = document.getElementById('closeChatbot');
    const badge = document.getElementById('chatbotBadge');

    // Toggle chatbot
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function () {
            // Toggle the active class instead of just adding it
            const isActive = chatbotContainer.classList.contains('active');
            chatbotContainer.classList.toggle('active');

            // Hide badge when opened
            if (!isActive && badge) {
                badge.style.display = 'none';
            }
        });
    }

    // Close chatbot
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function () {
            chatbotContainer.classList.remove('active');
        });
    }

    // Setup quick action buttons
    setupQuickActions();

    // Setup modal
    setupModal();

    // Setup escape key to close chatbot
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const chatbotContainer = document.getElementById('chatbotContainer');
            const pdfModal = document.getElementById('pdfModal');

            if (chatbotContainer && chatbotContainer.classList.contains('active')) {
                chatbotContainer.classList.remove('active');
            }

            if (pdfModal && pdfModal.classList.contains('active')) {
                pdfModal.classList.remove('active');
            }
        }
    });

    // Start booking system
    startBookingSystem();
}

function setupQuickActions() {
    const quickBook = document.getElementById('quickBook');
    const quickQuote = document.getElementById('quickQuote');
    const quickHelp = document.getElementById('quickHelp');
    const quickBrochure = document.getElementById('quickBrochure');

    if (quickBook) {
        quickBook.addEventListener('click', function () {
            startBookingSystem();
        });
    }

    if (quickQuote) {
        quickQuote.addEventListener('click', function () {
            showBookingMessage("📋 **INSTANT QUOTE**\n\nService: Regular Maintenance\nTotal: ₹1,500\nIncludes:\n• Oil & filter change\n• Complete inspection\n• Tire pressure check\n• Brake inspection\n• Battery test\n\nWant to book this service?", "bot");

            const inputArea = document.getElementById('bookingInput');
            if (inputArea) {
                inputArea.innerHTML = `
                    <div class="button-grid">
                        <button class="chat-btn" onclick="startBookingFlow()">
                            <i class="fas fa-calendar-check"></i> Book Now
                        </button>
                        <button class="chat-btn" onclick="showServiceInfo()">
                            <i class="fas fa-info-circle"></i> More Services
                        </button>
                    </div>
                `;
            }
        });
    }

    if (quickHelp) {
        quickHelp.addEventListener('click', function () {
            showBookingMessage("🚨 **EMERGENCY ASSISTANCE**\n\n• Call: 1800-VECTORS-1 (24/7)\n• WhatsApp: +91 98765 43210\n• Free pickup within 50km\n• 2-hour response time\n\nWe'll dispatch a technician immediately!", "bot");
        });
    }

    if (quickBrochure) {
        quickBrochure.addEventListener('click', function () {
            generatePDFBrochure();
        });
    }
}

function setupModal() {
    const closeModal = document.getElementById('closeModal');
    const pdfModal = document.getElementById('pdfModal');
    const downloadPDF = document.getElementById('downloadPDF');
    const emailPDF = document.getElementById('emailPDF');

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

    // Download PDF
    if (downloadPDF) {
        downloadPDF.addEventListener('click', function () {
            // Generate the PDF using html2pdf
            const element = document.getElementById('pdfContent');
            if (element) {
                html2pdf().from(element).save('vectors-service-booking.pdf');
            }
        });
    }

    // Email PDF
    if (emailPDF) {
        emailPDF.addEventListener('click', function () {
            alert('PDF would be emailed to your registered email address.');
        });
    }
}

// ==================== BOOKING SYSTEM FUNCTIONS ====================

function startBookingSystem() {
    // Clear messages
    clearBookingMessages();

    // Show welcome messages
    showBookingMessage("👋 Welcome to Vectors Motors ATV Service!", "bot");
    showBookingMessage("I'll help you book a service appointment. Let's get started!", "bot");

    // Reset status
    // updateStatus("name", "Not Started");
    // updateStatus("service", "No Service");
    // updateStatus("date", "No Date");

    // Show initial options after delay
    setTimeout(() => {
        showInitialOptions();
    }, 800);
}

function showInitialOptions() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="button-grid">
            <button class="chat-btn" onclick="startBookingFlow()">
                <i class="fas fa-calendar-check"></i> Start Booking
            </button>
            <button class="chat-btn" onclick="showQuickServices()">
                <i class="fas fa-bolt"></i> Quick Service
            </button>
            <button class="chat-btn" onclick="showServiceInfo()">
                <i class="fas fa-info-circle"></i> Service Info
            </button>
            <button class="chat-btn" onclick="showMaintenanceTips()">
                <i class="fas fa-tools"></i> Maintenance Tips
            </button>
        </div>
    `;
}

function startBookingFlow() {
    showBookingMessage("Let's book your service!", "user");

    // Show typing indicator
    showTypingIndicator(true);

    setTimeout(() => {
        showTypingIndicator(false);
        showBookingMessage("Great! Let's start with your details.", "bot");

        // Show name input
        showNameInput();
    }, 1000);
}

// ==================== INPUT FUNCTIONS ====================

function showNameInput() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="text" id="userName" placeholder="Enter your full name" class="form-input">
            </div>
            <div class="button-group">
                <button class="submit-btn" onclick="submitUserName()">
                    <i class="fas fa-check"></i> Submit
                </button>
                <button class="skip-btn" onclick="showInitialOptions()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            <div class="quick-options">
                <p class="quick-label"><i class="fas fa-bolt"></i> Quick fill:</p>
                <div class="quick-buttons">
                    <button class="quick-option" onclick="fillName('Rahul Sharma')">Rahul Sharma</button>
                    <button class="quick-option" onclick="fillName('Priya Patel')">Priya Patel</button>
                    <button class="quick-option" onclick="fillName('Amit Kumar')">Amit Kumar</button>
                </div>
            </div>
        </div>
    `;
}

function fillName(name) {
    const nameInput = document.getElementById('userName');
    if (nameInput) {
        nameInput.value = name;
    }
}

function submitUserName() {
    const nameInput = document.getElementById('userName');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name || name.length < 2) {
        showError("Please enter a valid name (min 2 characters)");
        return;
    }

    showBookingMessage(name, "user");
    updateStatus("name", name);

    // Continue to phone input
    setTimeout(() => {
        showBookingMessage("What's your contact number?", "bot");
        showPhoneInput();
    }, 500);
}

function showPhoneInput() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="tel" id="userPhone" placeholder="Enter 10-digit phone number" class="form-input">
            </div>
            <div class="button-group">
                <button class="submit-btn" onclick="submitUserPhone()">
                    <i class="fas fa-check"></i> Submit
                </button>
                <button class="skip-btn" onclick="showNameInput()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            <div class="quick-options">
                <p class="quick-label"><i class="fas fa-bolt"></i> Quick fill:</p>
                <div class="quick-buttons">
                    <button class="quick-option" onclick="fillPhone('9876543210')">9876543210</button>
                    <button class="quick-option" onclick="fillPhone('8765432109')">8765432109</button>
                </div>
            </div>
        </div>
    `;
}

function fillPhone(phone) {
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.value = phone;
    }
}

function submitUserPhone() {
    const phoneInput = document.getElementById('userPhone');
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!phone || !/^\d{10}$/.test(phone)) {
        showError("Please enter a valid 10-digit phone number");
        return;
    }

    showBookingMessage(phone, "user");

    // Continue to service selection
    setTimeout(() => {
        showBookingMessage("Select service type:", "bot");
        showServiceSelection();
    }, 500);
}

function showServiceSelection() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="button-grid">
            <button class="chat-btn" onclick="selectBookingService('Regular Service', 1500, '2-3 hours')">
                <i class="fas fa-oil-can"></i> Regular Service
                <small>₹1,500 • 2-3 hours</small>
            </button>
            <button class="chat-btn" onclick="selectBookingService('Full Service', 6000, '5-6 hours')">
                <i class="fas fa-tools"></i> Full Service
                <small>₹6,000 • 5-6 hours</small>
            </button>
            <button class="chat-btn" onclick="selectBookingService('Brake Overhaul', 3000, '3-4 hours')">
                <i class="fas fa-car-crash"></i> Brake Service
                <small>₹3,000 • 3-4 hours</small>
            </button>
            <button class="chat-btn" onclick="selectBookingService('Suspension Repair', 4500, '4-5 hours')">
                <i class="fas fa-car"></i> Suspension
                <small>₹4,500 • 4-5 hours</small>
            </button>
        </div>
    `;
}

function selectBookingService(service, price, duration) {
    // Store service details
    window.currentBooking = window.currentBooking || {};
    window.currentBooking.service = service;
    window.currentBooking.price = price;
    window.currentBooking.duration = duration;

    showBookingMessage(`${service} - ₹${price}`, "user");
    updateStatus("service", service);

    // Continue to date selection
    setTimeout(() => {
        showBookingMessage("Select preferred date:", "bot");
        showDateSelection();
    }, 500);
}

function showDateSelection() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    // Generate next 5 days
    const today = new Date();
    const dates = [];
    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        dates.push({ day, date: dateStr, iso: date.toISOString().split('T')[0] });
    }

    inputArea.innerHTML = `
        <div class="button-grid">
            ${dates.map(d => `
                <button class="chat-btn" onclick="selectBookingDate('${d.day}, ${d.date}', '${d.iso}')">
                    <i class="fas fa-calendar"></i> ${d.day}, ${d.date}
                </button>
            `).join('')}
            <button class="chat-btn" onclick="showCustomDatePicker()">
                <i class="fas fa-calendar-plus"></i> Other Date
            </button>
        </div>
    `;
}

function selectBookingDate(dateStr, isoDate) {
    // Store date
    window.currentBooking = window.currentBooking || {};
    window.currentBooking.date = dateStr;
    window.currentBooking.isoDate = isoDate;

    showBookingMessage(dateStr, "user");
    updateStatus("date", dateStr);

    // Show confirmation
    setTimeout(() => {
        showConfirmation();
    }, 500);
}

function showCustomDatePicker() {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    inputArea.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="date" id="customDatePicker" min="${minDate}" class="form-input">
            </div>
            <div class="button-group">
                <button class="submit-btn" onclick="submitCustomDate()">
                    <i class="fas fa-check"></i> Select Date
                </button>
                <button class="skip-btn" onclick="showDateSelection()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    `;
}

function submitCustomDate() {
    const datePicker = document.getElementById('customDatePicker');
    const isoDate = datePicker ? datePicker.value : '';

    if (!isoDate) {
        showError("Please select a date");
        return;
    }

    const date = new Date(isoDate);
    const dateStr = date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    selectBookingDate(dateStr, isoDate);
}

// ==================== CONFIRMATION & COMPLETION ====================

function showConfirmation() {
    const booking = window.currentBooking || {};
    const name = document.getElementById('statusName').textContent;

    showBookingMessage("Great! Here's your booking summary:", "bot");

    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="confirmation-card">
            <h3><i class="fas fa-check-circle"></i> Booking Summary</h3>
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="label">Name:</span>
                    <span class="value">${name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Service:</span>
                    <span class="value">${booking.service || 'Not Selected'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">${booking.date || 'Not Selected'}</span>
                </div>
                <div class="detail-row total">
                    <span class="label">Total Amount:</span>
                    <span class="value">₹${booking.price ? booking.price.toLocaleString('en-IN') : '0'}</span>
                </div>
            </div>
        </div>
        <div class="button-grid">
            <button class="submit-btn" onclick="confirmBooking()">
                <i class="fas fa-check"></i> Confirm Booking
            </button>
            <button class="skip-btn" onclick="showServiceSelection()">
                <i class="fas fa-edit"></i> Edit Details
            </button>
        </div>
    `;
}

function confirmBooking() {
    showBookingMessage("✅ Booking Confirmed!", "bot");

    // Store booking data in window.currentBooking for PDF generation
    window.currentBooking = {
        name: document.getElementById('statusName').textContent,
        service: document.getElementById('statusService').textContent,
        date: document.getElementById('statusDate').textContent,
        price: (() => {
            const serviceText = document.getElementById('statusService').textContent;
            if (serviceText.includes('Regular')) return 1500;
            if (serviceText.includes('Full')) return 6000;
            if (serviceText.includes('Brake')) return 3000;
            if (serviceText.includes('Suspension')) return 4500;
            return 0;
        })()
    };

    const bookingId = 'VM' + Date.now().toString().slice(-6);
    showBookingMessage(`Thank you! Your booking ID: ${bookingId}\nWe'll contact you within 24 hours to confirm.`, "bot");

    // Show download option
    const inputArea = document.getElementById('bookingInput');
    if (inputArea) {
        inputArea.innerHTML = `
            <div class="button-grid">
                <button class="submit-btn" onclick="downloadBookingConfirmation()">
                    <i class="fas fa-download"></i> Download Summary
                </button>
                <button class="skip-btn" onclick="startBookingSystem()">
                    <i class="fas fa-plus"></i> New Booking
                </button>
            </div>
        `;
    }
}

function downloadBookingConfirmation() {
    const pdfContent = document.getElementById('pdfContent');
    const pdfModal = document.getElementById('pdfModal');

    // Use stored booking data
    const booking = window.currentBooking || {};
    const name = booking.name || document.getElementById('statusName').textContent;
    const service = booking.service || document.getElementById('statusService').textContent;
    const date = booking.date || document.getElementById('statusDate').textContent;
    const price = booking.price || 0;

    pdfContent.innerHTML = `
        <div style="padding:20px;font-family:'Open Sans',sans-serif;">
            <h2 style="color:var(--primary-color);text-align:center;margin-bottom:20px;">🏍️ VECTORS MOTORS</h2>
            <h3 style="color:#666;text-align:center;margin-bottom:30px;">Service Booking Confirmation</h3>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:var(--primary-color);margin-bottom:15px;">Booking Details</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Booking ID:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">VM${Date.now().toString().slice(-8)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Customer:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Service:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${service}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Date:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${date}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background:#fff5f0;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:#ff6b35;margin-bottom:15px;">Cost Breakdown</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;">Service Charge</td>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:right;">₹${price.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="background:#ff6b35;color:white;font-weight:bold;">
                        <td style="padding:15px 0;">TOTAL AMOUNT</td>
                        <td style="padding:15px 0;text-align:right;">₹${price.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align:center;color:#666;font-size:14px;margin-top:30px;">
                <p>Thank you for choosing Vectors Motors!</p>
                <p><strong>Service Center:</strong> 123 Auto Nagar, Delhi</p>
                <p><strong>Contact:</strong> 1800-VECTORS-1</p>
            </div>
        </div>
    `;

    pdfModal.classList.add('active');
}

// ==================== QUICK SERVICES ====================

function showQuickServices() {
    showBookingMessage("Quick service options:", "bot");

    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="button-grid">
            <button class="chat-btn" onclick="bookQuickService('Oil Change', 1500, '1 hour')">
                <i class="fas fa-oil-can"></i> Oil Change
                <small>₹1,500 • 1 hour</small>
            </button>
            <button class="chat-btn" onclick="bookQuickService('Brake Check', 500, '30 min')">
                <i class="fas fa-car-crash"></i> Brake Check
                <small>₹500 • 30 min</small>
            </button>
            <button class="chat-btn" onclick="bookQuickService('Tire Service', 1000, '45 min')">
                <i class="fas fa-tire"></i> Tire Service
                <small>₹1,000 • 45 min</small>
            </button>
            <button class="chat-btn" onclick="bookQuickService('Full Checkup', 2000, '2 hours')">
                <i class="fas fa-car"></i> Full Checkup
                <small>₹2,000 • 2 hours</small>
            </button>
        </div>
    `;
}

function bookQuickService(service, price, duration) {
    showBookingMessage(`${service} - ₹${price}`, "user");

    setTimeout(() => {
        const bookingId = 'VM' + Date.now().toString().slice(-6);
        showBookingMessage(`✅ Quick service booked!\nBooking ID: ${bookingId}\nOur technician will contact you within 30 minutes.`, "bot");

        const inputArea = document.getElementById('bookingInput');
        if (inputArea) {
            inputArea.innerHTML = `
                <div class="button-grid">
                    <button class="submit-btn" onclick="generateQuickReceipt('${service}', ${price})">
                        <i class="fas fa-download"></i> Get Receipt
                    </button>
                    <button class="skip-btn" onclick="startBookingSystem()">
                        <i class="fas fa-plus"></i> New Service
                    </button>
                </div>
            `;
        }
    }, 1000);
}
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

// ==================== INFORMATION FUNCTIONS ====================

function showServiceInfo() {
    showBookingMessage("Our service packages:", "bot");

    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="confirmation-card">
            <h3><i class="fas fa-info-circle"></i> Service Information</h3>
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="label">Regular Service:</span>
                    <span class="value">₹1,500 • 2-3 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Full Service:</span>
                    <span class="value">₹6,000 • 5-6 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Brake Overhaul:</span>
                    <span class="value">₹3,000 • 3-4 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Suspension Repair:</span>
                    <span class="value">₹4,500 • 4-5 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Emergency Service:</span>
                    <span class="value">₹2,000 + parts</span>
                </div>
            </div>
        </div>
        <div class="button-grid">
            <button class="submit-btn" onclick="startBookingFlow()">
                <i class="fas fa-calendar-check"></i> Book Service
            </button>
            <button class="skip-btn" onclick="showInitialOptions()">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>
    `;
}

function showMaintenanceTips() {
    showBookingMessage("ATV Maintenance Tips:", "bot");

    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="confirmation-card">
            <h3><i class="fas fa-tools"></i> Maintenance Schedule</h3>
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="label">Oil Change:</span>
                    <span class="value">Every 50 hours or 6 months</span>
                </div>
                <div class="detail-row">
                    <span class="label">Air Filter:</span>
                    <span class="value">Every 100 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Spark Plugs:</span>
                    <span class="value">Every 200 hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Brake Fluid:</span>
                    <span class="value">Annually</span>
                </div>
                <div class="detail-row">
                    <span class="label">Coolant:</span>
                    <span class="value">Every 2 years</span>
                </div>
            </div>
        </div>
        <div class="button-grid">
            <button class="submit-btn" onclick="startBookingFlow()">
                <i class="fas fa-calendar-check"></i> Schedule Maintenance
            </button>
            <button class="skip-btn" onclick="showInitialOptions()">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>
    `;
}

// ==================== PDF GENERATION ====================

function generatePDFReport() {
    const booking = window.currentBooking || {};
    const name = document.getElementById('statusName').textContent;
    const pdfContent = document.getElementById('pdfContent');
    const pdfModal = document.getElementById('pdfModal');

    if (!pdfContent || !pdfModal) return;

    const bookingId = 'VM' + Date.now().toString().slice(-8);

    pdfContent.innerHTML = `
        <div style="padding:20px;font-family:'Open Sans',sans-serif;">
            <h2 style="color:#1a3a5f;text-align:center;margin-bottom:20px;">🏍️ VECTORS MOTORS</h2>
            <h3 style="color:#666;text-align:center;margin-bottom:30px;">Service Booking Confirmation</h3>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:#1a3a5f;margin-bottom:15px;">Booking Details</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Booking ID:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${bookingId}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Customer:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Service:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${booking.service || 'Not Selected'}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Date:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${booking.date || 'Not Selected'}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background:#fff5f0;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:#e63946;margin-bottom:15px;">Cost Breakdown</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;">Service Charge</td>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:right;">₹${booking.price ? booking.price.toLocaleString('en-IN') : '0'}</td>
                    </tr>
                    <tr style="background:#e63946;color:white;font-weight:bold;">
                        <td style="padding:15px 0;">TOTAL AMOUNT</td>
                        <td style="padding:15px 0;text-align:right;">₹${booking.price ? booking.price.toLocaleString('en-IN') : '0'}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align:center;color:#666;font-size:14px;margin-top:30px;">
                <p>Thank you for choosing Vectors Motors!</p>
                <p><strong>Service Center:</strong> 123 Auto Nagar, Delhi</p>
                <p><strong>Contact:</strong> 1800-VECTORS-1</p>
            </div>
        </div>
    `;

    pdfModal.classList.add('active');
}

function generateQuickReceipt(service, price) {
    const pdfContent = document.getElementById('pdfContent');
    const pdfModal = document.getElementById('pdfModal');

    if (!pdfContent || !pdfModal) return;

    const receiptId = 'QR' + Date.now().toString().slice(-6);

    pdfContent.innerHTML = `
        <div style="padding:20px;font-family:'Open Sans',sans-serif;">
            <h2 style="color:#1a3a5f;text-align:center;margin-bottom:20px;">🏍️ VECTORS MOTORS</h2>
            <h3 style="color:#666;text-align:center;margin-bottom:30px;">Quick Service Receipt</h3>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:#1a3a5f;margin-bottom:15px;">Service Details</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Receipt ID:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${receiptId}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Service:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${service}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;"><strong>Date:</strong></td>
                        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">${new Date().toLocaleDateString('en-IN')}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background:#fff5f0;padding:20px;border-radius:8px;margin-bottom:20px;">
                <h4 style="color:#e63946;margin-bottom:15px;">Payment Details</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;">Service Charge</td>
                        <td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:right;">₹${price.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="background:#e63946;color:white;font-weight:bold;">
                        <td style="padding:15px 0;">TOTAL AMOUNT</td>
                        <td style="padding:15px 0;text-align:right;">₹${price.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align:center;color:#666;font-size:14px;margin-top:30px;">
                <p>Thank you for choosing Vectors Motors!</p>
                <p>Our technician will contact you within 30 minutes.</p>
            </div>
        </div>
    `;

    pdfModal.classList.add('active');
}

function generatePDFBrochure() {
    const pdfContent = document.getElementById('pdfContent');
    const pdfModal = document.getElementById('pdfModal');

    if (!pdfContent || !pdfModal) return;

    pdfContent.innerHTML = `
        <div style="padding:20px;font-family:'Open Sans',sans-serif;">
            <h2 style="color:#1a3a5f;text-align:center;margin-bottom:20px;">🏍️ VECTORS MOTORS</h2>
            <h3 style="color:#666;text-align:center;margin-bottom:30px;">ATV Service Brochure</h3>
            
            <div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:8px;">
                <h4 style="color:#1a3a5f;margin-bottom:15px;">Service Packages</h4>
                <table style="width:100%;border-collapse:collapse;">
                    <tr style="border-bottom:1px solid #ddd;">
                        <td style="padding:10px;">Regular Service</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;">₹1,500</td>
                        <td style="padding:10px;color:#666;">2-3 hours</td>
                    </tr>
                    <tr style="border-bottom:1px solid #ddd;">
                        <td style="padding:10px;">Full Service</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;">₹6,000</td>
                        <td style="padding:10px;color:#666;">5-6 hours</td>
                    </tr>
                    <tr style="border-bottom:1px solid #ddd;">
                        <td style="padding:10px;">Brake Overhaul</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;">₹3,000</td>
                        <td style="padding:10px;color:#666;">3-4 hours</td>
                    </tr>
                    <tr style="border-bottom:1px solid #ddd;">
                        <td style="padding:10px;">Suspension Repair</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;">₹4,500</td>
                        <td style="padding:10px;color:#666;">4-5 hours</td>
                    </tr>
                    <tr>
                        <td style="padding:10px;">Emergency Service</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;">₹2,000</td>
                        <td style="padding:10px;color:#666;">+ parts cost</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:8px;">
                <h4 style="color:#1a3a5f;margin-bottom:15px;">Maintenance Schedule</h4>
                <ul style="list-style:none;padding:0;">
                    <li style="padding:8px 0;border-bottom:1px solid #ddd;">Oil Change: Every 50 hours or 6 months</li>
                    <li style="padding:8px 0;border-bottom:1px solid #ddd;">Air Filter: Every 100 hours</li>
                    <li style="padding:8px 0;border-bottom:1px solid #ddd;">Spark Plugs: Every 200 hours</li>
                    <li style="padding:8px 0;border-bottom:1px solid #ddd;">Brake Fluid: Annually</li>
                    <li style="padding:8px 0;">Coolant: Every 2 years</li>
                </ul>
            </div>
            
            <div style="background:#1a3a5f;color:white;padding:20px;border-radius:8px;text-align:center;">
                <h4 style="margin-top:0;font-size:18px;">Why Choose Us?</h4>
                <p style="margin:10px 0;">✓ 15+ Years Experience ✓ Genuine Parts ✓ 6-Month Warranty ✓ 24/7 Support</p>
                <p style="font-size:16px;font-weight:bold;margin:15px 0;">1800-VECTORS-1</p>
                <p>service@vectorsmotors.com</p>
                <p>123 Auto Nagar, Delhi - 110020</p>
            </div>
        </div>
    `;

    pdfModal.classList.add('active');
}

// ==================== HELPER FUNCTIONS ====================

function showBookingMessage(text, sender) {
    const messages = document.getElementById('bookingMessages');
    if (!messages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Handle newlines
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
    messages.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 100);
}

function clearBookingMessages() {
    const messages = document.getElementById('bookingMessages');
    if (messages) {
        messages.innerHTML = '';
    }
}

function updateStatus(type, value) {
    switch (type) {
        case "name":
            const statusName = document.getElementById('statusName');
            if (statusName) statusName.textContent = value;
            break;
        case "service":
            const statusService = document.getElementById('statusService');
            if (statusService) statusService.textContent = value;
            break;
        case "date":
            const statusDate = document.getElementById('statusDate');
            if (statusDate) statusDate.textContent = value;
            break;
    }
}

function showTypingIndicator(show) {
    const typingIndicator = document.getElementById('bookingTyping');
    if (typingIndicator) {
        if (show) {
            typingIndicator.classList.add('active');
        } else {
            typingIndicator.classList.remove('active');
        }
    }
}

function showError(message) {
    const inputArea = document.getElementById('bookingInput');
    if (!inputArea) return;

    const existingError = inputArea.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    const inputContainer = inputArea.querySelector('.input-container');
    if (inputContainer) {
        inputContainer.prepend(errorDiv);
    } else {
        inputArea.prepend(errorDiv);
    }

    setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.remove();
    }, 3000);
}

// ==================== EXPOSE FUNCTIONS FOR SCRIPT.JS ====================

// Expose functions so they can be called from inline onclick handlers
window.startBookingSystem = startBookingSystem;
window.startBookingFlow = startBookingFlow;
window.showQuickServices = showQuickServices;
window.showServiceInfo = showServiceInfo;
window.showMaintenanceTips = showMaintenanceTips;
window.generatePDFReport = generatePDFReport;
window.generatePDFBrochure = generatePDFBrochure;