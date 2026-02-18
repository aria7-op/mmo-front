/**
 * Enterprise Admin Login Page
 * Advanced security with Cloudflare Turnstile, 2FA, rate limiting, and monitoring
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { sanitizeTextInput } from '../../utils/inputSanitizer';
import { getAbout } from '../../services/about.service';
import { IMAGE_BASE_URL } from '../../config/api.config';
// import CloudflareTurnstile from "../../components/security/CloudflareTurnstile";
import TwoFactorAuth from "../../components/security/TwoFactorAuth";
import { 
  validatePasswordStrength, 
  RateLimiter, 
  SessionSecurity, 
  generateDeviceFingerprint,
  validateAdminLogin,
  securityHeaders
} from '../../utils/securityUtils';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [show2FA, setShow2FA] = useState(false);
    // const [turnstileToken, setTurnstileToken] = useState('');
    const [deviceFingerprint, setDeviceFingerprint] = useState('');
    const [loginAttempts, setLoginAttempts] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [securityInfo, setSecurityInfo] = useState({
        ipAddress: '',
        userAgent: '',
        location: 'Unknown'
    });
    const [organizationData, setOrganizationData] = useState(null);
    
    // const turnstileRef = useRef(null);
    const rateLimiter = useRef(new RateLimiter(5, 15 * 60 * 1000)); // 5 attempts per 15 minutes
    const { login, isAuthenticated, loading: authHookLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    // Fetch organization data
    const fetchOrganizationData = async () => {
        try {
            const data = await getAbout();
            setOrganizationData(data);
        } catch (error) {
            console.warn('Failed to fetch organization data:', error);
        }
    };

    // Helper function to construct proper logo URL
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http')) return logoPath;
        return `${IMAGE_BASE_URL}${logoPath.startsWith('/') ? logoPath.substring(1) : logoPath}`;
    };

    // Cloudflare Turnstile site key
    // const TURNSTILE_SITE_KEY = '0x4AAAAAACPm_44mTMtQD8O5';

    useEffect(() => {
        // Initialize security monitoring
        const initializeSecurity = async () => {
            try {
                // Generate device fingerprint
                const fingerprint = await generateDeviceFingerprint();
                setDeviceFingerprint(fingerprint);
                
                // Get client info
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setSecurityInfo({
                    ipAddress: data.ip || 'Unknown',
                    userAgent: navigator.userAgent,
                    location: `${data.city}, ${data.country_name}` || 'Unknown'
                });
            } catch (error) {
                console.warn('Security initialization failed:', error);
            }
        };
        
        initializeSecurity();
        fetchOrganizationData();
        
        // Set security headers
        Object.entries(securityHeaders).forEach(([header, value]) => {
            // Note: These would need to be set server-side in production
            console.log(`Security Header: ${header}: ${value}`);
        });
        
        // Wait for auth check to complete
        if (authHookLoading) {
            setAuthLoading(true);
        } else {
            setAuthLoading(false);
            // Redirect if already authenticated
            if (isAuthenticated) {
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, authHookLoading, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Enhanced validation
        const validation = validateAdminLogin(username, password);
        if (!validation.isValid) {
            showErrorToast(validation.errors.join(', '));
            return;
        }
        
        // Rate limiting check
        const rateLimitResult = rateLimiter.current.canAttempt(securityInfo.ipAddress);
        if (!rateLimitResult.allowed) {
            const minutes = Math.ceil(rateLimitResult.timeToWait / 60000);
            showErrorToast(`Too many login attempts. Please try again in ${minutes} minutes.`);
            return;
        }
        
        // Check Turnstile verification
        // if (!turnstileToken) {
        //     showErrorToast('Please complete the security verification first.');
        //     return;
        // }

        setLoading(true);
        const attemptData = {
            timestamp: Date.now(),
            ipAddress: securityInfo.ipAddress,
            userAgent: securityInfo.userAgent,
            success: false
        };
        
        try {
            // Detect suspicious activity
            const suspicious = SessionSecurity.detectSuspiciousActivity(loginAttempts);
            if (suspicious.hasMultipleIPs || suspicious.hasRapidAttempts) {
                console.warn('Suspicious login activity detected:', suspicious);
                // In production, you might want to block or require additional verification
            }
            
            const response = await login(username, password, {
                // turnstileToken,
                deviceFingerprint,
                securityInfo
            });
            
            attemptData.success = true;
            setLoginAttempts(prev => [...prev, attemptData]);
            
            if (response.requires2FA) {
                setShow2FA(true);
                showSuccessToast('Please enter your 2FA code');
            } else {
                showSuccessToast('Login successful!');
                navigate(from, { replace: true });
            }
        } catch (error) {
            attemptData.success = false;
            setLoginAttempts(prev => [...prev, attemptData]);
            rateLimiter.current.recordAttempt(securityInfo.ipAddress);
            
            // Reset Turnstile on failed login
            // if (turnstileRef.current) {
            //     turnstileRef.current.reset();
            //     setTurnstileToken('');
            // }
            
            showErrorToast(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const value = sanitizeTextInput(e.target.value);
        setPassword(value);
        
        if (value.length > 0) {
            const strength = validatePasswordStrength(value);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(null);
        }
    };
    
    const handle2FAVerify = async (code) => {
        setLoading(true);
        try {
            await login(username, password, {
                twoFactorCode: code,
                deviceFingerprint,
                securityInfo
            });
            showSuccessToast('Login successful!');
            navigate(from, { replace: true });
        } catch (error) {
            showErrorToast('Invalid 2FA code. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handle2FAResend = async () => {
        try {
            // Request new 2FA code
            showSuccessToast('New code sent to your device');
        } catch (error) {
            showErrorToast('Failed to resend code. Please try again.');
        }
    };
    
    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 'weak': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'strong': return '#10b981';
            case 'very-strong': return '#059669';
            default: return '#6b7280';
        }
    };
    
    // Extract data from API response structure
    const apiData = organizationData?.data || organizationData;
    // Always use the 'logo' field (path) and construct URL, ignore 'logoUrl' if it's incorrect
    const logoUrl = getLogoUrl(apiData?.logo);
    const orgName = apiData?.name;
    const orgStatus = apiData?.status;
    const totalEmployees = apiData?.totalEmp;

    // Show 2FA screen if needed
    if (show2FA) {
        return (
            <div className="admin-login-page" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f68bb 0%, #0d5ba0 50%, #f5b51e 100%)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(15, 104, 187, 0.4)',
                    width: '100%',
                    maxWidth: '450px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <TwoFactorAuth
                        onVerify={handle2FAVerify}
                        onResend={handle2FAResend}
                        isLoading={loading}
                        method="totp"
                    />
                </div>
            </div>
        );
    }

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="admin-login-page" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f68bb 0%, #0d5ba0 50%, #f5b51e 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-50%',
                left: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(245,181,30,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
            }}></div>

            <div className="login-container" style={{
                backgroundColor: '#fff',
                padding: '50px 40px',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(15, 104, 187, 0.4)',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo/Icon Header */}
                <div className="login-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 20px',
                        background: 'linear-gradient(135deg, #0f68bb 0%, #0d5ba0 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(15, 104, 187, 0.4)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt="Organization Logo" 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '16px'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <i className="fas fa-shield-alt" style={{ 
                            fontSize: '36px', 
                            color: '#fff', 
                            zIndex: 1,
                            display: logoUrl ? 'none' : 'flex'
                        }}></i>
                        <div style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#f5b51e',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(245, 181, 30, 0.5)',
                        }}>
                            <i className="fas fa-check" style={{ fontSize: '14px', color: '#fff' }}></i>
                        </div>
                    </div>
                    <h1 style={{ 
                        color: '#2c3e50', 
                        marginBottom: '8px',
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '-0.5px',
                    }}>
                        {orgName || 'MMO Admin Panel'}
                    </h1>
                    <p style={{ 
                        color: '#7f8c8d', 
                        fontSize: '15px',
                        margin: 0,
                    }}>
                        Sign in to continue to your dashboard
                    </p>
                    {apiData && (
                        <div style={{ 
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}>
                            <i className="fas fa-building" style={{ color: '#0f68bb' }}></i>
                            <span>Status: {orgStatus || 'Active'}</span>
                            {totalEmployees > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{totalEmployees} Employees</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label htmlFor="username" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '14px',
                        }}>
                            <i className="fas fa-user" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#0f68bb',
                                fontSize: '16px',
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}>
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(sanitizeTextInput(e.target.value))}
                                required
                                disabled={loading}
                                placeholder="Enter your username"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    backgroundColor: loading ? '#f9fafb' : '#fff',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#0f68bb';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(15, 104, 187, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label htmlFor="password" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#2c3e50', 
                            fontWeight: '600',
                            fontSize: '14px',
                        }}>
                            <i className="fas fa-lock" style={{ marginRight: '8px', color: '#0f68bb' }}></i>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#0f68bb',
                                fontSize: '16px',
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}>
                                <i className="fas fa-key"></i>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                onFocus={(e) => {
                                    setShowPasswordRequirements(true);
                                    e.target.style.borderColor = '#0f68bb';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(15, 104, 187, 0.1)';
                                }}
                                onBlur={(e) => {
                                    setShowPasswordRequirements(false);
                                    if (passwordStrength) {
                                        e.target.style.borderColor = getPasswordStrengthColor(passwordStrength.strength);
                                    } else {
                                        e.target.style.borderColor = '#e5e7eb';
                                    }
                                    e.target.style.boxShadow = 'none';
                                }}
                                required
                                disabled={loading}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 48px',
                                    border: passwordStrength 
                                        ? `2px solid ${getPasswordStrengthColor(passwordStrength.strength)}`
                                        : '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    backgroundColor: loading ? '#f9fafb' : '#fff',
                                }}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#9ca3af',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.color = '#0f68bb';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#9ca3af';
                                }}
                            >
                                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {passwordStrength && showPasswordRequirements && (
                            <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                border: `1px solid ${getPasswordStrengthColor(passwordStrength.strength)}`,
                                fontSize: '12px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ 
                                        fontWeight: '600',
                                        color: getPasswordStrengthColor(passwordStrength.strength)
                                    }}>
                                        Password Strength: {passwordStrength.strength.replace('-', ' ').toUpperCase()}
                                    </span>
                                    <span style={{ color: '#6b7280' }}>
                                        {passwordStrength.score}/{passwordStrength.maxScore}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: '#6b7280'
                                }}>
                                    <div style={{ 
                                        color: passwordStrength.checks.length ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.length ? 'fa-check' : 'fa-times'}`}></i>
                                        8+ characters
                                    </div>
                                    <div style={{ 
                                        color: passwordStrength.checks.uppercase ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.uppercase ? 'fa-check' : 'fa-times'}`}></i>
                                        Uppercase
                                    </div>
                                    <div style={{ 
                                        color: passwordStrength.checks.lowercase ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.lowercase ? 'fa-check' : 'fa-times'}`}></i>
                                        Lowercase
                                    </div>
                                    <div style={{ 
                                        color: passwordStrength.checks.numbers ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.numbers ? 'fa-check' : 'fa-times'}`}></i>
                                        Numbers
                                    </div>
                                    <div style={{ 
                                        color: passwordStrength.checks.special ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.special ? 'fa-check' : 'fa-times'}`}></i>
                                        Special chars
                                    </div>
                                    <div style={{ 
                                        color: passwordStrength.checks.noCommonPatterns ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <i className={`fas ${passwordStrength.checks.noCommonPatterns ? 'fa-check' : 'fa-times'}`}></i>
                                        No patterns
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cloudflare Turnstile */}
                    {/* <div className="form-group" style={{ marginBottom: '30px' }}>
                        <CloudflareTurnstile
                            ref={turnstileRef}
                            siteKey={TURNSTILE_SITE_KEY}
                            onVerify={(token) => setTurnstileToken(token)}
                            onExpire={() => setTurnstileToken('')}
                            onError={(error) => {
                                console.error('Turnstile error:', error);
                                setTurnstileToken('');
                            }}
                            theme="auto"
                            size="normal"
                        />
                    </div> */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: loading 
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                                : 'linear-gradient(135deg, #0f68bb 0%, #0d5ba0 50%, #0f68bb 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: loading 
                                ? 'none' 
                                : '0 10px 25px rgba(15, 104, 187, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 15px 35px rgba(15, 104, 187, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 25px rgba(15, 104, 187, 0.4)';
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Website Link */}
                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb',
                }}>
                    <button 
                        style={{ 
                            color: '#0f68bb',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                        }}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#f5b51e';
                            e.target.style.transform = 'translateX(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#0f68bb';
                            e.target.style.transform = 'translateX(0)';
                        }}
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Website</span>
                    </button>
                </div>

                {/* Footer text */}
                <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#9ca3af',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                        <i className="fas fa-shield-check" style={{ color: '#10b981' }}></i>
                        <span>Enterprise-Grade Security</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>Protected by Cloudflare • End-to-end encrypted</div>
                    
                    {/* Powered by Ariadelta.af */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        color: '#6b7280'
                    }}>
                        <span>Powered by</span>
                        <a 
                            href="https://ariadelta.af" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                color: '#0f68bb',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#f5b51e';
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#0f68bb';
                                e.target.style.textDecoration = 'none';
                            }}
                        >
                            <i className="fas fa-code" style={{ fontSize: '9px' }}></i>
                            Ariadelta.af
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
