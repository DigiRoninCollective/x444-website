# x444 Memecoin Payment Widget - Client Documentation

## 🪙 What is x444?

**x444** is a payment layer specifically built for **memecoins and volatile assets**.

Unlike traditional payment processors or even Coinbase's X402, x444 specializes in:
- **Accepting memecoins**: DEGEN, PEPE, SHIB, DOGE, BONK, and more
- **Real-time pricing**: Dynamic oracle-based pricing for volatile assets
- **Instant settlement**: Payments settle in <1 second
- **Gasless for users**: Zero transaction fees for your customers
- **Non-custodial**: Direct wallet-to-wallet transfers

**Perfect for:**
- NFT drops paid in memecoins
- Memecoin merchandise stores
- Community creator monetization
- Degen-to-degen transactions
- Any business accepting volatile crypto assets

---

## 🚀 Quick Start

The x444 payment widget allows you to accept memecoin payments on any website with just a few lines of code.

### 1. Include the Script

Add this to your HTML `<head>` or before closing `</body>`:

```html
<script src="https://cdn.x444.xyz/widget.js"></script>
```

### 2. Add a Container

Place a div where you want the payment widget to appear:

```html
<div id="x444-payment"></div>
```

### 3. Initialize the Widget

Add this script after the widget loads:

```html
<script>
  X444.init({
    elementId: 'x444-payment',
    linkId: 'your_payment_link_id',
    onSuccess: (txHash, amount, token) => {
      console.log('Payment successful!', txHash);
      // Redirect user, show success message, etc.
    },
    onError: (error) => {
      console.error('Payment failed:', error);
    }
  });
</script>
```

**That's it!** Your payment widget is live. 🎉

---

## 📖 Full Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Memecoin Store - Checkout</title>
  <script src="https://cdn.x444.xyz/widget.js"></script>
</head>
<body>
  <h1>Pay with Your Favorite Memecoin</h1>

  <div id="x444-payment"></div>

  <script>
    X444.init({
      elementId: 'x444-payment',
      linkId: 'memecoin_store_001',
      theme: 'dark',
      onSuccess: (txHash, amount, token) => {
        // Memecoin payment received!
        alert('Payment received in ' + token + '! TX: ' + txHash);

        // Deliver NFT, digital goods, etc.
        deliverDigitalGoods(txHash);

        // Redirect to success page
        window.location.href = '/success?tx=' + txHash;
      },
      onError: (error) => {
        alert('Payment failed: ' + error.message);
      }
    });
  </script>
</body>
</html>
```

---

## ⚙️ Configuration Options

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `elementId` | string | ID of the HTML element to mount the widget |
| `linkId` | string | Your payment link ID (get from dashboard) |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | Widget theme: `'dark'`, `'light'`, or `'minimal'` |
| `onSuccess` | function | - | Callback when payment succeeds |
| `onError` | function | - | Callback when payment fails |
| `supabaseAnonKey` | string | - | Override default Supabase key (advanced) |

---

## 🎨 Themes

### Dark Theme (Default)
```javascript
X444.init({
  elementId: 'payment',
  linkId: 'your_link_id',
  theme: 'dark' // Black background, white text
});
```

### Light Theme
```javascript
X444.init({
  elementId: 'payment',
  linkId: 'your_link_id',
  theme: 'light' // White background, black text
});
```

### Minimal Theme
```javascript
X444.init({
  elementId: 'payment',
  linkId: 'your_link_id',
  theme: 'minimal' // Transparent background, minimal UI
});
```

---

## 📞 Event Callbacks

### onSuccess

Called when payment is successfully processed.

```javascript
onSuccess: (txHash, amount, token) => {
  console.log('Transaction Hash:', txHash);
  console.log('Amount (USD):', amount);
  console.log('Token Address:', token);

  // Examples of what to do:
  // 1. Update your database
  fetch('/api/orders/confirm', {
    method: 'POST',
    body: JSON.stringify({ txHash, amount, token })
  });

  // 2. Show success message
  document.getElementById('success-msg').style.display = 'block';

  // 3. Redirect user
  window.location.href = '/success?tx=' + txHash;
}
```

### onError

Called when payment fails or user cancels.

```javascript
onError: (error) => {
  console.error('Payment Error:', error.message);

  // Examples of what to do:
  // 1. Show error message to user
  alert('Payment failed: ' + error.message);

  // 2. Log error for debugging
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({ error: error.message })
  });

  // 3. Allow user to retry
  document.getElementById('retry-btn').style.display = 'block';
}
```

---

## 🔑 Getting Your Payment Link ID

1. Go to: https://x444.xyz/dashboard
2. Click "Create Payment Link"
3. Configure your payment settings:
   - Link name (e.g., "Store Checkout")
   - Supported tokens (DEGEN, PEPE, X4, etc.)
   - Optional: Custom fee recipient
4. Copy your `linkId` - it looks like: `store_checkout_abc123`
5. Use it in the widget initialization

---

## 🎯 Use Cases

### NFT Drops (Paid in Memecoins)

```html
<div id="nft-mint-widget"></div>
<script>
  X444.init({
    elementId: 'nft-mint-widget',
    linkId: 'nft_drop_degen',
    onSuccess: (txHash, amount, token) => {
      // User paid in DEGEN, PEPE, or other memecoin
      console.log(`Payment received: ${amount} USD worth of ${token}`);

      // Mint NFT to their wallet
      mintNFT(userWallet, txHash);

      // Show success
      showSuccessMessage('NFT minted! Paid with ' + token);
    }
  });
</script>
```

### Memecoin Merchandise Store

```html
<div id="merch-checkout"></div>
<script>
  X444.init({
    elementId: 'merch-checkout',
    linkId: 'pepe_merch_store',
    onSuccess: (txHash, amount, token) => {
      // Customer paid with their favorite memecoin
      processOrder(orderId, {
        txHash,
        amountUSD: amount,
        tokenUsed: token, // Could be DOGE, SHIB, PEPE, etc.
      });

      // Send order confirmation
      sendConfirmation(email, token, amount);
    }
  });
</script>
```

---

## 🎨 Custom Styling

The widget uses CSS classes prefixed with `x444-` to avoid conflicts. You can override styles:

```html
<style>
  /* Customize button color */
  .x444-button-primary {
    background: linear-gradient(135deg, #your-color-1, #your-color-2) !important;
  }

  /* Customize widget width */
  .x444-widget {
    max-width: 500px !important;
  }

  /* Customize border radius */
  .x444-widget {
    border-radius: 20px !important;
  }
</style>
```

---

## 🛠️ Advanced Usage

### Multiple Widgets on Same Page

```html
<!-- Widget 1 -->
<div id="widget-bronze"></div>
<script>
  X444.init({
    elementId: 'widget-bronze',
    linkId: 'tier_bronze',
  });
</script>

<!-- Widget 2 -->
<div id="widget-silver"></div>
<script>
  X444.init({
    elementId: 'widget-silver',
    linkId: 'tier_silver',
  });
</script>

<!-- Widget 3 -->
<div id="widget-gold"></div>
<script>
  X444.init({
    elementId: 'widget-gold',
    linkId: 'tier_gold',
  });
</script>
```

### Dynamic Initialization

```javascript
// Initialize widget after user action
document.getElementById('show-payment').addEventListener('click', () => {
  X444.init({
    elementId: 'dynamic-payment',
    linkId: 'checkout_' + productId,
    onSuccess: (txHash) => {
      processOrder(productId, txHash);
    }
  });
});
```

### Conditional Loading

```javascript
// Only load widget if user is logged in
if (isUserLoggedIn()) {
  X444.init({
    elementId: 'member-payment',
    linkId: 'member_checkout',
  });
} else {
  document.getElementById('member-payment').innerHTML =
    '<p>Please <a href="/login">login</a> to continue</p>';
}
```

---

## 🔒 Security Best Practices

1. **Never store API keys client-side** - The widget uses your payment link ID, not sensitive keys

2. **Validate on your backend** - Always verify payment transactions on your server:
   ```javascript
   onSuccess: (txHash) => {
     // Verify with your backend
     fetch('/api/verify-payment', {
       method: 'POST',
       body: JSON.stringify({ txHash })
     }).then(response => {
       if (response.ok) {
         // Payment verified
       }
     });
   }
   ```

3. **Use HTTPS** - Always serve your website over HTTPS

4. **Implement rate limiting** - Prevent abuse by limiting payment attempts

---

## 📊 Analytics & Tracking

Track payment events:

```javascript
X444.init({
  elementId: 'payment',
  linkId: 'your_link',
  onSuccess: (txHash, amount, token) => {
    // Google Analytics
    gtag('event', 'purchase', {
      transaction_id: txHash,
      value: amount,
      currency: 'USD'
    });

    // Facebook Pixel
    fbq('track', 'Purchase', {
      value: amount,
      currency: 'USD'
    });

    // Your custom analytics
    analytics.track('Payment Success', {
      txHash,
      amount,
      token
    });
  }
});
```

---

## 🐛 Troubleshooting

### Widget Not Showing

**Check:**
- Script is loaded: View page source and verify `widget.js` is included
- Container exists: Make sure element with `elementId` exists in DOM
- Console errors: Open browser DevTools and check for JavaScript errors

**Fix:**
```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  X444.init({ ... });
});
```

### "MetaMask Not Detected"

User doesn't have MetaMask installed.

**Solution:**
```javascript
if (typeof window.ethereum === 'undefined') {
  alert('Please install MetaMask: https://metamask.io');
}
```

### Payment Link Not Found

Invalid `linkId` or link is inactive.

**Fix:**
- Verify `linkId` in dashboard
- Check link is marked as "Active"
- Ensure no typos in linkId

---

## 📞 Support

**Need help?**
- Documentation: https://docs.x444.xyz
- Dashboard: https://x444.xyz/dashboard
- Support: support@x444.xyz
- Discord: https://discord.gg/x444

**Report bugs:**
- GitHub: https://github.com/x444-protocol/widget/issues

---

## 📦 CDN URLs

**Production (Recommended):**
```html
<script src="https://cdn.x444.xyz/widget.js"></script>
```

**Development/Testing:**
```html
<script src="https://cdn.x444.xyz/widget-dev.js"></script>
```

**Specific Version:**
```html
<script src="https://cdn.x444.xyz/widget@1.0.0.js"></script>
```

---

## 📄 License

MIT License - Free to use in commercial and non-commercial projects

---

**Ready to accept crypto payments?** Get started at https://x444.xyz/dashboard 🚀
