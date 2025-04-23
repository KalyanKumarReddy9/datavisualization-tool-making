let selectedVisualization = null;
let columns = [];
let visualizationCounter = 0;

// Fetch available columns when the page loads
fetch('/api/columns')
    .then(response => response.json())
    .then(data => {
        columns = data;
        populateColumnSelects();
        populateFilters();
    });

function uploadDataset() {
    const fileInput = document.getElementById('datasetUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            columns = data.columns;
            populateColumnSelects();
            populateFilters();
            alert('Dataset uploaded successfully!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading dataset');
    });
}

function populateColumnSelects() {
    const xAxis = document.getElementById('xAxis');
    const yAxis = document.getElementById('yAxis');
    const hueColumn = document.getElementById('hueColumn');
    
    xAxis.innerHTML = '';
    yAxis.innerHTML = '';
    hueColumn.innerHTML = '<option value="">None</option>';
    
    columns.forEach(column => {
        xAxis.innerHTML += `<option value="${column}">${column}</option>`;
        yAxis.innerHTML += `<option value="${column}">${column}</option>`;
        hueColumn.innerHTML += `<option value="${column}">${column}</option>`;
    });
}

function populateFilters() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const categories = [...new Set(data.map(item => item.category))];
            const regions = [...new Set(data.map(item => item.region))];
            
            const categoryFilter = document.getElementById('categoryFilter');
            const regionFilter = document.getElementById('regionFilter');
            
            categoryFilter.innerHTML = '<option value="">All</option>';
            regionFilter.innerHTML = '<option value="">All</option>';
            
            categories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });
            
            regions.forEach(region => {
                regionFilter.innerHTML += `<option value="${region}">${region}</option>`;
            });
        });
}

function addVisualization(type) {
    visualizationCounter++;
    const id = `${type}-${visualizationCounter}`;
    
    const card = document.createElement('div');
    card.className = 'visualization-card';
    card.id = id;
    
    card.innerHTML = `
        <div class="visualization-header">
            <h3>New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart</h3>
            <div class="visualization-controls">
                <button onclick="editVisualization('${id}')" class="control-button">Edit</button>
                <button onclick="removeVisualization('${id}')" class="control-button delete">×</button>
            </div>
        </div>
        <div class="visualization-content">
            <img src="" alt="Chart will appear here" style="width: 100%;">
        </div>
    `;
    
    document.getElementById('visualizations').appendChild(card);
    
    // Create initial chart
    updateVisualization(id, {
        type: type,
        x_column: document.getElementById('xAxis').value,
        y_column: document.getElementById('yAxis').value,
        title: document.getElementById('chartTitle').value,
        hue: document.getElementById('hueColumn').value
    });
    
    selectedVisualization = id;
}

function editVisualization(id) {
    selectedVisualization = id;
    // You could also update the properties panel with the current visualization's settings
}

function removeVisualization(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
    if (selectedVisualization === id) {
        selectedVisualization = null;
    }
}

function updateChart() {
    if (!selectedVisualization) return;
    
    updateVisualization(selectedVisualization, {
        type: selectedVisualization.split('-')[0],
        x_column: document.getElementById('xAxis').value,
        y_column: document.getElementById('yAxis').value,
        title: document.getElementById('chartTitle').value,
        hue: document.getElementById('hueColumn').value
    });
}

function updateVisualization(id, config) {
    fetch('/api/chart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })
    .then(response => response.json())
    .then(data => {
        const card = document.getElementById(id);
        if (card) {
            const img = card.querySelector('img');
            img.src = `data:image/png;base64,${data.image}`;
            
            const title = card.querySelector('h3');
            title.textContent = config.title;
        }
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const region = document.getElementById('regionFilter').value;
    
    document.querySelectorAll('.visualization-card').forEach(card => {
        updateVisualization(card.id, {
            type: card.id.split('-')[0],
            x_column: document.getElementById('xAxis').value,
            y_column: document.getElementById('yAxis').value,
            title: document.getElementById('chartTitle').value,
            hue: document.getElementById('hueColumn').value,
            filters: {
                category: category,
                region: region
            }
        });
    });
}