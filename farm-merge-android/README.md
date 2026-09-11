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

## Privacy policy
The Unifiedfarm BLM privacy policy has been updated to cover Farm Merge, AdMob/UMP, Google Play Billing, local game-state storage and privacy choices:
`https://unifiedfarmblm.com/privacy/`

## Play setup still required
1. Create a one-time in-app product with ID `remove_ads` if the Remove Ads purchase will be offered.
2. Configure Privacy & Messaging in AdMob and connect the consent message to this app.
3. Enter `https://unifiedfarmblm.com/privacy/` as the privacy-policy URL in Play Console (and where applicable in AdMob).
4. Upload the signed `.aab` to an internal/closed test before production.
5. Complete Play Console Data safety, Ads, Target audience/content, Content rating and App access declarations accurately.

Never click live ads during developer testing. Use a debug build or configure test devices in AdMob.
