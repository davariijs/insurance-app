import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://assignment.devotel.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
