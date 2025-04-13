import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  CardActions, 
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const GroceryItem = ({ item, onSelect, isSelected }) => {
  const { name, type, chain, price, unit } = item;

  // Format price safely, handling null or undefined values
  const formattedPrice = price !== null && price !== undefined 
    ? `$${price.toFixed(2)}${unit ? `/${unit}` : ''}` 
    : 'Price not available';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: isSelected ? '2px solid #4caf50' : 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" gutterBottom>
            {name}
          </Typography>
          <Tooltip title="View details">
            <IconButton size="small">
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={type} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={chain} 
            size="small" 
            color="secondary" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="h5" color="text.primary">
          {formattedPrice}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          variant={isSelected ? "contained" : "outlined"}
          color={isSelected ? "secondary" : "primary"}
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onSelect(item)}
          fullWidth
        >
          {isSelected ? 'Selected' : 'Select Item'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default GroceryItem; 