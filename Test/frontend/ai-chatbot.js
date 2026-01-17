// ==================== ENHANCED AI CHATBOT ====================
const ADVANCED_AI = {
    mode: 'demo',
    conversation: [],
    trainingData: [],
    
    async processQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        // Check predefined responses first
        const predefined = this.getPredefinedResponse(lowerQuery);
        if (predefined) return predefined;
        
        // Check training data
        const trained = this.checkTrainingData(lowerQuery);
        if (trained) return trained;
        
        // Generate intelligent response
        return this.generateIntelligentResponse(lowerQuery);
    },
    
    getPredefinedResponse(query) {
        const responses = {
            'hello': "Hello! I'm your ATV AI assistant. How can I help with your vehicle today?",
            'hi': "Hi there! Ready to assist with ATV maintenance, troubleshooting, or service booking.",
            'help': "I can help with:\n• Maintenance scheduling\n• Troubleshooting issues\n• Parts pricing\n• Service booking\n• Safety guidelines\nWhat do you need?",
            'thanks': "You're welcome! Let me know if you need anything else. Safe riding! 🏍️",
            'bye': "Goodbye! Remember to schedule regular maintenance for your ATV.",
            'emergency': "🚨 EMERGENCY CONTACT:\n• Call: 1800-VECTORS-1 (24/7)\n• WhatsApp: +91 98765 43210\n• Location sharing available for roadside assistance.",
            'hours': "Our service hours:\n• Weekdays: 9 AM - 7 PM\n• Saturday: 10 AM - 5 PM\n• Sunday: 10 AM - 2 PM\n• Emergency: 24/7",
            'location': "Vectors Motors & Co.\n123 Auto Nagar, Delhi - 110020\nLandmark: Near Metro Station\nFree pickup within 50km radius.",
            'warranty': "All services come with:\n• 6 months warranty on labor\n• 12 months on engine work\n• 3 months on parts\nKeep your service receipt for claims.",
            'price': "Service prices start at ₹1,500. Popular services:\n• Regular Service: ₹1,500\n• Full Service: ₹6,000\n• Brake Overhaul: ₹3,000\nGet instant quote from quick actions.",
            'oil': "For 1-seater ATV:\n• Oil type: SAE 10W-40 4-stroke\n• Change interval: 50 hours or 6 months\n• Capacity: 1.2-1.5 liters\n• Filter: Replace every oil change",
            'tire': "ATV Tire Specifications:\n• Front: 5-7 PSI\n• Rear: 4-6 PSI\n• Life: 2-3 years\n• Replacement: ₹4,500-₹5,200\n• Check pressure when cold",
            'brake': "Brake Maintenance:\n• Check pads every 6 months\n• Replace if <2mm thick\n• Fluid: DOT 4\n• Bleed brakes yearly\n• Service: ₹3,000 complete",
            'battery': "ATV Battery Care:\n• Charge monthly if not used\n• Keep terminals clean\n• Store in cool place\n• Replacement: ₹2,500-₹3,500\n• Life: 2-3 years",
            'service': "We offer:\n1. Regular Service (₹1,500)\n2. Full Service (₹6,000)\n3. Emergency Repair\n4. Diagnostic Check\n5. Parts Replacement\nBook using the booking system.",
            'maintenance': "Regular Maintenance Schedule:\n• Every 50 hours: Oil change\n• Every 100 hours: Filter & spark plug\n• Every 200 hours: Chain & brake check\n• Annually: Full inspection",
            'parts': "Genuine Parts Available:\n• Oil Filter: ₹250\n• Brake Pads: ₹800-₹900\n• Spark Plug: ₹300\n• Tires: ₹4,500-₹5,200\n• Battery: ₹2,500\nAll with warranty.",
            'booking': "To book service:\n1. Click 'Book Service' category\n2. Or use Quick Book button\n3. Or call 1800-VECTORS-1\n4. WhatsApp: +91 98765 43210\nNext available slot: Tomorrow AM",
            'diagnostic': "We offer complete diagnostic service for ₹500. Includes:\n• Computer scan\n• Engine analysis\n• Electrical check\n• Performance test\n• Detailed report",
            'payment': "Payment Options:\n• Cash\n• Credit/Debit Cards\n• UPI (PhonePe, GPay, Paytm)\n• Net Banking\n• EMI available for >₹5,000\n• Insurance claims supported",
            'insurance': "We process insurance claims for:\n• Accident damage\n• Natural calamities\n• Theft recovery\n• Fire damage\nContact our helpdesk for assistance."
        };
        
        // Check for keywords
        for (const [keyword, response] of Object.entries(responses)) {
            if (query.includes(keyword)) {
                return response;
            }
        }
        
        return null;
    },
    
    checkTrainingData(query) {
        // Check if query matches any training data
        for (const item of this.trainingData) {
            if (query.includes(item.question) || item.question.includes(query)) {
                return item.answer;
            }
        }
        return null;
    },
    
    generateIntelligentResponse(query) {
        // Analyze query type and generate appropriate response
        if (query.includes('?')) {
            return "That's a detailed technical question. For accurate advice, I recommend:\n1. Visiting our service center\n2. Booking a diagnostic service (₹500)\n3. Calling our technical team at 1800-VECTORS-1\nI can help with basic troubleshooting and maintenance tips.";
        }
        
        if (query.includes('problem') || query.includes('issue') || query.includes('not working')) {
            return "For troubleshooting, please describe:\n1. What's happening exactly?\n2. When did it start?\n3. Any warning lights?\n4. Unusual sounds or smells?\nOr book a diagnostic service for ₹500.";
        }
        
        if (query.includes('cost') || query.includes('price') || query.includes('how much')) {
            return "Pricing depends on:\n1. Service type\n2. Parts needed\n3. Labor time\nUse 'Get Quote' button for instant estimate or book diagnostic service for accurate costing.";
        }
        
        if (query.includes('time') || query.includes('how long') || query.includes('duration')) {
            return "Service duration varies:\n• Regular: 2-3 hours\n• Full: 5-6 hours\n• Brakes: 3-4 hours\n• Diagnostic: 1 hour\nDrop off in morning for same-day service.";
        }
        
        if (query.includes('best') || query.includes('recommend')) {
            return "We recommend:\n• Motul oil for performance\n• K&N filters\n• EBC brake pads\n• Genuine Vectors parts\n• Annual full service\nAll available at our center.";
        }
        
        if (query.includes('urgent') || query.includes('asap') || query.includes('quick')) {
            return "For urgent service:\n• Call: 1800-VECTORS-1\n• Emergency slots available\n• 2-hour response time\n• Free pickup within 50km\n• Priority service with 20% premium.";
        }
        
        // Default intelligent response
        return "I understand you're asking about ATV maintenance. For specific advice, please:\n1. Use the category buttons for focused help\n2. Book a service appointment\n3. Call our experts at 1800-VECTORS-1\n4. Visit with your ATV for free inspection\nI'm here to guide you through the process!";
    },
    
    addTrainingExample(question, answer) {
        this.trainingData.push({
            question: question.toLowerCase(),
            answer: answer,
            timestamp: new Date().toISOString()
        });
        this.saveTrainingData();
    },
    
    saveTrainingData() {
        try {
            localStorage.setItem('atv-ai-training', JSON.stringify(this.trainingData));
        } catch (e) {
            console.warn('Could not save training data:', e);
        }
    },
    
    loadTrainingData() {
        try {
            const saved = localStorage.getItem('atv-ai-training');
            if (saved) {
                this.trainingData = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load training data:', e);
        }
    },
    
    exportData() {
        const data = {
            training: this.trainingData,
            conversation: this.conversation,
            exported: new Date().toISOString(),
            version: '2.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vectors-ai-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return "Data exported successfully!";
    }
};

// Initialize when needed
function initEnhancedAI() {
    ADVANCED_AI.loadTrainingData();
    console.log("Enhanced AI Module Loaded");
}

// Add to global scope for integration
window.AdvancedAI = ADVANCED_AI;