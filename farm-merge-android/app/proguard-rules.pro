# Google Mobile Ads, UMP, and Play Billing ship consumer ProGuard rules.
# Keep our custom view constructor accessible if future XML layouts reference it.
-keep public class com.unifiedfarmblm.farmmerge.GameView { public <init>(...); }
