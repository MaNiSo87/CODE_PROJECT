
// Plant database with CO2 absorption rates
const flowerData = {
    rose: {
        name: "Rose",
        description: "Roses are classic flowering plants known for their beauty and fragrance. They require regular watering (2-3 times per week) and prefer temperatures between 15-25°C. Roses are excellent air purifiers and can absorb approximately 5.5 kg of CO₂ per year.",
        co2PerYear: 5.5
    },
    tulip: {
        name: "Tulip",
        description: "Tulips are spring-blooming perennials with vibrant colors. They need moderate watering and prefer cooler temperatures (15-20°C). Tulips can absorb about 3.5 kg of CO₂ annually and add a cheerful ambiance to any space.",
        co2PerYear: 3.5
    },
    orchid: {
        name: "Orchid",
        description: "Orchids are elegant, exotic flowers that thrive in humid environments. They require minimal watering (once per week) and prefer temperatures between 18-24°C. Orchids absorb approximately 4.2 kg of CO₂ per year and release oxygen at night.",
        co2PerYear: 4.2
    },
    sunflower: {
        name: "Sunflower",
        description: "Sunflowers are bright, cheerful plants that follow the sun. They need regular watering and thrive in temperatures of 20-25°C. These large plants can absorb 7.2 kg of CO₂ annually and are excellent for improving air quality.",
        co2PerYear: 7.2
    },
    lavender: {
        name: "Lavender",
        description: "Lavender is a fragrant herb known for its calming properties. It requires moderate watering and prefers warm temperatures (20-25°C). Lavender absorbs about 3.8 kg of CO₂ per year and has natural pest-repelling qualities.",
        co2PerYear: 3.8
    },
    lily: {
        name: "Lily",
        description: "Lilies are graceful flowers with a strong fragrance. They need regular watering and prefer temperatures of 18-23°C. Lilies can absorb approximately 4.6 kg of CO₂ annually and are known for their air-purifying abilities.",
        co2PerYear: 4.6
    },
    daisy: {
        name: "Daisy",
        description: "Daisies are cheerful, low-maintenance flowers. They require moderate watering and thrive in temperatures of 15-22°C. Daisies absorb about 3.2 kg of CO₂ per year and are perfect for beginners.",
        co2PerYear: 3.2
    }
};

// Generate historical data
function generateHistory() {
    const history = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
        const date = new Date(now - i * 12 * 60 * 60 * 1000); // Every 12 hours
        const waterAmount = (Math.random() * 0.4 + 0.3).toFixed(1);
        const before = Math.min(100, 30 + Math.random() * 50);
        const after = Math.min(100, before + 20 + Math.random() * 15);
        const temp = (20 + Math.random() * 6).toFixed(1);
        
        history.push({
            date: date.toLocaleString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            amount: waterAmount + 'L',
            before: before.toFixed(1) + '%',
            after: after.toFixed(1) + '%',
            temperature: temp + '°C',
            timestamp: date.getTime(),
            waterValue: parseFloat(waterAmount),
            afterValue: parseFloat(after)
        });
    }
    
    return history.reverse();
}

let wateringHistory = generateHistory();
let waterLevel = 68.4;
let temperature = 22.3;
let currentFlower = "";

// Initialize chart
let waterChart;
function initChart() {
    const ctx = document.getElementById('waterChart').getContext('2d');
    const labels = wateringHistory.slice(-12).map(h => h.date.split(',')[0]);
    const data = wateringHistory.slice(-12).map(h => h.waterValue * 1000); // Convert L to mL
    
    waterChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Water Consumed',
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(45, 80, 22, 0.9)',
                    padding: 12,
                    titleFont: {
                        family: 'Space Mono',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Crimson Pro',
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return 'Water Used: ' + context.parsed.y.toFixed(0) + ' mL';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' mL';
                        },
                        font: {
                            family: 'Space Mono',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(45, 80, 22, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Space Mono',
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update water display
function updateWaterDisplay() {
    const waterFill = document.getElementById('waterFill');
    const waterPercentage = document.getElementById('waterPercentage');
    const waterAlert = document.getElementById('waterAlert');
    
    waterFill.style.height = waterLevel + '%';
    waterPercentage.textContent = waterLevel.toFixed(1) + '%';
    
    if (waterLevel < 10) {
        waterAlert.classList.add('active');
    } else {
        waterAlert.classList.remove('active');
    }
}

// Update temperature display
function updateTemperature() {
    temperature = (20 + Math.random() * 6);
    document.getElementById('tempValue').textContent = temperature.toFixed(1) + '°C';
}

// Simulate water level changes from sensor
function simulateWaterUsage() {
    if (waterLevel > 5) {
        waterLevel = Math.max(0, waterLevel - (Math.random() * 1.5 + 0.5));
        updateWaterDisplay();
    }
}

// Update history table
function updateHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = wateringHistory.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.amount}</td>
            <td>${record.before}</td>
            <td>${record.after}</td>
            <td>${record.temperature}</td>
        </tr>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalWaterings = wateringHistory.length;
    const totalWater = wateringHistory.reduce((sum, record) => {
        return sum + record.waterValue;
    }, 0);
    
    document.getElementById('totalWaterings').textContent = totalWaterings;
    document.getElementById('totalWaterUsed').textContent = totalWater.toFixed(1) + 'L';
    
    const lastDate = new Date(wateringHistory[wateringHistory.length - 1].timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - lastDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
        document.getElementById('lastWatered').textContent = 'Recently';
    } else if (diffHours < 24) {
        document.getElementById('lastWatered').textContent = diffHours + 'h ago';
    } else {
        const diffDays = Math.floor(diffHours / 24);
        document.getElementById('lastWatered').textContent = diffDays + 'd ago';
    }
}

// Update flower information
function updateFlowerInfo() {
    const flowerName = document.getElementById('flowerName').value;
    const flowerInfo = document.getElementById('flowerInfo');
    
    if (flowerName && flowerData[flowerName]) {
        currentFlower = flowerName;
        const flower = flowerData[flowerName];
        document.getElementById('flowerTitle').textContent = flower.name;
        document.getElementById('flowerDescription').textContent = flower.description;
        flowerInfo.classList.add('active');
        
        // If room dimensions are already entered, recalculate CO2
        const length = parseFloat(document.getElementById('roomLength').value);
        const width = parseFloat(document.getElementById('roomWidth').value);
        const height = parseFloat(document.getElementById('roomHeight').value);
        if (length && width && height) {
            calculateCO2();
        }
    } else {
        currentFlower = "";
        flowerInfo.classList.remove('active');
    }
}

// Calculate CO2 reduction
function calculateCO2() {
    const length = parseFloat(document.getElementById('roomLength').value);
    const width = parseFloat(document.getElementById('roomWidth').value);
    const height = parseFloat(document.getElementById('roomHeight').value);
    
    if (!length || !width || !height) {
        alert('Please enter all room dimensions');
        return;
    }
    
    if (!currentFlower) {
        alert('Please select a plant type first');
        return;
    }
    
    const volume = length * width * height;
    const co2PerPlant = flowerData[currentFlower].co2PerYear;
    
    // CO2 is about 0.04% of air by volume, or about 0.06% by mass
    const airMass = volume * 1.2; // kg
    const co2InRoom = airMass * 0.0006; // kg (0.06% of air mass)
    
    document.getElementById('roomVolume').textContent = volume.toFixed(2);
    document.getElementById('co2Value').textContent = co2PerPlant.toFixed(1) + ' kg';
    document.getElementById('co2InRoom').textContent = co2InRoom.toFixed(3) + ' kg';
    document.getElementById('co2Result').classList.add('active');
}

// Initialize everything
updateWaterDisplay();
updateTemperature();
updateHistoryTable();
updateStats();
initChart();

// Simulate sensor readings
setInterval(simulateWaterUsage, 15000); // Water usage every 15 seconds
setInterval(updateTemperature, 20000); // Temperature update every 20 seconds
