/**
 * Team List Page - Modern styling consistent with other admin pages
 * View and manage team members with consistent design patterns
 */

import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '../../hooks/useTeam';
import { deleteTeamMember } from '../../services/team.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LazyImage } from '../../hooks/useLazyImage.jsx';

const TeamList = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const filter = query.get('filter');

    const baseParams = useMemo(() => {
        if (!filter) return {};
        const roleMap = { board: 'Board', executive: 'Executive', management: 'Management' };
        const role = roleMap[filter.toLowerCase()];
        if (!role) return {};
        return { role, active: true, status: 'Published' };
    }, [filter]);

    const { teamMembers, loading, refetch } = useTeamMembers(baseParams);
    const [deleting, setDeleting] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteTeamMemberConfirm', 'Are you sure you want to delete this team member?'))) {
            return;
        }

        setDeleting(id);
        try {
            const token = localStorage.getItem('authToken');
            await deleteTeamMember(id, token);
            showSuccessToast(t('admin.teamMemberDeleted', 'Team member deleted successfully'));
            refetch();
        } catch (error) {
            console.error('Delete error:', error);
            showErrorToast(error.message || 'Failed to delete team member');
        } finally {
            setDeleting(null);
        }
    };

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
                            {filter === 'board' 
                                ? t('admin.boardOfDirectors','Board of Directors') 
                                : filter === 'executive' 
                                ? t('admin.executiveTeam','Executive Team') 
                                : t('admin.team','Team Members')
                            }
                        </h2>
                        <p className="text-muted mb-0">
                            {filter === 'board' 
                                ? t('admin.manageBoardOfDirectors', 'Manage board of directors')
                                : filter === 'executive' 
                                ? t('admin.manageExecutiveTeam', 'Manage executive team')
                                : t('admin.manageTeamMembers', 'Manage team members')
                            }
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link 
                            to="/admin/team/create" 
                            className="btn btn-primary"
                        >
                            {t('admin.addTeamMember', 'Add Team Member')}
                        </Link>
                    </div>
                </div>

                {/* Team Members Table */}
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
                                            {t('admin.role', 'Role')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.position', 'Position')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.department', 'Department')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.bio', 'Bio')}
                                        </th>
                                        <th style={{ fontWeight: '600' }}>
                                            {t('admin.status', 'Status')}
                                        </th>
                                        <th style={{ fontWeight: '600', textAlign: 'center' }}>
                                            {t('admin.actions', 'Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamMembers && teamMembers.length > 0 ? (
                                        teamMembers.map((member) => {
                                            // Get image URL - check image object first, then imageUrl, then photo (for backward compatibility)
                                            const imageUrl = member.image 
                                                ? getImageUrlFromObject(member.image) 
                                                : member.imageUrl 
                                                ? getImageUrlFromObject(member.imageUrl) 
                                                : member.photo 
                                                ? getImageUrlFromObject(member.photo) 
                                                : null;
                                            
                                            return (
                                                <tr key={member._id}>
                                                    <td>
                                                        {imageUrl ? (
                                                            <LazyImage 
                                                                src={imageUrl} 
                                                                alt={formatMultilingualContent(member.name, i18n.language) || 'Team member'} 
                                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                                                placeholder={t('admin.noImage', 'No Image')}
                                                                onError={(src) => console.error('Team member image failed to load:', src)}
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
                                                            {formatMultilingualContent(member.name, i18n.language)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info text-dark">
                                                            {member.role || t('admin.notSpecified', 'Not specified')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '14px' }}>
                                                            {formatMultilingualContent(member.position, i18n.language) || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '14px' }}>
                                                            {formatMultilingualContent(member.department, i18n.language) || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ maxWidth: '300px' }}>
                                                            {formatMultilingualContent(member.bio, i18n.language) ? (
                                                                <span 
                                                                    className="d-block text-truncate" 
                                                                    style={{ 
                                                                        fontSize: '13px',
                                                                        color: '#666'
                                                                    }} 
                                                                    title={formatMultilingualContent(member.bio, i18n.language)}
                                                                >
                                                                    {formatMultilingualContent(member.bio, i18n.language)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '13px' }}>-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {member.status ? (
                                                            <span className={`badge ${
                                                                member.status === 'Published' 
                                                                    ? 'bg-success' 
                                                                    : member.status === 'Draft' 
                                                                    ? 'bg-warning text-dark' 
                                                                    : 'bg-secondary'
                                                            }`}>
                                                                {member.status}
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-secondary">{t('admin.unknown', 'Unknown')}</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <Link 
                                                                to={`/admin/team/edit/${member._id}`} 
                                                                className="btn btn-sm btn-outline-primary"
                                                                title={t('admin.edit', 'Edit')}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(member._id)} 
                                                                disabled={deleting === member._id}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title={t('admin.delete', 'Delete')}
                                                            >
                                                                {deleting === member._id ? (
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
                                            <td colSpan="8" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="fas fa-users fa-3x mb-3 d-block"></i>
                                                    {t('admin.noTeamMembersFound', 'No team members found')}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TeamList;

