import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

# --- Load the dataset ---
csv_path = os.path.join(os.path.dirname(__file__), 'Banglore_traffic_Dataset.csv')
df = pd.read_csv(csv_path)

# --- Prepare data for training ---
# Convert the 'Date' column to datetime objects
df['Date'] = pd.to_datetime(df['Date'])

# Create 'Hour' and 'Day_of_Week' columns from the 'Date' column
df['Hour'] = df['Date'].dt.hour
df['Day_of_Week'] = df['Date'].dt.dayofweek # Monday=0, Sunday=6

# ✅ FIX: Use the newly created columns for features and the correct target column name
X = df[['Hour', 'Day_of_Week']]
y = df['Traffic Volume'] # Target column is 'Traffic Volume'

# --- Create and train the model ---
model = LinearRegression()
model.fit(X, y)

# --- Save the trained model ---
model_filename = 'traffic_model.pkl'
joblib.dump(model, model_filename)

print(f"Model trained and saved as {model_filename} in the backend directory.")