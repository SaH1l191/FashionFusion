import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
const viewportHeight = window.innerHeight;
const offsetValue = viewportHeight * 0.25;
AOS.init({
  // Global settings:
  disable: false,
  startEvent: 'DOMContentLoaded',
  initClassName: 'aos-init',
  animatedClassName: 'aos-animate',
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,


  offset: offsetValue,
  delay: 0,
  duration: 800,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(

  
    <BrowserRouter>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}> 
          <Toaster />
          <ToastContainer />
          <App /> 
          <ReactQueryDevtools  initialIsOpen={false} />
        </QueryClientProvider>
        
      </TooltipProvider>

    </BrowserRouter>



)
