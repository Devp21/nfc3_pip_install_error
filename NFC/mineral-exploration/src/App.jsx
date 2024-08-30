import React, { useState } from 'react';
import MapChart from './components/MapChart';
import StateChart from './components/StateChart';
import SearchBar from './components/SearchBar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './App.css';
import Chatbot from './components/Chatbot';

const App = () => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [stateName, setStateName] = useState('');
  const [showDistrict, setShowDistrict] = useState(false);
  const [districtName, setDistrictName] = useState('');

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="map-side">
          {!showDistrict ? (
            <MapChart
              setTooltipContent={setTooltipContent}
              setStateName={setStateName}
              setShowDistrict={setShowDistrict}
            />
          ) : (
            <StateChart
              setTooltipContent={setTooltipContent}
              setDistrictName={setDistrictName}
              selectedState={stateName}
            />
          )}
        </div>
        
        <div className="search-side">
          <SearchBar />
        </div>
      </div>
      
      <div className="chat-container">
        <Chatbot />
      </div>
      
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default App;
