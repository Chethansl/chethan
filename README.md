# BioAI - AI-Powered Disease Prediction

BioAI is an AI-powered disease prediction system that helps users identify potential diseases based on their symptoms and health information.

## Features

- Disease prediction based on symptoms
- Visualization of disease progression
- Risk factor analysis
- Medication suggestions
- User feedback system for continuous improvement

## Project Structure

```
bioai/
├── backend/                # Backend Python code
│   ├── data/               # Data files
│   ├── app.py              # Main Flask application
│   ├── diagnose.py         # Disease diagnosis module
│   ├── feedback_agent.py   # Feedback processing module
│   ├── reinforcement_model.py # ML model for disease prediction
│   ├── simple_server.py    # Simplified server for development
│   └── visualization.py    # Visualization generation module
├── frontend/               # Frontend web interface
│   ├── assets/             # CSS, JS, and image files
│   ├── index.html          # Home page
│   └── prediction.html     # Disease prediction page
└── models/                 # Trained ML models
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Flask
- NumPy
- Pandas
- Scikit-learn
- Chart.js (included via CDN)

##requirements 
+flask==2.0.1
+flask-cors==3.0.10
+numpy==1.21.2
+pandas==1.3.3
+scikit-learn==1.0
+joblib==1.1.0
+pyyaml==6.0
+matplotlib==3.4.3
+seaborn==0.11.2
+gunicorn==20.1.0


### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/bioai.git
   cd bioai
   ```

2. Install the required Python packages:
   ```
   pip install flask flask-cors numpy pandas scikit-learn joblib pyyaml
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   python simple_server.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Navigate to the Disease Prediction page
2. Enter your personal information (age, gender)
3. Select your symptoms from the list
4. Enter any additional health information
5. Click "Get Prediction" to receive your results
6. Review the prediction, disease progression chart, and recommendations
7. Provide feedback to help improve the system

## Development

### Backend Development

The backend is built with Flask and provides RESTful API endpoints for the frontend to consume. The main components are:

- `simple_server.py`: A simplified server for development
- `app.py`: The main Flask application with all API endpoints
- `reinforcement_model.py`: The machine learning model for disease prediction
- `visualization.py`: Generates visualization data for disease progression and risk factors

### Frontend Development

The frontend is built with HTML, CSS, and JavaScript. The main components are:

- `index.html`: The home page
- `prediction.html`: The disease prediction page
- `assets/styles.css`: CSS styles
- `assets/script.js`: JavaScript functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical data sources
- Open-source libraries and frameworks
- Contributors and testers