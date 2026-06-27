# Mystery Vault Feature

## Overview
The "Mystery Vault" is a gamified discount feature allowing authenticated users to unlock a vault and reveal a randomly selected discount coupon. It replaces typical spin wheels with a premium, on-brand interactive experience.

## Schema Changes
The existing `User` model was updated to track the vault status:
- `hasOpenedVault` (Boolean, default: false)
- `vaultPrize` (String)
- `vaultCouponCode` (String) - Added to easily retrieve the active coupon.
- `vaultOpenedAt` (Date)

The existing `Coupon` model is reused to generate the real coupon upon unlocking the vault.

## API Routes

### `GET /api/users/vault/status`
- **Auth**: Required
- **Purpose**: Returns the user's vault status so the frontend knows which state to display (locked, ready, or opened).
- **Response**: `{ hasOpenedVault, vaultPrize, vaultOpenedAt, coupon: { code, expiresAt, isActive } }`

### `POST /api/users/vault/open`
- **Auth**: Required
- **Purpose**: Checks if the vault can be opened, selects a random prize based on weighted probability, creates a one-time-use 48-hour coupon, and updates the user's record.
- **Response**: `{ prizeName, couponCode, expiresAt }`

## Prize Logic (Weights)
Prizes are selected via a weighted random generation. Total weight is 100.
1. **5% OFF** - Weight 30 (`percent`, value 5)
2. **10% OFF** - Weight 25 (`percent`, value 10)
3. **Free Shipping** - Weight 20 (`flat`, value 250 PKR approx)
4. **15% OFF** - Weight 12 (`percent`, value 15)
5. **Rs.300 Voucher** - Weight 8 (`flat`, value 300)
6. **20% OFF** - Weight 4 (`percent`, value 20)
7. **Free Gift with next order** - Weight 1 (`flat`, value 500 PKR approx)

## UI Flow (`MysteryVault.tsx`)
1. **Locked State**: Unauthenticated users see a disabled vault graphic with a prompt to log in or sign up.
2. **Ready State**: Authenticated users who haven't opened the vault see an interactive gold dial. Clicking it triggers a CSS rotation animation simulating unlocking.
3. **Opened State**: Displays the prize won with a shimmer text effect, the generated coupon code (with a "Copy Code" button), and the expiration time.

The feature is integrated directly into `src/app/page.tsx` on the homepage.
