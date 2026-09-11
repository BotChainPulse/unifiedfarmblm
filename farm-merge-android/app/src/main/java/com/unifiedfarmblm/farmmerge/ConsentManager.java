package com.unifiedfarmblm.farmmerge;

import android.app.Activity;

import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

public final class ConsentManager {
    public interface Listener {
        void onConsentResolved(boolean canRequestAds);
        void onPrivacyOptionsRequirementChanged(boolean required);
    }

    private final Activity activity;
    private final ConsentInformation consentInformation;
    private final Listener listener;
    private boolean resolvedOnce;

    public ConsentManager(Activity activity, Listener listener) {
        this.activity = activity;
        this.listener = listener;
        this.consentInformation = UserMessagingPlatform.getConsentInformation(activity);
    }

    public void gatherConsent() {
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                () -> {
                    updatePrivacyRequirement();
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> resolve());
                },
                formError -> {
                    updatePrivacyRequirement();
                    resolve();
                }
        );
    }

    public void showPrivacyOptions() {
        UserMessagingPlatform.showPrivacyOptionsForm(activity, formError -> {
            updatePrivacyRequirement();
            resolve();
        });
    }

    private void updatePrivacyRequirement() {
        boolean required = consentInformation.getPrivacyOptionsRequirementStatus()
                == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
        listener.onPrivacyOptionsRequirementChanged(required);
    }

    private void resolve() {
        boolean canRequestAds = consentInformation.canRequestAds();
        if (!resolvedOnce || canRequestAds) {
            resolvedOnce = true;
            listener.onConsentResolved(canRequestAds);
        }
    }
}
