import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";
import { sanitizeByType } from "../../utils/inputSanitizer";

// Stripe publishable key (should come from environment or config)
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Replace with actual key

const CheckoutForm = ({ amount, currency = 'usd' }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    zipCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let inputType = "text";
    if (type === "email") {
      inputType = "email";
    }

    const sanitizedValue = sanitizeByType(value, inputType);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on your server
      const response = await fetch('https://khwanzay.school/bak/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            city: formData.city,
            country: formData.country,
            zipCode: formData.zipCode,
          }
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        toast.error(backendError.message || 'Payment setup failed');
        setLoading(false);
        return;
      }

      // Confirm payment on the client
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              city: formData.city,
              country: formData.country,
              postal_code: formData.zipCode,
            },
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Thank you for your donation.');
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          city: "",
          country: "",
          zipCode: "",
        });
        
        // Update donation stats
        const currentStats = localStorage.getItem("donationStats");
        const stats = currentStats ? JSON.parse(currentStats) : { totalAmount: 0, donationCount: 0 };
        stats.totalAmount = (stats.totalAmount || 0) + amount;
        stats.donationCount = (stats.donationCount || 0) + 1;
        stats.lastDonation = new Date().toISOString();
        localStorage.setItem("donationStats", JSON.stringify(stats));
        window.dispatchEvent(new Event("donationUpdated"));
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-donation-form">
      <div className="row">
        {/* Personal Information */}
        <div className="col-lg-6 mb-4">
          <h4 className="mb-3">Personal Information</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Billing Information */}
        <div className="col-lg-6 mb-4">
          <h4 className="mb-3">Billing Information</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AF">Afghanistan</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">ZIP/Postal Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">Payment Information</h4>
          <div className="card p-4 mb-4">
            <div className="mb-3">
              <label className="form-label">Card Details</label>
              <div className="stripe-card-element">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5>Total Amount: ${amount.toFixed(2)} {currency.toUpperCase()}</h5>
              <small className="text-muted">Secure payment powered by Stripe</small>
            </div>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="btn btn-primary btn-lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing...
                </>
              ) : (
                `Donate $${amount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const StripeDonationContent = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(25);
  const [currency, setCurrency] = useState('usd');
  const [selectedAmount, setSelectedAmount] = useState(25);

  const presetAmounts = [10, 25, 50, 100, 250, 500];
  const currencies = [
    { value: 'usd', label: 'USD ($)' },
    { value: 'eur', label: 'EUR (€)' },
    { value: 'gbp', label: 'GBP (£)' },
  ];

  const handleAmountSelect = (amt) => {
    setSelectedAmount(amt);
    setAmount(amt);
  };

  const handleCustomAmount = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setSelectedAmount(null);
    setAmount(value);
  };

  return (
    <div className="stripe-donation-page">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Make a Donation</h1>
          <p className="lead text-muted">
            Your generous contribution helps us continue our mission and make a positive impact in the community.
          </p>
        </div>

        {/* Amount Selection */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title mb-4">Select Donation Amount</h3>
                
                {/* Currency Selection */}
                <div className="mb-4">
                  <label className="form-label">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select"
                  >
                    {currencies.map(curr => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset Amounts */}
                <div className="row mb-3">
                  {presetAmounts.map((amt) => (
                    <div key={amt} className="col-md-4 col-sm-6 mb-2">
                      <button
                        onClick={() => handleAmountSelect(amt)}
                        className={`btn w-100 ${
                          selectedAmount === amt
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                      >
                        {currency === 'usd' ? '$' : currency === 'eur' ? '€' : '£'}{amt}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-4">
                  <label className="form-label">Or enter custom amount</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      {currency === 'usd' ? '$' : currency === 'eur' ? '€' : '£'}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleCustomAmount}
                      className="form-control"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} currency={currency} />
            </Elements>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-5">
          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
            <i className="fas fa-lock text-muted"></i>
            <span className="text-muted">Secure Payment</span>
            <i className="fab fa-stripe text-muted" style={{ fontSize: '1.5em' }}></i>
            <span className="text-muted">Powered by Stripe</span>
          </div>
          <small className="text-muted">
            Your payment information is encrypted and secure. We never store your card details.
          </small>
        </div>
      </div>

      <style>{`
        .stripe-donation-page {
          padding: 60px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        
        .stripe-donation-page .container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .stripe-card-element {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }
        
        .stripe-card-element:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 12px 24px;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .card {
          border: none;
          border-radius: 15px;
        }
        
        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          padding: 12px;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
        
        .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default StripeDonationContent;
