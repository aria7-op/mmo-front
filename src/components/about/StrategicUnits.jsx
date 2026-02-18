import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getStrategicUnits } from '../../services/organizationProfile.service';
import { formatMultilingualContent, stripHtmlTags } from '../../utils/apiUtils';

const StrategicUnits = () => {
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['organizationProfile','strategicUnits'],
    queryFn: () => getStrategicUnits(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const payload = data?.data || data;
  const units = Array.isArray(payload) ? payload : (Array.isArray(payload?.strategicUnits) ? payload.strategicUnits : []);

  return (
    <div id="strategic-units" className="strategic-units-sec" style={{ 
      padding: '60px 0', 
      backgroundColor: '#f8fafc',
      marginBottom: '40px'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ 
                color: '#1e293b', 
                fontWeight: '700',
                fontSize: '2.2rem',
                marginBottom: '15px'
              }}>{t('about.strategicUnits','Strategic Units')}</h2>
              <div style={{
                width: '80px',
                height: '4px',
                backgroundColor: '#0f68bb',
                margin: '0 auto',
                borderRadius: '2px'
              }}></div>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: '4px solid #f3f4f6', 
                  borderTop: '4px solid #0f68bb', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
                <style>{`@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
              </div>
            ) : error ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626'
              }}>
                {error?.message || t('about.errorLoadingStrategicUnits','Failed to load strategic units')}
              </div>
            ) : units.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0',
                color: '#64748b'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem',
                  color: '#94a3b8'
                }}>📋</div>
                <p style={{ fontSize: '1.1rem', margin: 0 }}>
                  {t('about.noStrategicUnits','No strategic units available.')}
                </p>
              </div>
            ) : (
              <div className="row" style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                marginLeft: '-15px',
                marginRight: '-15px'
              }}>
                {units.map((unit, index) => (
                  <div key={index} className="col-lg-6 col-md-6 mb-4" style={{
                    flex: '0 0 50%',
                    maxWidth: '50%',
                    paddingLeft: '15px',
                    paddingRight: '15px'
                  }}>
                    <div className="unit-card" style={{
                      backgroundColor: '#ffffff',
                      padding: '30px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Icon/Number */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#0f68bb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {index + 1}
                      </div>
                      
                      {/* Content */}
                      <div style={{ paddingRight: '50px' }}>
                        <h4 style={{
                          color: '#1e293b',
                          fontWeight: '600',
                          fontSize: '1.3rem',
                          marginBottom: '15px',
                          lineHeight: '1.3'
                        }}>
                          {typeof unit === 'string' ? unit : formatMultilingualContent(unit?.name) || t('about.unitN', { n: index + 1, defaultValue: 'Unit {{n}}' })}
                        </h4>
                        {unit?.description ? (
                          <p style={{
                            color: '#475569',
                            lineHeight: '1.6',
                            fontSize: '1rem',
                            margin: 0
                          }}>
                            {stripHtmlTags(formatMultilingualContent(unit.description))}
                          </p>
                        ) : (
                          <p style={{
                            color: '#94a3b8',
                            fontStyle: 'italic',
                            margin: 0
                          }}>
                            {t('about.noDescription','No description available.')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicUnits;


