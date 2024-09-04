// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Base URL pointing to the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
