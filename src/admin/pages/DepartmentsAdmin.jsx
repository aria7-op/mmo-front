/**
 * Departments Admin Page - Modern styling consistent with other admin pages
 * Manage organizational departments with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_BASE_URL } from '../../config/api.config';

const DepartmentsAdmin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [departmentsData, setDepartmentsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        subtitle: { en: '', per: '', ps: '' },
        introduction: { en: '', per: '', ps: '' },
        departments: [],
        organizationalStructure: { en: '', per: '', ps: '' },
        status: 'active'
    });
    const [heroImage, setHeroImage] = useState(null);
    const [images, setImages] = useState([]);
    const [previewHero, setPreviewHero] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchDepartmentsData();
    }, []);

    const fetchDepartmentsData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/about/departments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success && result.data) {
                setDepartmentsData(result.data);
                setFormData({
                    title: result.data.title || { en: '', per: '', ps: '' },
                    subtitle: result.data.subtitle || { en: '', per: '', ps: '' },
                    introduction: result.data.introduction || { en: '', per: '', ps: '' },
                    departments: result.data.departments || [],
                    organizationalStructure: result.data.organizationalStructure || { en: '', per: '', ps: '' },
                    status: result.data.status || 'active'
                });
                setPreviewHero(result.data.heroImageUrl || null);
                setPreviewImages(result.data.images || []);
            }
        } catch (error) {
            toast.error('Failed to load departments data');
            console.error('Error fetching departments data:', error);
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

    const handleAddDepartment = () => {
        setFormData(prev => ({
            ...prev,
            departments: [...prev.departments, {
                name: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                responsibilities: [],
                headOfDepartment: {
                    name: { en: '', per: '', ps: '' },
                    title: { en: '', per: '', ps: '' },
                    email: '',
                    phone: ''
                },
                teamSize: 0,
                icon: 'fa-building',
                color: '#667eea',
                order: prev.departments.length
            }]
        }));
    };

    const handleUpdateDepartment = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.map((dept, i) => {
                if (i === index) {
                    if (field.startsWith('headOfDepartment.')) {
                        const headField = field.split('.')[1];
                        return {
                            ...dept,
                            headOfDepartment: {
                                ...dept.headOfDepartment,
                                [headField]: headField === 'email' || headField === 'phone' || headField === 'teamSize' 
                                    ? value 
                                    : {
                                        ...dept.headOfDepartment[headField],
                                        [lang]: value
                                    }
                            }
                        };
                    } else if (field === 'icon' || field === 'color' || field === 'teamSize') {
                        return { ...dept, [field]: value };
                    } else if (field === 'responsibilities') {
                        return { ...dept, responsibilities: value };
                    } else {
                        return {
                            ...dept,
                            [field]: {
                                ...dept[field],
                                [lang]: value
                            }
                        };
                    }
                }
                return dept;
            })
        }));
    };

    const handleRemoveDepartment = (index) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.filter((_, i) => i !== index)
        }));
    };

    const handleAddResponsibility = (deptIndex) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.map((dept, i) => {
                if (i === deptIndex) {
                    return {
                        ...dept,
                        responsibilities: [...dept.responsibilities, { en: '', per: '', ps: '' }]
                    };
                }
                return dept;
            })
        }));
    };

    const handleUpdateResponsibility = (deptIndex, respIndex, lang, value) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.map((dept, i) => {
                if (i === deptIndex) {
                    return {
                        ...dept,
                        responsibilities: dept.responsibilities.map((resp, j) => {
                            if (j === respIndex) {
                                return { ...resp, [lang]: value };
                            }
                            return resp;
                        })
                    };
                }
                return dept;
            })
        }));
    };

    const handleRemoveResponsibility = (deptIndex, respIndex) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.map((dept, i) => {
                if (i === deptIndex) {
                    return {
                        ...dept,
                        responsibilities: dept.responsibilities.filter((_, j) => j !== respIndex)
                    };
                }
                return dept;
            })
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

            const url = departmentsData 
                ? `${API_BASE_URL}/about/departments/${departmentsData._id}`
                : `${API_BASE_URL}/about/departments`;
            
            const method = departmentsData ? 'PUT' : 'POST';

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
                showSuccessToast(departmentsData ? t('admin.departmentsUpdated', 'Departments updated successfully!') : t('admin.departmentsCreated', 'Departments created successfully!'));
                setDepartmentsData(result.data);
            } else {
                showErrorToast(result.message || t('admin.failedToSaveDepartments', 'Failed to save departments'));
            }
        } catch (error) {
            showErrorToast(t('admin.errorSavingDepartments', 'Error saving departments'));
            console.error('Error saving departments:', error);
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
                                    {t('admin.departmentsManagement', 'Departments Management')}
                                </h2>
                                <p className="text-muted mb-0">
                                    {t('admin.manageDepartments', 'Manage organizational departments and team structure')}
                                </p>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/admin')}
                                >
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

                        {/* Departments */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        {t('admin.departments', 'Departments')}
                                    </h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddDepartment}>
                                        {t('admin.addDepartment', 'Add Department')}
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.departments.map((department, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6>Department {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveDepartment(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <label className="form-label">Icon</label>
                                                    <select
                                                        className="form-control"
                                                        value={department.icon}
                                                        onChange={(e) => handleUpdateDepartment(index, 'icon', null, e.target.value)}
                                                    >
                                                        <option value="fa-building">Building</option>
                                                        <option value="fa-graduation-cap">Education</option>
                                                        <option value="fa-heartbeat">Health</option>
                                                        <option value="fa-users">Community</option>
                                                        <option value="fa-cogs">Operations</option>
                                                        <option value="fa-chart-line">Monitoring</option>
                                                        <option value="fa-handshake">Partnerships</option>
                                                        <option value="fa-globe">Coverage</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Color</label>
                                                    <input
                                                        type="color"
                                                        className="form-control"
                                                        value={department.color}
                                                        onChange={(e) => handleUpdateDepartment(index, 'color', null, e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Team Size</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={department.teamSize}
                                                        onChange={(e) => handleUpdateDepartment(index, 'teamSize', null, parseInt(e.target.value) || 0)}
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Name (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={department.name.en}
                                                        onChange={(e) => handleUpdateDepartment(index, 'name', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Name (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={department.name.per}
                                                        onChange={(e) => handleUpdateDepartment(index, 'name', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Name (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={department.name.ps}
                                                        onChange={(e) => handleUpdateDepartment(index, 'name', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (English)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={department.description.en}
                                                        onChange={(e) => handleUpdateDepartment(index, 'description', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Dari)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={department.description.per}
                                                        onChange={(e) => handleUpdateDepartment(index, 'description', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Pashto)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={department.description.ps}
                                                        onChange={(e) => handleUpdateDepartment(index, 'description', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Responsibilities */}
                                            <div className="mt-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6>Responsibilities</h6>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleAddResponsibility(index)}>
                                                        Add Responsibility
                                                    </button>
                                                </div>
                                                {department.responsibilities.map((responsibility, respIndex) => (
                                                    <div key={respIndex} className="row mb-2">
                                                        <div className="col-md-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="English"
                                                                value={responsibility.en}
                                                                onChange={(e) => handleUpdateResponsibility(index, respIndex, 'en', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Dari"
                                                                value={responsibility.per}
                                                                onChange={(e) => handleUpdateResponsibility(index, respIndex, 'per', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Pashto"
                                                                value={responsibility.ps}
                                                                onChange={(e) => handleUpdateResponsibility(index, respIndex, 'ps', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveResponsibility(index, respIndex)}>
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Head of Department */}
                                            <div className="mt-3">
                                                <h6>Head of Department</h6>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label className="form-label">Name (English)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.name.en}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.name', 'en', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Name (Dari)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.name.per}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.name', 'per', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Name (Pashto)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.name.ps}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.name', 'ps', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            value={department.headOfDepartment.email}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.email', null, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-md-3">
                                                        <label className="form-label">Title (English)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.title.en}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.title', 'en', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Title (Dari)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.title.per}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.title', 'per', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Title (Pashto)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.title.ps}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.title', 'ps', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label">Phone</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={department.headOfDepartment.phone}
                                                            onChange={(e) => handleUpdateDepartment(index, 'headOfDepartment.phone', null, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Organizational Structure */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5>Organizational Structure</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Structure (English)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.organizationalStructure.en}
                                                onChange={(e) => handleInputChange('organizationalStructure', 'en', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Structure (Dari)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.organizationalStructure.per}
                                                onChange={(e) => handleInputChange('organizationalStructure', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Structure (Pashto)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.organizationalStructure.ps}
                                                onChange={(e) => handleInputChange('organizationalStructure', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>
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
                                        {saving ? 'Saving...' : (departmentsData ? 'Update Departments' : 'Create Departments')}
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

export default DepartmentsAdmin;
