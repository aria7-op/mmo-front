import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { 
    getAllPageSettings, 
    getPageSettingsByName,
    createPageSettings, 
    updatePageSettings,
    deletePageSettings,
    updateHeroImage,
    updateBodyImage 
} from '../../services/pageSettings.service';
import {
  getHomeSettings as getHomeSettingsApi,
  upsertHomeSettingsMultipart as upsertHomeSettingsMultipartApi,
  updateHomeSettingsMultipart as updateHomeSettingsMultipartApi,
  upsertHomeHeroImages as upsertHomeHeroImagesApi,
  addHomeHeroImages as addHomeHeroImagesApi,
  updateHomeHeroImageByIndex as updateHomeHeroImageByIndexApi,
  deleteHomeHeroImageByIndex as deleteHomeHeroImageByIndexApi,
  deleteHomeHeroImageByUrl as deleteHomeHeroImageByUrlApi,
  saveHomeHeroImagesStrict as saveHomeHeroImagesStrictApi,
  upsertHomeBodyImage as upsertHomeBodyImageApi,
  deleteHomeSettings as deleteHomeSettingsApi
} from '../../services/home.service';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL } from '../../config/api.config';
import { getImageUrlFromObject } from '../../utils/apiUtils';

// Comprehensive selectable pages based on actual frontend routes
// Values include translation key and default label so labels are localized at render time
const PAGE_OPTIONS = [
    { group: 'Main Pages', options: [
        { value: '/', labelKey: 'navigation.home', defaultLabel: 'Home' },
        { value: '/about', labelKey: 'navigation.about', defaultLabel: 'About' },
        { value: '/contact', labelKey: 'navigation.contact', defaultLabel: 'Contact Us' },
        { value: '/donation', labelKey: 'navigation.donate', defaultLabel: 'Donate' },
        { value: '/volunteer', labelKey: 'navigation.getInvolved', defaultLabel: 'Volunteer' },
        { value: '/what-we-do', labelKey: 'whatWeDo.title', defaultLabel: 'What We Do' },
        { value: '/programs', labelKey: 'navigation.programs', defaultLabel: 'Programs' },
        { value: '/projects', labelKey: 'navigation.projects', defaultLabel: 'Projects' },
        { value: '/resources', labelKey: 'navigation.resources', defaultLabel: 'Resources' },
        { value: '/competencies', labelKey: 'navigation.competencies', defaultLabel: 'Competencies' },
        { value: '/stakeholders', labelKey: 'navigation.stakeholders', defaultLabel: 'Stakeholders' },
        { value: '/search', labelKey: 'navigation.search', defaultLabel: 'Search' }
    ]},
    { group: 'About Pages', options: [
        { value: '/about/our-story', labelKey: 'about.ourStory', defaultLabel: 'Our Story' },
        { value: '/about/mission-vision', labelKey: 'about.missionVision', defaultLabel: 'Mission & Vision' },
        { value: '/about/organization-profile', labelKey: 'about.organizationProfile', defaultLabel: 'Organization Profile' },
        { value: '/about/strategic-units', labelKey: 'about.strategicUnits', defaultLabel: 'Strategic Units' },
        { value: '/about/board-directors', labelKey: 'about.boardDirectors', defaultLabel: 'Board of Directors' },
        { value: '/about/executive-team', labelKey: 'about.executiveTeam', defaultLabel: 'Executive Team' },
        { value: '/about/goals-objectives', labelKey: 'about.goalsObjectives', defaultLabel: 'Goals & Objectives' },
        { value: '/about/departments', labelKey: 'about.departments', defaultLabel: 'Departments' },
        { value: '/about/strategic-partnerships', labelKey: 'about.strategicPartnerships', defaultLabel: 'Strategic Partnerships' },
        { value: '/about/coverage-area', labelKey: 'about.coverageArea', defaultLabel: 'Coverage Area' },
        { value: '/about/organizational-structure', labelKey: 'about.orgStructure', defaultLabel: 'Organizational Structure' },
        { value: '/about/team', labelKey: 'about.team', defaultLabel: 'Team' },
        { value: '/about/volunteers', labelKey: 'about.volunteers', defaultLabel: 'Volunteers' }
    ]},
    { group: 'What We Do', options: [
        { value: '/what-we-do/focus-areas', labelKey: 'whatWeDo.focusAreas.title', defaultLabel: 'Focus Areas' },
        { value: '/what-we-do/geographic-coverage', labelKey: 'whatWeDo.geographicCoverage.title', defaultLabel: 'Geographic Coverage' },
        { value: '/what-we-do/monitoring-evaluation', labelKey: 'whatWeDo.monitoringEvaluation.title', defaultLabel: 'Monitoring & Evaluation' }
    ]},
    { group: 'Programs', options: [
        { value: '/programs/stay-in-afghanistan', labelKey: 'programs.stayInAfghanistan', defaultLabel: 'Stay in Afghanistan' },
        { value: '/programs/sitc', labelKey: 'programs.sitc', defaultLabel: 'SITC' },
        { value: '/programs/taaban', labelKey: 'programs.taaban', defaultLabel: 'TAABAN' },
        { value: '/programs/emergency-response', labelKey: 'programs.emergencyResponse', defaultLabel: 'Emergency Response' }
    ]},
    { group: 'Projects', options: [
        { value: '/projects/completed', labelKey: 'projects.completed', defaultLabel: 'Completed Projects' },
        { value: '/projects/ongoing', labelKey: 'projects.ongoing', defaultLabel: 'Ongoing Projects' }
    ]},
    { group: 'Resources', options: [
        { value: '/resources/news-events', labelKey: 'resources.newsEvents', defaultLabel: 'News & Events' },
        { value: '/resources/reports', labelKey: 'resources.reports', defaultLabel: 'Reports & Publications' },
        { value: '/resources/annual-reports', labelKey: 'resources.annualReports', defaultLabel: 'Annual Reports' },
        { value: '/resources/success-stories', labelKey: 'resources.successStories', defaultLabel: 'Success Stories' },
        { value: '/resources/case-studies', labelKey: 'resources.caseStudies', defaultLabel: 'Case Studies' },
        { value: '/resources/certificates', labelKey: 'resources.certificates', defaultLabel: 'Certificates' },
        { value: '/resources/rfq', labelKey: 'resources.rfqRfp', defaultLabel: 'RFQ/RFP' },
        { value: '/resources/policies', labelKey: 'resources.policies', defaultLabel: 'Policies' },
        { value: '/resources/jobs', labelKey: 'resources.jobs', defaultLabel: 'Jobs' }
    ]},
    { group: 'Gallery', options: [
        { value: '/gallery-full', labelKey: 'navigation.gallery', defaultLabel: 'Gallery (Full)' },
        { value: '/gallery3-column', labelKey: 'navigation.gallery', defaultLabel: 'Gallery (3 Column)' },
        { value: '/gallery4-column', labelKey: 'navigation.gallery', defaultLabel: 'Gallery (4 Column)' }
    ]},
    { group: 'Blog', options: [
        { value: '/blog-classic', labelKey: 'navigation.blog', defaultLabel: 'Blog Classic' },
        { value: '/blog-2', labelKey: 'navigation.blog', defaultLabel: 'Blog 2 Column' },
        { value: '/blog-3', labelKey: 'navigation.blog', defaultLabel: 'Blog 3 Column' }
    ]},
    { group: 'Events', options: [
        { value: '/event-sidebar', labelKey: 'navigation.events', defaultLabel: 'Event Sidebar' },
        { value: '/event-full', labelKey: 'navigation.events', defaultLabel: 'Event Full' },
        { value: '/event-details', labelKey: 'navigation.events', defaultLabel: 'Event Details' }
    ]},
    { group: 'Causes', options: [
        { value: '/cause-list', labelKey: 'navigation.causes', defaultLabel: 'Cause List' },
        { value: '/cause-2', labelKey: 'navigation.causes', defaultLabel: 'Cause 2 Column' },
        { value: '/cause-3', labelKey: 'navigation.causes', defaultLabel: 'Cause 3 Column' },
        { value: '/cause-details', labelKey: 'navigation.causes', defaultLabel: 'Cause Details' }
    ]},
    { group: 'Shop', options: [
        { value: '/shop', labelKey: 'navigation.shop', defaultLabel: 'Shop' },
        { value: '/product-details', labelKey: 'navigation.shop', defaultLabel: 'Product Details' },
        { value: '/cart', labelKey: 'navigation.shop', defaultLabel: 'Cart' },
        { value: '/check-out', labelKey: 'navigation.shop', defaultLabel: 'Checkout' }
    ]},
    { group: 'Legal & Policies', options: [
        { value: '/terms-of-use', labelKey: 'navigation.termsOfUse', defaultLabel: 'Terms of Use' },
        { value: '/privacy-policy', labelKey: 'navigation.privacyPolicy', defaultLabel: 'Privacy Policy' },
        { value: '/cookies-settings', labelKey: 'navigation.cookiesSettings', defaultLabel: 'Cookies Settings' },
        { value: '/ethics-compliance', labelKey: 'navigation.ethicsCompliance', defaultLabel: 'Ethics & Compliance' },
        { value: '/complaints-feedback', labelKey: 'navigation.complaintsFeedback', defaultLabel: 'Complaints & Feedback' }
    ]},
    { group: 'Other Pages', options: [
        { value: '/account', labelKey: 'navigation.account', defaultLabel: 'Account' },
        { value: '/not-found', labelKey: 'navigation.notFound', defaultLabel: '404 Page' }
    ]}
];

const PageSettingsForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState('/');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isExisting, setIsExisting] = useState(false);
    const [existingId, setExistingId] = useState(null);
    
    const [formData, setFormData] = useState({
        pageName: '/',
        title: { en: '', per: '', ps: '' },
        description: { en: '', per: '', ps: '' },
        metadata: {}
    });
    
    const [heroImage, setHeroImage] = useState(null); // single (non-home)
    const [heroImages, setHeroImages] = useState([]); // multiple (home)
    const [heroPreview, setHeroPreview] = useState(null); // single preview
    const [heroExistingPreviews, setHeroExistingPreviews] = useState([]); // deprecated previews list
    const [heroExisting, setHeroExisting] = useState([]); // existing items with meta
    const [heroPreviews, setHeroPreviews] = useState([]); // newly added previews
    const [heroOrder, setHeroOrder] = useState([]); // [{type:'existing'|'new', index:number}]
    const [bodyImage, setBodyImage] = useState(null); // single body image
    const [bodyPreview, setBodyPreview] = useState(null);
    const [hasExistingBodyImage, setHasExistingBodyImage] = useState(false); // track if we loaded an existing body image
    const [hasExistingHeroImage, setHasExistingHeroImage] = useState(false); // track if we loaded an existing image

    const heroMultiInputRef = useRef(null);

    // Per-new-image meta (localized title/description)
    const [heroNewMeta, setHeroNewMeta] = useState([]); // aligns with heroImages
    const [heroDeleteUrls, setHeroDeleteUrls] = useState([]); // existing urls to delete permanently

    // Load all page settings on mount
    useEffect(() => {
        loadPageSettings();
    }, []);

    // Load selected page settings
    useEffect(() => {
        loadPageData(selectedPage);
    }, [selectedPage]);

    const loadPageSettings = async () => {
        try {
            setLoading(true);
            const response = await getAllPageSettings();
            if (response.success) {
                setPages(response.data || []);
            }
        } catch (err) {
            setError('Failed to load page settings: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const loadPageData = async (pageName) => {
        try {
            setLoading(true);
            setError('');
            // Normalize: prefer route keys, but accept legacy
            const mapLegacyToRoute = { home: '/', about: '/about', contact: '/contact', donate: '/donation', donation: '/donation', blog: '/blog-classic', events: '/event-full', team: '/about/team', gallery: '/gallery-full' };
            const mapRouteToLegacy = Object.fromEntries(Object.entries(mapLegacyToRoute).map(([k, v]) => [v, k]));
            const tryKeys = [pageName];
            if (pageName.startsWith('/') && mapRouteToLegacy[pageName]) tryKeys.push(mapRouteToLegacy[pageName]);
            if (!pageName.startsWith('/') && mapLegacyToRoute[pageName]) tryKeys.push(mapLegacyToRoute[pageName]);

            let response;
            if (tryKeys[0] === 'home') {
                response = await getHomeSettingsApi();
            } else {
                response = await getPageSettingsByName(tryKeys[0]);
            }
            if ((!response?.success || !response?.data) && tryKeys[1]) {
                const fallback = tryKeys[1] === 'home' ? await getHomeSettingsApi() : await getPageSettingsByName(tryKeys[1]);
                if (fallback?.success && fallback?.data) {
                  response = fallback;
                }
            }
            
            if (response.success && response.data) {
                const data = response.data;
                console.log('PageSettingsForm - Loaded page data:', data);
                setIsExisting(true);
                setExistingId(data._id || null);
                setFormData({
                    pageName: pageName,
                    title: data.title || { en: '', per: '', ps: '' },
                    description: data.description || { en: '', per: '', ps: '' },
                    metadata: data.metadata || {}
                });
                
                // Prefer multiple heroImages for home
                console.log('PageSettingsForm - data.heroImages:', data.heroImages);
                console.log('PageSettingsForm - data.heroImages type:', typeof data.heroImages);
                console.log('PageSettingsForm - data.heroImages length:', data.heroImages?.length);
                
                if (Array.isArray(data.heroImages) && data.heroImages.length) {
                    const existing = data.heroImages.map((img) => ({
                        url: getImageUrlFromObject(img),
                        title: (typeof img === 'object' && img?.title) ? img.title : { en: '', per: '', ps: '' },
                        description: (typeof img === 'object' && img?.description) ? img.description : { en: '', per: '', ps: '' },
                        btn1: (typeof img === 'object' && img?.btn1) ? img.btn1 : { label: { en: '', per: '', ps: '' }, url: '' },
                        btn2: (typeof img === 'object' && img?.btn2) ? img.btn2 : { label: { en: '', per: '', ps: '' }, url: '' },
                        filename: img.filename || '',
                        size: img.size || 0,
                        mimetype: img.mimetype || ''
                    })).filter(it => !!it.url);
                    console.log('PageSettingsForm - Processed hero images:', existing);
                    setHeroExisting(existing);
                    setHeroPreviews([]);
                    setHeroImages([]);
                    setHeroNewMeta([]);
                    setHeroOrder(existing.map((_, i) => ({ type:'existing', index:i })));
                } else if (data.heroImage) {
                    const heroUrl = getImageUrlFromObject(data.heroImage);
                    console.log('PageSettingsForm - Single hero image URL:', heroUrl);
                    setHeroPreview(heroUrl || null);
                    setHasExistingHeroImage(true);
                }
                if (data.bodyImage) {
                    const bodyUrl = getImageUrlFromObject(data.bodyImage);
                    setBodyPreview(bodyUrl || null);
                    setHasExistingBodyImage(true);
                }
            } else {
                // New page or page without hero images
                setIsExisting(false);
                setExistingId(null);
                setFormData({
                    pageName: pageName,
                    title: { en: '', per: '', ps: '' },
                    description: { en: '', per: '', ps: '' },
                    metadata: {}
                });
                setHeroPreview(null);
                setBodyPreview(null);
                setHasExistingHeroImage(false);
                setHasExistingBodyImage(false);
            }
        } catch (err) {
            // Page doesn't exist yet, that's okay
            setIsExisting(false);
            setExistingId(null);
            setFormData({
                pageName: pageName,
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                metadata: {}
            });
            setHeroPreview(null);
            setBodyPreview(null);
            setHasExistingHeroImage(false);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (field, language, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [language]: value
            }
        }));
    };

    const handleMetadataChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [key]: value
            }
        }));
    };

    const handleImageChange = (e, imageType) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (imageType === 'hero-multi') {
            setHeroImages(prev => [...prev, ...files]);
            setHeroPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
            setHeroNewMeta(prev => [
                ...prev,
                ...files.map(() => ({ title: { en: '', per: '', ps: '' }, description: { en: '', per: '', ps: '' } }))
            ]);
        } else if (imageType === 'hero') {
            const file = files[0];
            setHeroImage(file);
            setHeroPreview(URL.createObjectURL(file));
            setHasExistingHeroImage(false); // New image selected, not existing anymore
        } else if (imageType === 'body') {
            const file = files[0];
            setBodyImage(file);
            setBodyPreview(URL.createObjectURL(file));
            setHasExistingBodyImage(false); // New image selected, not existing anymore
        }
    };

    const removeBodyImage = () => {
        setBodyImage(null);
        setBodyPreview(null);
        setHasExistingBodyImage(false);
    };

    const removeNewHeroAt = (idx) => {
        setHeroImages(prev => prev.filter((_, i) => i !== idx));
        setHeroPreviews(prev => prev.filter((_, i) => i !== idx));
        setHeroNewMeta(prev => prev.filter((_, i) => i !== idx));
        setHeroOrder(prev => prev.filter(item => !(item.type==='new' && item.index===idx)).map(item => {
            if (item.type==='new' && item.index>idx) return { ...item, index: item.index - 1 };
            return item;
        }));
    };

    const removeExistingHeroAt = (idx) => {
        setHeroDeleteUrls(prev => [...prev, heroExisting[idx]?.url].filter(Boolean));
        setHeroExisting(prev => prev.filter((_, i) => i !== idx));
        setHeroOrder(prev => prev.filter(item => !(item.type==='existing' && item.index===idx)).map(item => {
            if (item.type==='existing' && item.index>idx) return { ...item, index: item.index - 1 };
            return item;
        }));
    };

    const moveHero = (from, to) => {
        if (to < 0 || to >= heroOrder.length) return;
        const updated = [...heroOrder];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setHeroOrder(updated);
    };

    const updateExistingMeta = (idx, field, lang, value) => {
        setHeroExisting(prev => prev.map((m, i) => i === idx ? { ...m, [field]: { ...m[field], [lang]: value } } : m));
    };

    // Unified updater for per-new-image meta, including buttons
    const updateNewMeta = (idx, field, lang, value) => {
        setHeroNewMeta(prev => prev.map((m, i) => {
            if (i !== idx) return m;
            if (field === 'btn1.label' || field === 'btn2.label') {
                const btnKey = field.split('.')[0];
                return { ...m, [btnKey]: { ...m[btnKey], label: { ...(m[btnKey]?.label||{}), [lang]: value } } };
            } else if (field === 'btn1.url' || field === 'btn2.url') {
                const btnKey = field.split('.')[0];
                return { ...m, [btnKey]: { ...m[btnKey], url: value } };
            }
            return { ...m, [field]: { ...(m[field]||{}), [lang]: value } };
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.en) {
        setError('Title (English) is required');
        return;
    }

    try {
        setLoading(true);
        setError('');

        // Debug: Log current image states
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('bodyImage state:', bodyImage);
        console.log('bodyImage type:', typeof bodyImage);
        console.log('bodyImage is undefined:', bodyImage === undefined);
        console.log('bodyImage is null:', bodyImage === null);
        console.log('hasExistingBodyImage:', hasExistingBodyImage);

        const submitFormData = new FormData();
        
        // Append JSON data + indicate multiple heroes if home
        const basePayload = {
            pageName: formData.pageName,
            title: formData.title,
            description: formData.description,
            metadata: formData.metadata
        };
        submitFormData.append('data', JSON.stringify(basePayload));

        // Multiple heroes for home: append as heroImages[] (new uploads) + ordering + existing meta
        if (formData.pageName === 'home' || formData.pageName === '/') {
            if (heroImages.length) {
                // For new Home endpoints, backend accepts 'images' and 'heroImages'. Use 'images' to be safe
                heroImages.forEach((file) => submitFormData.append('images', file));
            }
            // Build combined meta and order
            const newMeta = heroNewMeta;
            const existingMeta = heroExisting.map(x => ({ title: x.title, description: x.description, btn1: x.btn1, btn2: x.btn2 }));
            // Provide per-upload metadata aligned with the uploaded files array
            basePayload.imageMetadata = newMeta;
            // heroOrder references either existing or new by index; build ordered meta list
            const orderedMeta = heroOrder.map(entry => {
                if (entry.type === 'existing') return existingMeta[entry.index];
                return newMeta[entry.index];
            });
            basePayload.heroImageMeta = orderedMeta;
            if (heroDeleteUrls.length) basePayload.heroDeleteUrls = heroDeleteUrls;
        } else if (heroImage) {
            submitFormData.append('heroImage', heroImage);
        }
        if (bodyImage && typeof bodyImage !== 'undefined') {
            submitFormData.append('bodyImage', bodyImage);
        }

        // Debug: Log what's being sent
        console.log('FormData contents:');
        for (let [key, value] of submitFormData.entries()) {
            console.log(key, value);
        }

        let response;
        const isHome = formData.pageName === 'home' || formData.pageName === '/';

        if (isExisting && !isHome) {
            // Update text/meta via PUT
            let patchRes;
            if (formData.pageName === 'home' || formData.pageName === '/') {
                // If there are new files for home, prefer strict endpoint for those; otherwise use JSON update
                if (heroImages && heroImages.length) {
                  const fdStrict = new FormData();
                  heroImages.forEach((file) => fdStrict.append('images', file));
                  fdStrict.append('imageMetadata', JSON.stringify(heroNewMeta || []));
                  if (typeof basePayload.replaceHeroImages !== 'undefined') {
                    fdStrict.append('replaceHeroImages', String(basePayload.replaceHeroImages));
                  }
                  patchRes = await saveHomeHeroImagesStrictApi(fdStrict);
                } else {
                  patchRes = await updateHomeSettingsMultipartApi(submitFormData);
                }
            } else {
                patchRes = await updatePageSettings(formData.pageName, basePayload);
            }
            // Upload images (if any) via dedicated endpoints
            if (heroImage) {
                console.log('[PageSettingsForm] Uploading hero image for page:', formData.pageName);
                console.log('[PageSettingsForm] Hero image file:', heroImage);
                if (formData.pageName === 'home' || formData.pageName === '/') {
                    const fd = new FormData();
                    fd.append('image', heroImage);
                    await upsertHomeHeroImagesApi(fd, true);
                } else {
                    console.log('[PageSettingsForm] Calling updateHeroImage for non-home page');
                    const result = await updateHeroImage(formData.pageName, heroImage);
                    console.log('[PageSettingsForm] updateHeroImage result:', result);
                }
            }
            if (bodyImage && typeof bodyImage !== 'undefined') {
                console.log('[PageSettingsForm] Uploading body image for page:', formData.pageName);
                console.log('[PageSettingsForm] Body image file:', bodyImage);
                if (formData.pageName === 'home' || formData.pageName === '/') {
                    const fdBody = new FormData();
                    fdBody.append('bodyImage', bodyImage);
                    await upsertHomeBodyImageApi(fdBody, true);
                } else {
                    await updateBodyImage(formData.pageName, bodyImage);
                }
            }
            response = patchRes;
        } else {
            // Create or complex home updates via POST-multipart
            if (formData.pageName === 'home' || formData.pageName === '/') {
                if (heroImages && heroImages.length) {
                  // Use strict endpoint only when uploading new files
                  const fdStrict = new FormData();
                  heroImages.forEach((file) => fdStrict.append('images', file));
                  fdStrict.append('imageMetadata', JSON.stringify(heroNewMeta || []));
                  if (typeof basePayload.replaceHeroImages !== 'undefined') {
                    fdStrict.append('replaceHeroImages', String(basePayload.replaceHeroImages));
                  }
                  response = await saveHomeHeroImagesStrictApi(fdStrict);
                } else {
                  // No new files: fall back to normal multipart to update meta/ordering only
                  response = await upsertHomeSettingsMultipartApi(submitFormData);
                }
              } else {
                response = await createPageSettings(submitFormData);
              }
        }
        
        if (response?.success) {
            setSuccess(isExisting ? 'Page settings updated successfully!' : 'Page settings saved successfully!');
            setHeroImage(null);
            setBodyImage(null);
            setTimeout(() => setSuccess(''), 3000);
            loadPageSettings();
            loadPageData(formData.pageName);
        }
    } catch (err) {
        setError('Failed to save page settings: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
        setLoading(false);
    }
};

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this page settings?')) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = (formData.pageName === 'home' || formData.pageName === '/')
                ? await deleteHomeSettingsApi()
                : await deletePageSettings(formData.pageName);
            
            if (response.success) {
                setSuccess('Page settings deleted successfully!');
                setFormData({
                    pageName: '/',
                    title: { en: '', per: '', ps: '' },
                    description: { en: '', per: '', ps: '' },
                    metadata: {}
                });
                setHeroPreview(null);
                setBodyPreview(null);
                setSelectedPage('/');
                setTimeout(() => setSuccess(''), 3000);
                loadPageSettings();
            }
        } catch (err) {
            setError('Failed to delete page settings: ' + (err.response?.data?.message || err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page-settings" style={{ padding: '20px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#2c3e50' }}>
                    Page Settings
                </h1>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fee', 
                        color: '#c33', 
                        padding: '15px', 
                        borderRadius: '4px', 
                        marginBottom: '20px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{ 
                        backgroundColor: '#efe', 
                        color: '#3c3', 
                        padding: '15px', 
                        borderRadius: '4px', 
                        marginBottom: '20px',
                        border: '1px solid #cfc'
                    }}>
                        {success}
                    </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Select Page:
                    </label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                    >
                        {PAGE_OPTIONS.map(group => (
                            <optgroup key={group.group} label={t(`admin.pageSettings.groups.${group.group}` , group.group)}>
                                {group.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{t(opt.labelKey || '', opt.defaultLabel || '')}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                    {/* Title Section */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Page Title</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                English (Required)
                            </label>
                            <input
                                type="text"
                                value={formData.title.en}
                                onChange={(e) => handleTextChange('title', 'en', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Persian/Dari
                            </label>
                            <input
                                type="text"
                                value={formData.title.per}
                                onChange={(e) => handleTextChange('title', 'per', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Pashto
                            </label>
                            <input
                                type="text"
                                value={formData.title.ps}
                                onChange={(e) => handleTextChange('title', 'ps', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Page Description</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                English
                            </label>
                            <textarea
                                value={formData.description.en}
                                onChange={(e) => handleTextChange('description', 'en', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    minHeight: '100px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Persian/Dari
                            </label>
                            <textarea
                                value={formData.description.per}
                                onChange={(e) => handleTextChange('description', 'per', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    minHeight: '100px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Pashto
                            </label>
                            <textarea
                                value={formData.description.ps}
                                onChange={(e) => handleTextChange('description', 'ps', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    minHeight: '100px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Hero Image Section */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Hero Image</h3>

                        {(formData.pageName === 'home' || formData.pageName === '/') ? (
                          <>
                            <input
                              ref={heroMultiInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleImageChange(e, 'hero-multi')}
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              onClick={() => heroMultiInputRef.current && heroMultiInputRef.current.click()}
                              style={{ padding: '8px 12px', background: '#0f68bb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 10 }}
                            >
                              + Add Hero Images
                            </button>
                            {/* Existing server images (editable meta) */}
                            {!!heroExisting.length && (
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>Existing Hero Images</div>
                                <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                                  {heroExisting.map((it, idx) => (
                                    <div key={`exist-${idx}`} style={{ position: 'relative', border:'1px solid #eee', borderRadius:6, padding:10 }}>
                                      <img src={it.url} alt={`Hero existing ${idx+1}`} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginBottom:8 }} />
                                      <button type="button" onClick={() => removeExistingHeroAt(idx)} title="Remove existing"
                                        style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#e74c3c', color: '#fff', cursor: 'pointer' }}>×</button>
                                      <div style={{ display:'grid', gap:6 }}>
                                        <div style={{ fontSize:12, color:'#555' }}>Title</div>
                                        <input type="text" placeholder="Title (EN)" value={heroExisting[idx]?.title?.en || ''} onChange={(e)=>updateExistingMeta(idx,'title','en',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Title (Dari)" value={heroExisting[idx]?.title?.per || ''} onChange={(e)=>updateExistingMeta(idx,'title','per',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Title (Pashto)" value={heroExisting[idx]?.title?.ps || ''} onChange={(e)=>updateExistingMeta(idx,'title','ps',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Description</div>
                                        <textarea placeholder="Description (EN)" value={heroExisting[idx]?.description?.en || ''} onChange={(e)=>updateExistingMeta(idx,'description','en',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <textarea placeholder="Description (Dari)" value={heroExisting[idx]?.description?.per || ''} onChange={(e)=>updateExistingMeta(idx,'description','per',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <textarea placeholder="Description (Pashto)" value={heroExisting[idx]?.description?.ps || ''} onChange={(e)=>updateExistingMeta(idx,'description','ps',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Button 1</div>
                                        <input type="text" placeholder="Btn1 Label (EN)" value={heroExisting[idx]?.btn1?.label?.en || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn1: { ...m.btn1, label:{ ...(m.btn1?.label||{}), en: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 Label (Dari)" value={heroExisting[idx]?.btn1?.label?.per || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn1: { ...m.btn1, label:{ ...(m.btn1?.label||{}), per: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 Label (Pashto)" value={heroExisting[idx]?.btn1?.label?.ps || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn1: { ...m.btn1, label:{ ...(m.btn1?.label||{}), ps: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 URL" value={heroExisting[idx]?.btn1?.url || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn1: { ...m.btn1, url: e.target.value } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Button 2</div>
                                        <input type="text" placeholder="Btn2 Label (EN)" value={heroExisting[idx]?.btn2?.label?.en || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn2: { ...m.btn2, label:{ ...(m.btn2?.label||{}), en: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 Label (Dari)" value={heroExisting[idx]?.btn2?.label?.per || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn2: { ...m.btn2, label:{ ...(m.btn2?.label||{}), per: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 Label (Pashto)" value={heroExisting[idx]?.btn2?.label?.ps || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn2: { ...m.btn2, label:{ ...(m.btn2?.label||{}), ps: e.target.value } } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 URL" value={heroExisting[idx]?.btn2?.url || ''} onChange={(e)=>setHeroExisting(prev=>prev.map((m,i)=> i===idx ? { ...m, btn2: { ...m.btn2, url: e.target.value } } : m))} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Newly added images with remove and ordering */}
                            {!!heroPreviews.length && (
                              <div>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>New Hero Images</div>
                                <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                                  {heroPreviews.map((src, idx) => (
                                    <div key={`new-${idx}`} style={{ position: 'relative', border:'1px solid #eee', borderRadius:6, padding:10 }}>
                                      <img src={src} alt={`Hero new ${idx+1}`} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginBottom:8 }} />
                                      <div style={{ position:'absolute', top:6, left:6, display:'flex', gap:6 }}>
                                        <button type="button" onClick={() => moveHero(heroOrder.findIndex(x=>x.type==='new' && x.index===idx), (heroOrder.findIndex(x=>x.type==='new' && x.index===idx))-1)} title="Move up"
                                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#0f68bb', color: '#fff', cursor: 'pointer' }}>↑</button>
                                        <button type="button" onClick={() => moveHero(heroOrder.findIndex(x=>x.type==='new' && x.index===idx), (heroOrder.findIndex(x=>x.type==='new' && x.index===idx))+1)} title="Move down"
                                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#0f68bb', color: '#fff', cursor: 'pointer' }}>↓</button>
                                      </div>
                                      <button type="button" onClick={() => removeNewHeroAt(idx)}
                                        title="Remove"
                                        style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#e74c3c', color: '#fff', cursor: 'pointer' }}>
                                        ×
                                      </button>
                                      {/* Per-image localized fields */}
                                      <div style={{ display:'grid', gap:6 }}>
                                        <div style={{ fontSize:12, color:'#555' }}>Title</div>
                                        <input type="text" placeholder="Title (EN)" value={heroNewMeta[idx]?.title?.en || ''} onChange={(e)=>updateNewMeta(idx,'title','en',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Title (Dari)" value={heroNewMeta[idx]?.title?.per || ''} onChange={(e)=>updateNewMeta(idx,'title','per',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Title (Pashto)" value={heroNewMeta[idx]?.title?.ps || ''} onChange={(e)=>updateNewMeta(idx,'title','ps',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Description</div>
                                        <textarea placeholder="Description (EN)" value={heroNewMeta[idx]?.description?.en || ''} onChange={(e)=>updateNewMeta(idx,'description','en',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <textarea placeholder="Description (Dari)" value={heroNewMeta[idx]?.description?.per || ''} onChange={(e)=>updateNewMeta(idx,'description','per',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <textarea placeholder="Description (Pashto)" value={heroNewMeta[idx]?.description?.ps || ''} onChange={(e)=>updateNewMeta(idx,'description','ps',e.target.value)} rows={2} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Button 1</div>
                                        <input type="text" placeholder="Btn1 Label (EN)" value={heroNewMeta[idx]?.btn1?.label?.en || ''} onChange={(e)=>updateNewMeta(idx,'btn1.label','en',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 Label (Dari)" value={heroNewMeta[idx]?.btn1?.label?.per || ''} onChange={(e)=>updateNewMeta(idx,'btn1.label','per',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 Label (Pashto)" value={heroNewMeta[idx]?.btn1?.label?.ps || ''} onChange={(e)=>updateNewMeta(idx,'btn1.label','ps',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn1 URL" value={heroNewMeta[idx]?.btn1?.url || ''} onChange={(e)=>updateNewMeta(idx,'btn1.url','',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <div style={{ fontSize:12, color:'#555', marginTop:6 }}>Button 2</div>
                                        <input type="text" placeholder="Btn2 Label (EN)" value={heroNewMeta[idx]?.btn2?.label?.en || ''} onChange={(e)=>updateNewMeta(idx,'btn2.label','en',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 Label (Dari)" value={heroNewMeta[idx]?.btn2?.label?.per || ''} onChange={(e)=>updateNewMeta(idx,'btn2.label','per',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 Label (Pashto)" value={heroNewMeta[idx]?.btn2?.label?.ps || ''} onChange={(e)=>updateNewMeta(idx,'btn2.label','ps',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                        <input type="text" placeholder="Btn2 URL" value={heroNewMeta[idx]?.btn2?.url || ''} onChange={(e)=>updateNewMeta(idx,'btn2.url','',e.target.value)} style={{ width:'100%', padding:6, border:'1px solid #ddd', borderRadius:4 }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Show existing single hero image if it exists */}
                            {heroPreview && (
                              <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>Current Hero Image</div>
                                <img src={heroPreview} alt="Current Hero" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', marginBottom: '10px' }} />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHeroPreview(null);
                                    setHeroImage(null);
                                    setHasExistingHeroImage(false);
                                  }}
                                  style={{ padding: '6px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                >
                                  Remove Current Image
                                </button>
                              </div>
                            )}
                            
                            {/* Upload new single hero image */}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'hero')}
                              style={{ display: 'block', marginBottom: '10px' }}
                            />
                            {heroPreview && (
                              <div style={{ marginTop: '15px' }}>
                                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>New Image Preview:</p>
                                <img src={heroPreview} alt="Hero Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
                              </div>
                            )}
                          </>
                        )}
                    </div>

                    {/* Body Image Section */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Body Image (Optional)</h3>
                        
                        {/* Show existing body image if it exists */}
                        {bodyPreview && (
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>Current Body Image</div>
                                <img 
                                    src={bodyPreview} 
                                    alt="Current Body" 
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '200px', 
                                        borderRadius: '4px', 
                                        marginBottom: '10px' 
                                    }} 
                                />
                                <button
                                    type="button"
                                    onClick={removeBodyImage}
                                    style={{ 
                                        padding: '6px 12px', 
                                        background: '#e74c3c', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: 4, 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Remove Current Image
                                </button>
                            </div>
                        )}
                        
                        {/* Upload new body image */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'body')}
                            style={{
                                display: 'block',
                                marginBottom: '10px'
                            }}
                        />

                        {bodyPreview && (
                            <div style={{ marginTop: '15px' }}>
                                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    {hasExistingHeroImage ? 'New Image Preview:' : 'Image Preview:'}
                                </p>
                                <img
                                    src={bodyPreview}
                                    alt="Body Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: loading ? '#95a5a6' : '#0f68bb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: loading ? '#95a5a6' : '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Delete
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#95a5a6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default PageSettingsForm;

