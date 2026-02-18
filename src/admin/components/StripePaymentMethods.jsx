/**
 * Stripe Payment Methods Component
 * Manages payment methods configuration and testing
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StripePaymentMethods = ({ config }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testAmount, setTestAmount] = useState('10.00');
    const [testCurrency, setTestCurrency] = useState('usd');

    // API base URL
    const API_BASE = 'https://khwanzay.school/bak';

    const availablePaymentMethods = [
        {
            id: 'card',
            name: 'Credit/Debit Cards',
            description: 'Visa, Mastercard, American Express, etc.',
            icon: 'fa-credit-card',
            status: 'active',
            supported: true
        },
        {
            id: 'apple_pay',
            name: 'Apple Pay',
            description: 'Digital wallet for Apple devices',
            icon: 'fa-apple',
            status: 'active',
            supported: true
        },
        {
            id: 'google_pay',
            name: 'Google Pay',
            description: 'Digital wallet for Android devices',
            icon: 'fa-google',
            status: 'active',
            supported: true
        },
        {
            id: 'usdc',
            name: 'USDC (Crypto)',
            description: 'USD Coin cryptocurrency payments',
            icon: 'fa-coins',
            status: 'active',
            supported: true
        },
        {
            id: 'ach',
            name: 'ACH Bank Transfer',
            description: 'Direct bank transfers (US only)',
            icon: 'fa-university',
            status: 'configurable',
            supported: true
        },
        {
            id: 'sepa',
            name: 'SEPA Direct Debit',
            description: 'European bank transfers',
            icon: 'fa-euro',
            status: 'configurable',
            supported: true
        }
    ];

    const testCards = [
        {
            name: 'Visa (Successful)',
            number: '4242424242424242',
            exp: '04/24',
            cvv: '123',
            result: 'success'
        },
        {
            name: 'Mastercard (Successful)',
            number: '5555555555554444',
            exp: '04/24',
            cvv: '123',
            result: 'success'
        },
        {
            name: 'Card Declined',
            number: '4000000000000002',
            exp: '04/24',
            cvv: '123',
            result: 'fail'
        },
        {
            name: 'Insufficient Funds',
            number: '4000000000009995',
            exp: '04/24',
            cvv: '123',
            result: 'fail'
        }
    ];

    useEffect(() => {
        if (config && config.connectionStatus === 'connected') {
            fetchPaymentMethods();
        }
    }, [config]);

    const fetchPaymentMethods = async () => {
        setLoading(true);
        try {
            // This would typically fetch from Stripe API
            // For now, we'll use the available methods
            setPaymentMethods(availablePaymentMethods);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            toast.error('Failed to fetch payment methods');
        } finally {
            setLoading(false);
        }
    };

    const testPaymentMethod = async (paymentMethodId, testCard = null) => {
        setTesting(true);
        try {
            const response = await fetch(`${API_BASE}/stripe/test-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    paymentMethod: paymentMethodId,
                    amount: testAmount,
                    currency: testCurrency,
                    testCard
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`Payment test successful for ${paymentMethodId}`);
            } else {
                toast.error(result.message || `Payment test failed for ${paymentMethodId}`);
            }
        } catch (error) {
            console.error('Error testing payment method:', error);
            toast.error('Failed to test payment method');
        } finally {
            setTesting(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            configurable: 'bg-yellow-100 text-yellow-800',
            disabled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.disabled}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Payment Methods Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Available Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <i className={`fas ${method.icon} text-xl text-gray-600`}></i>
                                    <div>
                                        <h4 className="font-medium">{method.name}</h4>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </div>
                                </div>
                                {getStatusBadge(method.status)}
                            </div>
                            {method.supported && (
                                <button
                                    onClick={() => testPaymentMethod(method.id)}
                                    disabled={testing}
                                    className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                                >
                                    {testing ? 'Testing...' : 'Test'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Testing */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Test Payment</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={testAmount}
                                onChange={(e) => setTestAmount(e.target.value)}
                                step="0.01"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Currency
                            </label>
                            <select
                                value={testCurrency}
                                onChange={(e) => setTestCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="usd">USD</option>
                                <option value="eur">EUR</option>
                                <option value="gbp">GBP</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => testPaymentMethod('card')}
                                disabled={testing}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {testing ? 'Testing...' : 'Test Card Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Cards */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Test Cards</h3>
                <div className="space-y-3">
                    {testCards.map((card, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div>
                                <h4 className="font-medium">{card.name}</h4>
                                <p className="text-sm text-gray-600">
                                    Card: {card.number} | Exp: {card.exp} | CVV: {card.cvv}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    card.result === 'success' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {card.result === 'success' ? 'Success' : 'Failure'}
                                </span>
                                <button
                                    onClick={() => testPaymentMethod('card', card)}
                                    disabled={testing}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                                >
                                    Test
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> These are Stripe's test cards. Use them in test mode to simulate different payment scenarios.
                    </p>
                </div>
            </div>

            {/* Configuration Guide */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Methods Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Card Payments</h4>
                        <p className="text-sm text-gray-600">
                            Automatically enabled when you activate Stripe. Supports Visa, Mastercard, American Express, Discover, and more.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Digital Wallets</h4>
                        <p className="text-sm text-gray-600">
                            Apple Pay and Google Pay are automatically available when card payments are enabled. No additional configuration needed.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cryptocurrency (USDC)</h4>
                        <p className="text-sm text-gray-600">
                            USDC payments are automatically included if enabled in your Stripe account. Contact Stripe support to enable crypto payments.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Bank Transfers</h4>
                        <p className="text-sm text-gray-600">
                            ACH and SEPA transfers require additional setup in your Stripe account and may require business verification.
                        </p>
                    </div>
                </div>
            </div>

            {/* Security Notes */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Security & Compliance</h3>
                <ul className="space-y-2 text-sm text-green-700">
                    <li>• All payment methods are PCI DSS compliant through Stripe</li>
                    <li>• Sensitive card data never touches your servers</li>
                    <li>• 3D Secure authentication is automatically supported</li>
                    <li>• Fraud detection is built into Stripe's processing</li>
                    <li>• All transactions are encrypted end-to-end</li>
                </ul>
            </div>
        </div>
    );
};

export default StripePaymentMethods;
