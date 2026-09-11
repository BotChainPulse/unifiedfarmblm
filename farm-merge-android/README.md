# Farm Merge: 2048 Puzzle — Rebuilt Android Project

Clean-room rebuild based on the supplied APK behaviour, modernized for current Google Play requirements.

## Identity
- Package: `com.unifiedfarmblm.farmmerge`
- Version: `1.1.0` (`versionCode 3`)
- Min SDK: 23
- Target/Compile SDK: 36

## Integrations
- Google Mobile Ads SDK 25.4.0
- Google User Messaging Platform 4.0.0
- Google Play Billing 9.1.0
- One-time product ID: `remove_ads`

## Improvements
- UMP consent flow before ads are requested.
- Premium entitlement reconciled against Google Play purchases.
- Premium users keep the Continue/rescue mechanic without an ad.
- Current board and score persist across restarts.
- Accessible directional buttons supplement swipe controls.
- Debug builds use Google's test ad units; release builds use the registered Farm Merge ad units.

## Play setup still required
1. Create a one-time in-app product with ID `remove_ads`.
2. Configure Privacy & Messaging in AdMob.
3. Publish a public privacy-policy URL and enter it in Play Console and AdMob.
4. Upload the signed `.aab` to an internal/closed test before production.

Never click live ads during developer testing. Use a debug build or configure test devices in AdMob.
