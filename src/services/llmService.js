import axios from 'axios';

const LLM_API_URL = process.env.REACT_APP_LLM_API_URL || 'http://localhost:8000/api/v1/meal-planner';

export const generateRecipe = async (groceryItems) => {
  try {
    console.log('Generating recipe for items:', groceryItems);
    const response = await axios.post(`${LLM_API_URL}/generate-meals`, groceryItems);
    return response.data.recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}; 