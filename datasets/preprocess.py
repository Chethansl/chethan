"""
Data preprocessing module for the BioAI disease prediction system.
This module handles data cleaning, normalization, and preparation for model training.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_dataset(file_path):
    """
    Load the dataset from a CSV file.
    
    Args:
        file_path (str): Path to the CSV file
        
    Returns:
        pandas.DataFrame: Loaded dataset
    """
    try:
        logger.info(f"Loading dataset from {file_path}")
        data = pd.read_csv(file_path)
        logger.info(f"Successfully loaded dataset with shape {data.shape}")
        return data
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        raise

def clean_data(data):
    """
    Clean the dataset by removing duplicates and handling missing values.
    
    Args:
        data (pandas.DataFrame): Input dataset
        
    Returns:
        pandas.DataFrame: Cleaned dataset
    """
    logger.info("Starting data cleaning process")
    
    # Make a copy to avoid modifying the original
    cleaned_data = data.copy()
    
    # Remove duplicates
    initial_rows = len(cleaned_data)
    cleaned_data = cleaned_data.drop_duplicates()
    logger.info(f"Removed {initial_rows - len(cleaned_data)} duplicate rows")
    
    # Handle missing values
    missing_values = cleaned_data.isnull().sum().sum()
    if missing_values > 0:
        logger.info(f"Found {missing_values} missing values")
        # For numeric columns, fill with median
        numeric_cols = cleaned_data.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            if cleaned_data[col].isnull().sum() > 0:
                cleaned_data[col] = cleaned_data[col].fillna(cleaned_data[col].median())
        
        # For categorical columns, fill with mode
        categorical_cols = cleaned_data.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if cleaned_data[col].isnull().sum() > 0:
                cleaned_data[col] = cleaned_data[col].fillna(cleaned_data[col].mode()[0])
    
    logger.info("Data cleaning completed")
    return cleaned_data

def create_symptom_disease_mapping(data):
    """
    Create a mapping between symptoms and diseases.
    
    Args:
        data (pandas.DataFrame): Input dataset
        
    Returns:
        dict: Mapping of symptoms to diseases with weights
    """
    logger.info("Creating symptom-disease mapping")
    
    mapping = {}
    
    for _, row in data.iterrows():
        symptom = row['symptom_name'].lower()
        disease = row['disease_name']
        weight = row['weight']
        
        if symptom not in mapping:
            mapping[symptom] = []
        
        mapping[symptom].append({
            'disease': disease,
            'weight': weight
        })
    
    # Sort diseases by weight for each symptom
    for symptom in mapping:
        mapping[symptom] = sorted(mapping[symptom], key=lambda x: x['weight'], reverse=True)
    
    logger.info(f"Created mapping for {len(mapping)} symptoms")
    return mapping

def create_disease_symptom_matrix(data):
    """
    Create a disease-symptom matrix for model training.
    
    Args:
        data (pandas.DataFrame): Input dataset
        
    Returns:
        tuple: (X, y) where X is the symptom matrix and y is the disease labels
    """
    logger.info("Creating disease-symptom matrix")
    
    # Get unique symptoms and diseases
    symptoms = data['symptom_name'].unique()
    diseases = data['disease_name'].unique()
    
    # Create a dictionary to map symptoms to indices
    symptom_to_idx = {symptom: i for i, symptom in enumerate(symptoms)}
    
    # Create a dictionary to map diseases to indices
    disease_to_idx = {disease: i for i, disease in enumerate(diseases)}
    
    # Initialize the symptom matrix and disease labels
    X = np.zeros((len(diseases), len(symptoms)))
    y = np.array(diseases)
    
    # Fill the symptom matrix
    for _, row in data.iterrows():
        disease_idx = disease_to_idx[row['disease_name']]
        symptom_idx = symptom_to_idx[row['symptom_name']]
        X[disease_idx, symptom_idx] = row['weight']
    
    logger.info(f"Created matrix with shape {X.shape}")
    return X, y, symptom_to_idx, disease_to_idx

def normalize_features(X):
    """
    Normalize the feature matrix.
    
    Args:
        X (numpy.ndarray): Feature matrix
        
    Returns:
        numpy.ndarray: Normalized feature matrix
    """
    logger.info("Normalizing features")
    scaler = StandardScaler()
    X_normalized = scaler.fit_transform(X)
    logger.info("Feature normalization completed")
    return X_normalized, scaler

def prepare_data_for_training(file_path):
    """
    Prepare the data for model training.
    
    Args:
        file_path (str): Path to the dataset
        
    Returns:
        tuple: Processed data ready for model training
    """
    logger.info("Preparing data for training")
    
    # Load and clean the data
    data = load_dataset(file_path)
    cleaned_data = clean_data(data)
    
    # Create the symptom-disease mapping
    mapping = create_symptom_disease_mapping(cleaned_data)
    
    # Create the disease-symptom matrix
    X, y, symptom_to_idx, disease_to_idx = create_disease_symptom_matrix(cleaned_data)
    
    # Normalize the features
    X_normalized, scaler = normalize_features(X)
    
    logger.info("Data preparation completed")
    return {
        'X': X_normalized,
        'y': y,
        'mapping': mapping,
        'symptom_to_idx': symptom_to_idx,
        'disease_to_idx': disease_to_idx,
        'scaler': scaler
    }

if __name__ == "__main__":
    # Example usage
    data_path = "symbipredict.csv"
    processed_data = prepare_data_for_training(data_path)
    print(f"Processed data with {len(processed_data['mapping'])} symptoms and {len(processed_data['y'])} diseases")