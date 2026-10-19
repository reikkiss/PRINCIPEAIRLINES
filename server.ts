import express from 'express';

const app = express();
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

// Proxy endpoint for airport lookup
app.get('/api/airport-lookup', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try {
    const url = `https://airportsapi.com/v1/airports?search=${encodeURIComponent(city as string)}`;
    console.log('Fetching from:', url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching airport data:', error);
    res.status(500).json({ error: 'Failed to fetch airport data', details: error instanceof Error ? error.message : String(error) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
