package com.unifiedfarmblm.farmmerge;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import java.util.Collections;
import java.util.List;

public final class BillingManager implements PurchasesUpdatedListener {
    public interface Listener {
        void onPremiumChanged(boolean premium);
        void onPriceAvailable(String formattedPrice);
        void onBillingMessage(String message);
    }

    private static final String PRODUCT_ID = "remove_ads";
    private static final String PREFS = "farm_merge_billing";
    private static final String KEY_PREMIUM_CACHE = "premium_cache";

    private final Context context;
    private final SharedPreferences prefs;
    private final Listener listener;
    private final BillingClient client;
    private ProductDetails productDetails;
    private boolean premium;

    public BillingManager(Context context, Listener listener) {
        this.context = context.getApplicationContext();
        this.listener = listener;
        this.prefs = this.context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        this.premium = prefs.getBoolean(KEY_PREMIUM_CACHE, false);
        this.client = BillingClient.newBuilder(this.context)
                .setListener(this)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .build();
    }

    public boolean isPremiumCached() { return premium; }

    public void start() {
        if (client.isReady()) {
            reconcilePurchases();
            queryProduct();
            return;
        }
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    reconcilePurchases();
                    queryProduct();
                }
            }
            @Override public void onBillingServiceDisconnected() {
                // Cached entitlement is kept until a successful Play query says otherwise.
            }
        });
    }

    public void refresh() {
        if (client.isReady()) reconcilePurchases(); else start();
    }

    public void launchPurchase(Activity activity) {
        if (premium) {
            listener.onBillingMessage("Premium is already active on this device.");
            return;
        }
        if (!client.isReady()) {
            listener.onBillingMessage("Google Play Billing is not ready yet. Try again shortly.");
            start();
            return;
        }
        if (productDetails == null) {
            listener.onBillingMessage("The Premium product is not available yet. Create the Play Console product ‘remove_ads’ first.");
            queryProduct();
            return;
        }

        BillingFlowParams.ProductDetailsParams.Builder detailsBuilder =
                BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(productDetails);
        ProductDetails.OneTimePurchaseOfferDetails offer = productDetails.getOneTimePurchaseOfferDetails();
        if (offer != null && offer.getOfferToken() != null && !offer.getOfferToken().isEmpty()) {
            detailsBuilder.setOfferToken(offer.getOfferToken());
        }

        BillingFlowParams params = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(detailsBuilder.build()))
                .build();
        BillingResult result = client.launchBillingFlow(activity, params);
        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            listener.onBillingMessage("Unable to open Google Play purchase: " + result.getDebugMessage());
        }
    }

    @Override public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            processPurchaseSnapshot(purchases, false);
        } else if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.USER_CANCELED) {
            listener.onBillingMessage("Purchase update: " + billingResult.getDebugMessage());
        }
    }

    private void queryProduct() {
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_ID)
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Collections.singletonList(product))
                .build();

        client.queryProductDetailsAsync(params, (billingResult, queryResult) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
            List<ProductDetails> list = queryResult.getProductDetailsList();
            if (list.isEmpty()) return;
            productDetails = list.get(0);
            ProductDetails.OneTimePurchaseOfferDetails offer = productDetails.getOneTimePurchaseOfferDetails();
            if (offer != null) {
                listener.onPriceAvailable(offer.getFormattedPrice());
            } else if (productDetails.getOneTimePurchaseOfferDetailsList() != null
                    && !productDetails.getOneTimePurchaseOfferDetailsList().isEmpty()) {
                listener.onPriceAvailable(productDetails.getOneTimePurchaseOfferDetailsList().get(0).getFormattedPrice());
            }
        });
    }

    private void reconcilePurchases() {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
        client.queryPurchasesAsync(params, (billingResult, purchases) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                processPurchaseSnapshot(purchases, true);
            }
        });
    }

    private void processPurchaseSnapshot(List<Purchase> purchases, boolean authoritativeSnapshot) {
        Purchase matching = null;
        for (Purchase purchase : purchases) {
            if (purchase.getProducts().contains(PRODUCT_ID)
                    && purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                matching = purchase;
                break;
            }
        }

        if (matching == null) {
            if (authoritativeSnapshot) setPremium(false);
            return;
        }

        if (matching.isAcknowledged()) {
            setPremium(true);
            return;
        }

        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(matching.getPurchaseToken())
                .build();
        client.acknowledgePurchase(params, billingResult -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                setPremium(true);
            } else {
                listener.onBillingMessage("Premium purchase is pending confirmation from Google Play.");
            }
        });
    }

    private void setPremium(boolean value) {
        if (premium == value) return;
        premium = value;
        prefs.edit().putBoolean(KEY_PREMIUM_CACHE, value).apply();
        listener.onPremiumChanged(value);
    }

    public void end() {
        if (client.isReady()) client.endConnection();
    }
}
