# Wallet Integration Setup Guide

## Quick Start

### 1. Install Dependencies

All necessary dependencies should already be installed. If not, run:

```bash
npm install
```

### 2. Configure WalletConnect (Required for Mobile Wallets)

To enable WalletConnect for mobile wallet support:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID
5. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

6. Add your Project ID to `.env`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

**Note**: Without a WalletConnect Project ID, only browser wallet connections (MetaMask extension) will work. Mobile wallet connections via QR code will be disabled.

### 3. Run the Development Server

```bash
npm run dev
```

## Testing the Integration

### Desktop Testing

1. **With Browser Wallet (e.g., MetaMask)**:
   - Click "Connect Wallet" button
   - Select "Browser Wallet" option
   - Approve connection in MetaMask extension
   - Verify connected address appears
   - Test disconnect functionality
   - Test copy address feature

2. **Without Browser Wallet**:
   - Click "Connect Wallet" button
   - Should see installation prompt
   - Click "Install MetaMask" to be redirected
   - After installation, refresh and test connection

### Mobile Testing

1. **With Mobile Wallet App (e.g., MetaMask Mobile, Trust Wallet)**:
   - Open the app in mobile browser
   - Click "Connect Wallet" button
   - Select "WalletConnect" option
   - Scan QR code with wallet app OR
   - Click deep link to open wallet app
   - Approve connection in wallet app
   - Verify connection in mobile menu

2. **Different Breakpoints**:
   - Test at various screen sizes (320px, 375px, 768px, 1024px)
   - Verify responsive layout works correctly
   - Check mobile menu wallet display
   - Test all touch interactions

### Testing Scenarios

#### Connection Flow
- [ ] Connect via browser wallet
- [ ] Connect via WalletConnect
- [ ] Reject connection (should show error)
- [ ] Cancel connection (should return to modal)
- [ ] Connection with pending request (should show warning)

#### Disconnection Flow
- [ ] Disconnect from dropdown menu (desktop)
- [ ] Disconnect from mobile menu
- [ ] Verify clean state after disconnect
- [ ] Reconnect after disconnect

#### State Persistence
- [ ] Connect wallet
- [ ] Refresh page
- [ ] Verify still connected (browser wallet)
- [ ] Navigate between pages
- [ ] Verify connection persists

#### Account Switching
- [ ] Connect wallet
- [ ] Switch accounts in wallet
- [ ] Verify UI updates to new account
- [ ] Check toast notification appears

#### Error Handling
- [ ] Try to connect without wallet installed
- [ ] Reject connection request
- [ ] Test with invalid WalletConnect project ID
- [ ] Switch networks during connection
- [ ] Disconnect wallet externally

#### Accessibility
- [ ] Navigate using keyboard only
- [ ] Test with screen reader
- [ ] Verify focus management
- [ ] Check ARIA labels
- [ ] Test color contrast

## Troubleshooting

### WalletConnect Not Working

**Problem**: "WalletConnect Unavailable" error  
**Solution**: Make sure you've set `VITE_WALLETCONNECT_PROJECT_ID` in your `.env` file

**Problem**: QR code doesn't appear  
**Solution**: Check browser console for errors. Verify Project ID is valid.

**Problem**: Mobile wallet can't connect  
**Solution**: Ensure wallet app is updated to latest version. Some wallets may not support Sepolia testnet.

### Browser Wallet Not Detected

**Problem**: "No Browser Wallet Detected" when MetaMask is installed  
**Solution**: 
- Refresh the page
- Check that MetaMask is unlocked
- Try disabling and re-enabling the extension
- Clear browser cache

### Connection Hangs

**Problem**: Connection request never completes  
**Solution**:
- Close pending requests in wallet
- Refresh the page
- Try disconnecting and reconnecting
- Check network connectivity

### Address Not Updating

**Problem**: UI shows old address after switching accounts  
**Solution**: This should happen automatically. If not, try:
- Disconnecting and reconnecting
- Refreshing the page
- Checking browser console for errors

## Development Notes

### File Structure

```
src/
├── contexts/
│   └── WalletContext.tsx          # Shared wallet state management
├── components/
│   ├── WalletConnect.tsx          # Main wallet button component
│   ├── WalletDetectionModal.tsx   # Connection modal
│   └── Navbar.tsx                 # Navigation with wallet integration
└── lib/
    └── ethereum.ts                # Ethereum interaction utilities
```

### Key Features

- **Shared Context**: All components use `useWallet()` hook for consistency
- **Auto-reconnection**: Checks for existing connections on load
- **Mobile-first**: Responsive design with touch-friendly targets
- **Accessible**: Full keyboard navigation and screen reader support
- **Error Recovery**: Graceful error handling with user feedback

### Adding Wallet Integration to New Components

```tsx
import { useWallet } from '@/contexts/WalletContext';

function MyComponent() {
  const { account, isConnected, connectBrowserWallet, disconnect } = useWallet();
  
  return (
    <div>
      {isConnected ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectBrowserWallet}>Connect</button>
      )}
    </div>
  );
}
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 13+
- Chrome Android 90+

## Security Considerations

- Never store private keys in the application
- Always verify network before transactions
- Use HTTPS in production
- Keep WalletConnect Project ID in `.env` (not committed to git)
- Validate all user inputs before blockchain interactions
