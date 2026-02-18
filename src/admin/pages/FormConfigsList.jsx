import React, { useState, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import formConfigService from '../../services/formConfig.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FormConfigsList = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        imageUrl: '',
        eventDetails: {
            date: '',
            time: '',
            location: '',
            deadline: ''
        },
        isActive: true,
        isDefault: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const response = await formConfigService.getAllConfigs();
            if (response.success) {
                setConfigs(response.data);
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (config) => {
        setEditingConfig(config);
        setFormData({
            name: config.name,
            title: config.title,
            description: config.description,
            imageUrl: config.imageUrl || '',
            eventDetails: config.eventDetails || {
                date: '',
                time: '',
                location: '',
                deadline: ''
            },
            isActive: config.isActive,
            isDefault: config.isDefault
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this form configuration?')) {
            return;
        }

        try {
            const response = await formConfigService.deleteConfig(id);
            if (response.success) {
                showSuccessToast(response.message);
                loadConfigs();
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await formConfigService.toggleStatus(id);
            if (response.success) {
                showSuccessToast(response.message);
                loadConfigs();
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const handleSetAsDefault = async (id) => {
        try {
            const response = await formConfigService.setAsDefault(id);
            if (response.success) {
                showSuccessToast(response.message);
                loadConfigs();
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let response;
            if (editingConfig) {
                response = await formConfigService.updateConfig(editingConfig._id, formData, imageFile);
            } else {
                response = await formConfigService.createConfig(formData, imageFile);
            }

            if (response.success) {
                showSuccessToast(response.message);
                setShowModal(false);
                setEditingConfig(null);
                setFormData({
                    name: '',
                    title: '',
                    description: '',
                    imageUrl: '',
                    eventDetails: {
                        date: '',
                        time: '',
                        location: '',
                        deadline: ''
                    },
                    isActive: true,
                    isDefault: false
                });
                setImageFile(null);
                loadConfigs();
            }
        } catch (error) {
            showErrorToast(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (field.startsWith('eventDetails.')) {
            const subField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                eventDetails: {
                    ...prev.eventDetails,
                    [subField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showErrorToast('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Form Configurations</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingConfig(null);
                        setFormData({
                            name: '',
                            title: '',
                            description: '',
                            imageUrl: '',
                            eventDetails: {
                                date: '',
                                time: '',
                                location: '',
                                deadline: ''
                            },
                            isActive: true,
                            isDefault: false
                        });
                        setImageFile(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fas fa-plus me-2"></i>
                    Add Configuration
                </button>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Default</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {configs.map(config => (
                                    <tr key={config._id}>
                                        <td>{config.name}</td>
                                        <td>{typeof config.title === 'object' ? (config.title?.en || config.title?.per || config.title?.ps || 'No title') : (config.title || 'No title')}</td>
                                        <td>
                                            <span className={`badge ${config.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                {config.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            {config.isDefault && (
                                                <span className="badge bg-primary">Default</span>
                                            )}
                                        </td>
                                        <td>{new Date(config.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEdit(config)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-warning"
                                                    onClick={() => handleToggleStatus(config._id)}
                                                    disabled={config.isDefault}
                                                >
                                                    <i className={`fas fa-${config.isActive ? 'eye-slash' : 'eye'}`}></i>
                                                </button>
                                                {!config.isDefault && (
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => handleSetAsDefault(config._id)}
                                                    >
                                                        <i className="fas fa-star"></i>
                                                    </button>
                                                )}
                                                {!config.isDefault && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(config._id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingConfig ? 'Edit Form Configuration' : 'Add Form Configuration'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Configuration Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Form Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.title}
                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Event Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {formData.imageUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Current"
                                                    style={{ maxHeight: '100px' }}
                                                    className="img-thumbnail"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Event Date</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.eventDetails.date}
                                                    onChange={(e) => handleInputChange('eventDetails.date', e.target.value)}
                                                    placeholder="e.g., 1:00 PM (Afghanistan Time) on December 15"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Event Time</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.eventDetails.time}
                                                    onChange={(e) => handleInputChange('eventDetails.time', e.target.value)}
                                                    placeholder="e.g., 1:00 PM"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Location</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.eventDetails.location}
                                                    onChange={(e) => handleInputChange('eventDetails.location', e.target.value)}
                                                    placeholder="e.g., Online (Google Meet)"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Registration Deadline</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.eventDetails.deadline}
                                                    onChange={(e) => handleInputChange('eventDetails.deadline', e.target.value)}
                                                    placeholder="e.g., December 13, 2025"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                                />
                                                <label className="form-check-label">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={formData.isDefault}
                                                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                                                />
                                                <label className="form-check-label">
                                                    Set as Default
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormConfigsList;
