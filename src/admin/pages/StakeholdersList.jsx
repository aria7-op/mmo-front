/**
 * Stakeholders List Page - Modern styling consistent with other admin pages
 * View and manage stakeholders with consistent design patterns
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StakeholderFormModal from '../components/StakeholderFormModal';
import { draftManager } from '../../utils/draftManager';
import StakeholderFormContent from '../components/forms/StakeholderFormContent';
import { useStakeholders } from '../../hooks/useStakeholders';
import { createStakeholder, updateStakeholder, deleteStakeholder, getStakeholderById } from '../../services/stakeholder.service';
import { formatMultilingualContent, getImageUrlFromObject } from '../../utils/apiUtils';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';

const StakeholdersList = () => {
  const { t } = useTranslation();
  const isRTL = t('currentLanguage') === 'dr' || t('currentLanguage') === 'ps';
  const { stakeholders, loading, refetch } = useStakeholders();
  const [deleting, setDeleting] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [modals, setModals] = useState(() => {
    try {
      const saved = localStorage.getItem('stakeholder-modal-instances');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const openCreate = () => {
    const id = `stakeholder-modal-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const instance = { id, mode: 'create', minimized: false };
    setModals(prev => {
      const next = [...prev, instance];
      localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
      return next;
    });
  };
  const openEdit = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const item = await getStakeholderById(id, token);
      const instance = { id: `stakeholder-modal-${id}-${Date.now()}`, mode: 'edit', minimized: false, stakeholderId: id, data: item?.data || item };
      setModals(prev => {
        const next = [...prev, instance];
        localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
        return next;
      });
    } catch (e) { console.error('Failed to load stakeholder for edit', e); }
  };
  const closeModal = (id) => {
    setModals(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('stakeholder-modal-instances', JSON.stringify(next));
      return next;
    });
  };

  const saveItem = async (id, data, file, token, isEdit) => {
    try {
      if (isEdit && id) {
        await updateStakeholder(id, data, file, token);
        showSuccessToast('Stakeholder updated successfully');
      } else {
        await createStakeholder(data, file, token);
        showSuccessToast('Stakeholder created successfully');
      }
      await refetch();
    } catch (e) {
      showErrorToast(e.message || 'Failed to save stakeholder');
      throw e;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteStakeholder', 'Are you sure you want to delete this stakeholder?'))) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('authToken');
      await deleteStakeholder(id, token);
      showSuccessToast(t('admin.stakeholderDeleted', 'Stakeholder deleted'));
      refetch();
    } catch (e) {
      showErrorToast(e.message || t('admin.failedToDelete', 'Failed to delete'));
    } finally {
      setDeleting(null);
    }
  };

  // Filter stakeholders based on search
  const filteredStakeholders = useMemo(() => {
    if (!searchInput) return stakeholders;
    const searchLower = searchInput.toLowerCase();
    return stakeholders?.filter(item => {
      const name = typeof formatMultilingualContent(item.name) === 'string' 
        ? formatMultilingualContent(item.name).toLowerCase() 
        : '';
      const type = item.type?.toLowerCase() || '';
      const website = item.website?.toLowerCase() || '';
      return name.includes(searchLower) || type.includes(searchLower) || website.includes(searchLower);
    }) || [];
  }, [stakeholders, searchInput]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-stakeholders-list" style={{ direction: isRTL ? 'rtl' : 'ltr', padding: '16px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px',
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1976d2',
              fontSize: '14px'
            }}>
              <i className="fas fa-handshake"></i>
            </div>
            <div>
              <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '600', color: '#212529' }}>
                Stakeholders Management
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                Manage organizational stakeholders and partners
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={openCreate}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              title="Add new stakeholder"
            >
              <i className="fas fa-plus"></i>
              Add Stakeholder
            </button>
            <button
              onClick={() => refetch()}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
              title="Refresh stakeholders list"
            >
              <i className="fas fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search stakeholders..."
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
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Stakeholders Table */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '6px', 
          border: '1px solid #dee2e6',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '80px 1fr 120px 200px 100px 120px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            fontWeight: '600',
            fontSize: '13px',
            color: '#495057'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-image"></i>
              Logo
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-building"></i>
              Name
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-tag"></i>
              Type
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-globe"></i>
              Website
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-info-circle"></i>
              Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <i className="fas fa-cog"></i>
              Actions
            </div>
          </div>
          
          {filteredStakeholders?.map((item) => (
            <div key={item._id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '80px 1fr 120px 200px 100px 120px',
              padding: '12px',
              borderBottom: '1px solid #f1f3f4',
              fontSize: '13px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.logo?.url ? (
                  <img 
                    src={item.logo.url} 
                    alt={typeof formatMultilingualContent(item.name) === 'string' ? formatMultilingualContent(item.name) : 'Stakeholder logo'} 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'contain', 
                      borderRadius: '4px',
                      border: '1px solid #e9ecef'
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: '#f8f9fa', 
                    borderRadius: '4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#6c757d', 
                    fontSize: '11px',
                    border: '1px solid #e9ecef',
                    textAlign: 'center'
                  }}>
                    No Logo
                  </div>
                )}
              </div>
              
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: '#212529' }}>
                  {typeof formatMultilingualContent(item.name) === 'string' 
                      ? formatMultilingualContent(item.name) 
                      : 'No name'
                  }
                </div>
              </div>
              
              {/* Type */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: item.type === 'Partner' ? '#e3f2fd' : '#f3e5f5',
                  color: item.type === 'Partner' ? '#1976d2' : '#7b1fa2'
                }}>
                  {item.type || 'Unknown'}
                </span>
              </div>
              
              {/* Website */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.website ? (
                  <a 
                    href={item.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    {item.website.replace(/^https?:\/\//, '').substring(0, 25)}
                    {item.website.length > 25 && '...'}
                  </a>
                ) : (
                  <span style={{ color: '#6c757d', fontSize: '12px' }}>No website</span>
                )}
              </div>
              
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: item.status === 'Published' ? '#d4edda' : '#f8d7da',
                  color: item.status === 'Published' ? '#155724' : '#721c24'
                }}>
                  {item.status || 'Unknown'}
                </span>
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <button
                  onClick={() => openEdit(item._id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  title="Edit stakeholder"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting === item._id}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: deleting === item._id ? '#6c757d' : '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '11px',
                    cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (deleting !== item._id) e.target.style.backgroundColor = '#c82333';
                  }}
                  onMouseLeave={(e) => {
                    if (deleting !== item._id) e.target.style.backgroundColor = '#dc3545';
                  }}
                  title="Delete stakeholder"
                >
                  <i className={`fas fa-${deleting === item._id ? 'spinner fa-spin' : 'trash'}`}></i>
                </button>
              </div>
            </div>
          ))}
          
          {!filteredStakeholders?.length && (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d',
              fontSize: '14px'
            }}>
              <i className="fas fa-handshake" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
              <div>
                {searchInput ? 'No stakeholders found matching your search' : 'No stakeholders found'}
              </div>
              {!searchInput && (
                <button
                  onClick={openCreate}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add First Stakeholder
                </button>
              )}
            </div>
          )}
        </div>

        {/* Render modals */}
        {modals.map(m => (
          <StakeholderFormModal
            key={m.id}
            isOpen={true}
            onClose={() => closeModal(m.id)}
            isEdit={m.mode === 'edit'}
            stakeholderData={m.data}
            onSave={async (data, file) => {
              const token = localStorage.getItem('authToken');
              if (m.mode === 'edit' && m.stakeholderId) {
                return await saveItem(m.stakeholderId, data, file, token, true);
              } else {
                return await saveItem(null, data, file, token, false);
              }
            }}
            minimized={m.minimized}
            modalId={m.id}
            onMinimize={() => {
              setModals(prev => prev.map(modal => 
                modal.id === m.id ? { ...modal, minimized: true } : modal
              ));
            }}
            onRestore={() => {
              setModals(prev => prev.map(modal => 
                modal.id === m.id ? { ...modal, minimized: false } : modal
              ));
            }}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default StakeholdersList;
