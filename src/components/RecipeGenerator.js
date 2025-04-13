import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  CircularProgress, 
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { generateRecipe } from '../services/llmService';

const RecipeGenerator = ({ selectedItems, onClearSelection }) => {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const generatedRecipe = await generateRecipe(selectedItems);
      setRecipe(generatedRecipe);
    } catch (error) {
      setError('Failed to generate recipe. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    onClearSelection();
    setRecipe(null);
    setError(null);
  };

  if (selectedItems.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recipe Generator
        </Typography>
        <Alert severity="info">
          Select grocery items to generate recipe suggestions.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recipe Generator
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selected Items ({selectedItems.length}):
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedItems.map((item) => (
            <Chip 
              key={item.id} 
              label={`${item.name} ${item.price !== null && item.price !== undefined ? `($${item.price.toFixed(2)})` : ''}`} 
              color="primary" 
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGenerateRecipe}
          disabled={loading || selectedItems.length === 0}
          startIcon={<RestaurantIcon />}
        >
          Generate Recipe
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleClearAll}
          disabled={loading}
        >
          Clear Selection
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {recipe && !loading && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              {recipe.title}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Ingredients:
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Instructions:
            </Typography>
            <Typography variant="body1" component="div">
              {recipe.instructions.split('\n').map((step, index) => (
                <Typography key={index} paragraph>
                  {step}
                </Typography>
              ))}
            </Typography>
            
            {recipe.tips && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Tips:
                </Typography>
                <Typography variant="body1">
                  {recipe.tips}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default RecipeGenerator; 