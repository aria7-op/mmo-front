/**
 * Security Utilities
 * Enterprise-level security functions for admin authentication
 */

// Password strength validation
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommonPatterns: !/(.)\1{2,}/.test(password), // No 3+ consecutive same chars
    noSequences: !/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    maxScore: Object.keys(checks).length,
    strength: getStrengthLevel(score),
    checks,
    isValid: score >= 5 // Require at least 5/7 checks
  };
};

const getStrengthLevel = (score) => {
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
};

// Rate limiting for login attempts
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  canAttempt(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...validAttempts);
      const timeToWait = this.windowMs - (now - oldestAttempt);
      return {
        allowed: false,
        timeToWait,
        attemptsLeft: 0
      };
    }
    
    return {
      allowed: true,
      attemptsLeft: this.maxAttempts - validAttempts.length
    };
  }

  recordAttempt(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    userAttempts.push(now);
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs);
    this.attempts.set(identifier, validAttempts);
  }

  reset(identifier) {
    this.attempts.delete(identifier);
  }
}

// Session security
export const SessionSecurity = {
  // Check if session is still valid
  isValidSession: (lastActivity, maxInactivity = 30 * 60 * 1000) => { // 30 minutes
    return Date.now() - lastActivity < maxInactivity;
  },

  // Generate secure session ID
  generateSessionId: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Check for suspicious activity
  detectSuspiciousActivity: (loginAttempts, timeWindow = 60 * 60 * 1000) => { // 1 hour
    const now = Date.now();
    const recentAttempts = loginAttempts.filter(attempt => now - attempt.timestamp < timeWindow);
    
    return {
      hasMultipleIPs: new Set(recentAttempts.map(a => a.ipAddress)).size > 1,
      hasMultipleUserAgents: new Set(recentAttempts.map(a => a.userAgent)).size > 1,
      hasRapidAttempts: recentAttempts.length > 10,
      hasFailedAttempts: recentAttempts.filter(a => a.success === false).length > 5
    };
  }
};

// Device fingerprinting
export const generateDeviceFingerprint = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = {
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth: screen.colorDepth,
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
  };
  
  // Create hash
  const fingerprintString = JSON.stringify(fingerprint);
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://challenges.cloudflare.com; frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Input validation for admin login
export const validateAdminLogin = (username, password) => {
  const errors = [];
  
  // Username validation
  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  if (!/^[a-zA-Z0-9_@.-]+$/.test(username)) {
    errors.push('Username contains invalid characters');
  }
  
  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      errors.push('Password does not meet security requirements');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate secure random token
export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Encrypt sensitive data (basic implementation)
export const encryptData = async (data, key) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyBuffer,
    dataBuffer
  );
  
  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv)
  };
};

// Decrypt sensitive data
export const decryptData = async (encryptedData, key, iv) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    keyBuffer,
    new Uint8Array(encryptedData)
  );
  
  return decoder.decode(decrypted);
};
