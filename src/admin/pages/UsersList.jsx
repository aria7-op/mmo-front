/**
 * Users List Page - Modern styling consistent with other admin pages
 * View and manage users with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllUsers, deleteUser } from '../../services/users.service';
import { getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LazyImage } from '../../hooks/useLazyImage.jsx';

const UsersList = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const usersData = await getAllUsers();
            setUsers(usersData || []);
        } catch (error) {
            console.error('Fetch users error:', error);
            showErrorToast(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteUserConfirm', 'Are you sure you want to delete this user?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteUser(id, token);
            showSuccessToast(t('admin.userDeleted', 'User deleted successfully'));
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete user');
        } finally {
            setDeleting(null);
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' || 
            (user.firstName && user.firstName.en && user.firstName.en.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.en && user.lastName.en.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = filterRole === '' || user.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    // Get unique roles for filter
    const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="container-fluid" style={{ padding: '20px' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1" style={{ 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '28px'
                        }}>
                            {t('admin.users', 'Users')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.manageUsers', 'Manage system users and their roles')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link 
                            to="/admin/users/create" 
                            className="btn btn-primary"
                        >
                            {t('admin.addUser', 'Add User')}
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('admin.search', 'Search')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('admin.searchUsers', 'Search by name, email, or username...')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">{t('admin.filterByRole', 'Filter by Role')}</label>
                                <select
                                    className="form-select"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="">{t('admin.allRoles', 'All Roles')}</option>
                                    {uniqueRoles.map(role => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterRole('');
                                    }}
                                >
                                    {t('admin.clearFilters', 'Clear')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.photo', 'Photo')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.name', 'Name')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.username', 'Username')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.email', 'Email')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.role', 'Role')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.gender', 'Gender')}
                                        </th>
                                        <th style={{ fontWeight: '600', textAlign: 'center' }}>
                                            {t('admin.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers && filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => {
                                            // Get image URL
                                            const imageUrl = user.image 
                                                ? getImageUrlFromObject(user.image) 
                                                : null;
                                            
                                            // Get display name
                                            const displayName = user.firstName 
                                                ? formatMultilingualContent(user.firstName, i18n.language) + 
                                                  (user.lastName ? ' ' + formatMultilingualContent(user.lastName, i18n.language) : '')
                                                : user.email || 'Unknown';
                                            
                                            return (
                                                <tr key={user._id}>
                                                    <td>
                                                        {imageUrl ? (
                                                            <LazyImage 
                                                                src={imageUrl} 
                                                                alt={displayName} 
                                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                                                placeholder={t('admin.noImage', 'No Image')}
                                                                onError={(src) => console.error('User image failed to load:', src)}
                                                            />
                                                        ) : (
                                                            <div className="d-flex align-items-center justify-content-center bg-light rounded-circle" 
                                                                style={{ 
                                                                    width: '50px', 
                                                                    height: '50px', 
                                                                    fontSize: '10px',
                                                                    color: '#999'
                                                                }}>
                                                                {t('admin.noImage', 'No Image')}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: '500' }}>
                                                            {displayName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '14px' }}>
                                                            {user.username || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '14px' }}>
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${
                                                            user.role === 'Admin' 
                                                                ? 'bg-danger' 
                                                                : user.role === 'Manager'
                                                                ? 'bg-warning text-dark'
                                                                : 'bg-info text-dark'
                                                        }`}>
                                                            {user.role || t('admin.notSpecified', 'Not specified')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${
                                                            user.gender === 'Male' 
                                                                ? 'bg-primary' 
                                                                : user.gender === 'Female'
                                                                ? 'bg-pink'
                                                                : 'bg-secondary'
                                                        }`}>
                                                            {user.gender || t('admin.notSpecified', 'Not specified')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <Link 
                                                                to={`/admin/users/edit/${user._id}`} 
                                                                className="btn btn-sm btn-outline-primary"
                                                                title={t('admin.edit', 'Edit')}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(user._id)} 
                                                                disabled={deleting === user._id}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title={t('admin.delete', 'Delete')}
                                                            >
                                                                {deleting === user._id ? (
                                                                    <i className="fas fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fas fa-trash"></i>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-users fa-3x mb-3 d-block"></i>
                                                    {searchTerm || filterRole 
                                                        ? t('admin.noUsersFoundFilter', 'No users found matching your filters')
                                                        : t('admin.noUsersFound', 'No users found')
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row text-center">
                                    <div className="col-md-3">
                                        <h4 className="text-primary">{users.length}</h4>
                                        <p className="text-muted mb-0">{t('admin.totalUsers', 'Total Users')}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h4 className="text-danger">{users.filter(u => u.role === 'Admin').length}</h4>
                                        <p className="text-muted mb-0">{t('admin.admins', 'Admins')}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h4 className="text-warning">{users.filter(u => u.role === 'Manager').length}</h4>
                                        <p className="text-muted mb-0">{t('admin.managers', 'Managers')}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h4 className="text-info">{users.filter(u => u.role !== 'Admin' && u.role !== 'Manager').length}</h4>
                                        <p className="text-muted mb-0">{t('admin.otherUsers', 'Other Users')}</p>
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

// Helper function for multilingual content (same as in other components)
const formatMultilingualContent = (content, language = 'en') => {
    if (!content) return '';
    
    if (typeof content === 'string') {
        return content;
    }
    
    if (typeof content === 'object') {
        return content[language] || content.en || content.per || content.ps || '';
    }
    
    return String(content);
};

export default UsersList;
