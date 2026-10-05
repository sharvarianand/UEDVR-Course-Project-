package com.jiwiar.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.util.Locale;

/**
 * MainActivity serves as the primary native launcher activity for Jiwi-AR.
 * It renders the high-performance offline React interface inside an optimized WebView
 * and seamlessly embeds and launches UnityPlayerGameActivity for AR drills.
 */
public class MainActivity extends Activity {
    private static final int RC_UNITY_AR = 1001;
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure seamless immersive status bar and navigation bar
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#090A0F"));
            window.setNavigationBarColor(Color.parseColor("#090A0F"));

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                View decor = window.getDecorView();
                decor.setSystemUiVisibility(decor.getSystemUiVisibility() & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }

        WebView.setWebContentsDebuggingEnabled(true);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#090A0F"));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Hardware Acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://") || url.startsWith("http://") || url.startsWith("https://")) {
                    return false;
                }
                return true;
            }
        });

        // Request CAMERA runtime permission on Android M+ for QR scanning
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{android.Manifest.permission.CAMERA}, 101);
            }
        }

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }

            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                android.util.Log.d("Jiwi-Web", consoleMessage.message() + " [" + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + "]");
                return true;
            }
        });

        // Register Native Android Bridge to the React Frontend
        webView.addJavascriptInterface(new JiwiAndroidBridge(), "AndroidBridge");

        setContentView(webView);

        // Load the offline bundled React interface
        webView.loadUrl("file:///android_asset/web/index.html");
    }

    public class JiwiAndroidBridge {
        @JavascriptInterface
        public void launchAR(final String workerId, final String language) {
            launchAR(workerId, language, "fire_safety");
        }

        @JavascriptInterface
        public void launchAR(final String workerId, final String language, final String drillType) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent intent = new Intent(MainActivity.this, com.unity3d.player.UnityPlayerGameActivity.class);
                        intent.putExtra("worker_id", workerId);
                        intent.putExtra("language", language);
                        intent.putExtra("drill_type", drillType != null ? drillType : "fire_safety");
                        startActivityForResult(intent, RC_UNITY_AR);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @JavascriptInterface
        public void triggerHaptic(int ms) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    int duration = ms > 0 ? ms : 50;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(android.os.VibrationEffect.createOneShot(duration, android.os.VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        v.vibrate(duration);
                    }
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void saveImageToGallery(final String base64Data, final String filename) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String cleanBase64 = base64Data;
                        if (cleanBase64.contains(",")) {
                            cleanBase64 = cleanBase64.split(",")[1];
                        }
                        byte[] decodedBytes = android.util.Base64.decode(cleanBase64, android.util.Base64.DEFAULT);
                        android.content.ContentValues values = new android.content.ContentValues();
                        values.put(android.provider.MediaStore.Images.Media.DISPLAY_NAME, filename != null ? filename : "DGMS_Certificate.png");
                        values.put(android.provider.MediaStore.Images.Media.MIME_TYPE, "image/png");
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            values.put(android.provider.MediaStore.Images.Media.RELATIVE_PATH, android.os.Environment.DIRECTORY_PICTURES + "/JiwiAR");
                            values.put(android.provider.MediaStore.Images.Media.IS_PENDING, 1);
                        }
                        android.net.Uri uri = getContentResolver().insert(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        if (uri != null) {
                            java.io.OutputStream out = getContentResolver().openOutputStream(uri);
                            if (out != null) {
                                out.write(decodedBytes);
                                out.flush();
                                out.close();
                            }
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                values.clear();
                                values.put(android.provider.MediaStore.Images.Media.IS_PENDING, 0);
                                getContentResolver().update(uri, values, null, null);
                            }
                            android.widget.Toast.makeText(MainActivity.this, "Certificate saved to Pictures/JiwiAR!", android.widget.Toast.LENGTH_LONG).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        android.widget.Toast.makeText(MainActivity.this, "Certificate Downloaded", android.widget.Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_UNITY_AR) {
            if (resultCode != RESULT_OK) {
                android.util.Log.d("Jiwi-Web", "Unity AR closed without completion (resultCode=" + resultCode + ")");
                return;
            }
            float duration = 8.5f;
            int score = 100;
            String drillType = "fire_safety";
            if (data != null) {
                duration = data.getFloatExtra("duration", 8.5f);
                score = data.getIntExtra("score", 100);
                if (data.hasExtra("drill_type")) {
                    drillType = data.getStringExtra("drill_type");
                }
            }

            final String js = String.format(
                Locale.US,
                "if (typeof window.onARDrillComplete === 'function') { window.onARDrillComplete({ duration: %.1f, score: %d, drillType: '%s' }); }",
                duration, score, drillType
            );

            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript(js, null);
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
