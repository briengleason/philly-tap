/**
 * Locations Management
 * Handles loading and managing location data from YAML
 */

// Global location data (accessed by other modules)
let locations = [];
let currentDateString = '';
let usingDateSpecificLocations = false;

// Update date indicator display
function updateDateIndicator() {
    const dateDisplay = document.getElementById('date-display');
    const sourceDisplay = document.getElementById('location-source-display');
    
    if (currentDateString) {
        dateDisplay.textContent = formatDateForDisplay(currentDateString);
        
        if (usingDateSpecificLocations) {
            // Hide the source indicator when using date-specific locations
            sourceDisplay.textContent = '';
            sourceDisplay.className = 'location-source';
        } else {
            // Only show warning when using default locations
            sourceDisplay.textContent = `⚠ Using default locations (looking for: ${currentDateString})`;
            sourceDisplay.className = 'location-source using-default';
        }
    } else {
        dateDisplay.textContent = 'Date not loaded';
        sourceDisplay.textContent = '';
    }
}

// Load locations from YAML file
async function loadLocations() {
    try {
        const response = await fetch('config/locations.yaml');
        const yamlText = await response.text();
        
        // Use JSON schema to prevent js-yaml from auto-parsing dates
        const data = jsyaml.load(yamlText, { schema: jsyaml.JSON_SCHEMA });
        
        const today = getTodayDateString();
        currentDateString = today;
        
        // First try direct string match
        let foundLocations = null;
        let matchedKey = null;
        
        console.log(`Looking for date: "${today}"`);
        
        // Method 1: Direct string match (should work with JSON_SCHEMA)
        if (data[today] && Array.isArray(data[today])) {
            foundLocations = data[today];
            matchedKey = today;
            console.log(`✓ Found locations using direct string match`);
        } else {
            // Method 2: Fallback - iterate and compare
            const [year, month, day] = today.split('-').map(Number);
            
            for (const key of Object.keys(data)) {
                if (key === 'default') continue;
                
                // Try direct string comparison first
                if (key === today && Array.isArray(data[key])) {
                    foundLocations = data[key];
                    matchedKey = key;
                    console.log(`✓ Found locations using key iteration (string match)`);
                    break;
                }
                
                // Fallback: try parsing as date and comparing components
                try {
                    const keyDate = new Date(key);
                    if (!isNaN(keyDate.getTime())) {
                        const keyYear = keyDate.getFullYear();
                        const keyMonth = keyDate.getMonth() + 1;
                        const keyDay = keyDate.getDate();
                        
                        if (keyYear === year && keyMonth === month && keyDay === day && Array.isArray(data[key])) {
                            foundLocations = data[key];
                            matchedKey = key;
                            console.log(`✓ Found locations using date component match (key: "${key}")`);
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (!foundLocations) {
            console.log(`✗ No match found for "${today}"`);
            console.log(`  Available keys:`, Object.keys(data).filter(k => k !== 'default').slice(0, 5).join(', '), '...');
        }
        
        // Check if we found date-specific locations
        if (foundLocations) {
            locations = foundLocations;
            usingDateSpecificLocations = true;
            console.log(`✓ Loaded ${locations.length} date-specific locations for ${today} (matched key: ${matchedKey})`);
        } else if (data.default && Array.isArray(data.default)) {
            // Use default locations
            locations = data.default;
            usingDateSpecificLocations = false;
            console.log(`⚠ No date-specific locations found for ${today}, using default locations`);
        } else {
            throw new Error('No locations found in YAML file');
        }
        
        // Ensure all locations have IDs and preserve all fields (including description)
        locations = locations.map((loc, index) => ({
            ...loc,
            id: loc.id !== undefined ? loc.id : index
        }));
        
        // Update date indicator
        updateDateIndicator();
        
        // Initialize game after locations are loaded
        initializeGame();
    } catch (error) {
        console.error('Error loading locations:', error);
        trackError('location_load_failed', error.message);
        // Fallback to default locations if YAML fails
        currentDateString = getTodayDateString();
        usingDateSpecificLocations = false;
        locations = [
            {
                id: 0,
                name: 'Liberty Bell',
                coordinates: [39.9496, -75.1503],
                icon: '🔔'
            },
            {
                id: 1,
                name: 'Independence Hall',
                coordinates: [39.9489, -75.1500],
                icon: '🏛️'
            },
            {
                id: 2,
                name: 'Philadelphia Museum of Art',
                coordinates: [39.9656, -75.1809],
                icon: '🎨'
            },
            {
                id: 3,
                name: 'Reading Terminal Market',
                coordinates: [39.9531, -75.1584],
                icon: '🍕'
            },
            {
                id: 4,
                name: 'City Hall',
                coordinates: [39.9523, -75.1636],
                icon: '🏢'
            }
        ];
        // Update date indicator even on fallback
        updateDateIndicator();
        initializeGame();
    }
}
