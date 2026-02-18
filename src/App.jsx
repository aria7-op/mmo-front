import Routers from './Routers';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import ScrollUpBtn from './components/others/ScrollUpBtn';
import CookieConsent from './components/legal/CookieConsent';
import ScriptManager from './components/legal/ScriptManager.jsx';
import { PageSettingsProvider } from './context/PageSettingsContext.jsx';
import { DecryptedPathProvider } from './context/DecryptedPathContext.jsx';
import ChatWidget from './components/common/ChatWidget';
import { backfillFocusAreasStatus, getAuthToken } from './services/auth.service';

import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '@fortawesome/fontawesome-free/css/all.css';
import 'swiper/css/bundle';
import 'react-rangeslider/lib/index.css'
import 'photoswipe/dist/photoswipe.css'
import '../src/assets/css/progress-circle.css'
import '../src/assets/css/main.css'
import '../src/assets/css/responsive.css'

function App() {
  // Initialize background tasks on app start (no blocking preloader)
  useEffect(() => {
    const token = getAuthToken();
    backfillFocusAreasStatus(token)
      .catch(error => {
        // Silently handle background task error
      });
  }, [])

  return (
    <PageSettingsProvider>
      <DecryptedPathProvider>
        <div>
          <Helmet>
            <link rel="shortcut icon" href="favicon.ico"></link>
          </Helmet>
          <Routers />
          <ToastContainer />
          <ScrollUpBtn />
          <CookieConsent />
          <ScriptManager ga4MeasurementId={import.meta.env.VITE_GA4_MEASUREMENT_ID} />
          <ChatWidget />
        </div>
      </DecryptedPathProvider>
    </PageSettingsProvider>
  )
}

export default App
