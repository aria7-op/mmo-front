import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderV1 from '../components/header/HeaderV1';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import Footer from '../components/footer/Footer';
import SEOHead from '../components/seo/SEOHead';
import { submitComplaintFeedback } from '../services/complaints.service';
import { toast } from 'react-toastify';
import { sanitizeByType } from '../utils/inputSanitizer';
import '../assets/css/complaints-form.css';

const ComplaintsFeedback = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'dr' || i18n.language === 'ps';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'feedback',
        subject: '',
        message: '',
        website: '' // honeypot
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [lastSubmitAt, setLastSubmitAt] = useState(0);

    const emailRegex = useMemo(() => /^(?:[a-zA-Z0-9_'^&\-])+(?:\.(?:[a-zA-Z0-9_'^&\-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i, []);

    const validate = (data) => {
        const e = {};
        const name = (data.name || '').trim();
        const email = (data.email || '').trim();
        const type = (data.type || '').trim();
        const subject = (data.subject || '').trim();
        const message = (data.message || '').trim();

        if (!name) e.name = t('complaintsPage.validation.nameRequired');
        else if (name.length < 2 || name.length > 100) e.name = t('complaintsPage.validation.nameLength');

        if (!email) e.email = t('complaintsPage.validation.emailRequired');
        else if (!emailRegex.test(email)) e.email = t('complaintsPage.validation.emailInvalid');

        if (!type) e.type = t('complaintsPage.validation.typeRequired');

        if (!subject) e.subject = t('complaintsPage.validation.subjectRequired');
        else if (subject.length < 5) e.subject = t('complaintsPage.validation.subjectMin');
        else if (subject.length > 150) e.subject = t('complaintsPage.validation.subjectMax');

        if (!message) e.message = t('complaintsPage.validation.messageRequired');
        else if (message.length < 20) e.message = t('complaintsPage.validation.messageMin');
        else if (message.length > 2000) e.message = t('complaintsPage.validation.messageMax');

        return e;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const inputType = type === 'email' ? 'email' : name === 'message' ? 'textarea' : 'text';
        const sanitizedValue = sanitizeByType(value, inputType);

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        
        // live clear error when user edits
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldErrors = validate({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
        } else if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Anti-bot: honeypot
        if (formData.website) {
            toast.error(t('complaintsPage.validation.honeypotDetected'));
            return;
        }
        // Cooldown: 10s
        const now = Date.now();
        if (now - lastSubmitAt < 10000) {
            toast.error(t('complaintsPage.validation.tooFast'));
            return;
        }

        const v = validate(formData);
        setErrors(v);
        if (Object.keys(v).length > 0) {
            // focus first error field
            const first = ['name','email','type','subject','message'].find((k) => v[k]);
            if (first) {
                const el = document.getElementById(first);
                if (el) el.focus();
            }
            return;
        }

        setSubmitting(true);
        try {
            // Data is already sanitized by handleChange
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                type: formData.type.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            };
            
            // Send form data to backend API
            await submitComplaintFeedback(payload);
            
            setLastSubmitAt(now);
            setFormData({
                name: '',
                email: '',
                type: 'feedback',
                subject: '',
                message: '',
                website: ''
            });
            e.target.reset();
        } catch (err) {
            // Error is already handled by the service with toast notifications
            console.error('Submission error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SEOHead page="homepage" customMeta={{
                title: t('complaintsPage.metaTitle'),
                description: t('complaintsPage.metaDescription')
            }} />
            <HeaderV1 />
            <Breadcrumb pageTitle={t('complaintsPage.title')} breadcrumb={t('complaintsPage.breadcrumb')} pageName="/complaints-feedback" />
            <div className={`complaints-page-sec pt-120 pb-100 ${isRTL ? 'rtl-direction' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div className="row">
                        <div style={{ width: '100%' }}>
                            <div className="complaints-content" style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #e8e8e8' }}>
                                <div style={{ borderBottom: '3px solid #1976d2', paddingBottom: '24px', marginBottom: '32px' }}>
                                    <h1 style={{ fontSize: '38px', marginBottom: '8px', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-0.8px' }}>{t('complaintsPage.heading')}</h1>
                                    <p className="lead" style={{ fontSize: '15px', lineHeight: '1.6', color: '#666666', marginBottom: '0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {t('complaintsPage.breadcrumb')}
                                    </p>
                                </div>
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555555', marginBottom: '40px', fontWeight: '400' }}>
                                    {t('complaintsPage.intro')}
                                </p>

                                <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
                                    <div className="row">
                                        <div className="col-md-6" style={{ marginBottom: '28px' }}>
                                             <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#222222', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('complaintsPage.form.name')} <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span></label>
                                             <input 
                                                 type="text" 
                                                 id="name"
                                                 name="name" 
                                                 className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                 style={{ 
                                                     padding: '12px 14px',
                                                     fontSize: '14px',
                                                     borderRadius: '8px',
                                                     border: errors.name ? '2px solid #d32f2f' : '1px solid #ddd',
                                                     transition: 'all 0.3s ease',
                                                     backgroundColor: errors.name ? '#fff3e0' : '#ffffff',
                                                     boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                     outline: 'none'
                                                 }}
                                                 onFocus={(e) => { e.target.style.borderColor = '#1976d2'; e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'; }}
                                                 onBlur={(e) => { 
                                                     e.target.style.borderColor = errors.name ? '#d32f2f' : '#ddd'; 
                                                     e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; 
                                                     handleBlur(e); 
                                                 }}
                                                 required
                                                 minLength={2}
                                                 maxLength={100}
                                                 value={formData.name}
                                                 onChange={handleChange}
                                                 autoComplete="name"
                                                 aria-invalid={!!errors.name}
                                                 aria-describedby={errors.name ? 'name-error' : undefined}
                                                 placeholder={t('complaintsPage.form.namePlaceholder')}
                                             />
                                             {errors.name && <div id="name-error" style={{ fontSize: '13px', color: '#d32f2f', marginTop: '6px', fontWeight: '500' }}>{errors.name}</div>}
                                         </div>

                                         <div className="col-md-6" style={{ marginBottom: '28px' }}>
                                             <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#222222', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('complaintsPage.form.email')} <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span></label>
                                             <input 
                                                 type="email" 
                                                 id="email"
                                                 name="email" 
                                                 className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                 style={{ 
                                                     padding: '12px 14px',
                                                     fontSize: '14px',
                                                     borderRadius: '8px',
                                                     border: errors.email ? '2px solid #d32f2f' : '1px solid #ddd',
                                                     transition: 'all 0.3s ease',
                                                     backgroundColor: errors.email ? '#fff3e0' : '#ffffff',
                                                     boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                     outline: 'none'
                                                 }}
                                                 onFocus={(e) => { e.target.style.borderColor = '#1976d2'; e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'; }}
                                                 onBlur={(e) => { 
                                                     e.target.style.borderColor = errors.email ? '#d32f2f' : '#ddd'; 
                                                     e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; 
                                                     handleBlur(e); 
                                                 }}
                                                 required
                                                 maxLength={254}
                                                 inputMode="email"
                                                 value={formData.email}
                                                 onChange={handleChange}
                                                 autoComplete="email"
                                                 aria-invalid={!!errors.email}
                                                 aria-describedby={errors.email ? 'email-error' : undefined}
                                                 placeholder={t('complaintsPage.form.emailPlaceholder')}
                                                 pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                                                 title={t('complaintsPage.validation.emailInvalid')}
                                                 spellCheck={false}
                                             />
                                             {errors.email && <div id="email-error" style={{ fontSize: '13px', color: '#d32f2f', marginTop: '6px', fontWeight: '500' }}>{errors.email}</div>}
                                         </div>

                                         <div className="col-md-12" style={{ marginBottom: '28px' }}>
                                             <label htmlFor="type" style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#222222', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('complaintsPage.form.type')} <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span></label>
                                             <select 
                                                 id="type"
                                                 name="type" 
                                                 className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                                 style={{ 
                                                     padding: '12px 14px',
                                                     fontSize: '14px',
                                                     borderRadius: '8px',
                                                     border: errors.type ? '2px solid #d32f2f' : '1px solid #ddd',
                                                     transition: 'all 0.3s ease',
                                                     backgroundColor: errors.type ? '#fff3e0' : '#ffffff',
                                                     cursor: 'pointer',
                                                     boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                     outline: 'none'
                                                 }}
                                                 onFocus={(e) => { e.target.style.borderColor = '#1976d2'; e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'; }}
                                                 onBlur={(e) => { 
                                                     e.target.style.borderColor = errors.type ? '#d32f2f' : '#ddd'; 
                                                     e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; 
                                                     handleBlur(e); 
                                                 }}
                                                 required
                                                 value={formData.type}
                                                 onChange={handleChange}
                                                 aria-invalid={!!errors.type}
                                                 aria-describedby={errors.type ? 'type-error' : undefined}
                                             >
                                                 <option value="feedback">{t('complaintsPage.form.typeOptions.feedback')}</option>
                                                 <option value="complaint">{t('complaintsPage.form.typeOptions.complaint')}</option>
                                                 <option value="suggestion">{t('complaintsPage.form.typeOptions.suggestion')}</option>
                                                 <option value="other">{t('complaintsPage.form.typeOptions.other')}</option>
                                             </select>
                                             {errors.type && <div id="type-error" style={{ fontSize: '13px', color: '#d32f2f', marginTop: '6px', fontWeight: '500', display: 'block' }}>{errors.type}</div>}
                                         </div>

                                         <div className="col-md-12" style={{ marginBottom: '28px' }}>
                                             <label htmlFor="subject" style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#222222', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('complaintsPage.form.subject')} <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span></label>
                                             <input 
                                                 type="text" 
                                                 id="subject"
                                                 name="subject" 
                                                 className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                 style={{ 
                                                     padding: '12px 14px',
                                                     fontSize: '14px',
                                                     borderRadius: '8px',
                                                     border: errors.subject ? '2px solid #d32f2f' : '1px solid #ddd',
                                                     transition: 'all 0.3s ease',
                                                     backgroundColor: errors.subject ? '#fff3e0' : '#ffffff',
                                                     boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                     outline: 'none'
                                                 }}
                                                 onFocus={(e) => { e.target.style.borderColor = '#1976d2'; e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'; }}
                                                 onBlur={(e) => { 
                                                     e.target.style.borderColor = errors.subject ? '#d32f2f' : '#ddd'; 
                                                     e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; 
                                                     handleBlur(e); 
                                                 }}
                                                 required
                                                 minLength={5}
                                                 maxLength={150}
                                                 value={formData.subject}
                                                 onChange={handleChange}
                                             />
                                             {errors.subject && <div id="subject-error" style={{ fontSize: '13px', color: '#d32f2f', marginTop: '6px', fontWeight: '500' }}>{errors.subject}</div>}
                                         </div>

                                         <div className="col-md-12" style={{ marginBottom: '28px' }}>
                                             <label htmlFor="message" style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#222222', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('complaintsPage.form.message')} <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span></label>
                                             <textarea 
                                                 id="message"
                                                 name="message" 
                                                 className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                 style={{ 
                                                     padding: '12px 14px',
                                                     fontSize: '14px',
                                                     borderRadius: '8px',
                                                     border: errors.message ? '2px solid #d32f2f' : '1px solid #ddd',
                                                     transition: 'all 0.3s ease',
                                                     backgroundColor: errors.message ? '#fff3e0' : '#ffffff',
                                                     fontFamily: 'inherit',
                                                     resize: 'vertical',
                                                     minHeight: '140px',
                                                     boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                     outline: 'none'
                                                 }}
                                                 onFocus={(e) => { e.target.style.borderColor = '#1976d2'; e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'; }}
                                                 onBlur={(e) => { 
                                                     e.target.style.borderColor = errors.message ? '#d32f2f' : '#ddd'; 
                                                     e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; 
                                                     handleBlur(e); 
                                                 }}
                                                 aria-invalid={!!errors.message}
                                                 aria-describedby={errors.message ? 'message-error' : undefined}
                                                 placeholder={t('complaintsPage.form.messagePlaceholder')}
                                                 spellCheck
                                             ></textarea>
                                             {errors.message && <div id="message-error" style={{ fontSize: '13px', color: '#d32f2f', marginTop: '6px', fontWeight: '500' }}>{errors.message}</div>}
                                         </div>

                                         <div className="col-md-12" style={{ marginTop: '32px' }}>
                                             <button 
                                                 type="submit" 
                                                 className="btn btn-primary" 
                                                 disabled={submitting}
                                                 style={{ 
                                                     padding: '14px 40px', 
                                                     fontSize: '15px', 
                                                     fontWeight: '700',
                                                     borderRadius: '8px',
                                                     transition: 'all 0.3s ease',
                                                     border: 'none',
                                                     cursor: submitting ? 'not-allowed' : 'pointer',
                                                     opacity: submitting ? 0.7 : 1,
                                                     minWidth: '180px',
                                                     boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                     letterSpacing: '0.5px'
                                                 }}
                                                 onMouseEnter={(e) => !submitting && (e.target.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)', e.target.style.transform = 'translateY(-2px)')}
                                                 onMouseLeave={(e) => !submitting && (e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)', e.target.style.transform = 'translateY(0)')}
                                             >
                                                 {submitting ? (
                                                     <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                         <span style={{ 
                                                             display: 'inline-block', 
                                                             width: '14px', 
                                                             height: '14px', 
                                                             border: '2px solid rgba(255, 255, 255, 0.3)', 
                                                             borderTopColor: '#ffffff',
                                                             borderRadius: '50%',
                                                             animation: 'spin 0.8s linear infinite'
                                                         }}></span>
                                                         {t('complaintsPage.form.submitting', 'Submitting...')}
                                                     </span>
                                                 ) : (
                                                     t('complaintsPage.form.submit')
                                                 )}
                                             </button>
                                         </div>
                                     </div>

                                    {/* Honeypot anti-bot field */}
                                    <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                                        <label htmlFor="website">Do not fill this field</label>
                                        <input
                                          type="text"
                                          id="website"
                                          name="website"
                                          tabIndex={-1}
                                          autoComplete="off"
                                          value={formData.website}
                                          onChange={handleChange}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ComplaintsFeedback;




