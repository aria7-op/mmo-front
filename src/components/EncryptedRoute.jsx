import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getOriginalPath } from '../utils/urlEncryption';
import NotFound from '../pages/NotFound';
import HomeOne from '../pages/HomeOne';
import About from '../pages/About';
import MissionVisionPage from '../pages/about/MissionVisionPage';
import OrganizationProfilePage from '../pages/about/OrganizationProfilePage';
import StrategicUnitsPage from '../pages/about/StrategicUnitsPage';
import BoardDirectorsPage from '../pages/about/BoardDirectorsPage';
import ExecutiveTeamPage from '../pages/about/ExecutiveTeamPage';
import OrgStructurePage from '../pages/about/OrgStructurePage';
import Team from '../pages/Team';
import Volunteers from '../pages/Volunteers';
import WhatWeDo from '../pages/WhatWeDo';
import FocusAreas from '../pages/what-we-do/FocusAreas';
import GeographicCoverage from '../pages/what-we-do/GeographicCoverage';
import FocusAreaDetail from '../pages/what-we-do/FocusAreaDetail';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import DynamicProgramPage from '../components/programs/DynamicProgramPage';
import Resources from '../pages/Resources';
import NewsEvents from '../pages/NewsEvents';
import NewsEventDetails from '../pages/NewsEventDetails';
import NewsDetails from '../pages/NewsDetails';
import EventDetailsClassic from '../pages/EventDetailsClassic';
import EventDetails from '../pages/EventDetails';
import ReportsPublications from '../pages/ReportsPublications';
import AnnualReports from '../pages/AnnualReports';
import SuccessStories from '../pages/SuccessStories';
import SuccessStoryDetails from '../pages/SuccessStoryDetails';
import Certificates from '../pages/Certificates';
import CaseStudies from '../pages/CaseStudies';
import CaseStudyDetails from '../pages/CaseStudyDetails';
import CompetencyDetail from '../pages/CompetencyDetail';
import Competencies from '../pages/Competencies';
import Stakeholders from '../pages/Stakeholders';
import RFQRFP from '../pages/RFQRFP';
import Policies from '../pages/Policies';
import Jobs from '../pages/Jobs';
import TermsOfUse from '../pages/TermsOfUse';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import CookiesSettingsPage from '../pages/CookiesSettings';
import EthicsCompliance from '../pages/EthicsCompliance';
import ComplaintsFeedback from '../pages/ComplaintsFeedback';
import EventSidebar from '../pages/EventSidebar';
import EventFull from '../pages/EventFull';
import CauseList from '../pages/CauseList';
import Cause2Column from '../pages/Cause2Column';
import Cause3Column from '../pages/Cause3Column';
import CauseDetails from '../pages/CauseDetails';
import GalleryFull from '../pages/GalleryFull';
import Gallery3Column from '../pages/Gallery3Column';
import Gallery4Column from '../pages/Gallery4Column';
import GalleryDetail from '../pages/GalleryDetail';
import BlogClassic from '../pages/BlogClassic';
import Blog2Column from '../pages/Blog2Column';
import Blog3Column from '../pages/Blog3Column';
import BlogDetails from '../pages/BlogDetails';
import VolunteerPage from '../pages/VolunteerPage';
import Donation from '../pages/Donation';
import Account from '../pages/Account';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import CheckOut from '../pages/CheckOut';
import ContactUs from '../pages/Contact';
import SearchResults from '../pages/SearchResults';

// Complete route mapping matching Routers.jsx
const routeMap = {
    '/': HomeOne,
    '/about': About,
    '/about/coverage-area': About,
    '/about/mission-vision': MissionVisionPage,
    '/about/organization-profile': OrganizationProfilePage,
    '/about/strategic-units': StrategicUnitsPage,
    '/about/board-directors': BoardDirectorsPage,
    '/about/executive-team': ExecutiveTeamPage,
    '/about/organizational-structure': OrgStructurePage,
    '/about/team': Team,
    '/about/volunteers': Volunteers,
    '/what-we-do': WhatWeDo,
    '/what-we-do/focus-areas': FocusAreas,
    '/what-we-do/geographic-coverage': GeographicCoverage,
    '/projects': Projects,
    '/programs': DynamicProgramPage,
    '/resources': Resources,
    '/resources/news-events': NewsEvents,
    '/resources/reports': ReportsPublications,
    '/resources/annual-reports': AnnualReports,
    '/resources/success-stories': SuccessStories,
    '/resources/certificates': Certificates,
    '/resources/case-studies': CaseStudies,
    '/competencies': Competencies,
    '/stakeholders': Stakeholders,
    '/resources/rfq-rfp': RFQRFP,
    '/resources/policies': Policies,
    '/resources/jobs': Jobs,
    '/terms-of-use': TermsOfUse,
    '/privacy-policy': PrivacyPolicy,
    '/cookies-settings': CookiesSettingsPage,
    '/ethics-compliance': EthicsCompliance,
    '/complaints-feedback': ComplaintsFeedback,
    '/event-sidebar': EventSidebar,
    '/event-full': EventFull,
    '/event-details': EventDetails,
    '/cause-list': CauseList,
    '/cause-2': Cause2Column,
    '/cause-3': Cause3Column,
    '/cause-details': CauseDetails,
    '/gallery-full': GalleryFull,
    '/gallery3-column': Gallery3Column,
    '/gallery4-column': Gallery4Column,
    '/gallery': GalleryDetail,
    '/blog-classic': BlogClassic,
    '/blog-2': Blog2Column,
    '/blog-3': Blog3Column,
    '/blog-details': BlogDetails,
    '/volunteer': VolunteerPage,
    '/donation': Donation,
    '/account': Account,
    '/shop': Shop,
    '/product-details': ProductDetails,
    '/cart': Cart,
    '/check-out': CheckOut,
    '/contact': ContactUs,
    '/search': SearchResults,
    // Additional routes for dynamic paths
    '/news': NewsDetails,
    '/events': EventDetailsClassic,
    '/resources/events': EventDetails,
    '/resources/procurements': RFQRFP,
    '/resources/tenders': RFQRFP,
    '/resources/rfp': RFQRFP,
    '/resources/rfq': RFQRFP,
};

const EncryptedRoute = () => {
  const location = useLocation();
  const [originalPath, setOriginalPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname;
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    
    console.log('🌐 EncryptedRoute useEffect - Current path:', path);
    console.log('🌐 EncryptedRoute useEffect - Window location:', fullPath);
    console.log('🌐 EncryptedRoute useEffect - Window pathname:', window.location.pathname);
    console.log('🌐 EncryptedRoute useEffect - Document URL:', document.URL);
    
    if (path.startsWith('/e/')) {
      console.log('🔐 EncryptedRoute - Processing encrypted URL');
      try {
        const decrypted = getOriginalPath(path);
        console.log('🔓 EncryptedRoute - Decrypted to:', decrypted);
        setOriginalPath(decrypted);
      } catch (error) {
        console.error('❌ Error decrypting route:', error);
        setOriginalPath('/not-found');
      }
    } else {
      console.log('📝 EncryptedRoute - Regular URL, not encrypted');
      setOriginalPath(path);
    }
    
    setLoading(false);
  }, [location.pathname]);

  // Add global URL change listener
  useEffect(() => {
    const handleUrlChange = () => {
      console.log('🔄 URL changed:', window.location.pathname);
      console.log('🔄 Full URL:', window.location.href);
    };

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange);
    
    // Also listen for pushstate/replacestate
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      console.log('🔄 pushState called:', args);
      handleUrlChange();
      return originalPushState.apply(window.history, args);
    };
    
    window.history.replaceState = function(...args) {
      console.log('🔄 replaceState called:', args);
      handleUrlChange();
      return originalReplaceState.apply(window.history, args);
    };

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #0A4F9D',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6c757d', margin: 0 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!originalPath) {
    return <NotFound />;
  }

  console.log('🔍 EncryptedRoute - Current location pathname:', location.pathname);
  console.log('🔍 EncryptedRoute - Original path:', originalPath);
  console.log('🔍 EncryptedRoute - Window location:', window.location.pathname);

// Log all available routes in routeMap for debugging
console.log('🔍 Available routes in routeMap:', Object.keys(routeMap));

// Wrapper component to preserve encrypted URL
const EncryptedRouteWrapper = ({ Component }) => {
  return <Component />;
};

// Handle dynamic routes with parameters
if (originalPath.includes('/projects/') || originalPath.includes('/programs/') || 
      originalPath.includes('/resources/') || originalPath.includes('/what-we-do/') ||
      originalPath.includes('/about/') || originalPath.includes('/competencies/') ||
      originalPath.includes('/gallery/') || originalPath.includes('/news/') ||
      originalPath.includes('/events/') || originalPath.includes('/blog-')) {
    
    // Extract the base path and parameters
    const pathParts = originalPath.split('/');
    const basePath = '/' + pathParts.slice(0, -1).join('/');
    console.log('🔍 Dynamic route - Base path:', basePath);
    
    const Component = routeMap[basePath];
    console.log('🔍 Dynamic route - Component found:', !!Component);
    
    if (Component) {
      // Render the component through a wrapper to preserve encrypted URL
      return <EncryptedRouteWrapper Component={Component} />;
    }
  }
  
  // Handle static routes
  const Component = routeMap[originalPath];
  console.log('🔍 Static route - Path:', originalPath, 'Component found:', !!Component);
  
  if (Component) {
    // Render the component through a wrapper to preserve encrypted URL
    return <EncryptedRouteWrapper Component={Component} />;
  }
  
  console.log('❌ No component found for path:', originalPath);
  console.log('❌ Available static routes:', Object.keys(routeMap).filter(key => !key.includes('/:')));
  return <NotFound />;
};

export default EncryptedRoute;
