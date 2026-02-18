import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMultilingualContent, getImageUrlFromObject, stripHtmlTags } from '../../utils/apiUtils';

// SVG Icons
const TargetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6 6v10z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="m14 2-6 6 6" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="2" width="6" height="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 4h2a2 2 0 0 1 2v14a2 2 0 0 1-2h-2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 18H6l-2 2v2h16v-2l-2-2h-2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="m21 21-4.35-2.65-2.65-2.65a2 2 0 0 0-2.83 0l-1.17-1.17" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 6 9 17 4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M20 12a8 8 0 0 1-8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="12 6 12 12 12 12" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const DetailView = ({
  // Core data
  item,
  title,
  description,
  imageUrl,
  
  // Configuration
  showHero = true,
  showStatistics = true,
  showStatus = true,
  showDescription = true,
  
  // Navigation
  backToListPath,
  backToListText,
  
  // Styling
  heroHeight = '400px',
  heroIcon = '🎯',
  typeLabel = 'Item',
  
  // Custom classes
  containerClass = '',
  heroClass = '',
  contentClass = ''
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!item && !title) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        margin: '40px 0'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#f1f5f9',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '3rem'
        }}><SearchIcon /></div>
        <h3 style={{
          color: '#6b7280',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          {t('common.itemNotFound', 'Item Not Found')}
        </h3>
        <p style={{
          color: '#64748b',
          fontSize: '1rem',
          marginBottom: '24px'
        }}>
          {t('common.itemNotFoundDesc', 'The item you are looking for could not be found or may have been removed.')}
        </p>
        <Link
          to={backToListPath || '/'}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#0f68bb',
            color: '#ffffff',
            fontWeight: '500',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0a4f9d';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0f68bb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>←</span>
          {backToListText || t('common.backToList', 'Back to list')}
        </Link>
      </div>
    );
  }

  const displayTitle = title || (item?.name ? formatMultilingualContent(item.name) : '');
  const displayDescription = description || (item?.description ? stripHtmlTags(formatMultilingualContent(item.description)) : '');
  const displayImageUrl = imageUrl || (item?.image ? getImageUrlFromObject(item.image) : null);

  return (
    <div className={`detail-view ${containerClass}`} style={{ display: 'grid', gap: '40px' }}>
      {/* Hero Section */}
      {showHero && (
        <div className={`detail-hero ${heroClass}`} style={{ 
          position: 'relative',
          height: heroHeight,
          borderRadius: '16px',
          overflow: 'hidden',
          background: displayImageUrl ? 
            `linear-gradient(135deg, rgba(15, 104, 187, 0.9), rgba(15, 104, 187, 0.7)), url(${displayImageUrl})` : 
            'linear-gradient(135deg, #0f68bb 0%, #0a4f9d 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}>
            <div style={{ textAlign: 'center', color: '#ffffff', maxWidth: '800px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                backdropFilter: 'blur(10px)',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}><TargetIcon /></span>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>{typeLabel}</span>
              </div>
              <h1 style={{
                margin: 0,
                fontSize: '2.5rem',
                fontWeight: '800',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                lineHeight: '1.2'
              }}>{displayTitle}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <article className={`detail-content ${contentClass}`} style={{ 
        background: '#ffffff', 
        borderRadius: '16px', 
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Content Header */}
        <div style={{ 
          padding: '30px 40px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                {/* Status Badge */}
                {showStatus && item?.status && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: item.status === 'Published' ? '#10b981' : '#f59e0b',
                    borderRadius: '20px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    <span style={{ fontSize: '1rem', color: '#ffffff' }}>
                      {item.status === 'Published' ? <CheckIcon /> : <ClockIcon />}
                    </span>
                    {item.status}
                  </div>
                )}
                
                {/* Statistics */}
                {showStatistics && item?.statistics && (
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    {item.statistics.beneficiaries !== undefined && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontSize: '1.2rem', color: '#0f68bb' }}><UsersIcon /></span>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1' }}>Beneficiaries</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>
                            {item.statistics.beneficiaries || 0}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {item.statistics.projects !== undefined && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontSize: '1.2rem', color: '#0f68bb' }}><ClipboardIcon /></span>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1' }}>Projects</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>
                            {item.statistics.projects || 0}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {backToListPath && (
                <Link
                  to={backToListPath}
                  aria-label={t('common.backToList', 'Back to list')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0f68bb',
                    color: '#ffffff',
                    fontWeight: '500',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0a4f9d';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0f68bb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>←</span>
                  {backToListText || t('common.backToList', 'Back to list')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {showDescription && displayDescription && (
          <div style={{ padding: '40px' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              lineHeight: '1.8'
            }}>
              <h3 style={{
                color: '#1e293b',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.5rem', color: '#0f68bb' }}><DocumentIcon /></span>
                {t('common.description', 'Description')}
              </h3>
              <p style={{
                color: '#374151',
                fontSize: '1.1rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                lineHeight: '1.8'
              }}>{displayDescription}</p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default DetailView;
