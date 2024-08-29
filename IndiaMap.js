import React, { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useSpring, animated } from 'react-spring';
import indiaTopoJson from './india-topojson.json';

const IndiaMap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 1 });
  const [stateInfo, setStateInfo] = useState(null);

  const animationProps = useSpring({
    transform: hoveredState ? 'scale(1.2)' : 'scale(1)',
    config: { tension: 220, friction: 120 },
  });

  const handleStateClick = useCallback((geo) => {
    if (selectedState === geo.id) {
      setSelectedState(null);
      setStateInfo(null);
      setPosition({ coordinates: [78.9629, 22.5937], zoom: 1 });
    } else {
      setSelectedState(geo.id);
      setStateInfo(geo.properties);
      const { centroid } = geo.properties;
      setPosition({
        coordinates: centroid || [geo.properties.longitude, geo.properties.latitude],
        zoom: 4
      });
    }
  }, [selectedState]);

  const handleMoveEnd = useCallback((position) => {
    setPosition(position);
  }, []);

  return (
    <div style={{ width: '100%', height: '500px', display: 'flex' }}>
      <div style={{ width: '70%', height: '100%' }}>
        <ComposableMap projection="geoMercator">
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={indiaTopoJson}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <animated.g
                    key={geo.rsmKey}
                    onMouseEnter={() => setHoveredState(geo.id)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(geo)}
                    style={geo.id === hoveredState ? animationProps : {}}
                  >
                    <Geography
                      geography={geo}
                      fill={selectedState === geo.id ? "#D6D6DA" : "#D6D6DA"}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#F53", outline: "none" },
                        pressed: { fill: "#E42", outline: "none" },
                      }}
                    />
                  </animated.g>
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div style={{ width: '30%', padding: '10px', overflowY: 'auto' }}>
        {stateInfo ? (
          <div>
            <h2>{stateInfo.name || 'Unknown'}</h2>
            <p><strong>Type:</strong> {stateInfo.type_en || 'N/A'}</p>
            <p><strong>Region:</strong> {stateInfo.region || 'N/A'}</p>
            <p><strong>HASC Code:</strong> {stateInfo.code_hasc || 'N/A'}</p>
            <p><strong>Area:</strong> {stateInfo.area_sqkm ? `${stateInfo.area_sqkm} sq km` : 'N/A'}</p>
            <p><strong>Latitude:</strong> {stateInfo.latitude || 'N/A'}</p>
            <p><strong>Longitude:</strong> {stateInfo.longitude || 'N/A'}</p>
          </div>
        ) : (
          <p>Click on a state to view details</p>
        )}
      </div>
    </div>
  );
};

export default IndiaMap