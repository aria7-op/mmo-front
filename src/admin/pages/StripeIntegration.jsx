/**
 * Stripe Integration Page - Modern styling consistent with other admin pages
 * Configure and manage Stripe payment integration with consistent design patterns
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast, showCrudToasts, showLoadingToast, dismissToast, showInfoToast } from '../../utils/errorHandler';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../layouts/AdminLayout';
import StripeWebhookManager from '../components/StripeWebhookManager';
import StripePaymentMethods from '../components/StripePaymentMethods';

const StripeIntegration = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const [activeTab, setActiveTab] = useState('configuration');

    // API base URL
    const API_BASE = 'https://khwanzay.school/bak';

    const [formData, setFormData] = useState({
        publishableKey: '',
        secretKey: '',
        webhookSecret: '',
        mode: 'test',
        webhookUrl: '',
        defaultCurrency: 'usd'
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${API_BASE}/stripe/config`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setConfig(result.data);
                    setFormData({
                        publishableKey: result.data.publishableKey || '',
                        mode: result.data.mode || 'test',
                        webhookUrl: result.data.webhookUrl || '',
                        defaultCurrency: result.data.defaultCurrency || 'usd'
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching Stripe config:', error);
            showErrorToast('Failed to fetch Stripe configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`${API_BASE}/stripe/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showSuccessToast('Stripe configuration saved successfully');
                setConfig(result.data);
                setShowForm(false);
                fetchConfig();
            } else {
                showErrorToast(result.message || 'Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            showErrorToast('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const testConnection = async () => {
        setTesting(true);
        try {
            const response = await fetch(`${API_BASE}/stripe/test-connection`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const result = await response.json();

            if (result.success) {
                showSuccessToast('Connection test successful');
                fetchConfig();
            } else {
                showErrorToast(result.message || 'Connection test failed');
            }
        } catch (error) {
            console.error('Error testing connection:', error);
            showErrorToast('Failed to test connection');
        } finally {
            setTesting(false);
        }
    };

    const fetchAccountInfo = async () => {
        try {
            const response = await fetch(`${API_BASE}/stripe/account-info`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setAccountInfo(result.data);
            } else {
                showErrorToast(result.message || 'Failed to fetch account info');
            }
        } catch (error) {
            console.error('Error fetching account info:', error);
            showErrorToast('Failed to fetch account information');
        }
    };

    const getStatusBadge = (status) => {
        const badgeClasses = {
            connected: 'bg-success',
            disconnected: 'bg-secondary',
            error: 'bg-danger'
        };

        return (
            <span className={`badge ${badgeClasses[status] || badgeClasses.disconnected}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

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
                            <i className="fab fa-stripe me-3" style={{ color: '#635BFF' }}></i>
                            {t('admin.stripeIntegration', 'Stripe Integration')}
                        </h2>
                        <p className="text-muted mb-0">
                            {t('admin.configureStripePayment', 'Configure and manage your Stripe payment integration')}
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        {config && (
                            <button
                                className="btn btn-outline-primary"
                                onClick={testConnection}
                                disabled={testing}
                            >
                                <i className="fas fa-plug me-2"></i>
                                {testing ? t('admin.testing', 'Testing...') : t('admin.testConnection', 'Test Connection')}
                            </button>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className="fas fa-cog me-2"></i>
                            {showForm ? t('admin.cancel', 'Cancel') : config ? t('admin.updateConfig', 'Update Config') : t('admin.addConfig', 'Add Config')}
                        </button>
                    </div>
                </div>

                {/* Configuration Status */}
                {config && (
                    <div className="quick-actions">
                        <h2>Configuration Status</h2>
                        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
                                    <i className="fa fa-cog"></i>
                                </div>
                                <div className="stat-body">
                                    <div className="stat-value" style={{ fontSize: '18px' }}>{config.mode}</div>
                                    <div className="stat-label">Mode</div>
                                </div>
                            </div>
                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                <div className="stat-icon" style={{ 
                                    backgroundColor: config.connectionStatus === 'connected' ? '#27ae60' : 
                                                   config.connectionStatus === 'disconnected' ? '#e74c3c' : '#f39c12' 
                                }}>
                                    <i className="fa fa-plug"></i>
                                </div>
                                <div className="stat-body">
                                    <div className="stat-value" style={{ fontSize: '18px' }}>{config.connectionStatus}</div>
                                    <div className="stat-label">Connection Status</div>
                                </div>
                            </div>
                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
                                    <i className="fa fa-clock"></i>
                                </div>
                                <div className="stat-body">
                                    <div className="stat-value" style={{ fontSize: '18px' }}>
                                        {config.lastTested ? new Date(config.lastTested).toLocaleDateString() : 'Never'}
                                    </div>
                                    <div className="stat-label">Last Tested</div>
                                </div>
                            </div>
                        </div>
                        {config.lastError && (
                            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '6px' }}>
                                <p style={{ margin: '0 0 4px 0', color: '#c33', fontSize: '14px' }}>
                                    <strong>Last Error:</strong> {config.lastError.message}
                                </p>
                                {config.lastError.timestamp && (
                                    <p style={{ margin: 0, color: '#c33', fontSize: '12px' }}>
                                        {new Date(config.lastError.timestamp).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Configuration Form */}
                {showForm && (
                    <div className="quick-actions">
                        <h2>{config ? 'Update Configuration' : 'Add New Configuration'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                        Mode
                                    </label>
                                    <select
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                    >
                                        <option value="test">Test</option>
                                        <option value="live">Live</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                        Default Currency
                                    </label>
                                    <select
                                        name="defaultCurrency"
                                        value={formData.defaultCurrency}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                    >
                                        <option value="usd">USD</option>
                                        <option value="eur">EUR</option>
                                        <option value="gbp">GBP</option>
                                        <option value="afn">AFN</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                    Publishable Key (pk_*)
                                </label>
                                <input
                                    type="text"
                                    name="publishableKey"
                                    value={formData.publishableKey}
                                    onChange={handleInputChange}
                                    placeholder="pk_test_..."
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                    Secret Key (sk_*)
                                </label>
                                <input
                                    type="password"
                                    name="secretKey"
                                    value={formData.secretKey}
                                    onChange={handleInputChange}
                                    placeholder="sk_test_..."
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                    Webhook Secret (Optional)
                                </label>
                                <input
                                    type="password"
                                    name="webhookSecret"
                                    value={formData.webhookSecret}
                                    onChange={handleInputChange}
                                    placeholder="whsec_..."
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>
                                    Webhook URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="webhookUrl"
                                    value={formData.webhookUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://your-domain.com/bak/stripe/webhook"
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '14px' }}
                                />
                            </div>

                            <div className="actions" style={{ justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-secondary"
                                    style={{ marginRight: '8px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary"
                                    style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                                >
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Information Tabs */}
                <div className="quick-actions">
                    <div style={{ borderBottom: '1px solid #e1e8ed', marginBottom: '20px' }}>
                        <nav style={{ display: 'flex', gap: '0' }}>
                            <button
                                onClick={() => setActiveTab('configuration')}
                                style={{
                                    padding: '12px 20px',
                                    borderBottom: activeTab === 'configuration' ? '2px solid #3498db' : '2px solid transparent',
                                    color: activeTab === 'configuration' ? '#3498db' : '#7f8c8d',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none'
                                }}
                            >
                                Configuration Guide
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('account');
                                    fetchAccountInfo();
                                }}
                                style={{
                                    padding: '12px 20px',
                                    borderBottom: activeTab === 'account' ? '2px solid #3498db' : '2px solid transparent',
                                    color: activeTab === 'account' ? '#3498db' : '#7f8c8d',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none'
                                }}
                            >
                                Account Info
                            </button>
                            <button
                                onClick={() => setActiveTab('webhooks')}
                                style={{
                                    padding: '12px 20px',
                                    borderBottom: activeTab === 'webhooks' ? '2px solid #3498db' : '2px solid transparent',
                                    color: activeTab === 'webhooks' ? '#3498db' : '#7f8c8d',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none'
                                }}
                            >
                                Webhooks Setup
                            </button>
                            <button
                                onClick={() => setActiveTab('payment-methods')}
                                style={{
                                    padding: '12px 20px',
                                    borderBottom: activeTab === 'payment-methods' ? '2px solid #3498db' : '2px solid transparent',
                                    color: activeTab === 'payment-methods' ? '#3498db' : '#7f8c8d',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none'
                                }}
                            >
                                Payment Methods
                            </button>
                        </nav>
                    </div>

                    <div>
                        {activeTab === 'configuration' && (
                            <div style={{ lineHeight: '1.6' }}>
                                <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#2c3e50' }}>How to Configure Stripe</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>1. Create a Stripe Account</h4>
                                        <p style={{ margin: 0, color: '#7f8c8d' }}>
                                            Sign up at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>stripe.com</a> and complete your business profile.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>2. Get Your API Keys</h4>
                                        <p style={{ margin: 0, color: '#7f8c8d' }}>
                                            Navigate to Developers → API Keys in your Stripe dashboard to find your publishable and secret keys.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>3. Configure Webhooks (Optional but Recommended)</h4>
                                        <p style={{ margin: 0, color: '#7f8c8d' }}>
                                            Set up webhooks to receive real-time payment notifications. Use endpoint: <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>/bak/stripe/webhook</code>
                                        </p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>4. Test Your Integration</h4>
                                        <p style={{ margin: 0, color: '#7f8c8d' }}>
                                            Use test mode with Stripe's test cards to verify everything works before going live.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div style={{ lineHeight: '1.6' }}>
                                <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#2c3e50' }}>Stripe Account Information</h3>
                                {accountInfo ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
                                                    <i className="fa fa-id-card"></i>
                                                </div>
                                                <div className="stat-body">
                                                    <div className="stat-value" style={{ fontSize: '14px', wordBreak: 'break-all' }}>{accountInfo.account.id}</div>
                                                    <div className="stat-label">Account ID</div>
                                                </div>
                                            </div>
                                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                <div className="stat-icon" style={{ backgroundColor: '#e74c3c' }}>
                                                    <i className="fa fa-globe"></i>
                                                </div>
                                                <div className="stat-body">
                                                    <div className="stat-value" style={{ fontSize: '18px' }}>{accountInfo.account.country}</div>
                                                    <div className="stat-label">Country</div>
                                                </div>
                                            </div>
                                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                <div className="stat-icon" style={{ backgroundColor: '#f39c12' }}>
                                                    <i className="fa fa-envelope"></i>
                                                </div>
                                                <div className="stat-body">
                                                    <div className="stat-value" style={{ fontSize: '14px', wordBreak: 'break-all' }}>{accountInfo.account.email}</div>
                                                    <div className="stat-label">Email</div>
                                                </div>
                                            </div>
                                            <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
                                                    <i className="fa fa-building"></i>
                                                </div>
                                                <div className="stat-body">
                                                    <div className="stat-value" style={{ fontSize: '16px', textTransform: 'capitalize' }}>{accountInfo.account.type}</div>
                                                    <div className="stat-label">Account Type</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 style={{ fontSize: '16px', margin: '0 0 12px 0', color: '#2c3e50' }}>Balance</h4>
                                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                                                <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                    <div className="stat-icon" style={{ backgroundColor: '#27ae60' }}>
                                                        <i className="fa fa-dollar-sign"></i>
                                                    </div>
                                                    <div className="stat-body">
                                                        <div className="stat-value" style={{ fontSize: '18px' }}>
                                                            ${accountInfo.balance.available.reduce((sum, bal) => sum + bal.amount, 0) / 100}
                                                        </div>
                                                        <div className="stat-label">Available</div>
                                                    </div>
                                                </div>
                                                <div className="stat-card" style={{ textDecoration: 'none' }}>
                                                    <div className="stat-icon" style={{ backgroundColor: '#f39c12' }}>
                                                        <i className="fa fa-hourglass-half"></i>
                                                    </div>
                                                    <div className="stat-body">
                                                        <div className="stat-value" style={{ fontSize: '18px' }}>
                                                            ${accountInfo.balance.pending.reduce((sum, bal) => sum + bal.amount, 0) / 100}
                                                        </div>
                                                        <div className="stat-label">Pending</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: '#7f8c8d' }}>Click "Account Info" tab to load your Stripe account details.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'webhooks' && (
                            <StripeWebhookManager config={config} onConfigUpdate={fetchConfig} />
                        )}

                        {activeTab === 'payment-methods' && (
                            <StripePaymentMethods config={config} />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default StripeIntegration;
