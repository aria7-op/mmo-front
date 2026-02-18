import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';
import { getOurStory, createOurStory, updateOurStory } from '../../services/ourStory.service';

const OurStoryAdmin = () => {
    const navigate = useNavigate();
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: { en: '', per: '', ps: '' },
        subtitle: { en: '', per: '', ps: '' },
        story: { en: '', per: '', ps: '' },
        mission: { en: '', per: '', ps: '' },
        vision: { en: '', per: '', ps: '' },
        values: [],
        keyMilestones: [],
        status: 'active'
    });
    const [heroImage, setHeroImage] = useState(null);
    const [images, setImages] = useState([]);
    const [previewHero, setPreviewHero] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        fetchStoryData();
    }, []);

    const fetchStoryData = async () => {
        try {
            setLoading(true);
            const result = await getOurStory();
            
            if (result.success && result.data) {
                setStoryData(result.data);
                setFormData({
                    title: result.data.title || { en: '', per: '', ps: '' },
                    subtitle: result.data.subtitle || { en: '', per: '', ps: '' },
                    story: result.data.story || { en: '', per: '', ps: '' },
                    mission: result.data.mission || { en: '', per: '', ps: '' },
                    vision: result.data.vision || { en: '', per: '', ps: '' },
                    values: result.data.values || [],
                    keyMilestones: result.data.keyMilestones || [],
                    status: result.data.status || 'active'
                });
                setPreviewHero(result.data.heroImageUrl || null);
                setPreviewImages(result.data.images || []);
            }
        } catch (error) {
            toast.error('Failed to load story data');
            console.error('Error fetching story data:', error);
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

    const handleAddValue = () => {
        setFormData(prev => ({
            ...prev,
            values: [...prev.values, {
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                color: '#667eea',
                order: prev.values.length
            }]
        }));
    };

    const handleUpdateValue = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            values: prev.values.map((valueItem, i) => 
                i === index 
                    ? { 
                        ...valueItem, 
                        [field]: {
                            ...valueItem[field],
                            [lang]: value
                        }
                    }
                    : valueItem
            )
        }));
    };

    const handleRemoveValue = (index) => {
        setFormData(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const handleAddMilestone = () => {
        setFormData(prev => ({
            ...prev,
            keyMilestones: [...prev.keyMilestones, {
                year: new Date().getFullYear().toString(),
                title: { en: '', per: '', ps: '' },
                description: { en: '', per: '', ps: '' },
                order: prev.keyMilestones.length
            }]
        }));
    };

    const handleUpdateMilestone = (index, field, lang, value) => {
        setFormData(prev => ({
            ...prev,
            keyMilestones: prev.keyMilestones.map((milestone, i) => 
                i === index 
                    ? { 
                        ...milestone, 
                        [field]: field === 'year' ? value : {
                            ...milestone[field],
                            [lang]: value
                        }
                    }
                    : milestone
            )
        }));
    };

    const handleRemoveMilestone = (index) => {
        setFormData(prev => ({
            ...prev,
            keyMilestones: prev.keyMilestones.filter((_, i) => i !== index)
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

            let result;
            if (storyData) {
                result = await updateOurStory(storyData._id, formDataToSend);
            } else {
                result = await createOurStory(formDataToSend);
            }

            if (result.success) {
                toast.success(storyData ? 'Story updated successfully!' : 'Story created successfully!');
                setStoryData(result.data);
            } else {
                toast.error(result.message || 'Failed to save story');
            }
        } catch (error) {
            toast.error('Error saving story');
            console.error('Error saving story:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading story data...</p>
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
                            <h2>Our Story Management</h2>
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/admin')}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Basic Information */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5>Basic Information</h5>
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

                        {/* Story Content */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5>Story Content</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Story (English)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.story.en}
                                                onChange={(e) => handleInputChange('story', 'en', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Story (Dari)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.story.per}
                                                onChange={(e) => handleInputChange('story', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Story (Pashto)</label>
                                            <textarea
                                                className="form-control"
                                                rows="6"
                                                value={formData.story.ps}
                                                onChange={(e) => handleInputChange('story', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mission & Vision */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5>Mission & Vision</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Mission (English)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.mission.en}
                                                onChange={(e) => handleInputChange('mission', 'en', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Mission (Dari)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.mission.per}
                                                onChange={(e) => handleInputChange('mission', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Mission (Pashto)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.mission.ps}
                                                onChange={(e) => handleInputChange('mission', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Vision (English)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.vision.en}
                                                onChange={(e) => handleInputChange('vision', 'en', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Vision (Dari)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.vision.per}
                                                onChange={(e) => handleInputChange('vision', 'per', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Vision (Pashto)</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.vision.ps}
                                                onChange={(e) => handleInputChange('vision', 'ps', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5>Values</h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddValue}>
                                        Add Value
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.values.map((value, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Value {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveValue(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={value.title.en}
                                                        onChange={(e) => handleUpdateValue(index, 'title', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={value.title.per}
                                                        onChange={(e) => handleUpdateValue(index, 'title', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={value.title.ps}
                                                        onChange={(e) => handleUpdateValue(index, 'title', 'ps', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Color</label>
                                                    <input
                                                        type="color"
                                                        className="form-control"
                                                        value={value.color}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            values: prev.values.map((v, i) => 
                                                                i === index ? { ...v, color: e.target.value } : v
                                                            )
                                                        }))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (English)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={value.description.en}
                                                        onChange={(e) => handleUpdateValue(index, 'description', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Dari)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={value.description.per}
                                                        onChange={(e) => handleUpdateValue(index, 'description', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Pashto)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={value.description.ps}
                                                        onChange={(e) => handleUpdateValue(index, 'description', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Key Milestones */}
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5>Key Milestones</h5>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddMilestone}>
                                        Add Milestone
                                    </button>
                                </div>
                                <div className="card-body">
                                    {formData.keyMilestones.map((milestone, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Milestone {index + 1}</h6>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveMilestone(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Year</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={milestone.year}
                                                        onChange={(e) => handleUpdateMilestone(index, 'year', null, e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (English)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={milestone.title.en}
                                                        onChange={(e) => handleUpdateMilestone(index, 'title', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (Dari)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={milestone.title.per}
                                                        onChange={(e) => handleUpdateMilestone(index, 'title', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Title (Pashto)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={milestone.title.ps}
                                                        onChange={(e) => handleUpdateMilestone(index, 'title', 'ps', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (English)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={milestone.description.en}
                                                        onChange={(e) => handleUpdateMilestone(index, 'description', 'en', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Dari)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={milestone.description.per}
                                                        onChange={(e) => handleUpdateMilestone(index, 'description', 'per', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Description (Pashto)</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="2"
                                                        value={milestone.description.ps}
                                                        onChange={(e) => handleUpdateMilestone(index, 'description', 'ps', e.target.value)}
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
                                        {saving ? 'Saving...' : (storyData ? 'Update Story' : 'Create Story')}
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

export default OurStoryAdmin;
