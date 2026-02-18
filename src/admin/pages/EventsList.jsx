/**
 * Events List Page - Rewritten to prevent React object rendering errors
 * Safe multilingual content handling with proper string conversion
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { deleteEvent, getEventById, createEvent, updateEvent } from '../../services/events.service';
import { formatMultilingualContent, getImageUrlFromObject, formatDate } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventsList = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [filter, setFilter] = useState({ 
        status: 'all', 
        page: 1, 
        limit: 20,
        search: '',
        category: 'all',
        featured: 'all',
        startDate: '',
        endDate: ''
    });
    const { events, loading, error, refetch } = useEvents(filter);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    // Safe multilingual content formatter
    const safeFormatContent = (content, fallback = '') => {
        try {
            const result = formatMultilingualContent(content);
            return typeof result === 'string' ? result : String(result || fallback);
        } catch (error) {
            console.warn('Error formatting multilingual content:', error);
            return fallback;
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Update filter when debounced changes
    useEffect(() => {
        if (filter.search !== debouncedSearch) {
            setFilter(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
        }
    }, [debouncedSearch, filter.search]);

    // Client-side filtered events for instant feedback
    const filteredEvents = useMemo(() => {
        if (!events || events.length === 0) return [];
        if (!debouncedSearch.trim()) return events;
        const searchTerm = debouncedSearch.toLowerCase().trim();
        return events.filter(item => {
            const titleEn = safeFormatContent(item.title?.en || '').toLowerCase();
            const titlePer = safeFormatContent(item.title?.per || '').toLowerCase();
            const titlePs = safeFormatContent(item.title?.ps || '').toLowerCase();
            const summaryEn = safeFormatContent(item.summary?.en || '').toLowerCase();
            const summaryPer = safeFormatContent(item.summary?.per || '').toLowerCase();
            const summaryPs = safeFormatContent(item.summary?.ps || '').toLowerCase();
            return (
                titleEn.includes(searchTerm) || titlePer.includes(searchTerm) || titlePs.includes(searchTerm) ||
                summaryEn.includes(searchTerm) || summaryPer.includes(searchTerm) || summaryPs.includes(searchTerm)
            );
        });
    }, [events, debouncedSearch]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteEvent(id, token);
            showSuccessToast('Event deleted successfully');
            refetch();
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete event');
        } finally {
            setDeleting(null);
        }
    };

    const handleCreate = () => {
        window.location.href = '/admin/events/create';
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/events/edit/${id}`;
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const resetFilters = () => {
        setFilter({
            status: 'all',
            page: 1,
            limit: 20,
            search: '',
            category: 'all',
            featured: 'all',
            startDate: '',
            endDate: ''
        });
        setSearchInput('');
    };

    const clearSearch = () => {
        setSearchInput('');
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-events-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    backgroundColor: '#f8f9fa',
                    padding: '16px 20px',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            backgroundColor: '#e9ecef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#495057',
                            fontSize: '14px'
                        }}>
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                                Events Management
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                                Manage events and activities
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleCreate}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: '1px solid #007bff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                            title="Create new event"
                        >
                            <i className="fas fa-plus"></i>
                            Create
                        </button>
                        <button
                            onClick={() => refetch()}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                border: '1px solid #6c757d',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                            title="Refresh events list"
                        >
                            <i className="fas fa-refresh"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '6px', 
                    border: '1px solid #dee2e6',
                    marginBottom: '16px'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        borderBottom: '1px solid #dee2e6' 
                    }}>
                        {[
                            { id: 'list', label: 'Events List', icon: 'list' },
                            { id: 'filters', label: 'Filters', icon: 'filter' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '12px 8px',
                                    backgroundColor: activeTab === tab.id ? '#f8f9fa' : '#fff',
                                    color: activeTab === tab.id ? '#212529' : '#6c757d',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: activeTab === tab.id ? '600' : '400',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <i className={`fas fa-${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '20px' }}>
                        {/* Events List Tab */}
                        {activeTab === 'list' && (
                            <div>
                                {/* Quick Search */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Search events..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '13px'
                                            }}
                                        />
                                        <button
                                            onClick={() => setSearchInput('')}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#6c757d',
                                                color: '#fff',
                                                border: '1px solid #6c757d',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Events Table */}
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '6px', 
                                    border: '1px solid #dee2e6',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '80px 1fr 120px 120px 100px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        <div>Image</div>
                                        <div>Title</div>
                                        <div>Date</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    
                                    {filteredEvents?.map((item) => (
                                        <div key={item._id} style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '80px 1fr 120px 120px 100px',
                                            padding: '12px',
                                            borderBottom: '1px solid #dee2e6',
                                            fontSize: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                {item.image ? (
                                                    <img 
                                                        src={getImageUrlFromObject(item.image)} 
                                                        alt={safeFormatContent(item.title, 'Event image')} 
                                                        style={{ 
                                                            width: '60px', 
                                                            height: '45px', 
                                                            objectFit: 'cover', 
                                                            borderRadius: '4px', 
                                                            backgroundColor: '#f0f0f0' 
                                                        }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        width: '60px', 
                                                        height: '45px', 
                                                        backgroundColor: '#f0f0f0', 
                                                        borderRadius: '4px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        color: '#999', 
                                                        fontSize: '10px' 
                                                    }}>
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                                                    {safeFormatContent(item.title, 'No title')?.substring(0, 50) + '...'}
                                                </div>
                                                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                    {safeFormatContent(item.description, 'No description')?.substring(0, 60) + '...'}
                                                </div>
                                            </div>
                                            <div style={{ color: '#6c757d', fontSize: '11px' }}>
                                                {formatDate(item.eventDate || item.date)}
                                            </div>
                                            <div>
                                                <span style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    backgroundColor: item.status === 'published' ? '#d4edda' : '#f8d7da',
                                                    color: item.status === 'published' ? '#155724' : '#721c24'
                                                }}>
                                                    {item.status || 'draft'}
                                                </span>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button 
                                                        onClick={() => handleEdit(item._id)} 
                                                        style={{ 
                                                            padding: '4px 6px', 
                                                            backgroundColor: '#007bff', 
                                                            color: '#fff', 
                                                            border: '1px solid #007bff',
                                                            borderRadius: '3px', 
                                                            fontSize: '10px',
                                                            cursor: 'pointer'
                                                        }}
                                                        title="Edit event"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item._id)} 
                                                        disabled={deleting === item._id} 
                                                        style={{ 
                                                            padding: '4px 6px', 
                                                            backgroundColor: deleting === item._id ? '#95a5a6' : '#dc3545', 
                                                            color: '#fff', 
                                                            border: '1px solid ' + (deleting === item._id ? '#95a5a6' : '#dc3545'),
                                                            borderRadius: '3px', 
                                                            cursor: deleting === item._id ? 'not-allowed' : 'pointer', 
                                                            fontSize: '10px' 
                                                        }}
                                                        title="Delete event"
                                                    >
                                                        {deleting === item._id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filters Tab */}
                        {activeTab === 'filters' && (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                                            Status
                                        </label>
                                        <select
                                            value={filter.status}
                                            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                                            Featured
                                        </label>
                                        <select
                                            value={filter.featured}
                                            onChange={(e) => setFilter(prev => ({ ...prev, featured: e.target.value, page: 1 }))}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <option value="all">All</option>
                                            <option value="true">Featured Only</option>
                                            <option value="false">Not Featured</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={resetFilters}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6c757d',
                                            color: '#fff',
                                            border: '1px solid #6c757d',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EventsList;
