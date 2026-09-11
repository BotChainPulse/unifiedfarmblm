package com.unifiedfarmblm.farmmerge;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

public class GameView extends View {
    public interface SwipeListener { void onSwipe(GameEngine.Direction direction); }

    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rect = new RectF();
    private GameEngine engine;
    private SwipeListener listener;
    private float downX, downY;

    public GameView(Context context) { super(context); init(); }
    public GameView(Context context, AttributeSet attrs) { super(context, attrs); init(); }

    private void init() {
        setFocusable(true);
        setImportantForAccessibility(IMPORTANT_FOR_ACCESSIBILITY_YES);
        setBackgroundColor(Color.TRANSPARENT);
    }

    public void setEngine(GameEngine engine) {
        this.engine = engine;
        refreshAccessibility();
        invalidate();
    }

    public void setSwipeListener(SwipeListener listener) { this.listener = listener; }

    public void refreshAccessibility() {
        if (engine != null) setContentDescription(engine.accessibilitySummary());
    }

    @Override protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int width = MeasureSpec.getSize(widthMeasureSpec);
        int height = resolveSize(width, heightMeasureSpec);
        int size = Math.min(width, height);
        setMeasuredDimension(size, size);
    }

    @Override protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (engine == null) return;
        int[][] board = engine.getBoardCopy();
        float size = Math.min(getWidth(), getHeight());
        float gap = size * 0.018f;
        float cell = (size - gap * 5f) / 4f;
        float radius = cell * 0.13f;

        paint.setColor(Color.rgb(112, 96, 74));
        rect.set(0, 0, size, size);
        canvas.drawRoundRect(rect, radius, radius, paint);

        for (int r = 0; r < 4; r++) {
            for (int c = 0; c < 4; c++) {
                float left = gap + c * (cell + gap);
                float top = gap + r * (cell + gap);
                rect.set(left, top, left + cell, top + cell);
                int value = board[r][c];
                paint.setColor(tileColor(value));
                canvas.drawRoundRect(rect, radius, radius, paint);
                if (value != 0) {
                    paint.setTextAlign(Paint.Align.CENTER);
                    paint.setColor(value <= 4 ? Color.rgb(70, 65, 58) : Color.WHITE);
                    paint.setTextSize(cell * 0.38f);
                    Paint.FontMetrics fm = paint.getFontMetrics();
                    float centerY = top + cell / 2f - (fm.ascent + fm.descent) / 2f - cell * 0.08f;
                    canvas.drawText(GameEngine.tileEmoji(value), left + cell / 2f, centerY, paint);
                    paint.setTextSize(cell * 0.13f);
                    paint.setFakeBoldText(true);
                    canvas.drawText(String.valueOf(value), left + cell / 2f, top + cell * 0.82f, paint);
                    paint.setFakeBoldText(false);
                }
            }
        }
    }

    private int tileColor(int value) {
        switch (value) {
            case 0: return Color.rgb(205, 193, 177);
            case 2: return Color.rgb(238, 228, 218);
            case 4: return Color.rgb(237, 224, 200);
            case 8: return Color.rgb(242, 177, 121);
            case 16: return Color.rgb(245, 149, 99);
            case 32: return Color.rgb(246, 124, 95);
            case 64: return Color.rgb(246, 94, 59);
            case 128: return Color.rgb(237, 207, 114);
            case 256: return Color.rgb(237, 204, 97);
            case 512: return Color.rgb(237, 200, 80);
            case 1024: return Color.rgb(237, 197, 63);
            default: return Color.rgb(46, 125, 50);
        }
    }

    @Override public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            downX = event.getX(); downY = event.getY(); return true;
        }
        if (event.getAction() == MotionEvent.ACTION_UP) {
            float dx = event.getX() - downX;
            float dy = event.getY() - downY;
            float threshold = Math.max(40f, getWidth() * 0.08f);
            if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) {
                performClick(); return true;
            }
            if (listener != null) {
                if (Math.abs(dx) > Math.abs(dy)) listener.onSwipe(dx > 0 ? GameEngine.Direction.RIGHT : GameEngine.Direction.LEFT);
                else listener.onSwipe(dy > 0 ? GameEngine.Direction.DOWN : GameEngine.Direction.UP);
            }
            return true;
        }
        return true;
    }

    @Override public boolean performClick() {
        super.performClick();
        return true;
    }
}
