/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen, currentPath, isRTL }) => {
    const location = useLocation();

    const [aboutOpen, setAboutOpen] = useState(false);

    // Responsive sidebar width
    const getSidebarWidth = () => {
        if (window.innerWidth < 576) {
            return isOpen ? '250px' : '0px';
        } else if (window.innerWidth < 768) {
            return isOpen ? '200px' : '60px';
        } else {
            return isOpen ? '250px' : '70px';
        }
    };

    const sidebarWidth = getSidebarWidth();

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'fa-chart-line',
            path: '/admin',
            exact: true,
        },
        {
            id: 'welcome-section',
            title: 'Welcome Section',
            icon: 'fa-home',
            path: '/admin/welcome-section',
        },
        {
            id: 'news',
            title: 'News',
            icon: 'fa-newspaper',
            path: '/admin/news',
        },
        {
            id: 'events',
            title: 'Events',
            icon: 'fa-calendar-alt',
            path: '/admin/events',
        },
        {
            id: 'programs',
            title: 'Programs',
            icon: 'fa-project-diagram',
            path: '/admin/programs',
        },
        {
            id: 'focus-areas',
            title: 'Focus Areas',
            icon: 'fa-bullseye',
            path: '/admin/focus-areas',
        },
        {
            id: 'articles',
            title: 'Articles',
            icon: 'fa-file-alt',
            path: '/admin/articles',
        },
        {
            id: 'resources',
            title: 'Resources',
            icon: 'fa-book',
            path: '/admin/resources',
        },
        {
            id: 'certificates',
            title: 'Certificates',
            icon: 'fa-certificate',
            path: '/admin/certificates',
        },
        {
            id: 'team',
            title: 'Team',
            icon: 'fa-users',
            path: '/admin/team',
        },
        {
            id: 'success-stories',
            title: 'Success Stories',
            icon: 'fa-trophy',
            path: '/admin/success-stories',
        },
        {
            id: 'case-studies',
            title: 'Case Studies',
            icon: 'fa-briefcase',
            path: '/admin/case-studies',
        },
        {
            id: 'annual-reports',
            title: 'Annual Reports',
            icon: 'fa-file-pdf',
            path: '/admin/annual-reports',
        },
        {
            id: 'policies',
            title: 'Policies',
            icon: 'fa-shield-alt',
            path: '/admin/policies',
        },
        {
            id: 'rfqs',
            title: 'RFQs',
            icon: 'fa-handshake',
            path: '/admin/rfqs',
        },
        {
            id: 'gallery',
            title: 'Gallery',
            icon: 'fa-images',
            path: '/admin/gallery',
        },
        {
            id: 'partners',
            title: 'Partners',
            icon: 'fa-user-friends',
            path: '/admin/partners',
        },
        {
            id: 'projects',
            title: 'Projects',
            icon: 'fa-project-diagram',
            path: '/admin/projects',
        },
        {
            id: 'monitoring-evaluation',
            title: 'Monitoring & Evaluation',
            path: '/admin/monitoring-evaluation',
        },
        {
            id: 'coverage-area',
            title: 'Coverage Area',
            icon: 'fa-map-marked-alt',
            path: '/admin/coverage-area',
        },
        {
            id: 'strategic-partnerships',
            title: 'Strategic Partnerships',
            icon: 'fa-handshake',
            path: '/admin/strategic-partnerships',
        },
        {
            id: 'faqs',
            title: 'FAQs',
            icon: 'fa-question-circle',
            path: '/admin/faqs',
        },
        {
            id: 'contacts',
            title: 'Contacts',
            icon: 'fa-address-book',
            path: '/admin/contacts',
        },
        {
            id: 'donations',
            title: 'Donations',
            icon: 'fa-donate',
            path: '/admin/donations',
        },
        {
            id: 'stripe-integration',
            title: 'Stripe Integration',
            icon: 'fa-credit-card',
            path: '/admin/stripe-integration',
        },
        {
            id: 'volunteers',
            title: 'Volunteers',
            icon: 'fa-hands-helping',
            path: '/admin/volunteers',
        },
        {
            id: 'jobs',
            title: 'Jobs',
            icon: 'fa-briefcase',
            path: '/admin/jobs',
        },
        {
            id: 'job-applications',
            title: 'Job Applications',
            icon: 'fa-file-contract',
            path: '/admin/job-applications',
        },
        {
            id: 'complaints',
            title: 'Complaints',
            icon: 'fa-exclamation-triangle',
            path: '/admin/complaints',
        },
        {
            id: 'newsletter',
            title: 'Newsletter',
            icon: 'fa-envelope',
            path: '/admin/newsletter',
        },
        {
            id: 'organization',
            title: 'Organization',
            icon: 'fa-building',
            path: '/admin/organization',
        },
        {
            id: 'about-content',
            title: 'About Content',
            icon: 'fa-info-circle',
            path: '/admin/about-content',
        },
        {
            id: 'mission-vision',
            title: 'Mission & Vision',
            icon: 'fa-eye',
            path: '/admin/mission-vision',
        },
        {
            id: 'our-story',
            title: 'Our Story',
            icon: 'fa-book-open',
            path: '/admin/our-story',
        },
        {
            id: 'goals-objectives',
            title: 'Goals & Objectives',
            icon: 'fa-bullseye',
            path: '/admin/goals-objectives',
        },
        {
            id: 'departments',
            title: 'Departments',
            icon: 'fa-sitemap',
            path: '/admin/departments',
        },
        {
            id: 'stakeholders',
            title: 'Stakeholders',
            icon: 'fa-user-tie',
            path: '/admin/stakeholders',
        },
        {
            id: 'competencies',
            title: 'Competencies',
            icon: 'fa-graduation-cap',
            path: '/admin/competencies',
        },
        {
            id: 'registrations',
            title: 'Registrations',
            icon: 'fa-user-plus',
            path: '/admin/registrations',
        },
        {
            id: 'form-links',
            title: 'Form Links',
            icon: 'fa-link',
            path: '/admin/form-links',
        },
        {
            id: 'form-configs',
            title: 'Form Configs',
            icon: 'fa-cogs',
            path: '/admin/form-configs',
        },
        {
            id: 'page-settings',
            title: 'Page Settings',
            icon: 'fa-sliders-h',
            path: '/admin/page-settings',
        },
        {
            id: 'users',
            title: 'Users',
            icon: 'fa-users',
            path: '/admin/users',
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'fa-cog',
            path: '/admin/settings',
        },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    if (!isOpen) {
        return (
            <div
                className={`admin-sidebar collapsed ${isRTL ? 'rtl-direction' : ''}`}
                style={{
                    width: sidebarWidth === '0px' ? '0px' : '60px',
                    position: 'fixed',
                    [isRTL ? 'right' : 'left']: 0,
                    top: 0,
                    height: '100vh',
                    backgroundColor: '#2c3e50',
                    color: '#fff',
                    paddingTop: '60px',
                    transition: 'width 0.3s',
                    zIndex: 1000,
                    overflow: 'hidden',
                    direction: isRTL ? 'rtl' : 'ltr',
                }}
            >
                {menuItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`sidebar-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        title={item.title}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px',
                            color: '#ecf0f1',
                            textDecoration: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                            minHeight: '48px',
                            position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        <i className={`fas ${item.icon || 'fa-circle'}`} style={{ fontSize: '16px' }}></i>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`admin-sidebar ${isRTL ? 'rtl-direction' : ''}`}
            style={{
                width: sidebarWidth,
                position: 'fixed',
                [isRTL ? 'right' : 'left']: 0,
                top: 0,
                height: '100vh',
                backgroundColor: '#2c3e50',
                color: '#fff',
                paddingTop: '60px',
                transition: 'width 0.3s',
                zIndex: 1000,
                overflowY: 'auto',
                overflowX: 'hidden',
                direction: isRTL ? 'rtl' : 'ltr',
            }}
        >
            <div style={{ padding: '20px 15px' }}>
                <h4 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#fff',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    Admin Panel
                </h4>
            </div>

            <nav style={{ padding: '0 15px' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        data-menu-id={item.id}
                        className={`sidebar-menu-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 15px',
                            color: isActive(item.path, item.exact) ? '#fff' : '#b8c7cc',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: isActive(item.path, item.exact) ? '600' : '400',
                            backgroundColor: isActive(item.path, item.exact) ? 'rgba(15, 104, 187, 0.8)' : 'transparent',
                            border: isActive(item.path, item.exact) ? '1px solid rgba(15, 104, 187, 0.9)' : '1px solid transparent',
                            position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(item.path, item.exact)) {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                                e.target.style.color = '#fff';
                                e.target.style.transform = 'translateX(2px)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(item.path, item.exact)) {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#b8c7cc';
                                e.target.style.transform = 'translateX(0)';
                                e.target.style.borderColor = 'transparent';
                            }
                        }}
                    >
                        <i className={`fas ${item.icon || 'fa-circle'}`} style={{ 
                            fontSize: '14px', 
                            width: '20px', 
                            marginRight: '12px',
                            opacity: isActive(item.path, item.exact) ? 1 : 0.8,
                            color: isActive(item.path, item.exact) ? '#fff' : '#b8c7cc'
                        }}></i>
                        <span style={{ flex: 1 }}>{item.title}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;
