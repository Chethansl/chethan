# BioAI: Disease Prediction AI System

BioAI is an advanced disease prediction system that uses machine learning to diagnose diseases based on symptoms and predict disease progression over time. The system includes a feedback mechanism to continuously improve its predictions.

## Features

- **AI-Powered Diagnosis**: Predict diseases based on symptoms using a Random Forest classifier
- **Disease Progression Prediction**: Forecast how a disease will progress over time with and without treatment
- **Feedback-Based Learning**: Continuously improve the model based on user feedback
- **RESTful API**: Easy integration with frontend applications
- **Scalable Architecture**: Designed to handle increasing loads with minimal changes

## Directory Structure

```
│── backend/
│   ├── app.py               # Flask backend for AI processing
│   ├── diagnose.py          # AI-powered diagnosis function
│   ├── predict_progress.py  # Condition progression logic
│   ├── feedback_agent.py    # Smart learning mechanism
│   ├── server.py            # API entry point
│   ├── requirements.txt     # Dependencies for AI & server

│── models/
│   ├── trained_model.pkl    # Random Forest trained model
│   ├── config.yaml          # Model configuration file

│── datasets/
│   ├── symbipredict.csv     # Disease mapping dataset
│   ├── preprocess.py        # Data cleaning functions

│── docs/
│   ├── README.md            # Setup instructions
│   ├── architecture.md      # System design overview
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/bioai.git
   cd bioai
   ```

2. Install the required dependencies:
   ```
   pip install -r backend/requirements.txt
   ```

3. Train the model:
   ```
   python -m backend.diagnose
   ```

4. Start the server:
   ```
   python -m backend.server
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Diagnosis

- **POST /api/diagnose**
  - Request: `{"symptoms": ["fever", "cough"], "severity": {"fever": 8, "cough": 6}}`
  - Response: `{"diagnoses": ["Pneumonia", "Influenza"], "confidences": [85.2, 65.7]}`

### Disease Progression

- **POST /api/predict_progression**
  - Request: `{"disease": "Pneumonia", "initial_severity": 8.5, "patient_data": {"age": 65, "comorbidities": 2}}`
  - Response: `{"timePoints": ["Initial", "Week 1", ...], "predictedProgression": {...}}`

### Feedback

- **POST /api/feedback**
  - Request: `{"symptoms": ["fever", "cough"], "actual_disease": "Pneumonia", "predicted_disease": "Influenza", "confidence": 75.5}`
  - Response: `{"status": "ok", "message": "Feedback added successfully"}`

## Configuration

The system can be configured by modifying the `models/config.yaml` file. This file contains settings for:

- Random Forest model parameters
- Training configuration
- Feedback learning parameters
- Prediction thresholds
- API settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- SymbiPredict dataset for symptom-disease mapping
- scikit-learn for machine learning algorithms
- Flask/FastAPI for API development