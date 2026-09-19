# PixelQuote Android rebuild

Status: release bundle compiles successfully on Android API 36.

## Identity
- App: PixelQuote
- Package: `com.unifiedfarmblm.pixelquote`
- Version: `1.0.0` / versionCode `1`
- Branch: `pixelquote-rebuild`

## Build stack
- Android Gradle Plugin 8.13.2
- Gradle 8.13
- Java 17
- Google Mobile Ads 25.4.0
- Google UMP 4.0.0

## Features
- Native dark/aurora PixelQuote UI
- 67 offline quotes / 9 categories
- Favorites, copy/share, check-in/streak and daily progress
- Personalized Trending and Rising rankings from on-device views/favorites/shares
- Public remote category/keyword seasonal boost feed with offline fallback
- UMP consent/privacy choices
- Banner and paced interstitial support

## Reconstruct the source used by CI
```bash
cat pixelquote-build-src/part*.b64 > /tmp/pixelquote-src.b64
base64 -d /tmp/pixelquote-src.b64 > /tmp/pixelquote-src.tar.gz
tar -xzf /tmp/pixelquote-src.tar.gz
```

CI workflow: `.github/workflows/build-pixelquote.yml`
Successful release workflow run: `35423805032`.

## AdMob before production
The recovered PixelQuote banner unit is `ca-app-pub-6880789718761474/6677229180`.
The PixelQuote app-level AdMob ID was not recoverable from the available files or connected Gmail, so the current manifest intentionally uses Google's sample app ID. The interstitial is also a Google test unit. Create/recover those PixelQuote-specific values in AdMob and rebuild before production publication.

The dedicated PixelQuote upload keystore and its credentials are intentionally **not stored in GitHub**.
