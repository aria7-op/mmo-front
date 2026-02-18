import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { useSingleProgram } from '../hooks/usePrograms';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatMultilingualContent, getImageUrlFromObject, getPlaceholderImage, stripHtmlTags } from '../utils/apiUtils';
import { useTranslation } from 'react-i18next';

const ProgramDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const { program, loading, error } = useSingleProgram(slug);

    if (loading) {
        return (
            <>
                <SEOHead page="homepage" />
                <HeaderV1 />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error || !program) {
        return null;
    }

    const programName = formatMultilingualContent(program.name, i18n.language);
    const programDescription = stripHtmlTags(formatMultilingualContent(program.description, i18n.language));
    const heroImage = getImageUrlFromObject(program.heroImage) || getPlaceholderImage(1200, 600);

    return (
        <>
            <SEOHead 
                page="homepage" 
                customMeta={{
                    title: `${programName} - Mission Mind Organization`,
                    description: programDescription.substring(0, 160),
                    keywords: `${programName}, Mission Mind Organization, Afghanistan programs`
                }} 
            />
            <HeaderV1 />
            <Breadcrumb pageTitle={programName} breadcrumb={t('breadcrumb.program', 'program')} />

            {/* Back to Programs button */}
            <div style={{ padding: '20px 0', background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
                    <button
                        onClick={() => {
                            const from = location.state && location.state.from;
                            if (from) navigate(from);
                            else if (window.history.length > 1) navigate(-1);
                            else navigate('/what-we-do');
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: isRTL ? 'auto' : 20,
                            right: isRTL ? 20 : 'auto',
                            background: 'transparent',
                            color: '#0f68bb',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ transform: isRTL ? 'scaleX(-1)' : 'none', color: 'inherit' }}></i>
                        <span style={{ color: 'inherit' }}>{t('programs.backToPrograms', 'Back to Programs')}</span>
                    </button>
                </div>
            </div>

            <div style={{ paddingTop: 20, paddingBottom: 60, background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Hero Image */}
                    <div style={{ marginBottom: 40, borderRadius: 12, overflow: 'hidden', height: 400, background: '#e9e9e9' }}>
                        <img
                            src={heroImage}
                            alt={programName}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            onError={(e) => e.target.src = getPlaceholderImage(1200, 600)}
                        />
                    </div>

                    {/* Article Header */}
                    <article style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
                        {/* Title */}
                        <h1 style={{ margin: '0 0 20px 0', fontSize: 32, lineHeight: 1.4, color: '#213547', fontWeight: 700 }}>
                            {programName}
                        </h1>

                        {/* Program Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
                            {program.status && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Status</p>
                                    <span style={{ 
                                        display: 'inline-block',
                                        background: program.status === 'active' ? '#e8f5e9' : '#f5f5f5',
                                        color: program.status === 'active' ? '#2e7d32' : '#666',
                                        padding: '6px 12px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>
                                        {program.status}
                                    </span>
                                </div>
                            )}
                            {program.startDate && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Start Date</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
                                        {new Date(program.startDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            )}
                            {program.beneficiaries > 0 && (
                                <div>
                                    <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Beneficiaries</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
                                        {program.beneficiaries.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ 
                            fontSize: 16, 
                            color: '#555', 
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            marginBottom: 30
                        }}>
                            {programDescription}
                        </div>

                        {/* Focus Areas */}
                        {program.focusAreas && program.focusAreas.length > 0 && (
                            <div style={{ marginBottom: 30 }}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700, color: '#213547' }}>Focus Areas</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                                    {program.focusAreas.map((area) => (
                                        <div key={area._id} style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e0e0e0' }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#213547' }}>
                                                {formatMultilingualContent(area.name, i18n.language)}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: 14, color: '#666', lineHeight: 1.5 }}>
                                                {stripHtmlTags(formatMultilingualContent(area.description, i18n.language)).substring(0, 100)}...
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Provinces */}
                        {program.provinces && program.provinces.length > 0 && (
                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700, color: '#213547' }}>Operating Provinces</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {program.provinces.map((province) => (
                                        <span key={province._id} style={{
                                            background: '#e9f0ff',
                                            color: '#0f68bb',
                                            padding: '8px 14px',
                                            borderRadius: 20,
                                            fontSize: 14,
                                            fontWeight: 600
                                        }}>
                                            {formatMultilingualContent(province.name, i18n.language)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProgramDetail;

