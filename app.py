from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import io
import base64
from datetime import datetime
import json
import numpy as np

app = Flask(__name__)

# Global variable to store the uploaded dataset
current_dataset = None

def create_chart(chart_type, x_column, y_column, title, hue=None):
    plt.figure(figsize=(10, 6))
    plt.style.use('dark_background')
    
    if not current_dataset is None:
        data = current_dataset
    else:
        data = generate_sample_data()
    
    if chart_type == 'bar':
        sns.barplot(data=data, x=x_column, y=y_column, hue=hue)
    elif chart_type == 'line':
        sns.lineplot(data=data, x=x_column, y=y_column, hue=hue, marker='o')
    elif chart_type == 'pie':
        plt.pie(data[y_column], labels=data[x_column], autopct='%1.1f%%')
    elif chart_type == 'scatter':
        sns.scatterplot(data=data, x=x_column, y=y_column, hue=hue)
    elif chart_type == 'box':
        sns.boxplot(data=data, x=x_column, y=y_column, hue=hue)
    elif chart_type == 'violin':
        sns.violinplot(data=data, x=x_column, y=y_column, hue=hue)
    elif chart_type == 'heatmap':
        pivot_table = pd.pivot_table(data, values=y_column, index=x_column, columns=hue, aggfunc='mean')
        sns.heatmap(pivot_table, annot=True, cmap='YlOrRd', fmt='.2f')
    elif chart_type == 'histogram':
        sns.histplot(data=data, x=x_column, hue=hue, bins=30)
    elif chart_type == 'kde':
        sns.kdeplot(data=data, x=x_column, hue=hue)
    
    plt.title(title)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    img = io.BytesIO()
    plt.savefig(img, format='png', facecolor='#1a1a1a')
    img.seek(0)
    plt.close()
    return base64.b64encode(img.getvalue()).decode()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global current_dataset
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            current_dataset = pd.read_csv(file)
            return jsonify({
                'message': 'File uploaded successfully',
                'columns': list(current_dataset.columns)
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/api/data')
def get_data():
    if current_dataset is not None:
        return jsonify(current_dataset.to_dict('records'))
    return jsonify(generate_sample_data().to_dict('records'))

@app.route('/api/chart', methods=['POST'])
def generate_chart():
    data = request.json
    chart_type = data.get('type', 'bar')
    x_column = data.get('x_column', 'product')
    y_column = data.get('y_column', 'sales')
    title = data.get('title', 'Chart')
    hue = data.get('hue', None)  # For additional dimension in visualizations
    
    chart_image = create_chart(chart_type, x_column, y_column, title, hue)
    return jsonify({'image': chart_image})

@app.route('/api/columns')
def get_columns():
    if current_dataset is not None:
        return jsonify(list(current_dataset.columns))
    return jsonify(list(generate_sample_data().columns))

def generate_sample_data():
    return pd.DataFrame({
        'product': ['Laptop', 'Smartphone', 'Headphones', 'Chair', 'Desk', 'Lamp'] * 2,
        'category': ['Electronics', 'Electronics', 'Electronics', 'Furniture', 'Furniture', 'Furniture'] * 2,
        'region': ['North', 'South', 'East', 'West', 'North', 'South'] * 2,
        'sales': [45000, 35000, 15000, 12000, 20000, 5000] * 2,
        'quantity': [30, 50, 100, 20, 15, 40] * 2,
        'month': ['January', 'January', 'February', 'February', 'March', 'March'] * 2,
        'year': [2023, 2023, 2023, 2023, 2023, 2023] * 2,
        'profit_margin': [0.15, 0.25, 0.35, 0.20, 0.30, 0.40] * 2
    })

if __name__ == '__main__':
    app.run(debug=True)