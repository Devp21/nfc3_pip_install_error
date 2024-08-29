import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

// Import TopoJSON files for all Indian states
import andamannicobar from '../topojsons/states/andamannicobar.json';
import andhrapradesh from '../topojsons/states/andhrapradesh.json';
import arunachalpradesh from '../topojsons/states/arunachalpradesh.json';
import assam from '../topojsons/states/assam.json';
import bihar from '../topojsons/states/bihar.json';
// import chandigarh from '../topojsons/states/chandigarh.json';
import chhattisgarh from '../topojsons/states/chhattisgarh.json';
// import dadraandnagarhaveli from '../topojsons/states/dadraandnagarhaveli.json';
// import damananddiu from '../topojsons/states/damananddiu.json';
import delhi from '../topojsons/states/delhi.json';
import goa from '../topojsons/states/goa.json';
import gujarat from '../topojsons/states/gujarat.json';
import haryana from '../topojsons/states/haryana.json';
import himachalpradesh from '../topojsons/states/himachalpradesh.json';
// import jammuandkashmir from '../topojsons/states/jammuandkashmir.json';
import jharkhand from '../topojsons/states/jharkhand.json';
import karnataka from '../topojsons/states/karnataka.json';
import kerala from '../topojsons/states/kerala.json';
// import ladakh from '../topojsons/states/ladakh.json';
import lakshadweep from '../topojsons/states/lakshadweep.json';
import madhyapradesh from '../topojsons/states/madhyapradesh.json';
import maharashtra from '../topojsons/states/maharashtra.json';
import manipur from '../topojsons/states/manipur.json';
import meghalaya from '../topojsons/states/meghalaya.json';
import mizoram from '../topojsons/states/mizoram.json';
import nagaland from '../topojsons/states/nagaland.json';
import odisha from '../topojsons/states/odisha.json';
// import puducherry from '../topojsons/states/puducherry.json';
import punjab from '../topojsons/states/punjab.json';
import rajasthan from '../topojsons/states/rajasthan.json';
import sikkim from '../topojsons/states/sikkim.json';
import tamilnadu from '../topojsons/states/tamilnadu.json';
import telangana from '../topojsons/states/telangana.json';
import tripura from '../topojsons/states/tripura.json';
import uttarpradesh from '../topojsons/states/uttarpradesh.json';
import uttarakhand from '../topojsons/states/uttarakhand.json';
import westbengal from '../topojsons/states/westbengal.json';

const StateChart = ({ setTooltipContent, setDistrictName, selectedState }) => {
  let geoURL;
  let zoomMap = 1;
  let centerMap = [80, 22];
  let scaleMap = 400;

  // Choose the right TopoJSON based on the selected state
  switch (selectedState) {
    case 'Andaman & Nicobar Island':
      geoURL = andamannicobar;
      scaleMap = 1000;
      centerMap = [93, 10];
      break;
    case 'Andhra Pradesh':
      geoURL = andhrapradesh;
      scaleMap = 800;
      centerMap = [80, 17];
      break;
    case 'Arunachal Pradesh':
      geoURL = arunachalpradesh;
      scaleMap = 800;
      centerMap = [94, 28];
      break;
    case 'Assam':
      geoURL = assam;
      scaleMap = 900;
      centerMap = [92, 26];
      break;
    case 'Bihar':
      geoURL = bihar;
      scaleMap = 900;
      centerMap = [85, 25];
      break;
   
    case 'Chhattisgarh':
      geoURL = chhattisgarh;
      scaleMap = 800;
      centerMap = [82, 21];
      break;
  
    case 'Delhi':
      geoURL = delhi;
      scaleMap = 1500;
      centerMap = [77.1, 28.6];
      break;
    case 'Goa':
      geoURL = goa;
      scaleMap = 1500;
      centerMap = [74, 15.4];
      break;
    case 'Gujarat':
      geoURL = gujarat;
      scaleMap = 700;
      centerMap = [71.5, 23];
      break;
    case 'Haryana':
      geoURL = haryana;
      scaleMap = 1000;
      centerMap = [76, 29];
      break;
    case 'Himachal Pradesh':
      geoURL = himachalpradesh;
      scaleMap = 1000;
      centerMap = [77, 32];
      break;
    // case 'Jammu and Kashmir':
    //   geoURL = jammuandkashmir;
    //   scaleMap = 600;
    //   centerMap = [75, 33];
    //   break;
    case 'Jharkhand':
      geoURL = jharkhand;
      scaleMap = 800;
      centerMap = [85, 23.5];
      break;
    case 'Karnataka':
      geoURL = karnataka;
      scaleMap = 700;
      centerMap = [76, 15];
      break;
    case 'Kerala':
      geoURL = kerala;
      scaleMap = 900;
      centerMap = [76.5, 10];
      break;
    case 'Ladakh':
      geoURL = ladakh;
      scaleMap = 400;
      centerMap = [78, 34];
      break;
    case 'Lakshadweep':
      geoURL = lakshadweep;
      scaleMap = 1500;
      centerMap = [73, 10];
      break;
    case 'Madhya Pradesh':
      geoURL = madhyapradesh;
      scaleMap = 700;
      centerMap = [78, 23];
      break;
    case 'Maharashtra':
      geoURL = maharashtra;
      scaleMap = 700;
      centerMap = [75, 19];
      break;
    case 'Manipur':
      geoURL = manipur;
      scaleMap = 1000;
      centerMap = [94, 24.5];
      break;
    case 'Meghalaya':
      geoURL = meghalaya;
      scaleMap = 1000;
      centerMap = [91, 25.5];
      break;
    case 'Mizoram':
      geoURL = mizoram;
      scaleMap = 1000;
      centerMap = [92.5, 23];
      break;
    case 'Nagaland':
      geoURL = nagaland;
      scaleMap = 1000;
      centerMap = [94, 26];
      break;
    case 'Odisha':
      geoURL = odisha;
      scaleMap = 800;
      centerMap = [85, 20];
      break;
    case 'Puducherry':
      geoURL = puducherry;
      scaleMap = 1500;
      centerMap = [79.8, 11.9];
      break;
    case 'Punjab':
      geoURL = punjab;
      scaleMap = 900;
      centerMap = [75, 30.5];
      break;
    case 'Rajasthan':
      geoURL = rajasthan;
      scaleMap = 600;
      centerMap = [73, 26];
      break;
    case 'Sikkim':
      geoURL = sikkim;
      scaleMap = 1200;
      centerMap = [88.5, 27.3];
      break;
    case 'Tamil Nadu':
      geoURL = tamilnadu;
      scaleMap = 800;
      centerMap = [78, 11];
      break;
    case 'Telangana':
      geoURL = telangana;
      scaleMap = 800;
      centerMap = [79, 18];
      break;
      case 'Tripura':
        geoURL = tripura;
        scaleMap = 1000;
        centerMap = [91.3, 23.8];
        break;
      case 'Uttar Pradesh':
        geoURL = uttarpradesh;
        scaleMap = 700;
        centerMap = [80.5, 25.5];
        break;
      case 'Uttarakhand':
        geoURL = uttarakhand;
        scaleMap = 1000;
        centerMap = [78, 30];
        break;
      case 'West Bengal':
        geoURL = westbengal;
        scaleMap = 800;
        centerMap = [87, 22];
        break;
      default:
        geoURL = {}; // Default empty object or handle the case where no state is selected
    }
  
    return (
      <ComposableMap data-tip="" projection="geoMercator" width={800} height={600} projectionConfig={{ scale: scaleMap }}>
        <ZoomableGroup zoom={zoomMap} center={centerMap}>
          <Geographies geography={geoURL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { district } = geo.properties;
                    setTooltipContent(`${district}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={() => {
                    const { district } = geo.properties;
                    setDistrictName(`${district}`);
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none"
                    },
                    hover: {
                      fill: "forestgreen",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#2E8B57",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    );
  };
  
  export default StateChart;
  