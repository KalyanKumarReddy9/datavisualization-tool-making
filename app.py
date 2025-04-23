from flask import Flask, render_template, request, session, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import io
import base64

app = Flask(__name__)
app.secret_key = "secret_key"

# Global dataset
current_dataset = None

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
                'columns': list(current_dataset.columns),
                'filters': get_filter_options(current_dataset)
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/api/data')
def get_data():
    if current_dataset is not None:
        return jsonify(current_dataset.to_dict('records'))
    return jsonify([])

@app.route('/api/chart', methods=['POST'])
def generate_chart():
    global current_dataset
    if current_dataset is None:
        return jsonify({'error': 'No dataset uploaded'}), 400

    data = request.json
    cat = data.get('categoryFilter')
    reg = data.get('regionFilter')
    if cat:
        df = df[df['category'] == cat]
    if reg:
        df = df[df['region'] == reg]
    x = data.get('x_column')
    y = data.get('y_column')
    hue = data.get('hue') or None
    chart_type = data.get('type')
    title = data.get('title', 'Chart')
    filter_column = data.get('filter_column')
    filter_value = data.get('filter_value')

    df = current_dataset.copy()

    # Apply filter if specified
    if filter_column and filter_value:
        df = df[df[filter_column] == filter_value]

    try:
        plt.figure(figsize=(10, 6))
        plt.style.use('dark_background')

        if chart_type == 'bar':
            sns.barplot(data=df, x=x, y=y, hue=hue)
        elif chart_type == 'line':
            sns.lineplot(data=df, x=x, y=y, hue=hue)
        elif chart_type == 'pie':
            pie_data = df[x].value_counts()
            plt.pie(pie_data.values, labels=pie_data.index, autopct='%1.1f%%')
        elif chart_type == 'scatter':
            sns.scatterplot(data=df, x=x, y=y, hue=hue)
        elif chart_type == 'box':
            sns.boxplot(data=df, x=x, y=y, hue=hue)
        elif chart_type == 'violin':
            sns.violinplot(data=df, x=x, y=y, hue=hue)
        elif chart_type == 'heatmap':
            corr = df.select_dtypes(include='number').corr()
            sns.heatmap(corr, annot=True, cmap='coolwarm')
        elif chart_type == 'histogram':
            sns.histplot(data=df, x=x, hue=hue, bins=30)
        elif chart_type == 'kde':
            sns.kdeplot(data=df, x=x, hue=hue)
        else:
            return jsonify({'error': f'Unsupported chart type: {chart_type}'}), 400

        plt.title(title)
        plt.xticks(rotation=45)
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()

        return jsonify({'image': image_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/columns')
def get_columns():
    if current_dataset is not None:
        return jsonify(list(current_dataset.columns))
    return jsonify([])

@app.route('/api/filters')
def get_filters():
    if current_dataset is not None:
        return jsonify(get_filter_options(current_dataset))
    return jsonify([])

def get_filter_options(df):
    filters = {}
    for col in df.columns:
        if df[col].dtype == 'object' or df[col].nunique() < 10:
            filters[col] = df[col].dropna().unique().tolist()
    return filters

if __name__ == '__main__':
    app.run(debug=True)
