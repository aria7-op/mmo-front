/**
 * Admin Dashboard Page
 * Main dashboard with statistics and overview
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import { useStatistics } from '../../hooks/useStatistics';
import { getDashboardStats, getDashboardCharts } from '../../services/dashboard.service';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../layouts/AdminLayout';
import '../css/AdminDashboard.css';
import DashboardChart from '../components/DashboardChart';

const AdminDashboard = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { statistics, loading: statsLoading } = useStatistics();
    const { data: dashboardStats, loading: dashboardStatsLoading } = useApi(() => getDashboardStats(), [], false);
    const { data: dashboardCharts, loading: dashboardChartsLoading } = useApi(() => getDashboardCharts(), [], false);

    const [query, setQuery] = useState('');
    const loading = statsLoading || dashboardStatsLoading || dashboardChartsLoading;

    const statCards = [
        {
            titleKey: 'admin.totalNews',
            value: statistics?.totalNews || dashboardStats?.data?.totalNews || 0,
            icon: 'fa-newspaper',
            color: '#3498db',
            link: '/admin/news',
        },
        {
            titleKey: 'admin.totalEvents',
            value: statistics?.totalEvents || dashboardStats?.data?.totalEvents || 0,
            icon: 'fa-calendar-alt',
            color: '#e74c3c',
            link: '/admin/events',
        },
        {
            titleKey: 'admin.totalPrograms',
            value: statistics?.totalPrograms || dashboardStats?.data?.totalPrograms || 0,
            icon: 'fa-project-diagram',
            color: '#2ecc71',
            link: '/admin/programs',
        },
        {
            titleKey: 'admin.totalVolunteers',
            value: statistics?.totalVolunteers || dashboardStats?.data?.totalVolunteers || 0,
            icon: 'fa-user-friends',
            color: '#9b59b6',
            link: '/admin/volunteers',
        },
        {
            titleKey: 'admin.totalDonations',
            value: statistics?.totalDonations || dashboardStats?.data?.totalDonations || 0,
            icon: 'fa-hand-holding-usd',
            color: '#1abc9c',
            link: '/admin/donations',
        },
        {
            titleKey: 'admin.pendingContacts',
            value: dashboardStats?.data?.pendingContacts || 0,
            icon: 'fa-envelope',
            color: '#e67e22',
            link: '/admin/contacts',
        },
        {
            titleKey: 'admin.pendingApplications',
            value: statistics?.totalApplications || dashboardStats?.data?.pendingApplications || 0,
            icon: 'fa-briefcase',
            color: '#34495e',
            link: '/admin/job-applications',
        },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard" style={{ direction: i18n.language === 'dr' || i18n.language === 'ps' ? 'rtl' : 'ltr' }}>
                <div className="dashboard-header">
                    <div>
                        <h1>{t('admin.dashboard')}</h1>
                        <p className="muted">{t('admin.welcomeBack')}, {user?.username || user?.email}!</p>
                    </div>
                    <div className="dashboard-controls">
                        <input
                            type="search"
                            placeholder={t('admin.searchStats') || 'Search stats...'}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="stats-grid">
                    {statCards
                        .map((stat) => ({ ...stat, label: t(stat.titleKey) }))
                        .filter((stat) => stat.label.toLowerCase().includes(query.trim().toLowerCase()))
                        .map((stat, index) => (
                        <Link
                            key={index}
                            to={stat.link}
                            className="stat-card"
                            aria-label={stat.label}
                        >
                            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                                <i className={`fas ${stat.icon}`} aria-hidden="true"></i>
                            </div>
                            <div className="stat-body">
                                <div className="stat-value">{stat.value.toLocaleString()}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="dashboard-chart" style={{ marginBottom: '20px' }}>
                    <DashboardChart statistics={statistics} dashboardStats={dashboardCharts || dashboardStats} />
                </div>

                <div className="quick-actions" style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#2c3e50' }}>{t('admin.quickActions')}</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <Link
                            to="/admin/news/create"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#3498db',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <i className="fas fa-plus"></i>
                            {t('admin.createNews')}
                        </Link>
                        <Link
                            to="/admin/events/create"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <i className="fas fa-plus"></i>
                            {t('admin.createEvent')}
                        </Link>
                        <Link
                            to="/admin/programs/create"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2ecc71',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <i className="fas fa-plus"></i>
                            {t('admin.createProgram')}
                        </Link>
                        <Link
                            to="/admin/team/create"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f39c12',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <i className="fas fa-plus"></i>
                            {t('admin.addTeamMember')}
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

