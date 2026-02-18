import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";

const MinimalStripeDonation = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = async (selectedAmount) => {
    setLoading(true);
    
    try {
      // Create checkout session on server
      const response = await fetch('https://khwanzay.school/bak/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(selectedAmount * 100), // Convert to cents
          currency: 'usd',
        }),
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Redirect directly to Stripe Checkout
        window.location.href = result.url;
      } else {
        toast.error(result.message || 'Payment setup failed');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minimal-donation-page">
      <div className="container">
        <div className="text-center">
          <h1 className="mb-4">Make a Donation</h1>
          <p className="lead mb-5">
            Your generous contribution helps us continue our mission and make a positive impact in the community.
          </p>
          
          {/* Simple amount selection */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-8">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleDonate(amt)}
                    disabled={loading}
                    className="btn btn-outline-primary"
                    style={{ minWidth: '80px' }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              
              {/* Custom amount input */}
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="form-control"
                      placeholder="Custom amount"
                      min="1"
                      step="0.01"
                    />
                    <button
                      onClick={() => handleDonate(amount)}
                      disabled={loading || amount <= 0}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        'Donate'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <small className="text-muted">
            Secure payment powered by Stripe
          </small>
        </div>
      </div>

      <style jsx>{`
        .minimal-donation-page {
          padding: 80px 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #f8f9fa;
        }
        
        .minimal-donation-page .container {
          background: white;
          border-radius: 10px;
          padding: 60px 40px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          max-width: 600px;
        }
        
        h1 {
          color: #333;
          font-weight: 700;
        }
        
        .lead {
          color: #666;
        }
        
        .btn-outline-primary:hover {
          transform: translateY(-1px);
        }
        
        .btn-primary {
          background: #635bff;
          border-color: #635bff;
        }
        
        .btn-primary:hover {
          background: #5a52e5;
          border-color: #5a52e5;
        }
      `}</style>
    </div>
  );
};

export default MinimalStripeDonation;
