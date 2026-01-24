// app.js - Vectors ATV Website with Booking Chatbot Integration

// ==================== 3D MODEL VIEWER FUNCTIONALITY ====================

document.getElementById("open3D-footer")?.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("open3D").click();
});


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

function init3DViewer() {
    const open3DButton = document.getElementById('open3D');
    const modelSlide = document.getElementById('modelSlide');
    const closeModelButton = document.getElementById('closeModel');

    if (open3DButton && modelSlide) {
        open3DButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            modelSlide.classList.add('active');
            document.body.classList.add('no-scroll');

            const productsSection = document.getElementById('products-section');
            if (productsSection) {
                productsSection.classList.remove('show');
            }

            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
        });
    }

    if (closeModelButton && modelSlide) {
        closeModelButton.addEventListener('click', function () {
            modelSlide.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    if (modelSlide) {
        modelSlide.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modelSlide && modelSlide.classList.contains('active')) {
            modelSlide.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Fullscreen change handler
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
}

document.addEventListener('DOMContentLoaded', function () {
    // ==================== INITIALIZE 3D VIEWER ====================
    init3DViewer();

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
            navLinks.classList.toggle('show');
        });
    }

    // Toggle Products Section
    if (productsToggle) {
        productsToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            productsSection.classList.toggle('show');
            body.classList.toggle('no-scroll');

            if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }

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

                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }

                if (productsSection.classList.contains('show')) {
                    productsSection.classList.remove('show');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
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

    console.log('Vectors ATV Website loaded successfully.');
});

// View Products button functionality
const viewProductsBtn = document.getElementById('viewProductsBtn');
if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const productsSection = document.getElementById('products-section');
        const body = document.body;

        if (productsSection) {
            productsSection.classList.add('show');
            body.classList.add('no-scroll');
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==================== PDF GENERATION ====================
function generatePDFReport() {
    const booking = JSON.parse(localStorage.getItem("vectors-booking"));

    if (!booking) {
        alert("Booking details not found.");
        return;
    }

    const html = `
<div style="
    font-family: 'Open Sans', Arial, sans-serif;
    padding: 30px;
    max-width: 700px;
    margin: auto;
    color: #333;
">
    <div style="text-align:center; margin-bottom:25px;">
        <h2 style="margin:0; letter-spacing:1px;">🚗 VECTORS MOTORS</h2>
        <p style="margin-top:5px; color:#777;">Service Booking Confirmation</p>
    </div>

    <hr style="border:none; border-top:1px solid #ddd; margin-bottom:25px;">

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
            <td style="padding:8px 0; text-align:right;">${booking.service}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;"><strong>Date:</strong></td>
            <td style="padding:8px 0; text-align:right;">${booking.date}</td>
        </tr>
    </table>

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
                <td style="padding:10px 0; text-align:right;">₹${booking.price}</td>
            </tr>
            <tr style="background:#ff6b35; color:white; font-weight:bold;">
                <td style="padding:14px 0;">TOTAL AMOUNT</td>
                <td style="padding:14px 0; text-align:right;">₹${booking.price}</td>
            </tr>
        </table>
    </div>

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
    const services = {
        regular: { name: "Regular Service", price: 1500, time: "2-3 hours" },
        maintenance: { name: "Routine Maintenance", price: 3500, time: "3-4 hours" },
        suspension: { name: "Suspension Repair", price: 4500, time: "4-5 hours" },
        brakes: { name: "Brake Overhaul", price: 3000, time: "3-4 hours" },
        full: { name: "Full Service", price: 6000, time: "5-6 hours" }
    };

    const parts = {
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
    };

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1a3a5f;">
                <h1 style="color: #1a3a5f; margin-bottom: 5px; font-size: 28px;">🏍️ VECTORS MOTORS</h1>
                <h2 style="color: #666; margin-top: 0; font-size: 20px;">ATV Service Price List & Brochure</h2>
                <p style="color: #888; font-size: 14px;">Effective Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1a3a5f; border-left: 4px solid #e63946; padding-left: 10px; font-size: 20px; margin-bottom: 20px;">
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
                            ${Object.values(services).map(service => `
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
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1a3a5f; border-left: 4px solid #2a9d8f; padding-left: 10px; font-size: 20px; margin-bottom: 20px;">
                    ⚙️ GENUINE PARTS PRICING
                </h3>
                
                ${Object.keys(parts).map(category => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        return `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #444; font-size: 16px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
                                ${categoryName} Parts
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                                ${parts[category].map(part => `
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
            
            <div style="background: linear-gradient(135deg, #1a3a5f 0%, #2a9d8f 100%); color: white; border-radius: 8px; padding: 25px; text-align: center;">
                <h3 style="margin-top: 0; font-size: 22px; margin-bottom: 15px;">WHY CHOOSE VECTORS MOTORS?</h3>
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
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
                <p>This is a computer-generated document. Prices are subject to change without notice.</p>
                <p>Document generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '794px';
    tempDiv.style.padding = '40px';
    tempDiv.innerHTML = html;

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
        .save();
}

// ==================== BOOKING HELPER FUNCTIONS ====================
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

    setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 100);
}

function saveBookingForPDF() {
    const booking = {
        name: document.getElementById('statusName').textContent,
        service: document.getElementById('statusService').textContent,
        date: document.getElementById('statusDate').textContent,
        price: window.bookingPrice || 0
    };

    localStorage.setItem("vectors-booking", JSON.stringify(booking));
}

function confirmBooking() {
    saveBookingForPDF();
    showBookingMessage("✅ Booking Confirmed!", "bot");

    const bookingId = 'VM' + Date.now().toString().slice(-6);
    showBookingMessage(`Thank you! Your booking ID: ${bookingId}\nWe'll contact you within 24 hours to confirm.`, "bot");

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
    generatePDFReport();
}

function openTestDrive() {
    const inputArea = document.getElementById("bookingInput");

    showBookingMessage("I want to book a test drive", "user");
    showBookingMessage("Great! Let me help you book an ATV test drive.", "bot");

    inputArea.innerHTML = `
        <div class="query-form">
            <input type="text" id="tdName" placeholder="Full Name" class="form-input" required>
            <input type="tel" id="tdPhone" placeholder="Mobile Number" class="form-input" required>
            <input type="email" id="tdEmail" placeholder="Email Address" class="form-input" required>
            <input type="text" id="tdCity" placeholder="City" class="form-input" required>

            <select id="tdModel" class="form-input" required>
                <option value="">Select ATV Model</option>
                <option>ATV 200cc</option>
                <option>ATV 300cc</option>
                <option>ATV 450cc</option>
            </select>

            <input type="date" id="tdDate" class="form-input" required>

            <div class="button-grid">
                <button class="submit-btn" onclick="submitTestDrive()">
                    <i class="fas fa-check"></i> Submit Request
                </button>

                <button class="skip-btn" onclick="startBookingSystem()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    `;

    // Set minimum date to today
    const dateInput = document.getElementById('tdDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function submitTestDrive() {
    const name = document.getElementById("tdName").value.trim();
    const phone = document.getElementById("tdPhone").value.trim();
    const email = document.getElementById("tdEmail").value.trim();
    const city = document.getElementById("tdCity").value.trim();
    const model = document.getElementById("tdModel").value;
    const date = document.getElementById("tdDate").value;

    if (!name || !phone || !email || !city || !model || !date) {
        alert("Please fill all fields");
        return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }

    // Capture data
    const testDriveData = {
        name,
        phone,
        email,
        city,
        model,
        date,
        time: new Date().toLocaleString()
    };

    console.log("Test Drive Request:", testDriveData);

    const inputArea = document.getElementById("bookingInput");

    // Remove form
    inputArea.innerHTML = "";

    // Bot confirmation
    showBookingMessage("✅ Test drive request submitted successfully!", "bot");
    showBookingMessage("📞 We will contact you within 24 hours to confirm your test drive.", "bot");
    showBookingMessage(`Test Drive Details:\n📅 Date: ${new Date(date).toLocaleDateString('en-IN')}\n🏍️ Model: ${model}\n📍 City: ${city}`, "bot");

    // Restore chatbot options
    setTimeout(() => {
        inputArea.innerHTML = `
            <div class="button-grid">
                <button class="chat-btn" onclick="startBookingFlow()">
                    <i class="fas fa-calendar-check"></i> Book Service
                </button>

                <button class="chat-btn" onclick="openTestDrive()">
                    <i class="fas fa-car"></i> Test Drive
                </button>

                <button class="chat-btn" onclick="openQueryForm()">
                    <i class="fas fa-circle-question"></i> Send Query
                </button>

                <button class="chat-btn" onclick="showServiceInfo()">
                    <i class="fas fa-info-circle"></i> Service Info
                </button>
            </div>
        `;
    }, 1500);
}

function startBookingSystem() {
    const messages = document.getElementById('bookingMessages');
    if (messages) {
        messages.innerHTML = '';
    }

    showBookingMessage("👋 Welcome to Vectors Motors ATV Service!", "bot");
    showBookingMessage("I'll help you book a service appointment. Let's get started!", "bot");

    const statusName = document.getElementById('statusName');
    const statusService = document.getElementById('statusService');
    const statusDate = document.getElementById('statusDate');

    if (statusName) statusName.textContent = "Not Started";
    if (statusService) statusService.textContent = "No Service";
    if (statusDate) statusDate.textContent = "No Date";

    setTimeout(() => {
        const inputArea = document.getElementById('bookingInput');
        if (inputArea) {
            inputArea.innerHTML = `
                <div class="button-grid">
                    <button class="chat-btn" onclick="startBookingFlow()">
                        <i class="fas fa-calendar-check"></i> Book Service
                    </button>
                    <button class="chat-btn" onclick="openTestDrive()">
                        <i class="fas fa-car"></i> Test Drive
                    </button>
                    <button class="chat-btn" onclick="openQueryForm()">
                        <i class="fas fa-circle-question"></i> Send Query
                    </button>
                    <button class="chat-btn" onclick="showServiceInfo()">
                        <i class="fas fa-info-circle"></i> Service Info
                    </button>
                </div>
            `;
        }
    }, 800);
}

function openQueryForm() {
    const inputArea = document.getElementById("bookingInput");

    inputArea.innerHTML = `
        <div class="query-form">
            <input type="text" id="qName" placeholder="Full Name" class="form-input">
            <input type="email" id="qEmail" placeholder="Email Address" class="form-input">
            <input type="tel" id="qPhone" placeholder="Phone Number" class="form-input">
            
            <select id="qTopic" class="form-input">
                <option value="">Select Topic</option>
                <option>Product Information</option>
                <option>Service Support</option>
                <option>Sectors</option>
                <option>Bulk Order</option>
                <option>Dealership</option>
            </select>

            <textarea id="qMessage" placeholder="Type your query..." class="form-input"></textarea>

            <div class="button-grid">
                <button class="submit-btn" onclick="submitQuery()">
                    <i class="fas fa-paper-plane"></i> Send Query
                </button>

                <button class="skip-btn" onclick="startBookingSystem()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    `;
}

function submitQuery() {
    const name = document.getElementById("qName").value.trim();
    const email = document.getElementById("qEmail").value.trim();
    const phone = document.getElementById("qPhone").value.trim();
    const topic = document.getElementById("qTopic").value;
    const message = document.getElementById("qMessage").value.trim();

    if (!name || !email || !phone || !topic || !message) {
        alert("Please fill all fields");
        return;
    }

    // Capture data (for backend later)
    const queryData = {
        name,
        email,
        phone,
        topic,
        message,
        time: new Date().toLocaleString()
    };

    console.log("Query submitted:", queryData);

    const inputArea = document.getElementById("bookingInput");

    // Remove query form
    inputArea.innerHTML = "";

    // Bot confirmation
    showBookingMessage("✅ Your query has been sent successfully.", "bot");
    showBookingMessage("📞 Our support team will contact you shortly.", "bot");

    // Restore chatbot options
    setTimeout(() => {
        inputArea.innerHTML = `
            <div class="button-grid">
                <button class="chat-btn" onclick="startBookingFlow()">
                    <i class="fas fa-calendar-check"></i> Book Service
                </button>

                <button class="chat-btn" onclick="openTestDrive()">
                    <i class="fas fa-car"></i> Test Drive
                </button>

                <button class="chat-btn" onclick="openQueryForm()">
                    <i class="fas fa-circle-question"></i> Send Query
                </button>

                <button class="chat-btn" onclick="showServiceInfo()">
                    <i class="fas fa-info-circle"></i> Service Info
                </button>
            </div>
        `;
    }, 1200);
}

// Expose functions to global scope for inline onclick handlers
window.generatePDFReport = generatePDFReport;
window.generatePDFBrochure = generatePDFBrochure;
window.confirmBooking = confirmBooking;
window.downloadBookingConfirmation = downloadBookingConfirmation;
window.startBookingSystem = startBookingSystem;
window.showBookingMessage = showBookingMessage;
window.openQueryForm = openQueryForm;
window.submitQuery = submitQuery;
window.toggleFullscreen = toggleFullscreen;
window.openTestDrive = openTestDrive;
window.submitTestDrive = submitTestDrive;