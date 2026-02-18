/**
 * User Form Page - Create and edit users
 * Consistent styling with other admin forms
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUser, getUserById, updateUser } from '../../services/users.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserForm = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: { en: '', per: '', ps: '' },
        lastName: { en: '', per: '', ps: '' },
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        role: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});

    // Fetch user data for editing
    useEffect(() => {
        if (isEditing) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const userData = await getUserById(id);
            setFormData({
                firstName: userData.firstName || { en: '', per: '', ps: '' },
                lastName: userData.lastName || { en: '', per: '', ps: '' },
                username: userData.username || '',
                email: userData.email || '',
                password: '',
                confirmPassword: '',
                gender: userData.gender || '',
                role: userData.role || ''
            });
            
            // Set image preview if exists
            if (userData.image) {
                const imageUrl = typeof userData.image === 'string' 
                    ? userData.image 
                    : userData.image.url || '';
                setImagePreview(imageUrl);
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            showErrorToast(error.message || 'Failed to fetch user');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [field, lang] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showErrorToast(t('admin.imageTooLarge', 'Image size should not exceed 5MB'));
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        // First name (at least English)
        if (!formData.firstName.en.trim()) {
            newErrors['firstName.en'] = t('admin.firstNameRequired', 'First name is required');
        }
        
        // Last name (at least English) - required by backend
        if (!formData.lastName.en.trim()) {
            newErrors['lastName.en'] = t('admin.lastNameRequired', 'Last name is required');
        }
        
        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = t('admin.emailRequired', 'Email is required');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t('admin.invalidEmail', 'Invalid email format');
        }
        
        // Password (only for new users)
        if (!isEditing && !formData.password.trim()) {
            newErrors.password = t('admin.passwordRequired', 'Password is required');
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = t('admin.passwordTooShort', 'Password must be at least 6 characters');
        }
        
        // Confirm password
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('admin.passwordMismatch', 'Passwords do not match');
        }
        
        // Role
        if (!formData.role) {
            newErrors.role = t('admin.roleRequired', 'Role is required');
        }
        
        // Gender
        if (!formData.gender) {
            newErrors.gender = t('admin.genderRequired', 'Gender is required');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            
            // Prepare data for API - ensure we don't send empty objects
            const submitData = {
                firstName: {
                    en: formData.firstName.en || '',
                    per: formData.firstName.per || '',
                    ps: formData.firstName.ps || ''
                },
                lastName: {
                    en: formData.lastName.en || '',
                    per: formData.lastName.per || '',
                    ps: formData.lastName.ps || ''
                },
                username: formData.username || '',
                email: formData.email,
                gender: formData.gender,
                role: formData.role
            };
            
            // Only include password if it's provided
            if (formData.password) {
                submitData.password = formData.password;
            }
            
            if (isEditing) {
                await updateUser(id, submitData, imageFile, token);
                showSuccessToast(t('admin.userUpdated', 'User updated successfully'));
            } else {
                await createUser(submitData, imageFile, token);
                showSuccessToast(t('admin.userCreated', 'User created successfully'));
            }
            
            navigate('/admin/users');
        } catch (error) {
            console.error('Save error:', error);
            showErrorToast(error.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="container-fluid" style={{ padding: '20px' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1" style={{ 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '28px'
                        }}>
                            {isEditing 
                                ? t('admin.editUser', 'Edit User') 
                                : t('admin.addUser', 'Add User')
                            }
                        </h2>
                        <p className="text-muted mb-0">
                            {isEditing 
                                ? t('admin.editUserInfo', 'Edit user information and settings')
                                : t('admin.addNewUser', 'Add a new user to the system')
                            }
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/admin/users')}
                        >
                            {t('admin.cancel', 'Cancel')}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Profile Image */}
                                <div className="col-md-12 mb-4">
                                    <label className="form-label">{t('admin.profileImage', 'Profile Image')}</label>
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="text-center">
                                            {imagePreview ? (
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Profile" 
                                                    className="rounded-circle"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                                                     style={{ width: '100px', height: '100px' }}>
                                                    <i className="fas fa-user fa-2x text-muted"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <small className="text-muted">
                                                {t('admin.imageSizeNote', 'Maximum file size: 5MB')}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* First Name */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.firstName', 'First Name')} ({t('admin.english', 'English')})*
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors['firstName.en'] ? 'is-invalid' : ''}`}
                                        name="firstName.en"
                                        value={formData.firstName.en}
                                        onChange={handleChange}
                                    />
                                    {errors['firstName.en'] && (
                                        <div className="invalid-feedback">{errors['firstName.en']}</div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.lastName', 'Last Name')} ({t('admin.english', 'English')})*
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors['lastName.en'] ? 'is-invalid' : ''}`}
                                        name="lastName.en"
                                        value={formData.lastName.en}
                                        onChange={handleChange}
                                    />
                                    {errors['lastName.en'] && (
                                        <div className="invalid-feedback">{errors['lastName.en']}</div>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t('admin.username', 'Username')}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder={t('admin.usernameOptional', 'Optional')}
                                    />
                                </div>

                                {/* Email */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t('admin.email', 'Email')}*</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.password', 'Password')}
                                        {!isEditing && '*'}
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={isEditing ? t('admin.leaveBlankToKeep', 'Leave blank to keep current') : ''}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t('admin.confirmPassword', 'Confirm Password')}</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t('admin.role', 'Role')}*</label>
                                    <select
                                        className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">{t('admin.selectRole', 'Select Role')}</option>
                                        <option value="Admin">{t('admin.admin', 'Admin')}</option>
                                        <option value="Manager">{t('admin.manager', 'Manager')}</option>
                                        <option value="Staff">{t('admin.staff', 'Staff')}</option>
                                        <option value="Volunteer">{t('admin.volunteer', 'Volunteer')}</option>
                                    </select>
                                    {errors.role && (
                                        <div className="invalid-feedback">{errors.role}</div>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t('admin.gender', 'Gender')}*</label>
                                    <select
                                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">{t('admin.selectGender', 'Select Gender')}</option>
                                        <option value="Male">{t('admin.male', 'Male')}</option>
                                        <option value="Female">{t('admin.female', 'Female')}</option>
                                    </select>
                                    {errors.gender && (
                                        <div className="invalid-feedback">{errors.gender}</div>
                                    )}
                                </div>

                                {/* Multilingual names (optional) */}
                                <div className="col-12">
                                    <h5 className="mb-3">{t('admin.multilingualNames', 'Multilingual Names (Optional)')}</h5>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.firstName', 'First Name')} ({t('admin.dari', 'Dari')})
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName.per"
                                        value={formData.firstName.per}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.lastName', 'Last Name')} ({t('admin.dari', 'Dari')})
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName.per"
                                        value={formData.lastName.per}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.firstName', 'First Name')} ({t('admin.pashto', 'Pashto')})
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName.ps"
                                        value={formData.firstName.ps}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {t('admin.lastName', 'Last Name')} ({t('admin.pashto', 'Pashto')})
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName.ps"
                                        value={formData.lastName.ps}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="d-flex gap-2 justify-content-end mt-4">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/admin/users')}
                                >
                                    {t('admin.cancel', 'Cancel')}
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i>
                                            {t('admin.saving', 'Saving...')}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            {isEditing ? t('admin.updateUser', 'Update User') : t('admin.createUser', 'Create User')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserForm;
