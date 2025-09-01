# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🌊 Hydration Mismatch Errors

#### **Problem**: 
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

#### **Root Cause**:
Components using dynamic values that differ between server and client rendering:
- `Math.random()` calls during render
- `Date.now()` for timestamps
- Browser-specific APIs like `window` or `localStorage`

#### **Solutions**:

1. **Use the `useClientOnly` Hook**:
```typescript
import { useClientOnly } from '../hooks/useClientOnly';

const MyComponent = () => {
  const mounted = useClientOnly();
  
  if (!mounted) return null; // Skip SSR
  
  return <div>{Math.random()}</div>; // Safe on client
};
```

2. **Move Dynamic Logic to useEffect**:
```typescript
const [randomValue, setRandomValue] = useState(0);

useEffect(() => {
  setRandomValue(Math.random()); // Client-side only
}, []);
```

3. **Use Stable Random Values**:
```typescript
import { useStableRandom } from '../hooks/useClientOnly';

const MyComponent = () => {
  const { values, mounted } = useStableRandom(10);
  if (!mounted) return null;
  // Use values array safely
};
```

### 🔌 API Connection Issues

#### **Problem**: 
```
Failed to fetch GitHub data / API rate limit exceeded
```

#### **Solutions**:

1. **Rate Limiting**: 
   - GitHub allows 60 requests/hour for unauthenticated requests
   - Implement client-side caching
   - Add retry logic with exponential backoff

2. **Error Handling**:
```typescript
try {
  const data = await fetchGitHubData(username);
} catch (error) {
  if (error instanceof GitHubClientError) {
    // Handle specific GitHub errors
    console.log(error.rateLimitInfo);
  }
}
```

### 🎨 Styling Issues

#### **TailwindCSS Not Working**:
1. Verify `tailwind.config.js` content paths
2. Check `globals.css` has `@tailwind` directives
3. Restart dev server after config changes

#### **Animation Performance**:
1. Use `transform` and `opacity` for hardware acceleration
2. Avoid animating `width`, `height`, or layout properties
3. Use `will-change` sparingly and remove after animation

### 🔍 TypeScript Errors

#### **Common Fixes**:

1. **Motion Component Type Conflicts**:
```typescript
// Instead of extending HTMLAttributes
interface Props {
  onClick?: () => void;
  className?: string;
  // List specific props needed
}
```

2. **Any Type Errors**:
```typescript
// Replace any with proper types
const data: unknown = await response.json();
const typedData = data as ExpectedType;
```

3. **Hook Dependency Warnings**:
```typescript
// Include all dependencies or use useCallback
useEffect(() => {
  // code
}, [allDependencies]);
```

### 🚀 Performance Issues

#### **Large Bundle Size**:
1. Use dynamic imports for heavy components
2. Implement code splitting at route level
3. Optimize images and assets

#### **Slow Animations**:
1. Use `transform` and `opacity` only
2. Enable `layoutId` for shared element transitions
3. Reduce motion for users with `prefers-reduced-motion`

### 🧪 Testing Issues

#### **Jest Configuration**:
1. Ensure `jest.config.js` uses ES modules
2. Mock external dependencies
3. Setup `@testing-library/jest-dom` properly

#### **Component Testing**:
```typescript
// Mock framer-motion for tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }: any) => children,
}));
```

### 🌐 Deployment Issues

#### **Vercel/Netlify Build Failures**:
1. Check Node.js version compatibility
2. Verify all dependencies are in `package.json`
3. Ensure no development-only imports in production code

#### **Environment Variables**:
```bash
# Add to .env.local (not committed)
GITHUB_TOKEN=your_token_here
NEXT_PUBLIC_API_URL=https://api.github.com
```

### 🔒 Security Considerations

#### **API Security**:
1. Never expose GitHub tokens client-side
2. Implement rate limiting on API routes
3. Validate and sanitize all inputs

#### **XSS Prevention**:
1. Use React's built-in XSS protection
2. Sanitize user inputs
3. Implement CSP headers

## 📞 Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Network Tab**: Check API calls and responses  
3. **Test in Incognito**: Rule out browser extension interference
4. **Clear Cache**: Try hard refresh (Ctrl+Shift+R)
5. **Check Dependencies**: Ensure all packages are properly installed

## 🐛 Debugging Commands

```bash
# Development debugging
npm run dev          # Start with hot reload
npm run lint         # Check code quality
npm run type-check   # Verify TypeScript

# Production testing
npm run build        # Test production build
npm run start        # Test production server

# Dependency debugging
npm list             # Check installed packages
npm audit            # Security vulnerabilities
npm outdated         # Check for updates
```

Remember: Most hydration issues stem from server/client differences. Always think "What might be different between server and browser?" when debugging hydration mismatches.