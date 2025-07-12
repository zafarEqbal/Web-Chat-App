import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'react-hot-toast'
import axios from 'axios'
import  store  from './Redux/store.js'

import { Provider } from 'react-redux'
// axios.defaults.baseURL = 'http://192.168.1.9:3000'  // use your PC IP here
axios.defaults.withCredentials = true 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    <Toaster/>
    </Provider>
    
  </StrictMode>,
)
