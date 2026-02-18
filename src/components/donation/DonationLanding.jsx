import React from 'react';

const DonationLanding = () => {
  const presetAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="donation-landing">
      <div className="container">
        <div className="text-center">
          <h1 className="mb-4">Make a Donation</h1>
          <p className="lead mb-5">
            Your generous contribution helps us continue our mission and make a positive impact in the community.
          </p>
          
          {/* Amount selection */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-8">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {presetAmounts.map((amt) => (
                  <a
                    key={amt}
                    href={`/donation-checkout?amount=${amt}`}
                    className="btn btn-outline-primary"
                    style={{ minWidth: '80px', textDecoration: 'none' }}
                  >
                    ${amt}
                  </a>
                ))}
              </div>
              
              {/* Custom amount form */}
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <form action="/donation-checkout" method="get">
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder="Custom amount"
                        min="1"
                        step="0.01"
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        Donate
                      </button>
                    </div>
                  </form>
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
        .donation-landing {
          padding: 80px 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #f8f9fa;
        }
        
        .donation-landing .container {
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

export default DonationLanding;
