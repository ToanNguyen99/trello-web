import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import theme from '~/theme.js'
// use Toastify library để hiển thị popup thông báo nhanh
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer
      position='top-right'
      autoClose={2000}
      hideProgressBar={true}
      limit={3}
    />
  </CssVarsProvider>
)
