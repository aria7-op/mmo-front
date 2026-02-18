import React, { useEffect, useState } from 'react';
import LoadingSpinner from "../common/LoadingSpinner";

const RedirectOnlyDonation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get amount from URL params or use default
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount') || '25';

    const createCheckoutSession = async () => {
      try {
        const response = await fetch('https://khwanzay.school/bak/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(parseFloat(amount) * 100), // Convert to cents
            currency: 'usd',
          }),
        });

        const result = await response.json();

        if (result.success && result.url) {
          // Redirect immediately to Stripe Checkout
          window.location.href = result.url;
        } else {
          setError(result.message || 'Payment setup failed');
          setLoading(false);
        }
      } catch (error) {
        setError('Payment failed. Please try again.');
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3">Redirecting to secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div className="text-center">
          <div className="alert alert-danger">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectOnlyDonation;
