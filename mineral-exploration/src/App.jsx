import React, { useState } from 'react';
import MapChart from './components/MapChart';
import StateChart from './components/StateChart';
// import { Tooltip } from 'react-tooltip';
import { Tooltip as ReactTooltip } from 'react-tooltip';


const App = () => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [stateName, setStateName] = useState('');
  const [showDistrict, setShowDistrict] = useState(false);
  const [districtName, setDistrictName] = useState('');

  return (
    <div>
      {!showDistrict ? (
        <MapChart setTooltipContent={setTooltipContent} setStateName={setStateName} setShowDistrict={setShowDistrict} />
      ) : (
        <StateChart setTooltipContent={setTooltipContent} setDistrictName={setDistrictName} selectedState={stateName} />
      )}
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default App;
