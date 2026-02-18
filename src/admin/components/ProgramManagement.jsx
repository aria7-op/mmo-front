import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeInput, sanitizeTextarea, validateFormData } from '../../utils/inputSanitizer';
import { programService } from '../../services/programs.service';

const ProgramManagement = () => {
    const { t, i18n } = useTranslation();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [formData, setFormData] = useState({
        title: { en: '', dr: '', ps: '' },
        description: { en: '', dr: '', ps: '' },
        overview: { en: '', dr: '', ps: '' },
        slug: '',
        readMoreLink: { en: '', dr: '', ps: '' },
        features: [],
        impacts: [],
        heroImage: null,
        logo: null,
        isActive: true
    });

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const data = await programService.getAllPrograms({ lang: i18n.language });
                setPrograms(data.data || []);
            } catch (err) {
                console.error('Error fetching programs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [i18n.language]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        const validation = validateFormData(formData, {
            title: { required: true, type: 'multilingual' },
            description: { required: true, type: 'multilingual' },
            overview: { required: true, type: 'multilingual' },
            slug: { required: true, type: 'slug' }
        });

        if (!validation.isValid) {
            alert(t('admin.validationError', 'Please fill in all required fields'));
            return;
        }

        try {
            const result = editingProgram 
                ? await programService.updateProgram(editingProgram.slug, formData)
                : await programService.createProgram(formData);

            await fetchPrograms();
            resetForm();
            alert(editingProgram ? t('admin.programUpdated', 'Program updated successfully') : t('admin.programCreated', 'Program created successfully'));
        } catch (err) {
            console.error('Error saving program:', err);
            alert(t('admin.saveError', 'Error saving program'));
        }
    };

    const handleEdit = (program) => {
        setEditingProgram(program);
        setFormData({
            title: program.title || { en: '', dr: '', ps: '' },
            description: program.description || { en: '', dr: '', ps: '' },
            overview: program.overview || { en: '', dr: '', ps: '' },
            slug: program.slug || '',
            readMoreLink: program.readMoreLink || { en: '', dr: '', ps: '' },
            features: program.features || [],
            impacts: program.impacts || [],
            heroImage: program.heroImage || null,
            logo: program.logo || null,
            isActive: program.isActive !== undefined ? program.isActive : true
        });
        setShowForm(true);
    };

    const handleDelete = async (slug) => {
        if (!confirm(t('admin.confirmDelete', 'Are you sure you want to delete this program?'))) {
            return;
        }

        try {
            await programService.deleteProgram(slug);
            await fetchPrograms();
            alert(t('admin.programDeleted', 'Program deleted successfully'));
        } catch (err) {
            console.error('Error deleting program:', err);
            alert(t('admin.deleteError', 'Error deleting program'));
        }
    };

    const resetForm = () => {
        setFormData({
            title: { en: '', dr: '', ps: '' },
            description: { en: '', dr: '', ps: '' },
            overview: { en: '', dr: '', ps: '' },
            slug: '',
            readMoreLink: { en: '', dr: '', ps: '' },
            features: [],
            impacts: [],
            heroImage: null,
            logo: null,
            isActive: true
        });
        setEditingProgram(null);
        setShowForm(false);
    };

    const handleInputChange = (field, lang, value) => {
        if (lang) {
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: sanitizeInput(value)
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: sanitizeInput(value)
            }));
        }
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = {
            ...newFeatures[index],
            [field]: field === 'icon' ? value : sanitizeTextarea(value)
        };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleImpactChange = (index, field, value) => {
        const newImpacts = [...formData.impacts];
        newImpacts[index] = {
            ...newImpacts[index],
            [field]: field === 'number' ? value : sanitizeInput(value)
        };
        setFormData(prev => ({ ...prev, impacts: newImpacts }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, { icon: '', title: { en: '', dr: '', ps: '' }, description: { en: '', dr: '', ps: '' } }]
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addImpact = () => {
        setFormData(prev => ({
            ...prev,
            impacts: [...prev.impacts, { number: { en: '', dr: '', ps: '' }, label: { en: '', dr: '', ps: '' } }]
        }));
    };

    const removeImpact = (index) => {
        setFormData(prev => ({
            ...prev,
            impacts: prev.impacts.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return <div>{t('common.loading', 'Loading...')}</div>;
    }

    if (error) {
        return <div>{t('common.error', 'Error')}: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <style>{`
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                
                .admin-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0A4F9D;
                }
                
                .btn {
                    background: #0A4F9D;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }
                
                .btn:hover {
                    background: #0864d4;
                }
                
                .btn-danger {
                    background: #dc3545;
                }
                
                .btn-danger:hover {
                    background: #c82333;
                }
                
                .programs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .program-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e9ecef;
                }
                
                .program-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #2c3e50;
                }
                
                .program-slug {
                    font-size: 14px;
                    color: #6c757d;
                    margin-bottom: 15px;
                }
                
                .program-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .form-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .form-container {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    margin: 20px;
                }
                
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .form-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6c757d;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                }
                
                .form-textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    min-height: 100px;
                    resize: vertical;
                }
                
                .lang-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                
                .lang-tab {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: #f8f9fa;
                    border-radius: 6px 6px 0 0;
                    cursor: pointer;
                }
                
                .lang-tab.active {
                    background: #0A4F9D;
                    color: white;
                    border-color: #0A4F9D;
                }
                
                .dynamic-section {
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .section-title {
                    font-weight: 600;
                    color: #2c3e50;
                }
            `}</style>

            <div className="admin-header">
                <h1 className="admin-title">{t('admin.programManagement', 'Program Management')}</h1>
                <button className="btn" onClick={() => setShowForm(true)}>
                    {t('admin.addNew', 'Add New Program')}
                </button>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <div className="form-header">
                            <h2 className="form-title">
                                {editingProgram ? t('admin.editProgram', 'Edit Program') : t('admin.createProgram', 'Create Program')}
                            </h2>
                            <button className="close-btn" onClick={resetForm}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="form-group">
                                <label className="form-label">{t('admin.slug', 'Slug')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', null, e.target.value)}
                                    required
                                />
                            </div>

                            {/* Multilingual Fields */}
                            {['title', 'description', 'overview'].map(field => (
                                <div key={field} className="form-group">
                                    <label className="form-label">{t(`admin.${field}`, field.charAt(0).toUpperCase() + field.slice(1))}</label>
                                    <div className="lang-tabs">
                                        {['en', 'dr', 'ps'].map(lang => (
                                            <button
                                                key={lang}
                                                type="button"
                                                className={`lang-tab ${i18n.language === lang ? 'active' : ''}`}
                                            >
                                                {lang.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                    {['en', 'dr', 'ps'].map(lang => (
                                        <input
                                            key={lang}
                                            type={field === 'overview' ? 'textarea' : 'text'}
                                            className={`form-${field === 'overview' ? 'textarea' : 'input'}`}
                                            placeholder={`${field} (${lang})`}
                                            value={formData[field][lang]}
                                            onChange={(e) => handleInputChange(field, lang, e.target.value)}
                                            required
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Dynamic Features Section */}
                            <div className="dynamic-section">
                                <div className="section-header">
                                    <h3 className="section-title">{t('admin.features', 'Features')}</h3>
                                    <button type="button" className="btn" onClick={addFeature}>
                                        {t('admin.addFeature', 'Add Feature')}
                                    </button>
                                </div>
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="form-group">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('admin.icon', 'Icon')}
                                            value={feature.icon}
                                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                        />
                                        {['en', 'dr', 'ps'].map(lang => (
                                            <div key={lang}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={`${t('admin.title', 'Title')} (${lang})`}
                                                    value={feature.title[lang]}
                                                    onChange={(e) => handleFeatureChange(index, 'title', { ...feature.title, [lang]: e.target.value })}
                                                />
                                                <textarea
                                                    className="form-textarea"
                                                    placeholder={`${t('admin.description', 'Description')} (${lang})`}
                                                    value={feature.description[lang]}
                                                    onChange={(e) => handleFeatureChange(index, 'description', { ...feature.description, [lang]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-danger" onClick={() => removeFeature(index)}>
                                            {t('admin.remove', 'Remove')}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Dynamic Impacts Section */}
                            <div className="dynamic-section">
                                <div className="section-header">
                                    <h3 className="section-title">{t('admin.impacts', 'Impacts')}</h3>
                                    <button type="button" className="btn" onClick={addImpact}>
                                        {t('admin.addImpact', 'Add Impact')}
                                    </button>
                                </div>
                                {formData.impacts.map((impact, index) => (
                                    <div key={index} className="form-group">
                                        {['en', 'dr', 'ps'].map(lang => (
                                            <div key={lang}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={`${t('admin.number', 'Number')} (${lang})`}
                                                    value={impact.number[lang]}
                                                    onChange={(e) => handleImpactChange(index, 'number', { ...impact.number, [lang]: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={`${t('admin.label', 'Label')} (${lang})`}
                                                    value={impact.label[lang]}
                                                    onChange={(e) => handleImpactChange(index, 'label', { ...impact.label, [lang]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-danger" onClick={() => removeImpact(index)}>
                                            {t('admin.remove', 'Remove')}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn">
                                    {editingProgram ? t('admin.update', 'Update') : t('admin.create', 'Create')}
                                </button>
                                <button type="button" className="btn" onClick={resetForm}>
                                    {t('admin.cancel', 'Cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="programs-grid">
                {programs.map(program => (
                    <div key={program.slug} className="program-card">
                        <h3 className="program-title">
                            {typeof program.title === 'object' 
                                ? (program.title?.[i18n.language] || program.title?.en || 'No title')
                                : (program.title || 'No title')
                            }
                        </h3>
                        <p className="program-slug">/{program.slug}</p>
                        <div className="program-actions">
                            <button className="btn" onClick={() => handleEdit(program)}>
                                {t('admin.edit', 'Edit')}
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(program.slug)}>
                                {t('admin.delete', 'Delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgramManagement;
