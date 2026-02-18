/**
 * Admin Layout
 * Main layout for admin panel with sidebar and header
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { TutorialProvider, useTutorial } from '../components/TutorialProvider';
import TutorialButton from '../components/TutorialButton';
import WelcomeModal from '../components/WelcomeModal';
import SidebarTutorial from '../components/SidebarTutorial';

const AdminLayoutContent = ({ children }) => {
    const { showWelcome, setShowWelcome } = useTutorial();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const sidebarWidth = sidebarOpen ? '250px' : '0px';

    // Handle mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <div 
                className="admin-layout" 
                style={{ 
                    display: 'flex', 
                    minHeight: '100vh', 
                    backgroundColor: '#f5f5f5',
                    direction: isRTL ? 'rtl' : 'ltr'
                }}
            >
                <AdminSidebar isOpen={sidebarOpen} currentPath={location.pathname} isRTL={isRTL} />
                <div 
                    className="admin-main-content" 
                    style={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        marginLeft: isMobile ? '0' : (isRTL ? '0' : sidebarWidth),
                        marginRight: isMobile ? '0' : (isRTL ? sidebarWidth : '0'),
                        transition: 'margin 0.3s ease',
                        minHeight: '100vh',
                        backgroundColor: '#f5f5f5',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}
                >
                    <AdminHeader 
                        user={user} 
                        onLogout={handleLogout}
                        onToggleSidebar={toggleSidebar}
                        isRTL={isRTL}
                        style={{ zIndex: 1001 }}
                    />
                    <main className="admin-content" style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                        {children}
                    </main>
                </div>
            </div>

            {/* Tutorial Components */}
            <TutorialButton />
            <SidebarTutorial 
                isOpen={false}
                onClose={() => {}}
                onComplete={() => {}}
            />
            <WelcomeModal 
                isOpen={showWelcome}
                onClose={() => setShowWelcome(false)}
            />
        </>
    );
};

const AdminLayout = ({ children }) => {
  return (
    <TutorialProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </TutorialProvider>
  );
};

export default AdminLayout;

