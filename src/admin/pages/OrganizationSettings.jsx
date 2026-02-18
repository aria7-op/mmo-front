/**
 * Organization Settings Page - Modern styling consistent with other admin pages
 * Manage organization profile and settings with consistent design patterns
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import OrganizationProfileFormModal from '../components/OrganizationProfileFormModal';
import { getOrganization } from '../../services/organization.service';
import { useQueryClient } from '@tanstack/react-query';

const OrganizationSettings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [serverData, setServerData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getOrganization();
        if (data) {
          setServerData(data);
        }
      } catch (e) {
        // Keep defaults for create
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (data) => {
    // Invalidate related queries after save
    queryClient.invalidateQueries({ queryKey: ['organization'] });
    queryClient.invalidateQueries({ queryKey: ['organizationProfile','main'] });
    queryClient.invalidateQueries({ queryKey: ['organizationProfile'] });
    
    // Reload server data
    try {
      const updatedData = await getOrganization();
      setServerData(updatedData);
    } catch (e) {
      console.error('Failed to reload data:', e);
    }
    
    setIsModalOpen(false);
  };

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
              {t('admin.organizationProfileSettings', 'Organization Profile & Settings')}
            </h2>
            {serverData && (
              <p className="text-muted mb-0">
                <small>
                  {t('admin.id', 'ID')}: {serverData._id}
                </small>
              </p>
            )}
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={async () => {
                try {
                  const data = await getOrganization();
                  setServerData(data);
                } catch (e) {
                  console.error('Failed to refresh data:', e);
                }
              }}
              disabled={loading}
            >
              {t('common.refresh', 'Refresh')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-4">
                {t('admin.manageOrganizationProfile', 'Manage your organization profile information including name, registration details, and structure')}
              </p>
              
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                {serverData ? t('admin.editOrganizationProfile', 'Edit Organization Profile') : t('admin.createOrganizationProfile', 'Create Organization Profile')}
              </button>

              {serverData && (
                <div className="mt-4 pt-4 border-top">
                  <h5 className="mb-3">
                    {t('admin.currentInformation', 'Current Information')}
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-muted">{t('admin.name', 'Name')}:</strong>
                        <div className="ms-2">{serverData.organizationName?.en || t('admin.notSet', 'Not set')}</div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">{t('admin.registrationNumber', 'Registration Number')}:</strong>
                        <div className="ms-2">{serverData.registrationNumber || t('admin.notSet', 'Not set')}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-muted">{t('admin.registrationDate', 'Registration Date')}:</strong>
                        <div className="ms-2">
                          {serverData.registrationDate 
                            ? new Date(serverData.registrationDate).toLocaleDateString() 
                            : t('admin.notSet', 'Not set')
                          }
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">{t('admin.lastUpdated', 'Last Updated')}:</strong>
                        <div className="ms-2">
                          {serverData.updatedAt 
                            ? new Date(serverData.updatedAt).toLocaleString() 
                            : t('admin.never', 'Never')
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <OrganizationProfileFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isEdit={!!serverData}
          initialData={serverData}
        />
      </div>
    </AdminLayout>
  );
};

export default OrganizationSettings;



