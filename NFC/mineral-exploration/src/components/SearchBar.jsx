import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const SearchBar = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to generate a random prediction
  const getRandomPrediction = () => {
    const predictions = ["Minerals found", "Minerals not found"];
    const randomIndex = Math.floor(Math.random() * predictions.length);
    return predictions[randomIndex];
  };

  // Function to generate a random probability between 80 and 90
  const getRandomProbability = () => {
    return Math.floor(Math.random() * (90 - 80 + 1)) + 80;
  };

  // Handle the search action
  const handleSearch = () => {
    setError("");
    setResult(null);

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Basic validation for India's latitude and longitude ranges
    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid numerical values for latitude and longitude.");
      return;
    }

    if (lat < 8.4 || lat > 37.6 || lon < 68.1 || lon > 97.4) {
      setError("Latitude and Longitude must be within India's range.");
      return;
    }

    setLoading(true);

    // Set result using random values
    setResult({
      prediction: getRandomPrediction(),
      probability: getRandomProbability()
    });

    setLoading(false);
  };

  return (
    <div className="search-bar-container">
      <Card>
        <CardContent>
          <Typography variant="h6">Search by Coordinates</Typography>
          <TextField
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            fullWidth
            margin="normal"
          />
          <label>
            India's latitude and longitude range is: <br />
            Latitude: 8° 4' N to 37° 6' N  <br />
            Longitude: 68° 7' E to 97° 25' E <br />
          </label>
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" color="black" onClick={handleSearch} disabled={loading}>
            Search
          </Button>
        </CardContent>
      </Card>

      {loading && <CircularProgress />}

      {result && (
        <Card className="result-card">
          <CardContent>
            <Typography variant="h6">Prediction Result</Typography>
            <Typography variant="body2">Prediction: {result.prediction}</Typography>
            <Typography variant="body2">Probability: {result.probability}%</Typography>
            <Typography variant="body2">Nearby Deposits: Not Known</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
