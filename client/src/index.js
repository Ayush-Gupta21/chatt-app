import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Routes';
import axios from 'axios';
import { renewAccessTokenRoute } from './utils/APIRoutes';
import { ToastContainer } from 'react-toastify';

axios.interceptors.response.use(response => {
  return response
}, async (error) => {
  if(error.response.status === 403) {
    const res = await axios.post(renewAccessTokenRoute , {}, {withCredentials: true})
    if(res.status === 200) {
      return await axios({
        method: error.config.method,
        url: error.config.url,
        data: error.config.data,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
    }
  }
  return Promise.reject(error)
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);