import React, { useState, useEffect, useRef } from 'react';
import { generateSecureToken } from '../../utils/securityUtils';

const TwoFactorAuth = ({ 
  onVerify, 
  onResend, 
  isLoading = false,
  method = 'totp' // 'totp' or 'email'
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Timer for resend countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    
    if (digit.length > 1) {
      // If pasted, distribute digits
      const digits = digit.split('').slice(0, 6);
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) {
          newCode[index + i] = d;
        }
      });
      setCode(newCode);
      
      // Focus next empty input
      const nextEmpty = newCode.findIndex(c => c === '');
      if (nextEmpty !== -1 && nextEmpty < 6) {
        inputRefs.current[nextEmpty]?.focus();
      }
    } else {
      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);
      
      // Move to next input
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      setCode(digits.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCanResend(false);
      setTimeLeft(30);
      setCode(['', '', '', '', '', '']);
      onResend();
      inputRefs.current[0]?.focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="two-factor-auth">
      <style>{`
        .two-factor-auth {
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
        }
        
        .auth-header {
          margin-bottom: 30px;
        }
        
        .auth-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0f68bb 0%, #0d5ba0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(15, 104, 187, 0.3);
        }
        
        .auth-icon i {
          font-size: 24px;
          color: white;
        }
        
        .auth-title {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .auth-description {
          font-size: 14px;
          color: #7f8c8d;
          line-height: 1.5;
          margin-bottom: 25px;
        }
        
        .code-inputs {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 25px;
        }
        
        .code-input {
          width: 45px;
          height: 50px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
          background: #fff;
        }
        
        .code-input:focus {
          outline: none;
          border-color: #0f68bb;
          box-shadow: 0 0 0 3px rgba(15, 104, 187, 0.1);
        }
        
        .code-input.filled {
          border-color: #10b981;
          background: #f0fdf4;
        }
        
        .verify-button {
          width: 100%;
          padding: 14px;
          background: isCodeComplete 
            ? 'linear-gradient(135deg, #0f68bb 0%, #0d5ba0 100%)'
            : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: isCodeComplete && !isLoading ? 'pointer' : 'not-allowed';
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 104, 187, 0.3);
        }
        
        .resend-section {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .resend-button {
          background: none;
          border: none;
          color: #0f68bb;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
        }
        
        .resend-button:hover:not(:disabled) {
          color: #f5b51e;
        }
        
        .resend-button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
          text-decoration: none;
        }
        
        .method-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0f9ff;
          color: #0f68bb;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        @media (max-width: 480px) {
          .code-inputs {
            gap: 8px;
          }
          
          .code-input {
            width: 40px;
            height: 45px;
            font-size: 16px;
          }
        }
      `}</style>

      <div className="auth-header">
        <div className="auth-icon">
          <i className={`fas ${method === 'totp' ? 'fa-mobile-alt' : 'fa-envelope'}`}></i>
        </div>
        <h2 className="auth-title">Two-Factor Authentication</h2>
        <div className="method-indicator">
          <i className={`fas ${method === 'totp' ? 'fa-clock' : 'fa-envelope'}`}></i>
          {method === 'totp' ? 'Authenticator App' : 'Email Code'}
        </div>
        <p className="auth-description">
          {method === 'totp' 
            ? 'Enter the 6-digit code from your authenticator app'
            : 'Enter the 6-digit code sent to your email address'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`code-input ${digit ? 'filled' : ''}`}
              disabled={isLoading}
              autoComplete={`one-time-code${index}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="verify-button"
          disabled={!isCodeComplete || isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <i className="fas fa-check-circle"></i>
              <span>Verify Code</span>
            </>
          )}
        </button>
      </form>

      <div className="resend-section">
        {canResend ? (
          <button
            type="button"
            className="resend-button"
            onClick={handleResend}
            disabled={isLoading}
          >
            <i className="fas fa-redo" style={{ marginRight: '6px' }}></i>
            Resend Code
          </button>
        ) : (
          <span>
            Resend code in <strong>{timeLeft}s</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
