/**
 * Enhanced Admin Dashboard - Complete Analytics & Monitoring
 * Dynamic charts, graphs, and comprehensive counting of all data
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '../../utils/errorHandler';
import { getDashboardData } from '../../services/dashboard.service';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        overview: {},
        charts: {},
        recent: [],
        topMetrics: []
    });
    const [timeRange, setTimeRange] = useState('7d');
    const [refreshing, setRefreshing] = useState(false);

    // Colors for charts
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        const loadingToastId = showLoadingToast('Loading dashboard data...');
        
        try {
            const response = await getDashboardData(timeRange);
            
            if (response.success) {
                setDashboardData(response.data);
                dismissToast(loadingToastId);
                showSuccessToast('Dashboard data loaded successfully');
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (error) {
            dismissToast(loadingToastId);
            showErrorToast('Failed to load dashboard data: ' + error.message);
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData().finally(() => setRefreshing(false));
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatPercentage = (value) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    const { overview, charts, recent, topMetrics } = dashboardData;

    return (
        <AdminLayout>
            <div className="container-fluid" style={{ padding: '20px', direction: isRTL ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="mb-1" style={{ 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '32px'
                        }}>
                            {t('admin.dashboard', 'Admin Dashboard')}
                        </h1>
                        <p className="text-muted mb-0">
                            {t('admin.dashboardSubtitle', 'Real-time analytics and monitoring')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <select 
                            className="form-select"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            style={{ minWidth: '120px' }}
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                            <option value="1y">Last Year</option>
                        </select>
                        <button
                            className="btn btn-primary"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''} me-2`}></i>
                            {t('common.refresh', 'Refresh')}
                        </button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="row mb-4">
                    <div className="col-xl-3 col-lg-6 col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            {t('admin.totalUsers', 'Total Users')}
                                        </div>
                                        <div className="h3 mb-0 font-weight-bold">
                                            {formatNumber(overview.totalUsers || 0)}
                                        </div>
                                        <div className="text-xs text-muted">
                                            <span className="text-success">
                                                <i className="fas fa-arrow-up"></i> {overview.usersGrowth || 0}%
                                            </span>
                                            {' '}{t('admin.fromLastMonth', 'from last month')}
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className="icon-circle bg-primary bg-opacity-10">
                                            <i className="fas fa-users text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            {t('admin.totalProjects', 'Total Projects')}
                                        </div>
                                        <div className="h3 mb-0 font-weight-bold">
                                            {formatNumber(overview.totalProjects || 0)}
                                        </div>
                                        <div className="text-xs text-muted">
                                            <span className="text-success">
                                                <i className="fas fa-arrow-up"></i> {overview.projectsGrowth || 0}%
                                            </span>
                                            {' '}{t('admin.fromLastMonth', 'from last month')}
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className="icon-circle bg-success bg-opacity-10">
                                            <i className="fas fa-project-diagram text-success"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                            {t('admin.totalDonations', 'Total Donations')}
                                        </div>
                                        <div className="h3 mb-0 font-weight-bold">
                                            ${formatNumber(overview.totalDonations || 0)}
                                        </div>
                                        <div className="text-xs text-muted">
                                            <span className="text-success">
                                                <i className="fas fa-arrow-up"></i> {overview.donationsGrowth || 0}%
                                            </span>
                                            {' '}{t('admin.fromLastMonth', 'from last month')}
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className="icon-circle bg-info bg-opacity-10">
                                            <i className="fas fa-dollar-sign text-info"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                            {t('admin.totalVolunteers', 'Total Volunteers')}
                                        </div>
                                        <div className="h3 mb-0 font-weight-bold">
                                            {formatNumber(overview.totalVolunteers || 0)}
                                        </div>
                                        <div className="text-xs text-muted">
                                            <span className="text-success">
                                                <i className="fas fa-arrow-up"></i> {overview.volunteersGrowth || 0}%
                                            </span>
                                            {' '}{t('admin.fromLastMonth', 'from last month')}
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className="icon-circle bg-warning bg-opacity-10">
                                            <i className="fas fa-hands-helping text-warning"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="row mb-4">
                    {/* User Growth Chart */}
                    <div className="col-xl-8 col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">
                                    {t('admin.userGrowth', 'User Growth')}
                                </h5>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={charts.userGrowth || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="users" 
                                            stroke="#3b82f6" 
                                            fill="#93c5fd" 
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Content Distribution */}
                    <div className="col-xl-4 col-lg-5 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">
                                    {t('admin.contentDistribution', 'Content Distribution')}
                                </h5>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={charts.contentDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {(charts.contentDistribution || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="row mb-4">
                    <div className="col-xl-8 col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">
                                    {t('admin.recentActivity', 'Recent Activity')}
                                </h5>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {recent && recent.length > 0 ? (
                                    <div className="timeline">
                                        {recent.map((activity, index) => (
                                            <div key={activity.id} className="timeline-item mb-3">
                                                <div className="d-flex">
                                                    <div className="me-3">
                                                        <div className={`icon-circle bg-${activity.type === 'create' ? 'success' : activity.type === 'update' ? 'info' : 'warning'} bg-opacity-10`}>
                                                            <i className={`fas fa-${activity.type === 'create' ? 'plus' : activity.type === 'update' ? 'edit' : 'trash'} text-${activity.type === 'create' ? 'success' : activity.type === 'update' ? 'info' : 'warning'}`}></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <div className="font-weight-semibold">
                                                                    {activity.description}
                                                                </div>
                                                                <div className="text-xs text-muted">
                                                                    {activity.user} • {activity.time}
                                                                </div>
                                                            </div>
                                                            <span className={`badge bg-${activity.type === 'create' ? 'success' : activity.type === 'update' ? 'info' : 'warning'} bg-opacity-10 text-${activity.type === 'create' ? 'success' : activity.type === 'update' ? 'info' : 'warning'}`}>
                                                                {activity.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        <i className="fas fa-clock fa-2x mb-3"></i>
                                        <p>{t('admin.noRecentActivity', 'No recent activity')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Metrics */}
                    <div className="col-xl-4 col-lg-5 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">
                                    {t('admin.topMetrics', 'Top Metrics')}
                                </h5>
                            </div>
                            <div className="card-body">
                                {topMetrics && topMetrics.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {topMetrics.map((metric, index) => (
                                            <div key={metric.id} className="list-group-item px-0">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="font-weight-semibold">
                                                            {metric.name}
                                                        </div>
                                                        <div className="text-xs text-muted">
                                                            {metric.description}
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="h5 mb-0 font-weight-bold text-primary">
                                                            {formatNumber(metric.value)}
                                                        </div>
                                                        <div className="text-xs text-muted">
                                                            {formatPercentage(metric.change)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        <i className="fas fa-chart-bar fa-2x mb-3"></i>
                                        <p>{t('admin.noMetrics', 'No metrics available')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Grid */}
                <div className="row">
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-newspaper fa-2x text-info mb-3"></i>
                                <h5 className="font-weight-bold">{formatNumber(overview.totalArticles || 0)}</h5>
                                <p className="text-muted mb-0">{t('admin.articles', 'Articles')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-calendar-alt fa-2x text-success mb-3"></i>
                                <h5 className="font-weight-bold">{formatNumber(overview.totalEvents || 0)}</h5>
                                <p className="text-muted mb-0">{t('admin.events', 'Events')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-handshake fa-2x text-warning mb-3"></i>
                                <h5 className="font-weight-bold">{formatNumber(overview.totalPartners || 0)}</h5>
                                <p className="text-muted mb-0">{t('admin.partners', 'Partners')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-certificate fa-2x text-danger mb-3"></i>
                                <h5 className="font-weight-bold">{formatNumber(overview.totalCertificates || 0)}</h5>
                                <p className="text-muted mb-0">{t('admin.certificates', 'Certificates')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">
                                    {t('admin.systemHealth', 'System Health')}
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="text-center">
                                            <div className={`h4 mb-2 ${overview.systemHealth?.api > 90 ? 'text-success' : overview.systemHealth?.api > 70 ? 'text-warning' : 'text-danger'}`}>
                                                {overview.systemHealth?.api || 0}%
                                            </div>
                                            <p className="text-muted mb-0">API Response</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center">
                                            <div className={`h4 mb-2 ${overview.systemHealth?.database > 90 ? 'text-success' : overview.systemHealth?.database > 70 ? 'text-warning' : 'text-danger'}`}>
                                                {overview.systemHealth?.database || 0}%
                                            </div>
                                            <p className="text-muted mb-0">Database</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center">
                                            <div className={`h4 mb-2 ${overview.systemHealth?.storage > 90 ? 'text-success' : overview.systemHealth?.storage > 70 ? 'text-warning' : 'text-danger'}`}>
                                                {overview.systemHealth?.storage || 0}%
                                            </div>
                                            <p className="text-muted mb-0">Storage</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center">
                                            <div className={`h4 mb-2 ${overview.systemHealth?.uptime > 99 ? 'text-success' : overview.systemHealth?.uptime > 95 ? 'text-warning' : 'text-danger'}`}>
                                                {overview.systemHealth?.uptime || 0}%
                                            </div>
                                            <p className="text-muted mb-0">Uptime</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
