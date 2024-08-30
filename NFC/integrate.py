from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import geopandas as gpd
import matplotlib
matplotlib.use('Agg')  # Use 'Agg' backend for non-interactive plotting
import matplotlib.pyplot as plt
import seaborn as sn
from shapely.geometry import Point
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import accuracy_score
import io
import os
import logging
logging.basicConfig(level=logging.DEBUG)
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global variables
scaler = None
best_model = None
combined_data = None
all_deposits = None

def load_and_preprocess_data(states):
    combined_data = pd.DataFrame()
    all_deposits = pd.DataFrame()
    
    for state in states:
        geological_file = f"D:\\DJSCE\\Hackathon\\Tsec\\NFC\\{state}\\Geology 2M.shp"
        mineral_file = f"D:\\DJSCE\\Hackathon\\Tsec\\NFC\\{state}\\Mineralization.shp"
        deposit_file = f"D:\\DJSCE\\Hackathon\\Tsec\\NFC\\{state}\\Deposit.shp"
        
        gdf_geological = gpd.read_file(geological_file)
        gdf_mineral = gpd.read_file(mineral_file)
        
        gdf_geological = gdf_geological.dropna()
        gdf_mineral = gdf_mineral.dropna()
        
        if gdf_geological.crs is None:
            gdf_geological.set_crs(epsg=4326, inplace=True)
        if gdf_mineral.crs is None:
            gdf_mineral.set_crs(epsg=4326, inplace=True)

        # Reproject to a projected CRS for accurate area/perimeter calculation
        gdf_geological = gdf_geological.to_crs(epsg=3395)  # Mercator Projection or use a suitable CRS
        gdf_mineral = gdf_mineral.to_crs(epsg=3395)
        
        gdf_geological['area'] = gdf_geological.geometry.area
        gdf_geological['perimeter'] = gdf_geological.geometry.length
        
        gdf_joined = gpd.sjoin(gdf_mineral, gdf_geological, how="inner", predicate='within')
        gdf_geological['has_minerals'] = gdf_geological.index.isin(gdf_joined.index).astype(int)
        
        gdf_geological['state'] = state
        combined_data = pd.concat([combined_data, gdf_geological], ignore_index=True)
        
        if os.path.exists(deposit_file):
            gdf_deposit = gpd.read_file(deposit_file)
            gdf_deposit['state'] = state
            all_deposits = pd.concat([all_deposits, gdf_deposit], ignore_index=True)
    
    return combined_data, all_deposits

def feature_engineering(data):
    data['area_to_perimeter_ratio'] = data['area'] / data['perimeter']
    data['log_area'] = np.log1p(data['area'])
    data['log_perimeter'] = np.log1p(data['perimeter'])
    data['shape_factor'] = 4 * np.pi * data['area'] / (data['perimeter'] ** 2)
    return data

def train_and_evaluate_model(X_train, X_test, y_train, y_test, model_type='xgboost'):
    if model_type == 'xgboost':
        model = XGBClassifier(random_state=42)
        param_grid = {
            'n_estimators': [100, 200, 300],
            'learning_rate': [0.01, 0.1, 0.3],
            'max_depth': [3, 5, 7]
        }
    elif model_type == 'random_forest':
        model = RandomForestClassifier(random_state=42)
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [5, 10, None],
            'min_samples_split': [2, 5, 10]
        }
    
    
    grid_search = GridSearchCV(model, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    return grid_search.best_estimator_

def predict_mineral_occurrence(lat, lon):
    point = Point(lon, lat)
    for _, polygon in combined_data.iterrows():
        if polygon.geometry.contains(point):
            features = polygon[['area', 'perimeter', 'area_to_perimeter_ratio', 'log_area', 'log_perimeter', 'shape_factor']]
            features_scaled = scaler.transform(features.values.reshape(1, -1))
            prediction = best_model.predict(features_scaled)
            probability = best_model.predict_proba(features_scaled)[0][1]
            
            nearby_deposits = all_deposits[all_deposits.geometry.distance(point) < 0.1]  # Adjust distance as needed
            return prediction[0], probability, nearby_deposits.to_dict(orient='records')

    # No minerals found in any polygon
    return None, None, None


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    lat = data.get('latitude')
    lon = data.get('longitude')
    
    prediction, probability, nearby_deposits = predict_mineral_occurrence(lat, lon)

    # Debug logs
    print(f"Latitude: {lat}, Longitude: {lon}")
    print(f"Prediction: {prediction}, Probability: {probability}")
    print(f"Nearby Deposits: {nearby_deposits}")
    
    if prediction is None:
        response = {
            'message': 'No minerals can be found in this location.',
            'nearby_deposits': []
        }
    else:
        response = {
            'prediction': prediction,
            'probability': probability,
            'nearby_deposits': nearby_deposits if nearby_deposits is not None else []
        }
    
    return jsonify(response)




@app.route('/state_charts/<state>', methods=['GET'])
def state_charts(state):
    if state not in combined_data['state'].unique():
        return jsonify({'error': 'State not found'}), 404

    state_data = combined_data[combined_data['state'] == state]
    state_deposits = all_deposits[all_deposits['state'] == state]

    # Generate plots
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))

    # Plot 1: Countplot
    sn.countplot(x='has_minerals', data=state_data, ax=axes[0])
    axes[0].set_title(f"Mineral Occurrences in {state}")

    # Plot 2: Distribution Map
    state_data.plot(column='has_minerals', cmap='viridis', legend=True, ax=axes[1])
    axes[1].set_title(f"Mineral Distribution in {state}")

    # Plot 3: Known Mineral Deposits
    plt.sca(axes[2])  # Set current axis to the third subplot
    state_data.plot(ax=plt.gca(), alpha=0.5, color='lightblue')  # Use gca() for the current axis
    if not state_deposits.empty:
        state_deposits.plot(ax=plt.gca(), color='red', markersize=50)
    else:
        plt.gca().text(0.5, 0.5, 'No Deposits Found', ha='center', va='center', transform=plt.gca().transAxes)
    plt.gca().set_title(f"Known Mineral Deposits in {state}")

    plt.tight_layout()

    # Convert plots to PNG and return as response
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')
    plt.close()
    
    img_stream.seek(0)
    
    return send_file(img_stream, mimetype='image/png')



    return jsonify({
        'image': 'data:image/png;base64,' + img_base64
    })

def initialize():
    global scaler, best_model, combined_data, all_deposits
    
    # Define states
    states = ["Maharashtra", "Arunachal Pradesh", "Assam", "Andhra Pradesh", "Bihar", "Chandigarh", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Ladakh", "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]

    # Load and preprocess data
    combined_data, all_deposits = load_and_preprocess_data(states)
    combined_data = feature_engineering(combined_data)

    # Prepare features and target
    X = combined_data[['area', 'perimeter', 'area_to_perimeter_ratio', 'log_area', 'log_perimeter', 'shape_factor']]
    y = combined_data['has_minerals']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42, stratify=y)

    # Train and evaluate models
    models = ['xgboost', 'random_forest']
    best_accuracy = 0

    for model_type in models:
        model = train_and_evaluate_model(X_train, X_test, y_train, y_test, model_type=model_type)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        if accuracy > best_accuracy:
            best_model = model
            best_accuracy = accuracy
            best_model_name = model_type

    print(f"Best Model: {best_model_name}")
    print(f"Best Accuracy: {best_accuracy:.4f}")

initialize()

if __name__ == "__main__":
    app.run(debug=True)
