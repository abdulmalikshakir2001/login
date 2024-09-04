import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this is the correct base URL
  withCredentials: true // if you are using cookies
});

export default instance;
