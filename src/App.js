import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import GroceryFilters from './components/GroceryFilters';
import GroceryList from './components/GroceryList';
import RecipeGenerator from './components/RecipeGenerator';

function App() {
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleItemSelect = (item) => {
    setSelectedItems(prevItems => {
      const isAlreadySelected = prevItems.some(selected => selected.id === item.id);
      
      if (isAlreadySelected) {
        return prevItems.filter(selected => selected.id !== item.id);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header selectedItemsCount={selectedItems.length} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <GroceryFilters onFilterChange={handleFilterChange} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 2 }}>
            <GroceryList 
              filters={filters} 
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <RecipeGenerator 
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
