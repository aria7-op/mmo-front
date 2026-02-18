/**
 * Stripe Webhook Manager Component
 * Handles webhook configuration and testing
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StripeWebhookManager = ({ config, onConfigUpdate }) => {
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newWebhook, setNewWebhook] = useState({
        url: '',
        events: ['payment_intent.succeeded', 'payment_intent.payment_failed', 'payment_intent.canceled']
    });

    // API base URL
    const API_BASE = 'https://khwanzay.school/bak';

    const availableEvents = [
        { id: 'payment_intent.succeeded', name: 'Payment Succeeded', description: 'Payment completed successfully' },
        { id: 'payment_intent.payment_failed', name: 'Payment Failed', description: 'Payment failed' },
        { id: 'payment_intent.canceled', name: 'Payment Canceled', description: 'Payment was canceled' },
        { id: 'charge.succeeded', name: 'Charge Succeeded', description: 'Charge completed successfully' },
        { id: 'charge.failed', name: 'Charge Failed', description: 'Charge failed' },
        { id: 'customer.created', name: 'Customer Created', description: 'New customer created' },
        { id: 'invoice.payment_succeeded', name: 'Invoice Payment Succeeded', description: 'Invoice paid successfully' },
        { id: 'invoice.payment_failed', name: 'Invoice Payment Failed', description: 'Invoice payment failed' }
    ];

    useEffect(() => {
        if (config && config.connectionStatus === 'connected') {
            fetchWebhooks();
        }
    }, [config]);

    const fetchWebhooks = async () => {
        setLoading(true);
        try {
            // This would typically call an endpoint to fetch webhooks from Stripe
            // For now, we'll simulate with empty array
            setWebhooks([]);
        } catch (error) {
            console.error('Error fetching webhooks:', error);
            toast.error('Failed to fetch webhooks');
        } finally {
            setLoading(false);
        }
    };

    const testWebhook = async (webhookUrl) => {
        setTesting(true);
        try {
            const response = await fetch(`${API_BASE}/stripe/test-webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ url: webhookUrl })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Webhook test successful');
            } else {
                toast.error(result.message || 'Webhook test failed');
            }
        } catch (error) {
            console.error('Error testing webhook:', error);
            toast.error('Failed to test webhook');
        } finally {
            setTesting(false);
        }
    };

    const handleEventToggle = (eventId) => {
        setNewWebhook(prev => ({
            ...prev,
            events: prev.events.includes(eventId)
                ? prev.events.filter(e => e !== eventId)
                : [...prev.events, eventId]
        }));
    };

    const getWebhookUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/bak/stripe/webhook`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard');
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    return (
        <div className="space-y-6">
            {/* Webhook URL Display */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Webhook Endpoint</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Webhook URL
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={getWebhookUrl()}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                            <button
                                onClick={() => copyToClipboard(getWebhookUrl())}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Copy
                            </button>
                            <button
                                onClick={() => testWebhook(getWebhookUrl())}
                                disabled={testing}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {testing ? 'Testing...' : 'Test'}
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Add this URL in your Stripe Dashboard under Developers → Webhooks
                    </p>
                </div>
            </div>

            {/* Configuration Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                        <div>
                            <h4 className="font-medium">Go to Stripe Dashboard</h4>
                            <p className="text-sm text-gray-600">Navigate to Developers → Webhooks in your Stripe account</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                        <div>
                            <h4 className="font-medium">Add Endpoint</h4>
                            <p className="text-sm text-gray-600">Click "Add endpoint" and paste the webhook URL above</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                        <div>
                            <h4 className="font-medium">Select Events</h4>
                            <p className="text-sm text-gray-600">Choose the events you want to receive (recommended events listed below)</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                        <div>
                            <h4 className="font-medium">Copy Webhook Secret</h4>
                            <p className="text-sm text-gray-600">After creating, copy the signing secret and add it to your configuration</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Events */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Events</h3>
                <div className="space-y-2">
                    {availableEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                            <div>
                                <h4 className="font-medium">{event.name}</h4>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{event.id}</code>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newWebhook.events.includes(event.id)}
                                    onChange={() => handleEventToggle(event.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Webhook Testing */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Test Webhook Events</h3>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Test your webhook configuration by sending simulated events to your endpoint.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => testWebhook(getWebhookUrl())}
                            disabled={testing}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {testing ? 'Testing...' : 'Test Payment Success'}
                        </button>
                        <button
                            onClick={() => testWebhook(getWebhookUrl())}
                            disabled={testing}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {testing ? 'Testing...' : 'Test Payment Failure'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Security Notes</h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Always use HTTPS for your webhook endpoint</li>
                    <li>• Store webhook signing secrets securely</li>
                    <li>• Verify webhook signatures for all incoming events</li>
                    <li>• Use idempotency keys when processing events</li>
                    <li>• Return 200 status codes quickly to acknowledge receipt</li>
                </ul>
            </div>
        </div>
    );
};

export default StripeWebhookManager;
