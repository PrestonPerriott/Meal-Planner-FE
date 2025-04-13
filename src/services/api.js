import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:8000/api/v1/grocery';

export const fetchGroceryItems = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching grocery items:', error);
    throw error;
  }
};

export const fetchGroceryByBrand = async (brand) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/brand/${brand}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching grocery item by brand:', err);
        throw err;
    }   
}

export const fetchGroceryById = async (id) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/id/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching grocery Item by ID:', err);
        throw err;
    }
};

export const fetchGroceryByType = async (type) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/type/${type}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching grocery item by type:', err);
        throw err;
    }
}
export const fetchGroceryByName = async (name) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/name/${name}`);
        return res.data
    } catch (err) {
        console.error('Error fetching grocery item by name:', err)
        throw err
    }
}

export const fetchGroceryByChain = async (chain) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/chain/${chain}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching grocery item by chain:', err);
        throw err;
    }
}