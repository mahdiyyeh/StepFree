# QA Checklist & Common Issues

## Common Runtime Issues

### 1. **Missing ANTHROPIC_API_KEY**
**Symptom:** Error: "ANTHROPIC_API_KEY environment variable is not set"  
**Fix:**
```bash
# Ensure .env.local exists in project root
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Restart dev server after adding
npm run dev
```

### 2. **JSON Parse Errors**
**Symptom:** "Failed to parse Claude response as JSON"  
**Fix:** Already handled with retry logic, but if persistent:
- Check Claude API status
- Verify API key has sufficient credits
- Check network connection

### 3. **Schema Validation Failures**
**Symptom:** "Repaired response still fails schema validation"  
**Fix:** The retry logic should handle this. If it persists:
- Check `lib/schema.ts` matches expected structure
- Verify Claude is returning all required fields
- Check debug panel for specific validation errors

### 4. **Port Already in Use**
**Symptom:** "Port 3000 is already in use"  
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### 5. **Module Not Found Errors**
**Symptom:** "Cannot find module '@/lib/...'"  
**Fix:**
```bash
# Verify tsconfig.json has correct paths
# Ensure all files exist in lib/ directory
# Restart TypeScript server in editor
```

### 6. **CORS Issues**
**Symptom:** CORS errors in browser console  
**Fix:** Not applicable - Next.js API routes are same-origin. If using external API directly from client, add:
```typescript
// In next.config.js
async headers() {
  return [{
    source: '/api/:path*',
    headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
  }]
}
```

### 7. **TypeScript Build Errors**
**Symptom:** Type errors during build  
**Fix:**
```bash
# Clear .next cache
rm -rf .next
npm run build
```

### 8. **Environment Variable Not Loading**
**Symptom:** API key undefined despite .env.local existing  
**Fix:**
- Ensure `.env.local` is in project root (not in app/)
- Restart dev server after changes
- Check for typos: `ANTHROPIC_API_KEY` (not `ANTHROPIC_KEY`)
- Verify no spaces around `=` sign

### 9. **API Rate Limits**
**Symptom:** 429 Too Many Requests  
**Fix:**
- Wait a few minutes between requests
- Check Anthropic dashboard for rate limits
- Consider adding request throttling in production

### 10. **Missing Dependencies**
**Symptom:** "Cannot find module 'zod'" or similar  
**Fix:**
```bash
npm install
# Verify package.json has all dependencies
```

## Demo Checklist (10 items)

- [ ] **Environment setup**
  - `.env.local` exists with valid `ANTHROPIC_API_KEY`
  - `npm install` completed successfully
  - `npm run dev` starts without errors
  - App loads at `http://localhost:3000`

- [ ] **Form validation**
  - Submit with empty fields shows validation error
  - Required fields (start, destination) are marked with *
  - All form inputs accept and store values correctly

- [ ] **API connectivity**
  - Submit form with valid inputs
  - Loading spinner appears
  - No console errors in browser DevTools
  - API returns response (check Network tab)

- [ ] **Response display**
  - Summary section renders with text
  - Confidence score displays as percentage (0-100)
  - Primary plan shows at least one step
  - All step cards display: title, description, time, walking mins

- [ ] **Accessibility features**
  - Checkboxes for needs work (step-free, wheelchair, etc.)
  - Disruption dropdown shows all options
  - Helper text appears under "Disruption" field
  - Form is keyboard navigable

- [ ] **Backup plans**
  - Exactly 2 backup plans display
  - Each backup shows name, reason, and steps
  - Backup plans are in 2-column grid (on desktop)

- [ ] **Staff script**
  - Staff script section displays array of strings
  - "Copy script" button works
  - Clipboard copy shows "✓ Copied!" feedback
  - Copied text matches displayed script

- [ ] **Checklist & risk flags**
  - Before-you-leave checklist items are checkable
  - Risk flags section appears if flags exist
  - All checklist items render correctly

- [ ] **Replan functionality**
  - "Replan" button appears after first plan generates
  - Clicking "Replan" regenerates plan with same inputs
  - Loading state shows "Replanning..." text
  - New plan displays successfully

- [ ] **Debug panel**
  - "Debug Information" accordion exists at bottom
  - Expanding shows: model name, latency_ms, repaired status
  - Model shows "claude-3-5-sonnet-20241022"
  - No errors in debug section

## Quick Pre-Demo Test

Run this 30-second smoke test:
1. Fill form: "King's Cross" → "London Bridge"
2. Check "Step-free only"
3. Click "Generate step-free plan"
4. Wait for results (should appear in 5-10 seconds)
5. Verify: summary, confidence score, primary plan steps all visible
6. Click "Replan" button
7. Verify new plan generates
8. Expand debug panel - verify model name visible

If all pass, you're ready to demo!
