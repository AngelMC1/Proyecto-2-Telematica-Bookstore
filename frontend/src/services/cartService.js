import axios from 'axios';

const API_URL = 'http://localhost:5003/api/cart';

export const cartService = {
  getCart: (userId) => axios.get(`${API_URL}/${userId}`),
  addToCart: (userId, bookId, quantity = 1) => 
    axios.post(`${API_URL}/${userId}/items`, { book_id: bookId, quantity }),
  addToCartWithData: (userId, cartItem) => 
    axios.post(`${API_URL}/${userId}/items`, cartItem),
  updateCartItem: (userId, bookId, quantity) =>
    axios.put(`${API_URL}/${userId}/items/${bookId}`, { quantity }),
  removeFromCart: (userId, bookId) =>
    axios.delete(`${API_URL}/${userId}/items/${bookId}`),
  clearCart: (userId) => axios.post(`${API_URL}/${userId}/clear`),
};
