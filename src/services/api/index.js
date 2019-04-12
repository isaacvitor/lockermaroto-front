import axios from 'axios';
const base_api = process.env.REACT_APP_BASE_API;

export const http = axios.create({
  baseURL: base_api
});
