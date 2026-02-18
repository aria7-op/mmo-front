import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getAbout } from '../../services/about.service';
import { IMAGE_BASE_URL } from '../../config/api.config';

// Helper function to construct proper logo URL
const getLogoUrl = (logoPath) => {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  return `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`;
};

const AboutStats = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: () => getAbout(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Extract data from API response structure
  const apiData = data?.data || data;
  const male = apiData?.maleEmp ?? 0;
  const female = apiData?.femaleEmp ?? 0;
  const total = apiData?.totalEmp ?? male + female;
  const status = apiData?.status ?? '—';
  
  // Construct proper logo URL using IMAGE_BASE_URL, only use 'logo' field
  const logoUrl = getLogoUrl(apiData?.logo);

  return (
    <section className="about-stats-sec pt-60 pb-60">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="Organization Logo" 
                  style={{ 
                    height: '60px', 
                    marginRight: '16px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
              <div>
                <h2 className="mb-0">{t('about.aboutStatsTitle','Our Organization Stats')}</h2>
                {status && (
                  <p style={{ 
                    margin: '4px 0 0 0', 
                    fontSize: '14px', 
                    color: '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    Status: {status}
                  </p>
                )}
              </div>
            </div>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error.message || 'Failed to load stats'}</div>
            ) : (
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.maleEmployees','Male Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{male}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.femaleEmployees','Female Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{female}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.totalEmployees','Total Employees')}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{total}</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="p-3 border rounded">
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{t('about.status','Status')}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{status}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
