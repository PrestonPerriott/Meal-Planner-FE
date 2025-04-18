import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Pagination,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroceryItem from './GroceryItem';
import { fetchGroceryItems } from '../services/api';

const GroceryList = ({ filters, selectedItems, onItemSelect }) => {
  // Store all grocery items
  const [allGroceries, setAllGroceries] = useState([]);
  // Store filtered grocery items based on current filters
  const [filteredGroceries, setFilteredGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChains, setExpandedChains] = useState({});
  
  // Pagination for each chain section
  const [chainPages, setChainPages] = useState({});
  const itemsPerPage = 10; // Items per page within each chain section

  // Load all grocery items once
  useEffect(() => {
    const loadAllGroceries = async () => {
      setLoading(true);
      try {
        // Check if we have cached data in localStorage
        const cachedData = localStorage.getItem('groceryItems');
        const cachedTimestamp = localStorage.getItem('groceryItemsTimestamp');
        const cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Use cached data if it exists and is not expired
        if (cachedData && cachedTimestamp && 
            (Date.now() - parseInt(cachedTimestamp)) < cacheExpiration) {
          console.log('Using cached grocery data');
          setAllGroceries(JSON.parse(cachedData));
        } else {
          console.log('Fetching fresh grocery data');
          const response = await fetchGroceryItems();
          setAllGroceries(response);
          
          // Cache the data
          localStorage.setItem('groceryItems', JSON.stringify(response));
          localStorage.setItem('groceryItemsTimestamp', Date.now().toString());
        }
        
        setError(null);
      } catch (error) {
        setError('Failed to load grocery items. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAllGroceries();
  }, []);

  // Apply filters whenever filters or allGroceries change
  useEffect(() => {
    if (allGroceries.length > 0) {
      let result = [...allGroceries];
      
      // Apply type filter
      if (filters.type) {
        result = result.filter(item => item.type === filters.type);
      }
      
      // Apply chain filter
      if (filters.chain) {
        result = result.filter(item => item.chain === filters.chain);
      }
      
      // Apply price range filter
      if (filters.priceRange && filters.priceRange.length === 2) {
        result = result.filter(item => 
          item.price !== null && 
          item.price >= filters.priceRange[0] && 
          item.price <= filters.priceRange[1]
        );
      }
      
      // Apply search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchLower) || 
          (item.type && item.type.toLowerCase().includes(searchLower))
        );
      }
      
      setFilteredGroceries(result);
      
      // Initialize pagination for each chain
      const chains = [...new Set(result.map(item => item.chain || 'Other'))];
      const initialChainPages = {};
      const initialExpandedState = {};
      
      chains.forEach(chain => {
        initialChainPages[chain] = 1;
        // If there's a chain filter, only expand that chain
        initialExpandedState[chain] = filters.chain ? chain === filters.chain : true;
      });
      
      setChainPages(initialChainPages);
      setExpandedChains(initialExpandedState);
    }
  }, [filters, allGroceries]);

  const handleItemSelect = (item) => {
    onItemSelect(item);
  };

  const handleAccordionChange = (chain) => (event, isExpanded) => {
    setExpandedChains({
      ...expandedChains,
      [chain]: isExpanded
    });
  };

  const handleChainPageChange = (chain) => (event, value) => {
    setChainPages({
      ...chainPages,
      [chain]: value
    });
  };

  // Group groceries by chain
  const groupedGroceries = filteredGroceries.reduce((groups, item) => {
    const chain = item.chain || 'Other';
    if (!groups[chain]) {
      groups[chain] = [];
    }
    groups[chain].push(item);
    return groups;
  }, {});

  // Get paginated items for a specific chain
  const getPaginatedItems = useCallback((chain) => {
    const items = groupedGroceries[chain] || [];
    const currentPage = chainPages[chain] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return items.slice(startIndex, endIndex);
  }, [groupedGroceries, chainPages, itemsPerPage]);

  if (loading && allGroceries.length === 0) {
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

  if (filteredGroceries.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No grocery items found matching your filters.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Available Grocery Items ({filteredGroceries.length})
      </Typography>
      
      {/* Collapsible sections by chain */}
      {Object.keys(groupedGroceries).map(chain => {
        const chainItems = groupedGroceries[chain];
        const totalPages = Math.ceil(chainItems.length / itemsPerPage);
        const paginatedItems = getPaginatedItems(chain);
        
        return (
          <Accordion 
            key={chain}
            expanded={expandedChains[chain] || false}
            onChange={handleAccordionChange(chain)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">{chain}</Typography>
                <Chip 
                  label={`${chainItems.length} items`} 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label={`${chainItems.filter(item => 
                    selectedItems.some(selected => selected.id === item.id)
                  ).length} selected`}
                  size="small"
                  color="secondary"
                  sx={{ display: selectedItems.length > 0 ? 'flex' : 'none' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Two-column grid layout for each chain */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                {paginatedItems.map((item) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      width: 'calc(50% - 12px)',
                      display: 'flex'
                    }}
                  >
                    <GroceryItem 
                      item={item} 
                      onSelect={handleItemSelect}
                      isSelected={selectedItems.some(selected => selected.id === item.id)}
                    />
                  </Box>
                ))}
              </Box>
              
              {/* Pagination for this chain section */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={chainPages[chain] || 1} 
                    onChange={handleChainPageChange(chain)} 
                    color="primary" 
                    size="medium"
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default GroceryList; 