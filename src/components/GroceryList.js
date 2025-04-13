import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Pagination,
  Paper
} from '@mui/material';
import GroceryItem from './GroceryItem';
import { fetchGroceryItems } from '../services/api';

const GroceryList = ({ filters, selectedItems, onItemSelect }) => {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadGroceries = async () => {
      setLoading(true);
      try {
        // Add pagination to filters
        const paginatedFilters = {
          ...filters,
          page,
          limit: itemsPerPage
        };
        
        //const response = await fetchGroceryItems(paginatedFilters);
        const response = await fetchGroceryItems()
        setGroceries(response);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setError(null);
      } catch (error) {
        setError('Failed to load grocery items. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadGroceries();
  }, [filters, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemSelect = (item) => {
    onItemSelect(item);
  };

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (groceries.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No grocery items found matching your filters.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Available Grocery Items
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {groceries.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <GroceryItem 
              item={item} 
              onSelect={handleItemSelect}
              isSelected={selectedItems.some(selected => selected.id === item.id)}
            />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          size="large"
        />
      </Box>
    </Paper>
  );
};

export default GroceryList; 