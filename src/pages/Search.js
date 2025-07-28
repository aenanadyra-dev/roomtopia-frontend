import { useState } from 'react';
import { Container, Typography, Paper, Grid, Slider, FormControlLabel, Checkbox, Button, Chip } from '@mui/material';
import { Search as SearchIcon, FilterAlt as FilterIcon } from '@mui/icons-material';

export default function Search() {
  const [priceRange, setPriceRange] = useState([300, 1000]);
  const [filters, setFilters] = useState({
    smoking: false,
    pets: false,
    gender: '',
    studyHabits: '',
  });

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Find Your Perfect Room
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography gutterBottom>Price Range (RM)</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={200}
              max={2000}
              step={50}
            />
            <Typography variant="body2">
              {priceRange[0]} - {priceRange[1]}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography gutterBottom>Preferences</Typography>
            <FormControlLabel
              control={<Checkbox checked={filters.smoking} onChange={() => setFilters({...filters, smoking: !filters.smoking})} />}
              label="Non-smoking"
            />
            <FormControlLabel
              control={<Checkbox checked={filters.pets} onChange={() => setFilters({...filters, pets: !filters.pets})} />}
              label="Pet-friendly"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" startIcon={<SearchIcon />} fullWidth sx={{ height: 56 }}>
              Search
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" startIcon={<FilterIcon />} fullWidth sx={{ height: 56 }}>
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Search Results */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Available Listings
      </Typography>
      
      {/* Map through search results here */}
    </Container>
  );
}