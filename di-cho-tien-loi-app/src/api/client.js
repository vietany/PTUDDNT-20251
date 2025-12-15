import axios from 'axios';

const baseURL = 'http://192.168.1.212:5000/it4788/user';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
