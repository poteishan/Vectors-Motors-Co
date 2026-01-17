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
        email: "",
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

// AI Knowledge Base
const KNOWLEDGE_BASE = {
    maintenance: {
        title: "🔧 Maintenance",
        questions: [
            {
                id: "oil-change",
                text: "How often should I change oil?",
                answer: "Change engine oil every 50 hours or 6 months. Use SAE 10W-40 4-stroke oil for best results.",
                followups: ["What oil brand is best?", "Can I do it myself?", "Oil change service cost"]
            },
            {
                id: "tire-pressure",
                text: "What's the correct tire pressure?",
                answer: "Front tires: 5-7 PSI, Rear tires: 4-6 PSI. Check when cold and adjust for terrain.",
                followups: ["How to check pressure?", "Best tires for sand", "Tire replacement cost"]
            },
            {
                id: "battery-care",
                text: "How to maintain battery?",
                answer: "1. Keep terminals clean 2. Charge monthly if not used 3. Store in cool place 4. Check water level.",
                followups: ["Battery replacement cost", "Jump start procedure", "Winter storage tips"]
            }
        ]
    },
    troubleshooting: {
        title: "🔍 Troubleshooting",
        questions: [
            {
                id: "wont-start",
                text: "ATV won't start - what to check?",
                answer: "Check: 1) Battery 2) Fuel 3) Spark plug 4) Kill switch 5) Clutch lever 6) Fuel valve.",
                followups: ["Battery is fine, still won't start", "Makes clicking sound", "Starts then dies"]
            },
            {
                id: "overheating",
                text: "Engine overheating issues",
                answer: "1. Check coolant 2. Clean radiator 3. Check thermostat 4. Verify fan 5. Check water pump.",
                followups: ["Coolant leak found", "Fan not working", "Temperature gauge issues"]
            }
        ]
    },
    parts: {
        title: "⚙️ Parts & Pricing",
        questions: [
            {
                id: "oil-filter-price",
                text: "Oil filter price & replacement",
                answer: "Genuine oil filter: ₹250. Replace every service (50 hours). Labor: ₹200 if done separately.",
                followups: ["Where to buy genuine parts", "Installation procedure", "Alternative brands"]
            },
            {
                id: "brake-pad-price",
                text: "Brake pad replacement cost",
                answer: "Front pads: ₹800, Rear pads: ₹900. Installation: ₹300. Total: ₹1,100-₹1,200.",
                followups: ["How long do pads last?", "Performance pads option", "DIY installation guide"]
            }
        ]
    },
    service: {
        title: "📅 Service Info",
        questions: [
            {
                id: "regular-service",
                text: "What's included in regular service?",
                answer: "1. Oil change 2. Filter replacement 3. Complete inspection 4. Tire check 5. Brake check 6. Battery test.",
                followups: ["Regular service cost", "How long does it take?", "Can I wait while servicing?"]
            },
            {
                id: "full-service",
                text: "Full service details",
                answer: "Complete diagnostics, all fluid changes, brake inspection, engine tune-up, suspension check.",
                followups: ["Full service cost", "Duration of full service", "What fluids are changed?"]
            }
        ]
    },
    safety: {
        title: "🛡️ Safety & Tips",
        questions: [
            {
                id: "safety-gear",
                text: "Essential safety gear",
                answer: "1. DOT-approved helmet 2. Goggles 3. Gloves 4. Boots 5. Chest protector 6. Knee/elbow pads.",
                followups: ["Best helmet brands", "Gear rental options", "Gear maintenance"]
            },
            {
                id: "riding-tips",
                text: "Safe riding practices",
                answer: "1. Take training course 2. Check machine before riding 3. Ride within limits 4. No passengers on 1-seater.",
                followups: ["Training course details", "Beginner riding areas", "Group riding etiquette"]
            }
        ]
    },
    booking: {
        title: "📋 Book Service",
        questions: [
            {
                id: "book-now",
                text: "Book service appointment",
                answer: "I'll help you book a service. Let's start with your details.",
                action: "startBooking"
            },
            {
                id: "get-quote",
                text: "Get instant service quote",
                answer: "Tell me what service you need, and I'll give you a detailed quote.",
                action: "startQuote"
            }
        ]
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
    emailPDF: document.getElementById('emailPDF'),
    pdfContent: document.getElementById('pdfContent')
};

function loadSavedBooking() {
    try {
        const savedBooking = localStorage.getItem('vectors-last-booking');
        if (savedBooking) {
            const parsed = JSON.parse(savedBooking);
            console.log('Loaded saved booking from localStorage:', parsed);

            // Update current state with saved data
            if (parsed.name) state.booking.name = parsed.name;
            if (parsed.phone) state.booking.phone = parsed.phone;
            if (parsed.email) state.booking.email = parsed.email;
            if (parsed.vehicle) state.booking.vehicle = parsed.vehicle;
            if (parsed.service) state.booking.service = parsed.service;
            if (parsed.date) state.booking.date = parsed.date;
            if (parsed.issue) state.booking.issue = parsed.issue;
            if (parsed.parts) state.booking.parts = parsed.parts;
            if (parsed.step !== undefined) state.booking.step = parsed.step;

            return parsed;
        }
    } catch (e) {
        console.error('Error loading saved booking:', e);
    }
    return null;
}
// Initialize Application
// Initialize Application
function init() {
    // Check if mobile
    checkMobile();

    // Load saved booking if exists
    const savedBooking = loadSavedBooking();
    if (savedBooking) {
        console.log('Restored previous booking:', savedBooking);
    }

    // Start booking system
    startBookingSystem();

    // Setup AI chat event listeners
    setupAIListeners();

    // Setup quick actions
    setupQuickActions();

    // Setup modal
    setupModal();

    // Setup window resize handler
    window.addEventListener('resize', handleResize);

    console.log("🏍️ Vectors Motors AI Assistant Initialized");
}

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

function askBookingQuestion() {
    clearBookingInput();

    switch (state.booking.step) {
        case 0:
            showBookingMessage("What's your full name?", "bot");
            showNameInput();
            break;
        case 1:
            showBookingMessage("What's your contact number?", "bot");
            showPhoneInput();
            break;
        case 2:
            showBookingMessage("Your email address? (Optional)", "bot");
            showEmailInput();
            break;
        case 3:
            showBookingMessage("What's your ATV registration number?", "bot");
            showVehicleButtons();
            break;
        case 4:
            showBookingMessage("Select service type:", "bot");
            showServiceButtons();
            break;
        case 5:
            showBookingMessage("Describe the issue briefly:", "bot");
            showIssueButtons();
            break;
        case 6:
            showBookingMessage("Preferred service date?", "bot");
            showDateButtons();
            break;
        case 7:
            showBookingMessage("Need any spare parts?", "bot");
            showPartsButtons();
            break;
        case 8:
            showBookingMessage("Review your booking:", "bot");
            showConfirmation();
            break;
    }
}

// Input Functions
function showNameInput() {
    elements.bookingInput.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="text" id="nameInput" placeholder="Enter your full name" class="form-input">
                <button id="submitName" class="submit-btn">
                    <i class="fas fa-check"></i> Submit
                </button>
            </div>
            <div class="quick-options">
                <p class="quick-label"><i class="fas fa-bolt"></i> Quick fill:</p>
                <div class="quick-buttons">
                    <button class="quick-option" data-name="Rahul Sharma">Rahul Sharma</button>
                    <button class="quick-option" data-name="Priya Patel">Priya Patel</button>
                    <button class="quick-option" data-name="Amit Kumar">Amit Kumar</button>
                </div>
            </div>
        </div>
    `;

    const nameInput = document.getElementById('nameInput');
    nameInput.focus();

    document.getElementById('submitName').addEventListener('click', submitName);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitName();
    });

    document.querySelectorAll('.quick-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            nameInput.value = e.target.dataset.name;
            submitName();
        });
    });
}

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

function showPhoneInput() {
    elements.bookingInput.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="tel" id="phoneInput" placeholder="Enter 10-digit phone" class="form-input">
                <button id="submitPhone" class="submit-btn">
                    <i class="fas fa-check"></i> Submit
                </button>
            </div>
            <div class="quick-options">
                <p class="quick-label"><i class="fas fa-bolt"></i> Quick fill:</p>
                <div class="quick-buttons">
                    <button class="quick-option" data-phone="9876543210">9876543210</button>
                    <button class="quick-option" data-phone="8765432109">8765432109</button>
                </div>
            </div>
        </div>
    `;

    const phoneInput = document.getElementById('phoneInput');
    phoneInput.focus();

    document.getElementById('submitPhone').addEventListener('click', submitPhone);
    phoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitPhone();
    });

    document.querySelectorAll('.quick-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            phoneInput.value = e.target.dataset.phone;
            submitPhone();
        });
    });
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

function showEmailInput() {
    elements.bookingInput.innerHTML = `
        <div class="input-container">
            <div class="input-group">
                <input type="email" id="emailInput" placeholder="Enter email (optional)" class="form-input">
                <div class="button-group">
                    <button id="submitEmail" class="submit-btn">
                        <i class="fas fa-check"></i> Submit
                    </button>
                    <button id="skipEmail" class="skip-btn">
                        <i class="fas fa-forward"></i> Skip
                    </button>
                </div>
            </div>
            <div class="quick-options">
                <p class="quick-label"><i class="fas fa-bolt"></i> Quick fill:</p>
                <div class="quick-buttons">
                    <button class="quick-option" data-email="customer@gmail.com">customer@gmail.com</button>
                    <button class="quick-option" data-email="rider@outlook.com">rider@outlook.com</button>
                </div>
            </div>
        </div>
    `;

    const emailInput = document.getElementById('emailInput');
    emailInput.focus();

    document.getElementById('submitEmail').addEventListener('click', submitEmail);
    document.getElementById('skipEmail').addEventListener('click', skipEmail);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitEmail();
    });

    document.querySelectorAll('.quick-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            emailInput.value = e.target.dataset.email;
            submitEmail();
        });
    });
}

function submitEmail() {
    const email = document.getElementById('emailInput').value.trim();

    if (email && !isValidEmail(email)) {
        showError("Please enter a valid email address");
        return;
    }

    state.booking.email = email;
    state.booking.step = 3;
    showBookingMessage(email || "Skipped email", "user");
    setTimeout(() => askBookingQuestion(), 500);
}

function skipEmail() {
    state.booking.email = "";
    state.booking.step = 3;
    showBookingMessage("Skipped email", "user");
    setTimeout(() => askBookingQuestion(), 500);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Button Display Functions
function showVehicleButtons() {
    const buttons = [
        { text: "DL01AB1234", value: "DL01AB1234" },
        { text: "HR26BR4567", value: "HR26BR4567" },
        { text: "Other", action: "showCustomVehicle" }
    ];
    renderButtonGrid(buttons, handleVehicleSelection, "booking");
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

function showIssueButtons() {
    const buttons = [
        { text: "Strange noise from engine", value: "Strange noise from engine" },
        { text: "Brakes not working properly", value: "Brakes not working properly" },
        { text: "Suspension feels rough", value: "Suspension feels rough" },
        { text: "Won't start", value: "Won't start" },
        { text: "Overheating", value: "Overheating" },
        { text: "Other issue", action: "showCustomIssue" }
    ];
    renderButtonGrid(buttons, handleIssueSelection, "booking");
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

function showPartsButtons() {
    const buttons = [
        { text: "🛢️ Oil & Filter", value: "oil_filter", details: "₹650" },
        { text: "🛑 Brake Pads", value: "brake_pads", details: "₹800" },
        { text: "🔌 Spark Plug", value: "spark_plug", details: "₹300" },
        { text: "✅ No Parts Needed", value: "none" },
        { text: "➕ Add More Parts", action: "showDetailedParts" }
    ];
    renderButtonGrid(buttons, handlePartsSelection, "booking");
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
                ${booking.email ? `<div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${booking.email}</span>
                </div>` : ''}
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

function handlePartsSelection(value, action) {
    if (action === "showDetailedParts") {
        showDetailedParts();
    } else if (value === "none") {
        state.booking.parts = [];
        state.booking.step = 8;
        showBookingMessage("No parts needed", "user");
        setTimeout(() => askBookingQuestion(), 500);
    } else {
        const part = getPartDetails(value);
        if (part) {
            state.booking.parts.push(part);
            showBookingMessage(`Added: ${part.name} (₹${part.price})`, "user");

            setTimeout(() => {
                showBookingMessage("Add more parts?", "bot");
                const buttons = [
                    { text: "➕ Add More", action: "showDetailedParts" },
                    { text: "✅ Done", value: "done" }
                ];
                renderButtonGrid(buttons, (val, act) => {
                    if (act === "showDetailedParts") {
                        showDetailedParts();
                    } else {
                        state.booking.step = 8;
                        setTimeout(() => askBookingQuestion(), 500);
                    }
                }, "booking");
            }, 500);
        }
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
        localStorage.setItem('vectors-last-booking', JSON.stringify(completeBookingData));
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

    // Reset after delay
    setTimeout(() => {
        resetBooking();
    }, 10000);
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

    // Save to localStorage
    saveBookingToLocalStorage();

    setTimeout(() => askBookingQuestion(), 500);
}

function resetBooking() {
    // Clear current booking state
    state.booking = {
        step: 0,
        name: "", phone: "", email: "", vehicle: "",
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
    const booking = state.booking;
    
    console.log('Current booking state in generatePDFReport:', booking);

    // Try to get service details from CONFIG
    let service;
    if (booking.service && CONFIG.services[booking.service]) {
        service = CONFIG.services[booking.service];
    } else {
        // If service is not in CONFIG, try to load from localStorage
        try {
            const savedBooking = localStorage.getItem('vectors-last-booking');
            if (savedBooking) {
                const parsed = JSON.parse(savedBooking);
                if (parsed.serviceDetails) {
                    service = parsed.serviceDetails;
                } else if (parsed.service && CONFIG.services[parsed.service]) {
                    service = CONFIG.services[parsed.service];
                }
            }
        } catch (e) {
            console.error('Error loading saved booking:', e);
        }
    }

    // If still no service, create a default
    if (!service) {
        service = { 
            name: booking.service || "Service", 
            price: 1500 // default price
        };
    }

    // Calculate totals
    const partsTotal = booking.parts ? booking.parts.reduce((sum, part) => sum + (part.price || 0), 0) : 0;
    const total = service.price + partsTotal;
    const bookingId = booking.bookingId || 'VM' + Date.now().toString().slice(-8);

    // Generate HTML for PDF
    const html = `
        <div style="font-family: 'Open Sans', Arial, sans-serif; padding: 20px; max-width: 800px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #1a3a5f;">
                <h1 style="color: #1a3a5f; margin-bottom: 5px; font-size: 28px; font-family: 'Allerta Stencil', sans-serif;">
                    🏍️ VECTORS MOTORS
                </h1>
                <h2 style="color: #666; margin-top: 0; font-size: 18px;">Service Booking Confirmation</h2>
            </div>
            
            <!-- Booking Details -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1a3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                    📋 BOOKING DETAILS
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Booking ID:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${bookingId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Name:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${booking.name || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${booking.phone || 'Not specified'}</td>
                    </tr>
                    ${booking.email ? `
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${booking.email}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Vehicle:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${booking.vehicle || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Service Type:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${service.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Service Date:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${booking.date || 'To be scheduled'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Issue Reported:</td>
                        <td style="padding: 8px 0;">${booking.issue || 'Routine maintenance'}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Cost Breakdown -->
            <div style="background: #fff5f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #e63946; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                    💰 COST BREAKDOWN
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #ffd6cc;">Service Charge (${service.name})</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #ffd6cc; text-align: right; font-weight: bold;">
                            ₹${service.price.toLocaleString('en-IN')}
                        </td>
                    </tr>
                    ${booking.parts && booking.parts.length > 0 ? booking.parts.map(part => `
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #ffd6cc;">${part.name}</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #ffd6cc; text-align: right;">
                                ₹${(part.price || 0).toLocaleString('en-IN')}
                            </td>
                        </tr>
                    `).join('') : ''}
                    <tr style="background: #e63946; color: white; font-weight: bold;">
                        <td style="padding: 15px 0; font-size: 16px;">TOTAL AMOUNT</td>
                        <td style="padding: 15px 0; text-align: right; font-size: 16px;">
                            ₹${total.toLocaleString('en-IN')}
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p>Thank you for choosing Vectors Motors!</p>
                <p><strong>Service Center:</strong> 123 Auto Nagar, Delhi - 110020</p>
                <p><strong>Contact:</strong> 1800-VECTORS-1 | service@vectorsmotors.com</p>
                <p style="margin-top: 15px; color: #999;">Document generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
        </div>
    `;

    // Create temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '794px';
    tempDiv.style.padding = '40px';
    tempDiv.innerHTML = html;

    // Generate and download PDF
    html2pdf()
        .from(tempDiv)
        .set({
            margin: [10, 10, 10, 10],
            filename: `Vectors-Booking-${bookingId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .save()
        .then(() => {
            showBookingMessage("✅ Booking summary downloaded successfully!", "bot");
        })
        .catch(error => {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        });
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

    // Email PDF
    if (emailPDF) {
        emailPDF.addEventListener('click', function () {
            alert('PDF would be emailed to: ' + (state.booking.email || 'your registered email'));
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);

// Expose functions for inline onclick handlers
window.addPartToBooking = addPartToBooking;
window.finishPartsSelection = finishPartsSelection;
window.skipParts = skipParts;
window.generatePDFReport = generatePDFReport;