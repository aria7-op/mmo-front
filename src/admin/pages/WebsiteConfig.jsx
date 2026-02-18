/**
 * Website Configuration Page
 * Manage website settings including logo, favicon, site name, and other global configurations
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../layouts/AdminLayout';
import { toast } from 'react-toastify';
import { 
  getAllWebsiteSettings, 
  updateWebsiteConfig, 
  uploadWebsiteLogo, 
  uploadWebsiteFavicon 
} from '../../services/websiteConfig.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WebsiteConfig = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    siteName: { en: '', dr: '', ps: '' },
    siteDescription: { en: '', dr: '', ps: '' },
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    contactPhone: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    seo: {
      metaTitle: { en: '', dr: '', ps: '' },
      metaDescription: { en: '', dr: '', ps: '' },
      keywords: ''
    },
    maintenance: {
      enabled: false,
      message: { en: '', dr: '', ps: '' }
    }
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await getAllWebsiteSettings();
      if (response?.success && response?.data) {
        setConfig(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Failed to load website config:', error);
      toast.error('Failed to load website configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleMultiLanguageChange = (section, field, lang, value) => {
    if (section) {
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [lang]: value
          }
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    
    try {
      setSaving(true);
      const response = await uploadWebsiteLogo(file);
      if (response?.success) {
        setConfig(prev => ({ ...prev, logoUrl: response.data.url }));
        toast.success('Logo uploaded successfully');
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setSaving(false);
    }
  };

  const handleFaviconUpload = async (file) => {
    if (!file) return;
    
    try {
      setSaving(true);
      const response = await uploadWebsiteFavicon(file);
      if (response?.success) {
        setConfig(prev => ({ ...prev, faviconUrl: response.data.url }));
        toast.success('Favicon uploaded successfully');
      }
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      toast.error('Failed to upload favicon');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateWebsiteConfig('general', config);
      if (response?.success) {
        toast.success('Website configuration saved successfully');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      toast.error('Failed to save configuration');
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Website Configuration</h2>
            <p className="text-muted mb-0">Manage your website settings, logo, and global configurations</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="row">
          {/* Basic Information */}
          <div className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Site Name (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.siteName.en}
                    onChange={(e) => handleMultiLanguageChange(null, 'siteName', 'en', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Site Name (Dari)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.siteName.dr}
                    onChange={(e) => handleMultiLanguageChange(null, 'siteName', 'dr', e.target.value)}
                    placeholder="نام سایت را وارد کنید"
                    dir="rtl"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Site Name (Pashto)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.siteName.ps}
                    onChange={(e) => handleMultiLanguageChange(null, 'siteName', 'ps', e.target.value)}
                    placeholder="د ویب پاڼ نوم لیکئ"
                    dir="rtl"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Site Description (English)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={config.siteDescription.en}
                    onChange={(e) => handleMultiLanguageChange(null, 'siteDescription', 'en', e.target.value)}
                    placeholder="Enter site description"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={config.contactEmail}
                    onChange={(e) => handleInputChange(null, 'contactEmail', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={config.contactPhone}
                    onChange={(e) => handleInputChange(null, 'contactPhone', e.target.value)}
                    placeholder="+93 20 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo and Favicon */}
          <div className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Logo & Favicon</h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label">Website Logo</label>
                  {config.logoUrl && (
                    <div className="mb-3">
                      <img 
                        src={config.logoUrl} 
                        alt="Website Logo" 
                        style={{ maxHeight: '80px', maxWidth: '200px' }}
                        className="border rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e.target.files[0])}
                    disabled={saving}
                  />
                  <small className="text-muted">Recommended size: 200x80px, Max size: 2MB</small>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Favicon</label>
                  {config.faviconUrl && (
                    <div className="mb-3">
                      <img 
                        src={config.faviconUrl} 
                        alt="Favicon" 
                        style={{ width: '32px', height: '32px' }}
                        className="border rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept=".ico,.png"
                    onChange={(e) => handleFaviconUpload(e.target.files[0])}
                    disabled={saving}
                  />
                  <small className="text-muted">Recommended: 32x32px ICO or PNG, Max size: 1MB</small>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Social Media</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Facebook</label>
                  <input
                    type="url"
                    className="form-control"
                    value={config.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Twitter</label>
                  <input
                    type="url"
                    className="form-control"
                    value={config.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/handle"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Instagram</label>
                  <input
                    type="url"
                    className="form-control"
                    value={config.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/handle"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="form-control"
                    value={config.socialMedia.linkedin}
                    onChange={(e) => handleInputChange('socialMedia', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">YouTube</label>
                  <input
                    type="url"
                    className="form-control"
                    value={config.socialMedia.youtube}
                    onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/channel"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">SEO Settings</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Meta Title (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={config.seo.metaTitle.en}
                        onChange={(e) => handleMultiLanguageChange('seo', 'metaTitle', 'en', e.target.value)}
                        placeholder="Meta title for search engines"
                        maxLength={60}
                      />
                      <small className="text-muted">Max 60 characters</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Meta Description (English)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={config.seo.metaDescription.en}
                        onChange={(e) => handleMultiLanguageChange('seo', 'metaDescription', 'en', e.target.value)}
                        placeholder="Meta description for search engines"
                        maxLength={160}
                      />
                      <small className="text-muted">Max 160 characters</small>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <small className="text-muted">Comma-separated keywords</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Maintenance Mode</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="maintenanceEnabled"
                      checked={config.maintenance.enabled}
                      onChange={(e) => handleInputChange('maintenance', 'enabled', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="maintenanceEnabled">
                      Enable Maintenance Mode
                    </label>
                  </div>
                  <small className="text-muted">When enabled, visitors will see a maintenance page</small>
                </div>
                
                {config.maintenance.enabled && (
                  <div className="mb-3">
                    <label className="form-label">Maintenance Message (English)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={config.maintenance.message.en}
                      onChange={(e) => handleMultiLanguageChange('maintenance', 'message', 'en', e.target.value)}
                      placeholder="We are currently under maintenance. Please check back soon."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WebsiteConfig;
