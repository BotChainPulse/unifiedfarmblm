package com.unifiedfarmblm.farmmerge;

import android.app.Activity;
import android.content.Context;
import android.view.ViewGroup;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public final class AdManager {
    private final Context context;
    private boolean initialized;
    private InterstitialAd interstitial;
    private RewardedAd rewarded;
    private AdView banner;

    public AdManager(Context context) { this.context = context.getApplicationContext(); }

    public void initialize(Runnable onReady) {
        if (initialized) { onReady.run(); return; }
        MobileAds.initialize(context, status -> {
            initialized = true;
            loadInterstitial();
            loadRewarded();
            onReady.run();
        });
    }

    public void attachBanner(ViewGroup container) {
        detachBanner();
        banner = new AdView(container.getContext());
        banner.setAdSize(AdSize.BANNER);
        banner.setAdUnitId(BuildConfig.BANNER_AD_UNIT_ID);
        container.removeAllViews();
        container.addView(banner, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        banner.loadAd(new AdRequest.Builder().build());
    }

    public void detachBanner() {
        if (banner != null) {
            ViewGroup parent = (ViewGroup) banner.getParent();
            if (parent != null) parent.removeView(banner);
            banner.destroy();
            banner = null;
        }
    }

    public void showInterstitial(Activity activity, Runnable after) {
        if (interstitial == null) { after.run(); loadInterstitial(); return; }
        InterstitialAd ad = interstitial;
        interstitial = null;
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override public void onAdDismissedFullScreenContent() { loadInterstitial(); after.run(); }
            @Override public void onAdFailedToShowFullScreenContent(com.google.android.gms.ads.AdError adError) { loadInterstitial(); after.run(); }
        });
        ad.show(activity);
    }

    public void showRewarded(Activity activity, Runnable onReward, Runnable unavailable) {
        if (rewarded == null) { loadRewarded(); unavailable.run(); return; }
        RewardedAd ad = rewarded;
        rewarded = null;
        final boolean[] earned = {false};
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override public void onAdDismissedFullScreenContent() {
                loadRewarded();
                if (!earned[0]) unavailable.run();
            }
            @Override public void onAdFailedToShowFullScreenContent(com.google.android.gms.ads.AdError adError) {
                loadRewarded();
                unavailable.run();
            }
        });
        ad.show(activity, rewardItem -> {
            earned[0] = true;
            onReward.run();
        });
    }

    private void loadInterstitial() {
        InterstitialAd.load(context, BuildConfig.INTERSTITIAL_AD_UNIT_ID,
                new AdRequest.Builder().build(), new InterstitialAdLoadCallback() {
                    @Override public void onAdLoaded(InterstitialAd ad) { interstitial = ad; }
                    @Override public void onAdFailedToLoad(LoadAdError error) { interstitial = null; }
                });
    }

    private void loadRewarded() {
        RewardedAd.load(context, BuildConfig.REWARDED_AD_UNIT_ID,
                new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
                    @Override public void onAdLoaded(RewardedAd ad) { rewarded = ad; }
                    @Override public void onAdFailedToLoad(LoadAdError error) { rewarded = null; }
                });
    }

    public void destroy() { detachBanner(); }
}
