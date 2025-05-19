// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the prediction page
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        setupPredictionForm();
    }

    // Check if we're on the results page
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        setupFeedbackSystem();
    }

    // Check if we're on the home page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupContactForm();
    }

    // Setup navigation highlighting
    setupNavigation();
});

// Setup the prediction form
function setupPredictionForm() {
    const predictionForm = document.getElementById('prediction-form');
    const resultsSection = document.getElementById('results-section');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Hide results section initially
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }

    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        
        // Get form data
        const formData = new FormData(predictionForm);
        const formObject = {};
        
        // Convert symptoms checkboxes to array
        const symptoms = [];
        
        formData.forEach((value, key) => {
            if (key === 'symptoms') {
                symptoms.push(value);
            } else {
                formObject[key] = value;
            }
        });
        
        formObject.symptoms = symptoms;
        
        try {
            // Send data to backend
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            // Display results
            displayResults(data);
            
            // Show results section
            if (resultsSection) {
                resultsSection.style.display = 'block';
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            // Show error message
            alert('An error occurred while processing your request. Please try again.');
        }
    });
}

// Display prediction results
function displayResults(data) {
    const predictionResult = document.getElementById('prediction-result');
    const confidenceLevel = document.getElementById('confidence-level');
    const predictionDetails = document.getElementById('prediction-details');
    const medicationsList = document.getElementById('medications-list');
    const alternativePredictions = document.getElementById('alternative-predictions');
    
    // Display disease prediction
    if (predictionResult) {
        predictionResult.textContent = data.prediction;
    }
    
    // Display confidence level
    if (confidenceLevel) {
        confidenceLevel.style.width = `${data.confidence}%`;
        document.getElementById('confidence-percentage').textContent = `${data.confidence}%`;
    }
    
    // Display prediction details
    if (predictionDetails) {
        predictionDetails.innerHTML = '';
        
        // Add description
        const descriptionPara = document.createElement('p');
        descriptionPara.innerHTML = `<strong>Description:</strong> ${data.description}`;
        predictionDetails.appendChild(descriptionPara);
        
        // Add risk factors
        const riskPara = document.createElement('p');
        riskPara.innerHTML = `<strong>Risk Factors:</strong> ${data.risk_factors.join(', ')}`;
        predictionDetails.appendChild(riskPara);
    }
    
    // Display medications
    if (medicationsList) {
        medicationsList.innerHTML = '';
        
        data.medications.forEach(med => {
            const li = document.createElement('li');
            li.textContent = med;
            medicationsList.appendChild(li);
        });
    }
    
    // Display alternative predictions if available
    if (alternativePredictions && data.top_predictions && data.top_predictions.length > 1) {
        alternativePredictions.innerHTML = '<h4>Alternative Possibilities:</h4>';
        const list = document.createElement('ul');
        
        // Start from index 1 to skip the top prediction which is already displayed
        for (let i = 1; i < data.top_predictions.length; i++) {
            const pred = data.top_predictions[i];
            const li = document.createElement('li');
            li.innerHTML = `<strong>${pred.disease}</strong> (${pred.confidence}% confidence)`;
            list.appendChild(li);
        }
        
        alternativePredictions.appendChild(list);
        alternativePredictions.style.display = 'block';
    } else if (alternativePredictions) {
        alternativePredictions.style.display = 'none';
    }
    
    // Setup visualization if available
    if (data.visualization_data && typeof renderChart === 'function') {
        renderChart(data.visualization_data);
    }
}

// Render chart for disease progression
function renderChart(data) {
    const ctx = document.getElementById('progression-chart').getContext('2d');
    
    // Clear previous chart if it exists
    if (window.progressionChart) {
        window.progressionChart.destroy();
    }
    
    window.progressionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Disease Progression',
                data: data.values,
                backgroundColor: 'rgba(92, 184, 92, 0.2)',
                borderColor: 'rgba(92, 184, 92, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(92, 184, 92, 1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Severity (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Severity: ${context.parsed.y}%`;
                        }
                    }
                }
            }
        }
    });
}

// Setup feedback system
function setupFeedbackSystem() {
    const feedbackCorrect = document.getElementById('feedback-correct');
    const feedbackIncorrect = document.getElementById('feedback-incorrect');
    const feedbackComment = document.getElementById('feedback-comment');
    const feedbackSubmit = document.getElementById('feedback-submit');
    
    if (feedbackCorrect && feedbackIncorrect) {
        // Handle correct feedback
        feedbackCorrect.addEventListener('click', function() {
            feedbackCorrect.classList.add('active');
            feedbackIncorrect.classList.remove('active');
        });
        
        // Handle incorrect feedback
        feedbackIncorrect.addEventListener('click', function() {
            feedbackIncorrect.classList.add('active');
            feedbackCorrect.classList.remove('active');
        });
    }
    
    // Handle feedback submission
    if (feedbackSubmit) {
        feedbackSubmit.addEventListener('click', async function() {
            const isCorrect = feedbackCorrect.classList.contains('active');
            const isIncorrect = feedbackIncorrect.classList.contains('active');
            
            if (!isCorrect && !isIncorrect) {
                alert('Please select whether the prediction was correct or incorrect.');
                return;
            }
            
            const feedbackData = {
                is_correct: isCorrect,
                comment: feedbackComment.value
            };
            
            try {
                const response = await fetch('http://localhost:5000/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedbackData),
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                alert('Thank you for your feedback!');
                
                // Reset feedback form
                feedbackCorrect.classList.remove('active');
                feedbackIncorrect.classList.remove('active');
                feedbackComment.value = '';
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your feedback. Please try again.');
            }
        });
    }
}

// Setup navigation highlighting
function setupNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPage.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentPage === '/' && linkPath === '/') {
            link.classList.add('active');
        }
    });
}

// Symptom selection functionality
function toggleSymptomSelection(checkbox) {
    const label = checkbox.parentElement;
    
    if (checkbox.checked) {
        label.classList.add('selected');
    } else {
        label.classList.remove('selected');
    }
    
    // Update selected symptoms counter
    updateSelectedSymptomsCounter();
}

// Update selected symptoms counter
function updateSelectedSymptomsCounter() {
    const selectedCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
    const counter = document.getElementById('selected-symptoms-count');
    
    if (counter) {
        counter.textContent = selectedCheckboxes.length;
    }
}

// Age validation
function validateAge(input) {
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0 || value > 120) {
        input.setCustomValidity('Please enter a valid age between 0 and 120');
    } else {
        input.setCustomValidity('');
    }
}

// Temperature validation
function validateTemperature(input) {
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < 35 || value > 42) {
        input.setCustomValidity('Please enter a valid temperature between 35°C and 42°C');
    } else {
        input.setCustomValidity('');
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // In a real application, you would send this data to your backend
        console.log('Contact form submitted:', formObject);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}