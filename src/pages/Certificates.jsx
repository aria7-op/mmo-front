import React from 'react';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useCertificates } from '../hooks/useCertificates';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Certificates = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { certificates, loading, error } = useCertificates();

    // Client-side pagination
    const [page, setPage] = React.useState(1);
    const pageSize = 8;

    // Responsive columns: 1 (mobile) / 2 (tablet) / 3 (desktop)
    const [columns, setColumns] = React.useState(3);
    React.useEffect(() => {
        const computeCols = () => {
            const w = window.innerWidth;
            if (w < 576) return 1; // mobile
            if (w < 992) return 2; // tablet
            return 3; // desktop
        };
        const onResize = () => setColumns(computeCols());
        setColumns(computeCols());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const totalPages = Math.max(1, Math.ceil((certificates.length || 0) / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCertificates = certificates.slice(startIndex, startIndex + pageSize);

    React.useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [certificates.length, totalPages]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <>
            <SEOHead 
                page="certificates" 
                customMeta={{
                    title: 'Certificates - Mission Mind Organization',
                    description: 'View certificates awarded by Mission Mind Organization for various programs and achievements.',
                    keywords: 'certificates, achievements, programs, Mission Mind Organization Afghanistan'
                }} 
            />
            <HeaderV1 />
            <Breadcrumb 
                pageTitle="Certificates" 
                breadcrumb="Certificates" 
                backgroundImage="/img/background/acdo-what-we-do-hero-bg.jpg" 
                pageName="/resources/certificates"
            />
            
            {loading && (
                <div style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
            )}
            
            {!loading && (
                <div className={`certificates-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
                        <div style={{ marginBottom: 60 }}>
                            <div style={{ marginBottom: 40 }}>
                                <h1 style={{ margin: '0 0 16px 0', fontSize: 40, fontWeight: 700, color: '#213547' }}>
                                    Certificates
                                </h1>
                                <p style={{ color: '#6b7785', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                                    Explore certificates awarded by Mission Mind Organization for program completion and outstanding achievements.
                                </p>
                            </div>
                        </div>

                        {error ? (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <p style={{ color: '#dc3545', fontSize: 16 }}>{error}</p>
                            </div>
                        ) : paginatedCertificates && paginatedCertificates.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 24 }}>
                                {paginatedCertificates.map((certificate, index) => (
                                    <article
                                        key={`${certificate._id}-${index}`}
                                        style={{
                                            background: '#fff',
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            boxShadow: '0 6px 18px rgba(12,34,56,0.06)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(12,34,56,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(12,34,56,0.06)';
                                        }}
                                    >
                                        <div style={{ 
                                            width: '100%', 
                                            height: 200, 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                textAlign: 'center',
                                                color: '#fff',
                                                padding: '20px'
                                            }}>
                                                <div style={{
                                                    fontSize: 48,
                                                    marginBottom: 10,
                                                    opacity: 0.9
                                                }}>
                                                    🏆
                                                </div>
                                                <div style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    opacity: 0.8
                                                }}>
                                                    Certificate
                                                </div>
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '4px 8px',
                                                borderRadius: 4,
                                                fontSize: 12,
                                                color: '#fff'
                                            }}>
                                                {certificate.certificateId}
                                            </div>
                                        </div>
                                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                                            <h4 style={{ 
                                                margin: 0, 
                                                fontSize: 20, 
                                                fontWeight: 700, 
                                                color: '#213547',
                                                textAlign: 'center'
                                            }}>
                                                {certificate.recipientName}
                                            </h4>
                                            <div style={{ 
                                                textAlign: 'center',
                                                padding: '12px 0',
                                                borderTop: '1px solid #f0f0f0',
                                                borderBottom: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ 
                                                    fontSize: 16, 
                                                    fontWeight: 600, 
                                                    color: '#0f68bb',
                                                    marginBottom: 4
                                                }}>
                                                    {certificate.courseTitle}
                                                </div>
                                                <div style={{ 
                                                    fontSize: 14, 
                                                    color: '#6b7785'
                                                }}>
                                                    Instructor: {certificate.instructorName}
                                                </div>
                                            </div>
                                            {certificate.description && (
                                                <p style={{ 
                                                    color: '#6b7785', 
                                                    fontSize: 14, 
                                                    margin: 0, 
                                                    lineHeight: 1.6,
                                                    textAlign: 'center',
                                                    fontStyle: 'italic'
                                                }}>
                                                    "{certificate.description.length > 120 
                                                        ? certificate.description.slice(0, 120) + '...' 
                                                        : certificate.description}"
                                                </p>
                                            )}
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginTop: 'auto',
                                                paddingTop: 12,
                                                fontSize: 12,
                                                color: '#999'
                                            }}>
                                                <div>
                                                    Issued: {formatDate(certificate.issueDate)}
                                                </div>
                                                <div>
                                                    Completed: {formatDate(certificate.completionDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 60 }}>
                                <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.5 }}>
                                    📜
                                </div>
                                <h3 style={{ color: '#6b7785', fontSize: 20, marginBottom: 12 }}>
                                    No Certificates Found
                                </h3>
                                <p style={{ color: '#999', fontSize: 16, margin: 0 }}>
                                    No certificates have been awarded yet. Check back later for updates.
                                </p>
                            </div>
                        )}

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div role="navigation" aria-label="Certificates pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 40 }}>
                                <button
                                    type="button"
                                    aria-label="Previous page"
                                    title="Previous page"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                    style={{ 
                                        minWidth: 44, 
                                        height: 44, 
                                        padding: '8px 14px', 
                                        borderRadius: 6, 
                                        border: '1px solid #ddd', 
                                        background: currentPage <= 1 ? '#f3f3f3' : '#fff', 
                                        cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', 
                                        outline: '2px solid transparent', 
                                        outlineOffset: 2 
                                    }}
                                    onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                    onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                >
                                    Previous
                                </button>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const n = idx + 1;
                                        const isActive = n === currentPage;
                                        return (
                                            <button
                                                key={n}
                                                type="button"
                                                aria-label={`Go to page ${n}`}
                                                title={`Go to page ${n}`}
                                                aria-current={isActive ? 'page' : undefined}
                                                onClick={() => setPage(n)}
                                                disabled={isActive}
                                                style={{
                                                    minWidth: 44,
                                                    height: 44,
                                                    borderRadius: 6,
                                                    border: '1px solid #ddd',
                                                    background: isActive ? '#0f68bb' : '#fff',
                                                    color: isActive ? '#fff' : '#333',
                                                    cursor: isActive ? 'default' : 'pointer',
                                                    fontWeight: 600,
                                                    outline: '2px solid transparent',
                                                    outlineOffset: 2
                                                }}
                                                onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                                onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    aria-label="Next page"
                                    title="Next page"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    style={{ 
                                        minWidth: 44, 
                                        height: 44, 
                                        padding: '8px 14px', 
                                        borderRadius: 6, 
                                        border: '1px solid #ddd', 
                                        background: currentPage >= totalPages ? '#f3f3f3' : '#fff', 
                                        cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', 
                                        outline: '2px solid transparent', 
                                        outlineOffset: 2 
                                    }}
                                    onFocus={(e) => e.currentTarget.style.outline = '2px solid #0f68bb'}
                                    onBlur={(e) => e.currentTarget.style.outline = '2px solid transparent'}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <Footer />
        </>
    );
};

export default Certificates;
