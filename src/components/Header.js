import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Badge, 
  IconButton,
  Tooltip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const Header = ({ selectedItemsCount }) => {
  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Recipe Finder
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Selected Items">
            <IconButton color="inherit">
              <Badge badgeContent={selectedItemsCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 