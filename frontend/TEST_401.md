# Testing 401 Auto-Logout Functionality

This guide explains how to test the 401 unauthorized auto-logout feature in the axios interceptor.

## What Does the 401 Interceptor Do?

When any API call returns a 401 status code:
1. ✅ Automatically removes the JWT token from localStorage
2. ✅ Redirects the user to the login page (`/`)
3. ✅ Passes the error through to error boundaries

## Testing Methods

### 1. 🧪 Manual Testing with Test Page

1. Open `test-401.html` in your browser
2. Login to your app first to get a valid token
3. Use the test buttons to simulate different scenarios:
   - **Test Expired Token**: Sets an expired token and makes a request
   - **Test Invalid Token**: Uses a malformed token
   - **Test Backend 401**: Calls the `/test-401` endpoint
   - **Check Current Token**: Shows current token info
   - **Clear Token**: Manually clears the token

### 2. 🔧 Backend Test Endpoint

I've added a temporary test endpoint:
```
GET /test-401
```

This endpoint always returns 401 and can be used to test the interceptor.

**Remember to remove this endpoint in production!**

### 3. 🎯 Browser Dev Tools Testing

**Method A: Manually expire token**
```javascript
// In browser console:
// 1. Check current token
localStorage.getItem('token')

// 2. Set an expired token
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6MSwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDB9.invalid')

// 3. Make any protected API call and watch the interceptor work
```

**Method B: Intercept requests**
```javascript
// Block requests and return 401
// In Network tab: Right-click → Block request URL → Edit response
```

### 4. 🧪 Automated Testing

Run the test suite:
```bash
npm run test frontend/src/tests/axiosInterceptor.test.js
```

The test verifies:
- ✅ Token is cleared on 401
- ✅ Redirect happens on 401
- ✅ Non-401 errors don't trigger logout
- ✅ Network errors don't trigger logout

### 5. 📋 Integration Testing Steps

1. **Setup**: Start backend and frontend
2. **Login**: Get a valid token
3. **Test scenarios**:
   - Expired token → Should auto-logout
   - Invalid token → Should auto-logout
   - Network error → Should NOT auto-logout
   - 500 error → Should NOT auto-logout

## Expected Behavior

✅ **On 401 Response:**
- Token cleared from localStorage
- Redirect to `/` (login page)
- User sees login screen
- No infinite redirect loops

❌ **On Non-401 Errors:**
- Token remains in localStorage
- No redirect
- Error handled by error boundary
- User stays on current page

## Common Issues

**Q: Token not clearing?**
- Check if you're using the correct axios instance (`api` from `axiosAgent.ts`)
- Verify the interceptor is properly installed

**Q: Redirect not happening?**
- Check if `window.location.href` is accessible
- Verify you're not in a test environment that mocks `window.location`

**Q: Infinite redirect loops?**
- Ensure auth endpoints are excluded from token attachment
- Check that login page doesn't make protected API calls on load

## Cleanup

After testing, remember to:
1. Remove the test endpoint (`/test-401`) from production
2. Remove the `test401` controller function
3. Delete the test files if not needed
4. Clear any test tokens from localStorage 