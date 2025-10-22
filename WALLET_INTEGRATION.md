# Wallet Integration Features

## Overview

NewsWave includes a comprehensive wallet integration system supporting both browser wallets (MetaMask, Coinbase Wallet) and mobile wallets via WalletConnect. The system provides a seamless, responsive experience across desktop and mobile devices.

## Features

### 1. Shared Wallet Context

- **Centralized State Management**: All wallet state is managed through a React Context, ensuring consistency across components
- **Connection Methods**: Supports both browser wallet injection and WalletConnect protocol
- **Auto-reconnection**: Automatically reconnects if wallet was previously connected
- **Account Change Detection**: Responds to wallet account changes in real-time
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 2. Dual Connection Options

#### Browser Wallet Connection
- **MetaMask, Coinbase, etc.**: One-click connection for browser extension wallets
- **Smart Detection**: Automatically detects if browser wallet is available
- **Instant Connection**: Direct connection via window.ethereum

#### WalletConnect Integration
- **Mobile-First**: QR code scanning for mobile wallet apps
- **Deep Linking**: Automatic app launching on mobile browsers
- **Major Wallet Support**: Trust Wallet, Rainbow, MetaMask Mobile, and more
- **Session Management**: Persistent sessions across page reloads

### 3. Responsive Modal Experience

- **Mobile-First Design**: Full-width buttons with clear labels and icons
- **Accessible**: Proper ARIA labels, keyboard navigation, and focus management
- **Visual Feedback**: Loading states, error messages, and success notifications
- **Connection Status**: Shows active connection method and wallet address
- **Adaptive Layout**: Different layouts for mobile vs desktop experiences

### 4. Enhanced Wallet Button

#### Desktop Experience
- **Dropdown Menu**: Click connected wallet to see options
- **Copy Address**: One-click address copying to clipboard
- **Switch Wallet**: Change connection method without disconnecting
- **Disconnect**: Clean disconnect with proper cleanup

#### Mobile Experience
- **Card Display**: Shows connected address in an attractive card format
- **Quick Actions**: Large touch-friendly buttons for copying and disconnecting
- **Clear Labels**: Explicit text for all actions

### 5. Disconnect Functionality

- **Clean Teardown**: Properly removes event listeners and cleans up state
- **WalletConnect Cleanup**: Disconnects WalletConnect sessions properly
- **User Feedback**: Toast notifications for successful disconnections
- **Error Handling**: Graceful handling of disconnect errors

### 6. Toast Notifications

- **Connection Success**: Confirms wallet connection with truncated address
- **Connection Errors**: Clear error messages for failed connections
- **Disconnection**: Notification when wallet is disconnected
- **Copy Feedback**: Confirmation when address is copied

## Technical Implementation

### Components

- **WalletProvider**: React Context provider managing global wallet state
- **WalletConnect**: Main wallet button component with desktop/mobile variants
- **WalletDetectionModal**: Modal dialog with connection options
- **useWallet Hook**: Custom hook for accessing wallet context

### Integration Points

- **Navbar**: Desktop wallet button in header
- **Mobile Menu**: Mobile-optimized wallet interface in hamburger menu
- **Submit News Page**: Automatic wallet connection for submitting articles
- **Global Access**: Available throughout the app via useWallet hook

### Connection Flow

1. **Page Load**: Check for existing wallet connections
2. **User Action**: User clicks "Connect Wallet" button
3. **Modal Display**: Show connection options (Browser Wallet or WalletConnect)
4. **Connection**: User selects method and connects
5. **State Update**: Global state updates, UI reflects connection
6. **Persistence**: Connection persists across navigation

### WalletConnect Configuration

The app requires a WalletConnect Project ID to enable mobile wallet connections:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add to `.env` file:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

## Browser & Device Compatibility

### Desktop
- **Chrome/Edge**: Full support with MetaMask extension
- **Firefox**: Full support with MetaMask extension
- **Safari**: Full support with MetaMask extension
- **Brave**: Full support with built-in wallet

### Mobile
- **iOS Safari**: WalletConnect with QR code or deep linking
- **Android Chrome**: WalletConnect with QR code or deep linking
- **In-app Browsers**: MetaMask mobile, Trust Wallet, etc.
- **Wallet Apps**: Native support in wallet app browsers

## User Experience Enhancements

### Responsive Design
- Mobile-first approach with full-width buttons
- Touch-friendly targets (minimum 44x44px)
- Clear visual hierarchy and spacing
- Smooth transitions and animations

### Accessibility
- Keyboard navigation support
- Screen reader friendly ARIA labels
- Focus management with proper focus return
- High contrast for visual elements

### Error Handling
- User rejected connection
- Connection already pending
- No wallet detected
- Network errors
- Session timeouts

### Loading States
- Connection in progress indicator
- Button disabled states
- Spinner animations
- Clear status messages

## Future Enhancements

- Network switching (Mainnet, Sepolia, etc.)
- Multi-chain support
- Transaction history tracking
- Wallet balance display
- ENS name resolution
- Gas estimation and management
- Ledger and hardware wallet support
