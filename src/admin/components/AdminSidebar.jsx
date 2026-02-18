/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAbout } from '../../services/about.service';
import { IMAGE_BASE_URL } from '../../config/api.config';

const AdminSidebar = ({ isOpen, currentPath, isRTL }) => {
    const location = useLocation();
    const [organizationData, setOrganizationData] = useState(null);

    // Helper function to construct proper logo URL
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http')) return logoPath;
        return `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`;
    };

    // Fetch organization data
    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const data = await getAbout();
                setOrganizationData(data);
            } catch (error) {
                console.warn('Failed to fetch organization data for sidebar:', error);
            }
        };
        fetchOrganizationData();
    }, []);

    // State for managing collapsible groups
    const [expandedGroups, setExpandedGroups] = useState({
        'dashboard': true,
        'content': true,
        'programs': false,
        'organization': false,
        'engagement': false,
        'operations': false,
        'user-management': false
    });

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

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

    const menuGroups = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'fa-tachometer-alt',
            items: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    icon: 'fa-chart-line',
                    path: '/admin',
                    exact: true,
                }
            ]
        },
        {
            id: 'content',
            title: 'Content Management',
            icon: 'fa-file-alt',
            items: [
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
                    id: 'gallery',
                    title: 'Gallery',
                    icon: 'fa-images',
                    path: '/admin/gallery',
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
                }
            ]
        },
        {
            id: 'programs',
            title: 'Program Management',
            icon: 'fa-project-diagram',
            items: [
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
                    id: 'projects',
                    title: 'Projects',
                    icon: 'fa-project-diagram',
                    path: '/admin/projects',
                },
                {
                    id: 'certificates',
                    title: 'Certificates',
                    icon: 'fa-certificate',
                    path: '/admin/certificates',
                },
                {
                    id: 'monitoring-evaluation',
                    title: 'Monitoring & Evaluation',
                    icon: 'fa-chart-bar',
                    path: '/admin/monitoring-evaluation',
                }
            ]
        },
        {
            id: 'organization',
            title: 'Organization',
            icon: 'fa-building',
            items: [
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
                    id: 'organization',
                    title: 'Organization Profile',
                    icon: 'fa-building',
                    path: '/admin/organization',
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
                    id: 'team',
                    title: 'Team',
                    icon: 'fa-users',
                    path: '/admin/team',
                }
            ]
        },
        {
            id: 'engagement',
            title: 'Community Engagement',
            icon: 'fa-users',
            items: [
                {
                    id: 'partners',
                    title: 'Partners',
                    icon: 'fa-user-friends',
                    path: '/admin/partners',
                },
                {
                    id: 'strategic-partnerships',
                    title: 'Strategic Partnerships',
                    icon: 'fa-handshake',
                    path: '/admin/strategic-partnerships',
                },
                {
                    id: 'coverage-area',
                    title: 'Coverage Area',
                    icon: 'fa-map-marked-alt',
                    path: '/admin/coverage-area',
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
                }
            ]
        },
        {
            id: 'operations',
            title: 'Operations',
            icon: 'fa-cogs',
            items: [
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
                    id: 'donations',
                    title: 'Donations',
                    icon: 'fa-donate',
                    path: '/admin/donations',
                },
                {
                    id: 'stripe-integration',
                    title: 'Payment Integration',
                    icon: 'fa-credit-card',
                    path: '/admin/stripe-integration',
                },
                {
                    id: 'newsletter',
                    title: 'Newsletter',
                    icon: 'fa-envelope',
                    path: '/admin/newsletter',
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
                }
            ]
        },
        {
            id: 'user-management',
            title: 'User Management',
            icon: 'fa-user-cog',
            items: [
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
                {
                    id: 'page-settings',
                    title: 'Page Settings',
                    icon: 'fa-sliders-h',
                    path: '/admin/page-settings',
                },
                {
                    id: 'website-config',
                    title: 'Website Configuration',
                    icon: 'fa-globe',
                    path: '/admin/website-config',
                },
                {
                    id: 'complaints',
                    title: 'Complaints',
                    icon: 'fa-exclamation-triangle',
                    path: '/admin/complaints',
                },
                {
                    id: 'contacts',
                    title: 'Contacts',
                    icon: 'fa-address-book',
                    path: '/admin/contacts',
                },
                {
                    id: 'faqs',
                    title: 'FAQs',
                    icon: 'fa-question-circle',
                    path: '/admin/faqs',
                }
            ]
        }
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    // Extract data from API response structure
    const apiData = organizationData?.data || organizationData;
    const logoUrl = getLogoUrl(apiData?.logo);
    const orgName = apiData?.name || 'Admin Panel';

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
                    backgroundColor: '#1a1f2e',
                    color: '#fff',
                    paddingTop: '60px',
                    transition: 'width 0.3s',
                    zIndex: 1000,
                    overflow: 'hidden',
                    direction: isRTL ? 'rtl' : 'ltr',
                }}
            >
                {menuGroups.map(group => (
                    <div key={group.id}>
                        {group.items.map(item => (
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
                                    color: isActive(item.path, item.exact) ? '#fff' : '#64748b',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease',
                                    minHeight: '48px',
                                    position: 'relative',
                                    backgroundColor: isActive(item.path, item.exact) ? '#3b82f6' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.path, item.exact)) {
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                                        e.target.style.color = '#cbd5e1';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.path, item.exact)) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#64748b';
                                    }
                                }}
                            >
                                <i className={`fas ${item.icon || 'fa-circle'}`} style={{ 
                                    fontSize: '14px',
                                    opacity: isActive(item.path, item.exact) ? 1 : 0.7
                                }}></i>
                            </Link>
                        ))}
                    </div>
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
                backgroundColor: '#1a1f2e',
                color: '#fff',
                paddingTop: '60px',
                transition: 'width 0.3s',
                zIndex: 1000,
                overflowY: 'auto',
                overflowX: 'hidden',
                direction: isRTL ? 'rtl' : 'ltr',
            }}
        >
            <style>
                {`
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-5px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .admin-sidebar::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    .admin-sidebar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    .admin-sidebar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 2px;
                    }
                `}
            </style>
            
            <div style={{ 
                padding: '24px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt="Organization Logo" 
                            style={{ 
                                height: '40px', 
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    ) : (
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <i className="fas fa-building" style={{ color: '#fff', fontSize: '18px' }}></i>
                        </div>
                    )}
                </div>
                <h4 style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#fff',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                }}>
                    {orgName}
                </h4>
                {apiData?.status && (
                    <div style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '4px',
                        textTransform: 'capitalize'
                    }}>
                        Status: {apiData.status}
                    </div>
                )}
            </div>

            <nav style={{ padding: '0 15px' }}>
                {menuGroups.map((group) => (
                    <div key={group.id} style={{ marginBottom: '16px' }}>
                        {/* Group Header */}
                        <div
                            onClick={() => toggleGroup(group.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                marginBottom: '6px',
                                backgroundColor: 'transparent',
                                transition: 'all 0.2s ease',
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.target.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#94a3b8';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i className={`fas ${group.icon || 'fa-folder'}`} style={{ 
                                    fontSize: '12px', 
                                    width: '16px', 
                                    marginRight: '8px',
                                    opacity: 0.8
                                }}></i>
                                <span>{group.title}</span>
                            </div>
                            <i 
                                className={`fas fa-chevron-${expandedGroups[group.id] ? 'up' : 'down'}`}
                                style={{ 
                                    fontSize: '9px', 
                                    opacity: 0.6,
                                    transition: 'transform 0.2s ease'
                                }}
                            ></i>
                        </div>

                        {/* Group Items */}
                        {expandedGroups[group.id] && (
                            <div style={{ 
                                paddingLeft: '8px',
                                animation: 'slideDown 0.25s ease-out'
                            }}>
                                {group.items.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        data-menu-id={item.id}
                                        className={`sidebar-menu-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px 12px',
                                            color: isActive(item.path, item.exact) ? '#fff' : '#64748b',
                                            textDecoration: 'none',
                                            borderRadius: '6px',
                                            marginBottom: '4px',
                                            transition: 'all 0.2s ease',
                                            fontSize: '13px',
                                            fontWeight: isActive(item.path, item.exact) ? '500' : '400',
                                            backgroundColor: isActive(item.path, item.exact) ? '#3b82f6' : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive(item.path, item.exact)) {
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                                                e.target.style.color = '#cbd5e1';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive(item.path, item.exact)) {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#64748b';
                                            }
                                        }}
                                    >
                                        <i className={`fas ${item.icon || 'fa-circle'}`} style={{ 
                                            fontSize: '12px', 
                                            width: '16px', 
                                            marginRight: '10px',
                                            opacity: isActive(item.path, item.exact) ? 1 : 0.7,
                                            color: isActive(item.path, item.exact) ? '#fff' : '#64748b'
                                        }}></i>
                                        <span style={{ flex: 1 }}>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;
