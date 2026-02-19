import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useParams, Navigate } from 'react-router-dom';
import HomeOne from './pages/HomeOne';
import AdminRoutes from './admin/routes/AdminRoutes';
import About from './pages/About';
import OurStory from './pages/about/OurStory';
import MissionVisionPage from './pages/about/MissionVisionPage';
import OrganizationProfilePage from './pages/about/OrganizationProfilePage';
import StrategicUnitsPage from './pages/about/StrategicUnitsPage';
import BoardDirectorsPage from './pages/about/BoardDirectorsPage';
import ExecutiveTeamPage from './pages/about/ExecutiveTeamPage';
import GoalsObjectives from './pages/about/GoalsObjectives';
import Departments from './pages/about/Departments';
import StrategicPartnerships from './pages/about/StrategicPartnerships';
import CoverageArea from './pages/about/CoverageArea';
import OrgStructurePage from './pages/about/OrgStructurePage';
import EventSidebarPage from './pages/EventSidebarPage';
import EventFullPage from './pages/EventFullPage';
import EventDetails from './pages/EventDetails';
import EventDetailsClassic from './pages/EventDetailsClassic';
import CauseListPage from './pages/CauseListPage';
import Cause2Column from './pages/Cause2Column';
import Cause3Column from './pages/Cause3Column';
import CauseDetails from './pages/CauseDetails';
import GalleryFull from './pages/GalleryFull';
import Gallery3Column from './pages/Gallery3Column';
import Gallery4Column from './pages/Gallery4Column';
import GalleryDetail from './pages/GalleryDetail';
import BlogClassicPage from './pages/BlogClassicPage';
import Blog2Column from './pages/Blog2Column';
import Blog3Column from './pages/Blog3Column';
import BlogDetails from './pages/BlogDetails';
import NotFound from './pages/NotFound';
import VolunteerPage from './pages/VolunteerPage';
import Donation from './pages/Donation';
import DonationCheckout from './pages/DonationCheckout';
import Account from './pages/Account';
import ShopPage from './pages/ShopPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import CheckOut from './pages/CheckOut';
import ContactUs from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import CompletedProjects from './pages/CompletedProjects';
import OngoingProjects from './pages/OngoingProjects';
import WhatWeDo from './pages/WhatWeDo';
import Resources from './pages/Resources';
import Jobs from './pages/Jobs';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesSettingsPage from './pages/CookiesSettings';
import EthicsCompliance from './pages/EthicsCompliance';
import ComplaintsFeedback from './pages/ComplaintsFeedback';
import NewsEvents from './pages/NewsEvents';
import ReportsPublications from './pages/ReportsPublications';
import AnnualReports from './pages/AnnualReports';
import SuccessStories from './pages/SuccessStories';
import SuccessStoryDetails from './pages/SuccessStoryDetails';
import Certificates from './pages/Certificates';
import Team from './pages/Team';
import Volunteers from './pages/Volunteers';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetails from './pages/CaseStudyDetails';
import CompetencyDetail from './pages/CompetencyDetail';
import Competencies from './pages/Competencies';
import RFQRFP from './pages/RFQRFP';
import Policies from './pages/Policies';
import NewsDetails from './pages/NewsDetails';
import NewsEventDetails from './pages/NewsEventDetails';
import DynamicProgramPage from './components/programs/DynamicProgramPage';
import Programs from './pages/Programs';
import ProgramStayInAfghanistan from './pages/StayInAfghanistan';
import ProgramSITC from './pages/SITCSimple';
import TABAN from './pages/TABAN';
import EmergencyResponse from './pages/EmergencyResponse';
import SearchResults from './pages/SearchResults';
import Stakeholders from './pages/Stakeholders';
import Sitemap from './pages/Sitemap';
import FAQ from './pages/FAQ';

// What We Do subpages
import FocusAreas from './pages/what-we-do/FocusAreas';
import GeographicCoverage from './pages/what-we-do/GeographicCoverage';
import MonitoringEvaluation from './pages/what-we-do/MonitoringEvaluation';
import FocusAreaDetail from './pages/what-we-do/FocusAreaDetail';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    useEffect(() => {
        // Scroll when hash changes (covers hash-based routing)
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [hash]);

    useEffect(() => {
        const handleHashChange = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        const handlePopState = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handlePopState);
        // Also scroll immediately on mount in case the browser restored scroll position
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return null;
};

const FocusAreaAliasRoute = () => {
    // Redirect /what-we-do/:slug to /what-we-do/focus-areas/:slug, but avoid conflicting with known static paths
    const location = useLocation();
    const parts = location.pathname.split('/').filter(Boolean);
    // Expect ['what-we-do', ':slug']
    const slug = parts[1];
    // Known static subpaths under /what-we-do to exclude
    const staticSubpaths = new Set(['focus-areas', 'geographic-coverage', 'monitoring-evaluation']);
    if (parts[0] === 'what-we-do' && parts.length === 2 && slug && !staticSubpaths.has(slug)) {
        return <Navigate to={`/what-we-do/focus-areas/${slug}`} replace />;
    }
    // If doesn't match alias case, render 404
    return <Navigate to="/not-found" replace />;
};

const Routers = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path='/' element={<HomeOne />}></Route>
                
                {/* All other routes */}
                <Route path='/about/our-story' element={<OurStory />}></Route>
                 <Route path='/about/mission-vision' element={<MissionVisionPage />}></Route>
                 <Route path='/about/organization-profile' element={<OrganizationProfilePage />}></Route>
                 <Route path='/about/strategic-units' element={<StrategicUnitsPage />}></Route>
                 <Route path='/about/board-directors' element={<BoardDirectorsPage />}></Route>
                 <Route path='/about/executive-team' element={<ExecutiveTeamPage />}></Route>
                 <Route path='/about/goals-objectives' element={<GoalsObjectives />}></Route>
                 <Route path='/about/coverage-area' element={<CoverageArea />}></Route>
                 <Route path='/about/strategic-partnerships' element={<StrategicPartnerships />}></Route>
                 <Route path='/about/departments' element={<Departments />}></Route>
                 <Route path='/about/organizational-structure' element={<OrgStructurePage />}></Route>
                <Route path='/what-we-do' element={<WhatWeDo />}></Route>
                <Route path='/what-we-do/focus-areas' element={<FocusAreas />}></Route>
                <Route path='/what-we-do/focus-areas/:slug' element={<FocusAreaDetail />}></Route>
                <Route path='/what-we-do/monitoring-evaluation' element={<MonitoringEvaluation />}></Route>
                <Route path='/what-we-do/geographic-coverage' element={<GeographicCoverage />}></Route>
                {/* Alias route for direct focus area slugs, e.g., /what-we-do/education -> /what-we-do/focus-areas/education */}
                {/* This must come AFTER all specific what-we-do routes */}
                <Route path='/what-we-do/:slug' element={<FocusAreaAliasRoute />} />
                <Route path='/projects/completed' element={<CompletedProjects />}></Route>
                <Route path='/projects/ongoing' element={<OngoingProjects />}></Route>
                <Route path='/projects' element={<Projects />}></Route>
                <Route path='/projects/:slugOrId' element={<ProjectDetail />}></Route>
                <Route path='/programs' element={<Programs />}></Route>
                <Route path='/programs/stay-in-afghanistan' element={<ProgramStayInAfghanistan />}></Route>
                <Route path='/programs/sitc' element={<ProgramSITC />}></Route>
                <Route path='/programs/taaban' element={<TABAN />}></Route>
                <Route path='/programs/emergency-response' element={<EmergencyResponse />}></Route>
                <Route path='/programs/:slug' element={<DynamicProgramPage />}></Route>
                <Route path='/resources' element={<Resources />}></Route>
                <Route path='/resources/news-events' element={<NewsEvents />}></Route>
                <Route path='/resources/news-events/:slug' element={<NewsEventDetails />}></Route>
                <Route path='/news/:slug' element={<NewsDetails />}></Route>
                <Route path='/events/:slug' element={<EventDetailsClassic />}></Route>
                 <Route path='/resources/events/:slug' element={<EventDetails />}></Route>
                <Route path='/resources/reports' element={<ReportsPublications />}></Route>
                <Route path='/resources/annual-reports' element={<AnnualReports />}></Route>
                <Route path='/resources/success-stories' element={<SuccessStories />}></Route>
                <Route path='/resources/success-stories/:slugOrId' element={<SuccessStoryDetails />}></Route>
                <Route path='/resources/certificates' element={<Certificates />}></Route>
                 <Route path='/about/team' element={<Team />}></Route>
                 <Route path='/about/volunteers' element={<Volunteers />}></Route>
                <Route path='/resources/case-studies' element={<CaseStudies />}></Route>
                <Route path='/resources/case-studies/:id' element={<CaseStudyDetails />}></Route>
                <Route path='/competencies/:slugOrId' element={<CompetencyDetail />}></Route>
                <Route path='/competencies' element={<Competencies />}></Route>
                <Route path='/stakeholders' element={<Stakeholders />}></Route>
                <Route path='/resources/rfq' element={<RFQRFP />}></Route>
                <Route path='/resources/policies' element={<Policies />}></Route>
                <Route path='/resources/jobs' element={<Jobs />}></Route>
                <Route path='/terms-of-use' element={<TermsOfUse />}></Route>
                <Route path='/privacy' element={<PrivacyPolicy />}></Route>
                <Route path='/privacy-policy' element={<PrivacyPolicy />}></Route>
                <Route path='/cookies' element={<CookiesSettingsPage />}></Route>
                <Route path='/cookies-settings' element={<CookiesSettingsPage />}></Route>
                <Route path='/sitemap' element={<Sitemap />}></Route>
                <Route path='/faq' element={<FAQ />}></Route>
                <Route path='/ethics-compliance' element={<EthicsCompliance />}></Route>
                <Route path='/complaints-feedback' element={<ComplaintsFeedback />}></Route>
                <Route path='/event-sidebar' element={<EventSidebarPage />}></Route>
                <Route path='/event-full' element={<EventFullPage />}></Route>
                <Route path='/event-details' element={<EventDetails />}></Route>
                <Route path='/cause-list' element={<CauseListPage />}></Route>
                <Route path='/cause-2' element={<Cause2Column />}></Route>
                <Route path='/cause-3' element={<Cause3Column />}></Route>
                <Route path='/cause-details' element={<CauseDetails />}></Route>
                <Route path='/gallery-full' element={<GalleryFull />}></Route>
                <Route path='/gallery3-column' element={<Gallery3Column />}></Route>
                <Route path='/gallery4-column' element={<Gallery4Column />}></Route>
                <Route path='/gallery/:slug' element={<GalleryDetail />}></Route>
                <Route path='/blog-classic' element={<BlogClassicPage />}></Route>
                <Route path='/blog-2' element={<Blog2Column />}></Route>
                <Route path='/blog-3' element={<Blog3Column />}></Route>
                <Route path='/blog-details' element={<BlogDetails />}></Route>
                <Route path='/volunteer' element={<VolunteerPage />}></Route>
                <Route path='/donation' element={<Donation />}></Route>
                <Route path='/donation-checkout' element={<DonationCheckout />}></Route>
                <Route path='/account' element={<Account />}></Route>
                <Route path='/shop' element={<ShopPage />}></Route>
                <Route path='/product-details' element={<ProductDetails />}></Route>
                <Route path='/cart' element={<Cart />}></Route>
                <Route path='/check-out' element={<CheckOut />}></Route>
                <Route path='/contact' element={<ContactUs />}></Route>
                <Route path='/search' element={<SearchResults />}></Route>
                
                 {/* Admin Routes */}
                 <Route path='/admin/*' element={<AdminRoutes />}></Route>
                 
                 <Route path='/not-found' element={<NotFound />}></Route>
                 <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </>
    );
};

export default Routers;