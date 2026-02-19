/**
 * Goals & Objectives Admin Page - Modern styling consistent with other admin pages
 * Manage organizational goals and objectives with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_BASE_URL } from '../../config/api.config';

const GoalsObjectivesAdmin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [goalsData, setGoalsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        subtitle: { en: '', per: '', ps: '' },
        introduction: { en: '', per: '', ps: '' },
        strategicGoals: [],
        objectives: [],
        impactMetrics: [],
        status: 'active'
    });
    const [heroImage, setHeroImage] = useState(null);
    const [images, setImages] = useState([]);
    const [previewHero, setPreviewHero] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchGoalsData();
    }, []);

    const fetchGoalsData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/about/goals-objectives`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success && result.data) {
                setGoalsData(result.data);
                setFormData({
                    title: result.data.title || { en: '', per: '', ps: '' },
                    subtitle: result.data.subtitle || { en: '', per: '', ps: '' },
                    introduction: result.data.introduction || { en: '', per: '', ps: '' },
                    strategicGoals: result.data.strategicGoals || [],
                    objectives: result.data.objectives || [],
                    impactMetrics: result.data.impactMetrics || [],
                    status: result.data.status || 'active'
                });
                setPreviewHero(result.data.heroImageUrl || null);
                setPreviewImages(result.data.images || []);
            }
        } catch (error) {
            toast.error('Failed to load goals data');
            console.error('Error fetching goals data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const handleAddStrategicGoal = () => {
        setFormData(prev => ({
            ...prev,
            strategicGoals: [...prev.strategicGoals, {
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                icon: 'fa-bullseye',
                color: '#667eea',
                order: prev.strategicGoals.length
            }]
        }));
    };

    const handleUpdateStrategicGoal = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            strategicGoals: prev.strategicGoals.map((goal, i) => 
                i === index 
                    ? { 
                        ...goal, 
                        [field]: field === 'icon' || field === 'color' ? value : {
                            ...goal[field],
                            [lang]: value
                        }
                    }
                    : goal
            )
        }));
    };

    const handleRemoveStrategicGoal = (index) => {
        setFormData(prev => ({
            ...prev,
            strategicGoals: prev.strategicGoals.filter((_, i) => i !== index)
        }));
    };

    const handleAddObjective = () => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, {
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                category: 'short_term',
                timeline: '',
                order: prev.objectives.length
            }]
        }));
    };

    const handleUpdateObjective = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.map((objective, i) => 
                i === index 
                    ? { 
                        ...objective, 
                        [field]: field === 'category' || field === 'timeline' ? value : {
                            ...objective[field],
                            [lang]: value
                        }
                    }
                    : objective
            )
        }));
    };

    const handleRemoveObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    const handleAddImpactMetric = () => {
        setFormData(prev => ({
            ...prev,
            impactMetrics: [...prev.impactMetrics, {
                metric: { en: '', per: '', ps: '' },
                value: '',
                unit: { en: '', per: '', ps: '' },
                color: '#667eea',
                order: prev.impactMetrics.length
            }]
        }));
    };

    const handleUpdateImpactMetric = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            impactMetrics: prev.impactMetrics.map((metric, i) => 
                i === index 
                    ? { 
                        ...metric, 
                        [field]: field === 'value' || field === 'color' ? value : {
                            ...metric[field],
                            [lang]: value
                        }
                    }
                    : metric
            )
        }));
    };

    const handleRemoveImpactMetric = (index) => {
        setFormData(prev => ({
            ...prev,
            impactMetrics: prev.impactMetrics.filter((_, i) => i !== index)
        }));
    };

    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHeroImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewHero(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
        const newPreviews = files.map(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
            return reader.result;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            const formDataToSend = new FormData();
            
            // Add form data
            formDataToSend.append('data', JSON.stringify(formData));
            
            // Add hero image if changed
            if (heroImage) {
                formDataToSend.append('heroImage', heroImage);
            }
            
            // Add additional images if changed
            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const url = goalsData 
                ? `${API_BASE_URL}/about/goals-objectives/${goalsData._id}`
                : `${API_BASE_URL}/about/goals-objectives`;
            
            const method = goalsData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            // Debug: Check response content type
            const contentType = response.headers.get('content-type');
            console.log('Response status:', response.status);
            console.log('Content type:', contentType);

            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Server returned non-JSON response:', text.substring(0, 500));
                toast.error('Server returned an unexpected response. Check console for details.');
                return;
            }

            if (result.success) {
                showSuccessToast(result.message || t('admin.operationSuccessful', 'Operation successful!'));
                setGoalsData(result.data);
            } else {
                showErrorToast(result.message || t('admin.failedToSaveData', 'Failed to save data'));
            }
        } catch (error) {
            showErrorToast(t('admin.errorSavingData', 'Error saving data'));
            console.error('Error saving data:', error);
        } finally {
            setSaving(false);
        }
    };

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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-1" style={{ 
                                    color: '#2c3e50', 
                                    fontWeight: '600',
                                    fontSize: '28px'
                                }}>
                                    <i className="fas fa-bullseye me-3"></i>
                                    {t('admin.goalsObjectives', 'Goals & Objectives')}
                                </h2>
                                <p className="text-muted mb-0">
                                    {t('admin.manageGoalsObjectives', 'Manage organizational goals and objectives')}
                                </p>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/admin')}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    {t('admin.backToDashboard', 'Back to Dashboard')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Basic Information */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">
                                        <i className="fas fa-info-circle me-2"></i>
                                        {t('admin.basicInformation', 'Basic Information')}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Title (English)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.title.en}
                                                onChange={(e) => handleInputChange('title', 'en', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Title (Dari)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.title.per}
                                                onChange={(e) => handleInputChange('title', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Title (Pashto)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.title.ps}
                                                onChange={(e) => handleInputChange('title', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Subtitle (English)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.subtitle.en}
                                                onChange={(e) => handleInputChange('subtitle', 'en', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Subtitle (Dari)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.subtitle.per}
                                                onChange={(e) => handleInputChange('subtitle', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Subtitle (Pashto)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.subtitle.ps}
                                                onChange={(e) => handleInputChange('subtitle', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-control"
                                                value={formData.status}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Introduction */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">
                                        <i className="fas fa-file-alt me-2"></i>
                                        {t('admin.introduction', 'Introduction')}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Introduction (English)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.introduction.en}
                                                onChange={(e) => handleInputChange('introduction', 'en', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Introduction (Dari)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.introduction.per}
                                                onChange={(e) => handleInputChange('introduction', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Introduction (Pashto)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.introduction.ps}
                                                onChange={(e) => handleInputChange('introduction', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Strategic Goals */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="fas fa-bullseye me-2"></i>
                                        {t('admin.strategicGoals', 'Strategic Goals')}
                                    </h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddStrategicGoal}>
                                        <i className="fas fa-plus me-2"></i>
                                        {t('admin.addStrategicGoal', 'Add Strategic Goal')}
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.strategicGoals.map((goal, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Strategic Goal {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveStrategicGoal(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <label className="form-label">Icon</label>
                                                    <select
                                                        className="form-control"
                                                        value={goal.icon}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'icon', null, e.target.value)}
                                                    >
                                                        <option value="fa-bullseye">Target</option>
                                                        <option value="fa-graduation-cap">Education</option>
                                                        <option value="fa-heartbeat">Health</option>
                                                        <option value="fa-tint">Water</option>
                                                        <option value="fa-female">Women</option>
                                                        <option value="fa-leaf">Environment</option>
                                                        <option value="fa-users">Community</option>
                                                        <option value="fa-home">Housing</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Color</label>
                                                    <input
                                                        type="color"
                                                        className="form-control"
                                                        value={goal.color}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'color', null, e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={goal.title.en}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'title', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={goal.title.per}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'title', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={goal.title.ps}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'title', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (English)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={goal.description.en}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'description', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Dari)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={goal.description.per}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'description', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Pashto)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={goal.description.ps}
                                                        onChange={(e) => handleUpdateStrategicGoal(index, 'description', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Objectives */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5>Objectives</h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddObjective}>
                                        Add Objective
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.objectives.map((objective, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Objective {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveObjective(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Category</label>
                                                    <select
                                                        className="form-control"
                                                        value={objective.category}
                                                        onChange={(e) => handleUpdateObjective(index, 'category', null, e.target.value)}
                                                    >
                                                        <option value="short_term">Short Term</option>
                                                        <option value="medium_term">Medium Term</option>
                                                        <option value="long_term">Long Term</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Timeline</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={objective.timeline}
                                                        onChange={(e) => handleUpdateObjective(index, 'timeline', null, e.target.value)}
                                                        placeholder="e.g., 2024-2026"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={objective.title.en}
                                                        onChange={(e) => handleUpdateObjective(index, 'title', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={objective.title.per}
                                                        onChange={(e) => handleUpdateObjective(index, 'title', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={objective.title.ps}
                                                        onChange={(e) => handleUpdateObjective(index, 'title', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (English)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={objective.description.en}
                                                        onChange={(e) => handleUpdateObjective(index, 'description', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Dari)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={objective.description.per}
                                                        onChange={(e) => handleUpdateObjective(index, 'description', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Pashto)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={objective.description.ps}
                                                        onChange={(e) => handleUpdateObjective(index, 'description', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Impact Metrics */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5>Impact Metrics</h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddImpactMetric}>
                                        Add Impact Metric
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.impactMetrics.map((metric, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Impact Metric {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveImpactMetric(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <label className="form-label">Value</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.value}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'value', null, e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Color</label>
                                                    <input
                                                        type="color"
                                                        className="form-control"
                                                        value={metric.color}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'color', null, e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Metric (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.metric.en}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'metric', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Metric (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.metric.per}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'metric', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Metric (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.metric.ps}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'metric', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Unit (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.unit.en}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'unit', 'en', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Unit (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.unit.per}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'unit', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Unit (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={metric.unit.ps}
                                                        onChange={(e) => handleUpdateImpactMetric(index, 'unit', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5>Images</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label className="form-label">Hero Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleHeroImageChange}
                                            />
                                            {previewHero && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={previewHero} 
                                                        alt="Hero preview" 
                                                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Additional Images</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImagesChange}
                                            />
                                            <div className="mt-2">
                                                {previewImages.map((preview, index) => (
                                                    <img 
                                                        key={index}
                                                        src={preview} 
                                                        alt={`Preview ${index + 1}`} 
                                                        style={{ maxWidth: '100px', maxHeight: '75px', objectFit: 'cover', marginRight: '10px' }}
                                                        className="img-thumbnail"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : (goalsData ? 'Update Data' : 'Create Data')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default GoalsObjectivesAdmin;
