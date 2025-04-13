import axios from 'axios';

const LLM_API_URL = process.env.REACT_APP_LLM_API_URL || 'http://localhost:3001/api/llm';

export const generateRecipe = async (groceryItems) => {
  try {
    const response = await axios.post(`${LLM_API_URL}/generate-recipe`, { groceryItems });
    return response.data.recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}; 