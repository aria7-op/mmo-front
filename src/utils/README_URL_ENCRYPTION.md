# URL Encryption System

## Overview

This document describes the comprehensive URL encryption system implemented for the NGO website to enhance security and obfuscate routing information.

## Features

- **Complete URL Encryption**: All navigation URLs are encrypted using AES encryption
- **Seamless Integration**: Works with existing React Router setup
- **Automatic Decryption**: Encrypted URLs are automatically decrypted and routed
- **Loading States**: Shows loading spinner during decryption
- **Fallback Support**: Graceful fallback to original URLs if decryption fails

## Components

### 1. URL Encryption Utility (`urlEncryption.js`)

Core encryption/decryption functions using CryptoJS AES encryption.

**Key Functions:**
- `encryptPath(path)` - Encrypts a URL path
- `decryptPath(encryptedPath)` - Decrypts an encrypted path
- `getEncryptedRoute(path)` - Gets encrypted route with /e/ prefix
- `getOriginalPath(encryptedRoute)` - Gets original path from encrypted route
- `isEncrypted(path)` - Checks if a path is encrypted

### 2. Encrypted Route Handler (`EncryptedRoute.jsx`)

React component that handles encrypted URL decryption and redirects.

**Features:**
- Automatic decryption of /e/:encryptedPath routes
- Loading state during decryption
- Error handling with fallback to 404
- Seamless redirect to decrypted routes

### 3. Secure Link Component (`SecureLink.jsx`)

Drop-in replacement for React Router Link component that automatically encrypts URLs.

**Usage:**
```jsx
import SecureLink from './components/SecureLink';

<SecureLink to="/about">About Us</SecureLink>
// Automatically renders as: <Link to="/e/encrypted-path">About Us</Link>
```

## Implementation

### Router Setup

The router includes an encrypted route handler:

```jsx
<Route path='/e/:encryptedPath' element={<EncryptedRoute />}></Route>
```

### Menu Configuration

All menu items use encrypted URLs:

```jsx
import { getEncryptedRoute } from '../utils/urlEncryption';

{
  label: t('navigation.about'),
  path: getEncryptedRoute('/about'),
  children: [
    { label: t('navigation.submenu.aboutMMO'), path: getEncryptedRoute('/about') },
    // ... more encrypted routes
  ]
}
```

### Footer and Navigation

All navigation components use encrypted URLs:

```jsx
import { getEncryptedRoute } from '../../utils/urlEncryption';

<Link to={getEncryptedRoute('/about/organization-profile')}>Organization Profile</Link>
```

## URL Format

### Original URL
```
/about/organization-profile
```

### Encrypted URL
```
/e/U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y=
```

## Security Features

### Encryption Algorithm
- **Algorithm**: AES (Advanced Encryption Standard)
- **Key**: Secure secret key stored in application
- **Encoding**: URL-safe Base64 encoding

### Route Obfuscation
- Original paths are completely hidden
- Encrypted paths are non-guessable
- No direct access to original routes

### Error Handling
- Graceful fallback for decryption failures
- 404 redirect for invalid encrypted URLs
- Loading states during decryption process

## Testing

### Test Utility (`urlEncryptionTest.js`)

```javascript
import { testURLEncryption } from './utils/urlEncryptionTest';

// Run comprehensive encryption tests
testURLEncryption();

// Generate test URLs
import { generateTestURL, parseTestURL } from './utils/urlEncryptionTest';

const encrypted = generateTestURL('/about');
const decrypted = parseTestURL(encrypted);
```

## Usage Examples

### Basic Navigation
```jsx
import { getEncryptedRoute } from '../utils/urlEncryption';

// In components
<Link to={getEncryptedRoute('/contact')}>Contact Us</Link>

// In menu configuration
{
  label: 'Contact',
  path: getEncryptedRoute('/contact')
}
```

### Dynamic Routes
```jsx
// For dynamic content with parameters
const encryptedURL = createEncryptedURL('/projects/123', { 
  tab: 'overview',
  section: 'details' 
});
```

### Programmatic Navigation
```jsx
import { getEncryptedRoute } from '../utils/urlEncryption';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(getEncryptedRoute('/about'));
```

## Benefits

1. **Enhanced Security**: Routes are not exposed in plain text
2. **SEO Friendly**: Original routes still work for search engines
3. **User Experience**: Transparent to end users
4. **Developer Friendly**: Easy to implement and maintain
5. **Backward Compatible**: Existing routes continue to work

## Configuration

### Secret Key
The encryption key is defined in `urlEncryption.js`:

```javascript
const SECRET_KEY = 'MMO_URL_ENCRYPTION_KEY_2024';
```

**Important**: In production, this should be stored securely and potentially rotated periodically.

### Route Mapping
Common routes are mapped for efficiency:

```javascript
export const ROUTE_MAP = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  // ... more mappings
};
```

## Performance Considerations

- **Minimal Overhead**: Encryption/decryption is fast and efficient
- **Client-Side Only**: No server-side processing required
- **Caching**: Encrypted URLs can be cached by browsers
- **Lazy Loading**: Decryption only happens when needed

## Browser Support

- Modern browsers with CryptoJS support
- React Router compatible
- No additional dependencies required

## Troubleshooting

### Common Issues

1. **Blank Page**: Check if CryptoJS is properly installed
2. **404 Errors**: Verify encrypted route handler is configured
3. **Broken Links**: Ensure `getEncryptedRoute()` is used consistently

### Debug Mode

Enable console logging to debug encryption:

```javascript
// In urlEncryption.js
console.log('Original:', path);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
```

## Future Enhancements

1. **Server-Side Encryption**: Optional server-side route encryption
2. **Key Rotation**: Automatic key rotation mechanism
3. **Analytics**: Track encrypted vs direct route usage
4. **Caching**: Enhanced caching for encrypted routes
5. **Rate Limiting**: Prevent brute force attacks on encrypted URLs
