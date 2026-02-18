/**
 * Admin Routes
 * All admin panel routes
 * Touch for cache busting: remove AdminSettings ref
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import NewsList from '../pages/NewsList';
import NewsForm from '../pages/NewsForm';
import EventsList from '../pages/EventsList';
import EventsForm from '../pages/EventsForm';
import ProgramsList from '../pages/ProgramsList';
import ProgramsForm from '../pages/ProgramsForm';
import TeamList from '../pages/TeamList';
import TeamForm from '../pages/TeamForm';
import ResourcesList from '../pages/ResourcesList';
import ResourcesForm from '../pages/ResourcesForm';
import SuccessStoriesList from '../pages/SuccessStoriesList';
import CaseStudiesList from '../pages/CaseStudiesList';
import AnnualReportsList from '../pages/AnnualReportsList';
import PoliciesList from '../pages/PoliciesList';
import RFQsList from '../pages/RFQsList';
import RFQForm from '../pages/RFQForm';
import GalleryList from '../pages/GalleryList';
import FAQsList from '../pages/FAQsList';
import FAQForm from '../pages/FAQForm';
import ArticlesList from '../pages/ArticlesList';
import FocusAreasList from '../pages/FocusAreasList';
import FocusAreasForm from '../pages/FocusAreasForm';
import FormLinksList from '../pages/FormLinksList';
import RegistrationList from '../pages/RegistrationList';
import FormConfigsList from '../pages/FormConfigsList';
import CertificateList from '../pages/CertificateList';
import ContactsList from '../pages/ContactsList';
import DonationsList from '../pages/DonationsList';
import StripeIntegration from '../pages/StripeIntegration';
import VolunteersList from '../pages/VolunteersList';
import JobsList from '../pages/JobsList';
import JobApplicationsList from '../pages/JobApplicationsList';
import ComplaintsList from '../pages/ComplaintsList';
import NewsletterList from '../pages/NewsletterList';
import OrganizationSettings from '../pages/OrganizationSettings';
import AboutContent from '../pages/AboutContent';
import MissionVisionContent from '../pages/MissionVisionContent';
import PageSettingsForm from '../pages/PageSettingsForm';
import PartnersList from '../pages/PartnersList';
import ProjectsList from '../pages/ProjectsList';
import MonitoringEvaluationAdmin from '../pages/MonitoringEvaluationAdmin';
import StakeholdersList from '../pages/StakeholdersList';
import CompetenciesList from '../pages/CompetenciesList';
import UsersList from '../pages/UsersList';
import UserForm from '../pages/UserForm';
import OurStoryAdmin from '../pages/OurStoryAdmin';
import GoalsObjectivesAdmin from '../pages/GoalsObjectivesAdmin';
import DepartmentsAdmin from '../pages/DepartmentsAdmin';
import StrategicPartnershipsAdmin from '../pages/StrategicPartnershipsAdmin';
import CoverageAreaAdmin from '../pages/CoverageAreaAdmin';
import WelcomeSectionAdmin from '../pages/WelcomeSectionAdmin';

const AdminRoutes = () => {
    return (
        <AuthProvider>
            <Routes>
            {/* Public admin route - Login */}
            <Route path="login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
                path=""
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* News Routes */}
            <Route
                path="news"
                element={
                    <ProtectedRoute>
                        <NewsList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="news/create"
                element={
                    <ProtectedRoute>
                        <NewsForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="news/edit/:id"
                element={
                    <ProtectedRoute>
                        <NewsForm />
                    </ProtectedRoute>
                }
            />

            {/* Events Routes */}
            <Route
                path="events"
                element={
                    <ProtectedRoute>
                        <EventsList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="events/create"
                element={
                    <ProtectedRoute>
                        <EventsForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="events/edit/:id"
                element={
                    <ProtectedRoute>
                        <EventsForm />
                    </ProtectedRoute>
                }
            />

            {/* Programs Routes */}
            <Route
                path="programs"
                element={
                    <ProtectedRoute>
                        <ProgramsList />
                    </ProtectedRoute>
                }
            />

            {/* Team Routes */}
            <Route
                path="team"
                element={
                    <ProtectedRoute>
                        <TeamList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="team/create"
                element={
                    <ProtectedRoute>
                        <TeamForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="team/edit/:id"
                element={
                    <ProtectedRoute>
                        <TeamForm />
                    </ProtectedRoute>
                }
            />

            {/* Resources Routes (Success Stories, Case Studies, etc.) */}
            <Route
                path="success-stories"
                element={
                    <ProtectedRoute>
                        <SuccessStoriesList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="case-studies"
                element={
                    <ProtectedRoute>
                        <CaseStudiesList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="annual-reports"
                element={
                    <ProtectedRoute>
                        <AnnualReportsList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="policies"
                element={
                    <ProtectedRoute>
                        <PoliciesList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="rfqs"
                element={
                    <ProtectedRoute>
                        <RFQsList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="rfqs/create"
                element={
                    <ProtectedRoute>
                        <RFQForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="rfqs/edit/:id"
                element={
                    <ProtectedRoute>
                        <RFQForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="gallery"
                element={
                    <ProtectedRoute>
                        <GalleryList />
                    </ProtectedRoute>
                }
            />
                        <Route
                path="faqs"
                element={
                    <ProtectedRoute>
                        <FAQsList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="faqs/create"
                element={
                    <ProtectedRoute>
                        <FAQForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="faqs/edit/:id"
                element={
                    <ProtectedRoute>
                        <FAQForm />
                    </ProtectedRoute>
                }
            />
            
            {/* Articles Route */}
            <Route
                path="articles"
                element={
                    <ProtectedRoute>
                        <ArticlesList />
                    </ProtectedRoute>
                }
            />
            
            {/* Focus Areas Route */}
            <Route
                path="focus-areas"
                element={
                    <ProtectedRoute>
                        <FocusAreasList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="focus-areas/create"
                element={
                    <ProtectedRoute>
                        <FocusAreasForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="focus-areas/edit/:id"
                element={
                    <ProtectedRoute>
                        <FocusAreasForm />
                    </ProtectedRoute>
                }
            />

            {/* Form Links Route */}
            <Route
                path="form-links"
                element={
                    <ProtectedRoute>
                        <FormLinksList />
                    </ProtectedRoute>
                }
            />

            {/* Registration Route */}
            <Route
                path="registrations"
                element={
                    <ProtectedRoute>
                        <RegistrationList />
                    </ProtectedRoute>
                }
            />

            {/* Form Configurations Route */}
            <Route
                path="form-configs"
                element={
                    <ProtectedRoute>
                        <FormConfigsList />
                    </ProtectedRoute>
                }
            />

            {/* Certificates Route */}
            <Route
                path="certificates"
                element={
                    <ProtectedRoute>
                        <CertificateList />
                    </ProtectedRoute>
                }
            />

            {/* Stakeholders */}
            <Route
                path="stakeholders"
                element={
                    <ProtectedRoute>
                        <StakeholdersList />
                    </ProtectedRoute>
                }
            />

            {/* Competencies */}
            <Route
                path="competencies"
                element={
                    <ProtectedRoute>
                        <CompetenciesList />
                    </ProtectedRoute>
                }
            />

            {/* Partners */}
            <Route
                path="partners"
                element={
                    <ProtectedRoute>
                        <PartnersList />
                    </ProtectedRoute>
                }
            />

            {/* Projects */}
            <Route
                path="projects"
                element={
                    <ProtectedRoute>
                        <ProjectsList />
                    </ProtectedRoute>
                }
            />

            {/* Monitoring & Evaluation */}
            <Route
                path="monitoring-evaluation"
                element={
                    <ProtectedRoute>
                        <MonitoringEvaluationAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Contacts */}
            <Route
                path="contacts"
                element={
                    <ProtectedRoute>
                        <ContactsList />
                    </ProtectedRoute>
                }
            />

            {/* Donations */}
            <Route
                path="donations"
                element={
                    <ProtectedRoute>
                        <DonationsList />
                    </ProtectedRoute>
                }
            />

            {/* Stripe Integration */}
            <Route
                path="stripe-integration"
                element={
                    <ProtectedRoute>
                        <StripeIntegration />
                    </ProtectedRoute>
                }
            />

            {/* Volunteers */}
            <Route
                path="volunteers"
                element={
                    <ProtectedRoute>
                        <VolunteersList />
                    </ProtectedRoute>
                }
            />

            {/* Jobs */}
            <Route
                path="jobs"
                element={
                    <ProtectedRoute>
                        <JobsList />
                    </ProtectedRoute>
                }
            />

            {/* Job Applications */}
            <Route
                path="job-applications"
                element={
                    <ProtectedRoute>
                        <JobApplicationsList />
                    </ProtectedRoute>
                }
            />

            {/* Complaints & Feedback */}
            <Route
                path="complaints"
                element={
                    <ProtectedRoute>
                        <ComplaintsList />
                    </ProtectedRoute>
                }
            />

            {/* Newsletter */}
            <Route
                path="newsletter"
                element={
                    <ProtectedRoute>
                        <NewsletterList />
                    </ProtectedRoute>
                }
            />

            {/* Organization Settings */}
            <Route
                path="organization"
                element={
                    <ProtectedRoute>
                        <OrganizationSettings />
                    </ProtectedRoute>
                }
            />

            {/* Page Settings */}
            <Route
                path="page-settings"
                element={
                    <ProtectedRoute>
                        <PageSettingsForm />
                    </ProtectedRoute>
                }
            />

            {/* About Content */}
            <Route
                path="about-content"
                element={
                    <ProtectedRoute>
                        <AboutContent />
                    </ProtectedRoute>
                }
            />

            {/* Mission & Vision Content */}
            <Route
                path="mission-vision"
                element={
                    <ProtectedRoute>
                        <MissionVisionContent />
                    </ProtectedRoute>
                }
            />

            {/* Our Story Management */}
            <Route
                path="our-story"
                element={
                    <ProtectedRoute>
                        <OurStoryAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Data Management */}
            <Route
                path="goals-objectives"
                element={
                    <ProtectedRoute>
                        <GoalsObjectivesAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Departments Management */}
            <Route
                path="departments"
                element={
                    <ProtectedRoute>
                        <DepartmentsAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Strategic Partnerships Management */}
            <Route
                path="strategic-partnerships"
                element={
                    <ProtectedRoute>
                        <StrategicPartnershipsAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Coverage Area Management */}
            <Route
                path="coverage-area"
                element={
                    <ProtectedRoute>
                        <CoverageAreaAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Welcome Section Management */}
            <Route
                path="welcome-section"
                element={
                    <ProtectedRoute>
                        <WelcomeSectionAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Users Management */}
            <Route
                path="users"
                element={
                    <ProtectedRoute>
                        <UsersList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="users/create"
                element={
                    <ProtectedRoute>
                        <UserForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="users/edit/:id"
                element={
                    <ProtectedRoute>
                        <UserForm />
                    </ProtectedRoute>
                }
            />

        </Routes>
        </AuthProvider>
    );
};

export default AdminRoutes;

