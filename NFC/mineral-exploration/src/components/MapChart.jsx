import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import india from "../topojsons/india.json";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import './MapChart.css';
import axios from 'axios';

const MapChart = ({ setTooltipContent, setStateName, setShowDistrict }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStateClick = async (ST_NM) => {
    setSelectedState(ST_NM);
    setStateName(ST_NM);
    setShowDistrict(false);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/state_charts/${ST_NM}`, {
        responseType: 'blob'
      });

      const url = URL.createObjectURL(response.data);
      setImageURL(url);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching state data:", error);
      setImageURL(null);
      setLoading(false);
    }
  };

  return (
    <div className="map-chart-container">
      <ComposableMap
        data-tip=""
        projection="geoMercator"
        width={800}
        height={600}
        projectionConfig={{ scale: 1000, center: [80, 22] }}
        style={{ backgroundColor: "#282c34" }}
      >
        <Geographies geography={india}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  const { ST_NM } = geo.properties;
                  setTooltipContent(`${ST_NM}`);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                onClick={() => {
                  const { ST_NM } = geo.properties;
                  handleStateClick(ST_NM);
                }}
                className="geography-hover"
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {selectedState && (
        <div className="card-popup">
          {loading ? (
            <CircularProgress />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h5">{selectedState}</Typography>
                {imageURL ? (
                  <img src={imageURL} alt={`${selectedState} data`} style={{ width: '100%', height: 'auto' }} />
                ) : (
                  <Typography variant="body2">No data available.</Typography>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MapChart;