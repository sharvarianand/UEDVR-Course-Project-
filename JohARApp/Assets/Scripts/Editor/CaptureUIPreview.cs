#if UNITY_EDITOR
using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.IO;

public static class CaptureUIPreview
{
    [MenuItem("JohAR/Capture Home Screenshot")]
    public static void CaptureHomeScreenshot()
    {
        string scenePath = "Assets/Scenes/1_Home.unity";
        EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);

        Canvas canvas = Object.FindAnyObjectByType<Canvas>();
        if (canvas == null)
        {
            Debug.LogError("Canvas not found in 1_Home!");
            return;
        }

        // Create temporary rendering camera
        GameObject camObj = new GameObject("TempUICam");
        Camera cam = camObj.AddComponent<Camera>();
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color(0.04f, 0.06f, 0.09f, 1f);
        cam.orthographic = true;
        cam.cullingMask = ~0; // Render all layers

        RenderMode origMode = canvas.renderMode;
        Camera origCam = canvas.worldCamera;

        canvas.renderMode = RenderMode.ScreenSpaceCamera;
        canvas.worldCamera = cam;

        int width = 1080;
        int height = 2340; // Modern 19.5:9 smartphone aspect
        RenderTexture rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
        cam.targetTexture = rt;

        // Force UI update
        Canvas.ForceUpdateCanvases();

        cam.Render();

        RenderTexture.active = rt;
        Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
        tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
        tex.Apply();

        RenderTexture.active = null;
        cam.targetTexture = null;
        Object.DestroyImmediate(rt);
        Object.DestroyImmediate(camObj);

        // Restore canvas
        canvas.renderMode = origMode;
        canvas.worldCamera = origCam;

        byte[] bytes = tex.EncodeToPNG();
        Object.DestroyImmediate(tex);

        string outDir = "/Users/macy/.gemini/antigravity-ide/brain/011265ff-a013-4963-9e47-b78d221d240e/scratch";
        if (!Directory.Exists(outDir)) Directory.CreateDirectory(outDir);
        string outPath = Path.Combine(outDir, "home_preview_phone.png");
        File.WriteAllBytes(outPath, bytes);

        Debug.Log($"<b>[CaptureUIPreview] Saved preview screenshot to: {outPath}</b>");
    }
}
#endif
