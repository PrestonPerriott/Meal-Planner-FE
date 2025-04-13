import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Slider, 
  Typography, 
  Button,
  Chip,
  Paper
} from '@mui/material';
import { fetchGroceryByChain, fetchGroceryByType } from '../services/api';

const GroceryFilters = ({ onFilterChange }) => {
  const [chains, setChains] = useState([]);
  const [types, setTypes] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    chain: '',
    priceRange: [0, 50],
    searchTerm: '',
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const chainsData = await fetchGroceryByChain();
        const typesData = await fetchGroceryByType();
        setChains(chainsData);
        setTypes(typesData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters({
      ...filters,
      priceRange: newValue,
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      chain: '',
      priceRange: [0, 50],
      searchTerm: '',
    });
    onFilterChange({});
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter Grocery Items
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Store Chain</InputLabel>
          <Select
            value={filters.chain}
            onChange={handleFilterChange('chain')}
            label="Store Chain"
          >
            <MenuItem value="">All Chains</MenuItem>
            {chains.map((chain) => (
              <MenuItem key={chain} value={chain}>
                {chain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Food Type</InputLabel>
          <Select
            value={filters.type}
            onChange={handleFilterChange('type')}
            label="Food Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          variant="outlined"
          value={filters.searchTerm}
          onChange={handleFilterChange('searchTerm')}
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={50}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">${filters.priceRange[0]}</Typography>
          <Typography variant="body2">${filters.priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>

      {/* Active filters display */}
      {(filters.type || filters.chain || filters.searchTerm || 
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 50)) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Active Filters:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.type && (
              <Chip label={`Type: ${filters.type}`} onDelete={() => {
                setFilters({...filters, type: ''});
              }} />
            )}
            {filters.chain && (
              <Chip label={`Chain: ${filters.chain}`} onDelete={() => {
                setFilters({...filters, chain: ''});
              }} />
            )}
            {filters.searchTerm && (
              <Chip label={`Search: ${filters.searchTerm}`} onDelete={() => {
                setFilters({...filters, searchTerm: ''});
              }} />
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50) && (
              <Chip label={`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`} onDelete={() => {
                setFilters({...filters, priceRange: [0, 50]});
              }} />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default GroceryFilters; 