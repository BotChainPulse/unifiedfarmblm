package com.unifiedfarmblm.farmmerge;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public final class GameEngine {
    public enum Direction { LEFT, RIGHT, UP, DOWN }

    private static final int SIZE = 4;
    private static final String PREFS = "farm_merge_state_v2";
    private static final String KEY_BOARD = "board";
    private static final String KEY_SCORE = "score";
    private static final String KEY_BEST = "best";
    private static final String KEY_WON = "won";

    private final SharedPreferences prefs;
    private final Random random = new Random();
    private final int[][] board = new int[SIZE][SIZE];
    private int score;
    private int best;
    private boolean won;

    public GameEngine(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (!restore()) newGame();
    }

    public int[][] getBoardCopy() {
        int[][] copy = new int[SIZE][SIZE];
        for (int r = 0; r < SIZE; r++) System.arraycopy(board[r], 0, copy[r], 0, SIZE);
        return copy;
    }

    public int getScore() { return score; }
    public int getBest() { return best; }
    public boolean hasReached2048() { return won; }

    public void newGame() {
        for (int r = 0; r < SIZE; r++) for (int c = 0; c < SIZE; c++) board[r][c] = 0;
        score = 0;
        won = false;
        addRandomTile();
        addRandomTile();
        save();
    }

    public boolean move(Direction direction) {
        boolean changed = false;
        int gained = 0;
        for (int i = 0; i < SIZE; i++) {
            int[] line = readLine(direction, i);
            MergeResult result = mergeLine(line);
            if (!same(line, result.values)) changed = true;
            gained += result.gained;
            writeLine(direction, i, result.values);
        }
        if (!changed) return false;
        score += gained;
        if (score > best) best = score;
        addRandomTile();
        if (!won && contains(2048)) won = true;
        save();
        return true;
    }

    public void rescue() {
        List<Cell> occupied = new ArrayList<>();
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (board[r][c] != 0) occupied.add(new Cell(r, c, board[r][c]));
            }
        }
        Collections.sort(occupied, (a, b) -> Integer.compare(a.value, b.value));
        int removeCount = Math.min(2, occupied.size());
        for (int i = 0; i < removeCount; i++) {
            Cell cell = occupied.get(i);
            board[cell.r][cell.c] = 0;
        }
        addRandomTile();
        addRandomTile();
        save();
    }

    public boolean isGameOver() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (board[r][c] == 0) return false;
                if (r + 1 < SIZE && board[r][c] == board[r + 1][c]) return false;
                if (c + 1 < SIZE && board[r][c] == board[r][c + 1]) return false;
            }
        }
        return true;
    }

    public String accessibilitySummary() {
        StringBuilder sb = new StringBuilder("Farm Merge board. Score ").append(score).append(". ");
        for (int r = 0; r < SIZE; r++) {
            sb.append("Row ").append(r + 1).append(": ");
            for (int c = 0; c < SIZE; c++) {
                int value = board[r][c];
                sb.append(value == 0 ? "empty" : tileName(value));
                if (c < SIZE - 1) sb.append(", ");
            }
            sb.append(". ");
        }
        return sb.toString();
    }

    public static String tileName(int value) {
        switch (value) {
            case 2: return "Egg";
            case 4: return "Hatching Egg";
            case 8: return "Chick";
            case 16: return "Hen";
            case 32: return "Pig";
            case 64: return "Sheep";
            case 128: return "Cow";
            case 256: return "Horse";
            case 512: return "Tractor";
            case 1024: return "Farm House";
            case 2048: return "Golden Farm";
            default: return "Farm " + value;
        }
    }

    public static String tileEmoji(int value) {
        switch (value) {
            case 2: return "🥚";
            case 4: return "🐣";
            case 8: return "🐥";
            case 16: return "🐔";
            case 32: return "🐖";
            case 64: return "🐑";
            case 128: return "🐄";
            case 256: return "🐎";
            case 512: return "🚜";
            case 1024: return "🏡";
            case 2048: return "👑";
            default: return "🌾";
        }
    }

    private MergeResult mergeLine(int[] source) {
        List<Integer> values = new ArrayList<>();
        for (int v : source) if (v != 0) values.add(v);
        List<Integer> merged = new ArrayList<>();
        int gained = 0;
        for (int i = 0; i < values.size(); i++) {
            int current = values.get(i);
            if (i + 1 < values.size() && current == values.get(i + 1)) {
                current *= 2;
                gained += current;
                i++;
            }
            merged.add(current);
        }
        int[] out = new int[SIZE];
        for (int i = 0; i < merged.size(); i++) out[i] = merged.get(i);
        return new MergeResult(out, gained);
    }

    private int[] readLine(Direction direction, int index) {
        int[] line = new int[SIZE];
        for (int j = 0; j < SIZE; j++) {
            switch (direction) {
                case LEFT: line[j] = board[index][j]; break;
                case RIGHT: line[j] = board[index][SIZE - 1 - j]; break;
                case UP: line[j] = board[j][index]; break;
                case DOWN: line[j] = board[SIZE - 1 - j][index]; break;
            }
        }
        return line;
    }

    private void writeLine(Direction direction, int index, int[] line) {
        for (int j = 0; j < SIZE; j++) {
            switch (direction) {
                case LEFT: board[index][j] = line[j]; break;
                case RIGHT: board[index][SIZE - 1 - j] = line[j]; break;
                case UP: board[j][index] = line[j]; break;
                case DOWN: board[SIZE - 1 - j][index] = line[j]; break;
            }
        }
    }

    private boolean same(int[] a, int[] b) {
        for (int i = 0; i < SIZE; i++) if (a[i] != b[i]) return false;
        return true;
    }

    private boolean contains(int target) {
        for (int[] row : board) for (int v : row) if (v >= target) return true;
        return false;
    }

    private void addRandomTile() {
        List<Cell> empty = new ArrayList<>();
        for (int r = 0; r < SIZE; r++) for (int c = 0; c < SIZE; c++) if (board[r][c] == 0) empty.add(new Cell(r, c, 0));
        if (empty.isEmpty()) return;
        Cell chosen = empty.get(random.nextInt(empty.size()));
        board[chosen.r][chosen.c] = random.nextDouble() < 0.90 ? 2 : 4;
    }

    private boolean restore() {
        best = prefs.getInt(KEY_BEST, 0);
        String encoded = prefs.getString(KEY_BOARD, null);
        if (encoded == null) return false;
        String[] parts = encoded.split(",");
        if (parts.length != SIZE * SIZE) return false;
        try {
            int k = 0;
            for (int r = 0; r < SIZE; r++) for (int c = 0; c < SIZE; c++) board[r][c] = Integer.parseInt(parts[k++]);
            score = prefs.getInt(KEY_SCORE, 0);
            won = prefs.getBoolean(KEY_WON, false);
            return true;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private void save() {
        StringBuilder sb = new StringBuilder();
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (sb.length() > 0) sb.append(',');
                sb.append(board[r][c]);
            }
        }
        prefs.edit().putString(KEY_BOARD, sb.toString()).putInt(KEY_SCORE, score).putInt(KEY_BEST, best).putBoolean(KEY_WON, won).apply();
    }

    private static final class MergeResult {
        final int[] values;
        final int gained;
        MergeResult(int[] values, int gained) { this.values = values; this.gained = gained; }
    }

    private static final class Cell {
        final int r, c, value;
        Cell(int r, int c, int value) { this.r = r; this.c = c; this.value = value; }
    }
}
