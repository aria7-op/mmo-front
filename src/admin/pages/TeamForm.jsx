import React, { useState, useEffect } from 'react';

// Predefined options for Position and Department
const POSITION_OPTIONS = [
  'Executive Director',
  'Deputy Director',
  'Board Member',
  'Advisor',
  'Program Manager',
  'Project Manager',
  'Program Officer',
  'M&E Officer',
  'Finance Manager',
  'Finance Officer',
  'HR Manager',
  'HR Officer',
  'IT Manager',
  'IT Officer',
  'Communications Manager',
  'Communications Officer',
  'Operations Manager',
  'Operations Officer',
  'Admin Officer',
  'Field Officer',
  'Volunteer'
];

const DEPARTMENT_OPTIONS = [
  'Executive',
  'Programs',
  'Projects',
  'Monitoring & Evaluation',
  'Finance',
  'Human Resources',
  'Information Technology',
  'Communications',
  'Operations',
  'Administration',
  'Legal',
  'Partnerships',
  'Procurement'
];
import { useNavigate, useParams } from 'react-router-dom';
import { getTeamMemberById, createTeamMember, updateTeamMember } from '../../services/team.service';
import { showSuccessToast, showErrorToast } from '../../utils/errorHandler';
import { getImageUrlFromObject, isValidEmail } from '../../utils/apiUtils';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Helpers
const inList = (val, list) => list.includes((val || '').trim());

const TeamForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: { en: '', per: '', ps: '' },
        position: { en: '', per: '', ps: '' },
        department: { en: '', per: '', ps: '' },
        role: 'Volunteer',
        bio: { en: '', per: '', ps: '' },
        email: '',
        status: '',
        featured: false,
        order: 0,
        active: true,
        photo: null,
        existingPhoto: null,
    });

    useEffect(() => {
        if (isEdit) loadMember();
    }, [id]);

    const loadMember = async () => {
        try {
            setLoading(true);
            const member = await getTeamMemberById(id);
            if (member) {
                // Get image - check image object first, then imageUrl, then photo (for backward compatibility)
                const existingImage = member.image || member.imageUrl || member.photo || null;
                
                setFormData({
                    name: member.name || { en: '', per: '', ps: '' },
                    position: member.position || { en: '', per: '', ps: '' },
                    department: member.department || { en: '', per: '', ps: '' },
                    role: member.role || 'Volunteer',
                    bio: member.bio || { en: '', per: '', ps: '' },
                    email: member.email || '',
                    status: member.status || '',
                    featured: typeof member.featured === 'boolean' ? member.featured : false,
                    order: typeof member.order === 'number' ? member.order : (parseInt(member.order, 10) || 0),
                    active: typeof member.active === 'boolean' ? member.active : true,
                    photo: null,
                    existingPhoto: existingImage,
                });
            }
        } catch (error) {
            showErrorToast('Failed to load team member');
            navigate('/admin/team');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');

            // Validate email if provided
            if (formData.email && !isValidEmail(formData.email)) {
                showErrorToast('Please enter a valid email address');
                setSaving(false);
                return;
            }

            // Normalize payload to ensure correct types
            const normalizedData = {
                ...formData,
                featured: !!formData.featured,
                active: !!formData.active,
                order: (() => {
                    const num = parseInt(formData.order, 10);
                    return Number.isFinite(num) && num >= 0 ? num : 0;
                })(),
                email: (formData.email || '').trim() || undefined,
            };

            if (isEdit) {
                await updateTeamMember(id, normalizedData, formData.photo, token);
                showSuccessToast('Team member updated successfully');
            } else {
                await createTeamMember(normalizedData, formData.photo, token);
                showSuccessToast('Team member created successfully');
            }
            navigate('/admin/team');
        } catch (error) {
            showErrorToast(error.message || 'Failed to save team member');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-team-form">
                <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#2c3e50' }}>
                    {isEdit ? 'Edit Team Member' : 'Add Team Member'}
                </h1>
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Role</label>
                        <select value={formData.role} onChange={(e) => handleChange('role', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="Board">Board</option>
                            <option value="Executive">Executive</option>
                            <option value="Management">Management</option>
                            <option value="Staff">Staff</option>
                            <option value="Volunteer">Volunteer</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name *</label>
                        <input type="text" value={formData.name.en} onChange={(e) => handleChange('name', e.target.value, 'en')} placeholder="English Name" required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} />
                        <input type="text" value={formData.name.per} onChange={(e) => handleChange('name', e.target.value, 'per')} placeholder="Dari Name" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} />
                        <input type="text" value={formData.name.ps} onChange={(e) => handleChange('name', e.target.value, 'ps')} placeholder="Pashto Name" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Position *</label>
                        <select
                            value={inList(formData.position.en, POSITION_OPTIONS) ? formData.position.en : 'Other'}
                            onChange={(e) => {
                                const v = e.target.value;
                                const nextEn = v === 'Other' ? '' : v;
                                setFormData(prev => ({
                                    ...prev,
                                    position: {
                                        ...prev.position,
                                        en: nextEn,
                                        per: prev.position.per || nextEn,
                                        ps: prev.position.ps || nextEn,
                                    }
                                }));
                            }}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                        >
                            <option value="">Select Position</option>
                            {POSITION_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {/* If Other, show custom input for English */}
                        {(!inList(formData.position.en, POSITION_OPTIONS)) && (
                            <input 
                                type="text" 
                                value={formData.position.en} 
                                onChange={(e) => handleChange('position', e.target.value, 'en')} 
                                placeholder="Custom English Position" 
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} 
                            />
                        )}
                        <input type="text" value={formData.position.per} onChange={(e) => handleChange('position', e.target.value, 'per')} placeholder="Dari Position" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} />
                        <input type="text" value={formData.position.ps} onChange={(e) => handleChange('position', e.target.value, 'ps')} placeholder="Pashto Position" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Department</label>
                        <select
                            value={inList(formData.department.en, DEPARTMENT_OPTIONS) ? formData.department.en : 'Other'}
                            onChange={(e) => {
                                const v = e.target.value;
                                const nextEn = v === 'Other' ? '' : v;
                                setFormData(prev => ({
                                    ...prev,
                                    department: {
                                        ...prev.department,
                                        en: nextEn,
                                        per: prev.department.per || nextEn,
                                        ps: prev.department.ps || nextEn,
                                    }
                                }));
                            }}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENT_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {/* If Other, show custom input for English */}
                        {(!inList(formData.department.en, DEPARTMENT_OPTIONS)) && (
                            <input 
                                type="text" 
                                value={formData.department.en} 
                                onChange={(e) => handleChange('department', e.target.value, 'en')} 
                                placeholder="Custom English Department" 
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} 
                            />
                        )}
                        <input type="text" value={formData.department.per} onChange={(e) => handleChange('department', e.target.value, 'per')} placeholder="Dari Department" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }} />
                        <input type="text" value={formData.department.ps} onChange={(e) => handleChange('department', e.target.value, 'ps')} placeholder="Pashto Department" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bio</label>
                        <textarea 
                            value={formData.bio.en} 
                            onChange={(e) => handleChange('bio', e.target.value, 'en')} 
                            placeholder="English Bio" 
                            rows="4"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', fontFamily: 'inherit', resize: 'vertical' }} 
                        />
                        <textarea 
                            value={formData.bio.per} 
                            onChange={(e) => handleChange('bio', e.target.value, 'per')} 
                            placeholder="Dari Bio" 
                            rows="4"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', fontFamily: 'inherit', resize: 'vertical' }} 
                        />
                        <textarea 
                            value={formData.bio.ps} 
                            onChange={(e) => handleChange('bio', e.target.value, 'ps')} 
                            placeholder="Pashto Bio" 
                            rows="4"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }} 
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => handleChange('status', e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                            <option value="">Select Status</option>
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="name@example.com"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <p style={{ marginTop: '6px', color: '#777', fontSize: '12px' }}>Optional but must be unique if provided.</p>
                    </div>

                    {/* New Fields: Featured, Order, Active */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Featured</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 400 }}>
                                <input
                                    type="checkbox"
                                    checked={!!formData.featured}
                                    onChange={(e) => handleChange('featured', e.target.checked)}
                                />
                                Mark as featured
                            </label>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Order</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={Number.isFinite(formData.order) ? formData.order : 0}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    const safe = Number.isFinite(v) && v >= 0 ? v : 0;
                                    handleChange('order', safe);
                                }}
                                placeholder="Display order (0 for default)"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Active</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 400 }}>
                                <input
                                    type="checkbox"
                                    checked={!!formData.active}
                                    onChange={(e) => handleChange('active', e.target.checked)}
                                />
                                Active
                            </label>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Photo</label>
                        {formData.existingPhoto && !formData.photo && (
                            <div style={{ marginBottom: '10px' }}>
                                <img 
                                    src={getImageUrlFromObject(formData.existingPhoto)} 
                                    alt="Current" 
                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Current Photo</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files[0] }))} 
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => navigate('/admin/team')} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#95a5a6' : '#0f68bb', color: '#fff', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default TeamForm;


