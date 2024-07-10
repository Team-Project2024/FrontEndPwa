import React, { useState } from 'react';

// Provided JSON string
const jsonData = `{"content":"잘 나옴","table":"school_location","data":"[{\\"category\\":\\"학교관련시설\\",\\"locationName\\":\\"교육문화관\\",\\"lat\\":\\"36.73754469\\",\\"lon\\":\\"127.0777794\\"}, {\\"category\\":\\"학교관련시설\\",\\"locationName\\":\\"벤처산학협력관\\",\\"lat\\":\\"36.73705343\\",\\"lon\\":\\"127.0780196\\"}]"} `;

const MapTestComponent = () => {
  const [maps, setMaps] = useState([]);

  const handleMapOpen = (data) => {
    try {
      // First parsing
      const parsedData = JSON.parse(data);
      console.log('Parsed Data:', parsedData);
      
      // Extract and clean the 'data' string
      const cleanedData = parsedData.data.replace(/\\/g, '');
      console.log('Cleaned Data:', cleanedData);
      
      // Remove surrounding quotes and wrap in square brackets
      const validData = `[${cleanedData.substring(1, cleanedData.length - 1)}]`;
      console.log('Valid Data:', validData);
      
      // Second parsing
      let locations;
      try {
        locations = JSON.parse(validData);
        console.log('Locations:', locations);
      } catch (parseError) {
        console.error('Parsing validData failed:', parseError);
        return;
      }

      // Extract coordinates
      const coordinates = locations.map(item => ({
        name: item.locationName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      setMaps(coordinates);
    } catch (error) {
      console.error('Error parsing map data:', error);
    }
  };

  return (
    <div>
      <h1>Map Test Component</h1>
      <button onClick={() => handleMapOpen(jsonData)}>Open Map Data</button>
      {maps.length > 0 && (
        <div>
          <h2>Locations:</h2>
          <ul>
            {maps.map((location, index) => (
              <li key={index}>
                {location.name}: ({location.lat}, {location.lng})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapTestComponent;
