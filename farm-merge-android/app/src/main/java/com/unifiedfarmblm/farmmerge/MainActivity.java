package com.unifiedfarmblm.farmmerge;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public final class MainActivity extends Activity implements
        ConsentManager.Listener, BillingManager.Listener {

    private GameEngine engine;
    private GameView gameView;
    private ConsentManager consentManager;
    private BillingManager billingManager;
    private AdManager adManager;

    private TextView scoreView;
    private TextView bestView;
    private Button premiumButton;
    private Button privacyButton;
    private FrameLayout bannerContainer;

    private boolean premium;
    private boolean adsAllowed;
    private boolean adsInitialized;
    private int gameOverCount;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        engine = new GameEngine(this);
        adManager = new AdManager(this);
        billingManager = new BillingManager(this, this);
        premium = billingManager.isPremiumCached();
        consentManager = new ConsentManager(this, this);

        buildUi();
        updateUi();
        billingManager.start();
        consentManager.gatherConsent();
    }

    @Override protected void onResume() {
        super.onResume();
        if (billingManager != null) billingManager.refresh();
    }

    private void buildUi() {
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(Color.rgb(247, 244, 234));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(16), dp(24), dp(16), dp(20));
        root.setFitsSystemWindows(true);
        scroll.addView(root, new ScrollView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView title = text("🌾 Farm Merge", 30, true);
        title.setTextColor(Color.rgb(45, 80, 46));
        root.addView(title, wrapCenter());

        TextView subtitle = text("2048 Puzzle • Build the Golden Farm", 15, false);
        subtitle.setTextColor(Color.rgb(95, 88, 75));
        LinearLayout.LayoutParams subLp = wrapCenter();
        subLp.bottomMargin = dp(14);
        root.addView(subtitle, subLp);

        LinearLayout stats = new LinearLayout(this);
        stats.setOrientation(LinearLayout.HORIZONTAL);
        stats.setGravity(Gravity.CENTER);
        scoreView = statChip();
        bestView = statChip();
        stats.addView(scoreView, weighted(1, 0, dp(6)));
        stats.addView(bestView, weighted(1, dp(6), 0));
        root.addView(stats, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        gameView = new GameView(this);
        gameView.setEngine(engine);
        gameView.setSwipeListener(this::attemptMove);
        LinearLayout.LayoutParams gameLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(400));
        gameLp.topMargin = dp(14);
        gameLp.bottomMargin = dp(10);
        root.addView(gameView, gameLp);

        TextView accessibilityHint = text("Swipe the board, or use the arrow buttons below.", 13, false);
        accessibilityHint.setTextColor(Color.rgb(105, 96, 82));
        root.addView(accessibilityHint, wrapCenter());

        LinearLayout arrowsTop = horizontalCenter();
        arrowsTop.addView(directionButton("↑", "Move up", GameEngine.Direction.UP), buttonSquare());
        root.addView(arrowsTop, wrapCenter());

        LinearLayout arrowsBottom = horizontalCenter();
        arrowsBottom.addView(directionButton("←", "Move left", GameEngine.Direction.LEFT), buttonSquare());
        arrowsBottom.addView(directionButton("↓", "Move down", GameEngine.Direction.DOWN), buttonSquare());
        arrowsBottom.addView(directionButton("→", "Move right", GameEngine.Direction.RIGHT), buttonSquare());
        root.addView(arrowsBottom, wrapCenter());

        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        actions.setGravity(Gravity.CENTER);
        Button newGame = primaryButton(getString(R.string.new_game));
        newGame.setOnClickListener(v -> confirmNewGame());
        Button how = secondaryButton(getString(R.string.how_to_play));
        how.setOnClickListener(v -> showHowToPlay());
        actions.addView(newGame, weighted(1, 0, dp(6)));
        actions.addView(how, weighted(1, dp(6), 0));
        LinearLayout.LayoutParams actionsLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        actionsLp.topMargin = dp(12);
        root.addView(actions, actionsLp);

        premiumButton = primaryButton(getString(R.string.premium));
        premiumButton.setContentDescription("Remove ads with a one-time Google Play purchase");
        premiumButton.setOnClickListener(v -> billingManager.launchPurchase(this));
        LinearLayout.LayoutParams premiumLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        premiumLp.topMargin = dp(10);
        root.addView(premiumButton, premiumLp);

        privacyButton = secondaryButton(getString(R.string.privacy_choices));
        privacyButton.setOnClickListener(v -> showPrivacy());
        LinearLayout.LayoutParams privacyLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        privacyLp.topMargin = dp(8);
        root.addView(privacyButton, privacyLp);

        bannerContainer = new FrameLayout(this);
        bannerContainer.setForegroundGravity(Gravity.CENTER);
        LinearLayout.LayoutParams adLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        adLp.topMargin = dp(12);
        root.addView(bannerContainer, adLp);

        TextView footer = text("No account required • Progress stored on this device", 12, false);
        footer.setTextColor(Color.rgb(110, 103, 91));
        LinearLayout.LayoutParams footerLp = wrapCenter();
        footerLp.topMargin = dp(10);
        root.addView(footer, footerLp);

        setContentView(scroll);
    }

    private void attemptMove(GameEngine.Direction direction) {
        boolean hadWon = engine.hasReached2048();
        if (!engine.move(direction)) return;
        updateUi();
        if (!hadWon && engine.hasReached2048()) {
            new AlertDialog.Builder(this)
                    .setTitle("👑 Golden Farm reached!")
                    .setMessage("You reached 2048. Keep merging to grow an even bigger farm.")
                    .setPositiveButton("Keep playing", null)
                    .show();
        }
        if (engine.isGameOver()) handleGameOver();
    }

    private void handleGameOver() {
        gameOverCount++;
        if (!premium && adsAllowed && adsInitialized && gameOverCount % 2 == 0) {
            adManager.showInterstitial(this, this::showGameOverDialog);
        } else {
            showGameOverDialog();
        }
    }

    private void showGameOverDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this)
                .setTitle("Farm full")
                .setMessage("No more merges are available. Continue by clearing two low-value tiles, or start a new farm.")
                .setNegativeButton("New game", (d, w) -> startNewGame());

        if (premium) {
            builder.setPositiveButton("Continue — Premium", (d, w) -> {
                engine.rescue();
                updateUi();
            });
        } else {
            builder.setPositiveButton(getString(R.string.continue_with_ad), (d, w) -> {
                if (!adsAllowed || !adsInitialized) {
                    Toast.makeText(this, "A rewarded ad is not available right now.", Toast.LENGTH_LONG).show();
                    showGameOverDialog();
                    return;
                }
                adManager.showRewarded(this,
                        () -> { engine.rescue(); updateUi(); },
                        () -> {
                            Toast.makeText(this, "Rewarded ad unavailable. Try again or start a new game.", Toast.LENGTH_LONG).show();
                            showGameOverDialog();
                        });
            });
        }
        builder.setCancelable(false).show();
    }

    private void confirmNewGame() {
        if (engine.getScore() == 0 || engine.isGameOver()) {
            startNewGame();
            return;
        }
        new AlertDialog.Builder(this)
                .setTitle("Start a new farm?")
                .setMessage("Your current board will be replaced. Your best score will be kept.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("New game", (d, w) -> startNewGame())
                .show();
    }

    private void startNewGame() {
        engine.newGame();
        updateUi();
    }

    private void updateUi() {
        scoreView.setText(getString(R.string.score_format, engine.getScore()));
        bestView.setText(getString(R.string.best_format, engine.getBest()));
        gameView.refreshAccessibility();
        gameView.invalidate();
        updatePremiumUi();
    }

    private void updatePremiumUi() {
        if (premium) {
            premiumButton.setText(getString(R.string.premium_active));
            premiumButton.setEnabled(false);
            bannerContainer.setVisibility(View.GONE);
            adManager.detachBanner();
        } else {
            premiumButton.setEnabled(true);
            if (!premiumButton.getText().toString().contains("Remove ads")) premiumButton.setText(getString(R.string.premium));
            if (adsAllowed && adsInitialized) {
                bannerContainer.setVisibility(View.VISIBLE);
                if (bannerContainer.getChildCount() == 0) adManager.attachBanner(bannerContainer);
            }
        }
    }

    private void showHowToPlay() {
        new AlertDialog.Builder(this)
                .setTitle("How to play")
                .setMessage("Swipe up, down, left or right. Matching farm tiles merge into the next stage. " +
                        "Build from 🥚 Egg to 👑 Golden Farm at 2048.\n\n" +
                        "The board and current score are saved automatically. The arrow buttons provide an accessible alternative to swipe gestures.")
                .setPositiveButton("Got it", null)
                .show();
    }

    private void showPrivacy() {
        new AlertDialog.Builder(this)
                .setTitle("Privacy & ads")
                .setMessage(getString(R.string.privacy_note))
                .setNegativeButton("Close", null)
                .setPositiveButton("Privacy choices", (d, w) -> consentManager.showPrivacyOptions())
                .show();
    }

    @Override public void onConsentResolved(boolean canRequestAds) {
        adsAllowed = canRequestAds;
        if (canRequestAds && !premium) {
            adManager.initialize(() -> runOnUiThread(() -> {
                adsInitialized = true;
                updatePremiumUi();
            }));
        }
    }

    @Override public void onPrivacyOptionsRequirementChanged(boolean required) {
        privacyButton.setVisibility(View.VISIBLE);
    }

    @Override public void onPremiumChanged(boolean premium) {
        this.premium = premium;
        runOnUiThread(this::updatePremiumUi);
    }

    @Override public void onPriceAvailable(String formattedPrice) {
        if (premium) return;
        runOnUiThread(() -> premiumButton.setText("Remove ads — " + formattedPrice));
    }

    @Override public void onBillingMessage(String message) {
        runOnUiThread(() -> Toast.makeText(this, message, Toast.LENGTH_LONG).show());
    }

    private TextView statChip() {
        TextView tv = text("", 16, true);
        tv.setGravity(Gravity.CENTER);
        tv.setTextColor(Color.rgb(72, 62, 52));
        tv.setPadding(dp(12), dp(10), dp(12), dp(10));
        tv.setBackground(roundRect(Color.rgb(232, 226, 209), dp(12), 0));
        return tv;
    }

    private Button directionButton(String label, String description, GameEngine.Direction direction) {
        Button b = secondaryButton(label);
        b.setTextSize(26);
        b.setContentDescription(description);
        b.setOnClickListener(v -> attemptMove(direction));
        return b;
    }

    private Button primaryButton(String label) {
        Button b = new Button(this);
        b.setText(label);
        b.setTextSize(15);
        b.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        b.setTextColor(Color.WHITE);
        b.setAllCaps(false);
        b.setMinHeight(dp(48));
        b.setBackground(roundRect(Color.rgb(46, 125, 50), dp(12), 0));
        return b;
    }

    private Button secondaryButton(String label) {
        Button b = new Button(this);
        b.setText(label);
        b.setTextSize(15);
        b.setTextColor(Color.rgb(50, 72, 50));
        b.setAllCaps(false);
        b.setMinHeight(dp(48));
        b.setBackground(roundRect(Color.rgb(234, 239, 229), dp(12), Color.rgb(150, 166, 143)));
        return b;
    }

    private GradientDrawable roundRect(int fill, int radius, int stroke) {
        GradientDrawable d = new GradientDrawable();
        d.setColor(fill);
        d.setCornerRadius(radius);
        if (stroke != 0) d.setStroke(dp(1), stroke);
        return d;
    }

    private TextView text(String value, int sp, boolean bold) {
        TextView tv = new TextView(this);
        tv.setText(value);
        tv.setTextSize(sp);
        tv.setGravity(Gravity.CENTER);
        if (bold) tv.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return tv;
    }

    private LinearLayout horizontalCenter() {
        LinearLayout l = new LinearLayout(this);
        l.setOrientation(LinearLayout.HORIZONTAL);
        l.setGravity(Gravity.CENTER);
        return l;
    }

    private LinearLayout.LayoutParams buttonSquare() {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(76), dp(58));
        lp.setMargins(dp(4), dp(3), dp(4), dp(3));
        return lp;
    }

    private LinearLayout.LayoutParams weighted(float weight, int left, int right) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, weight);
        lp.leftMargin = left;
        lp.rightMargin = right;
        return lp;
    }

    private LinearLayout.LayoutParams wrapCenter() {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.gravity = Gravity.CENTER_HORIZONTAL;
        return lp;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override protected void onDestroy() {
        if (adManager != null) adManager.destroy();
        if (billingManager != null) billingManager.end();
        super.onDestroy();
    }
}
