using System;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 3D Illuminated Emergency Fire Exit Marker spawned in the miner's scanned environment.
/// Miner must look around their physical space, locate the glowing green exit sign, and tap it to evacuate.
/// </summary>
public class FireExitMarker : MonoBehaviour
{
    private Action onExitReachedCallback;
    private bool isEvacuated = false;
    private BoxCollider boxCollider;
    private Light beaconLight;
    private Text exitTitleText;
    private Text exitSubText;

    public void Initialize(Action onEvacuated)
    {
        onExitReachedCallback = onEvacuated;

        BuildExitSignVisual();

        boxCollider = GetComponent<BoxCollider>();
        if (boxCollider == null)
            boxCollider = gameObject.AddComponent<BoxCollider>();
        boxCollider.size = new Vector3(0.9f, 1.2f, 0.4f);
        boxCollider.center = new Vector3(0f, 0.4f, 0f);
    }

    private void Update()
    {
        if (isEvacuated) return;

        // Face camera smoothly
        Camera cam = Camera.main;
        if (cam != null)
        {
            Vector3 targetDir = transform.position - cam.transform.position;
            targetDir.y = 0; // Keep vertical upright
            if (targetDir.sqrMagnitude > 0.001f)
            {
                transform.rotation = Quaternion.Slerp(
                    transform.rotation,
                    Quaternion.LookRotation(targetDir),
                    Time.deltaTime * 5f
                );
            }
        }

        // Pulse green beacon light
        if (beaconLight != null)
        {
            beaconLight.intensity = 1.2f + Mathf.Sin(Time.time * 4f) * 0.6f;
        }
    }

    public void OnTapped()
    {
        if (isEvacuated) return;
        isEvacuated = true;

        // Visual feedback
        if (beaconLight != null)
        {
            beaconLight.intensity = 3.5f;
            beaconLight.color = Color.white;
        }

        onExitReachedCallback?.Invoke();
    }

    private void BuildExitSignVisual()
    {
        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        // Green Luminescent Signboard Material
        Material greenMat = new Material(litShader);
        greenMat.color = new Color(0.05f, 0.75f, 0.35f);
        greenMat.EnableKeyword("_EMISSION");
        greenMat.SetColor("_EmissionColor", new Color(0.05f, 0.9f, 0.35f) * 1.5f);

        // Dark Metallic Frame Material
        Material frameMat = new Material(litShader);
        frameMat.color = new Color(0.12f, 0.14f, 0.16f);
        frameMat.SetFloat("_Metallic", 0.8f);
        frameMat.SetFloat("_Smoothness", 0.7f);

        // 1. Stand Pole
        GameObject pole = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        pole.name = "SignPole";
        pole.transform.SetParent(transform, false);
        pole.transform.localScale = new Vector3(0.04f, 0.5f, 0.04f);
        pole.transform.localPosition = new Vector3(0f, -0.2f, 0f);
        pole.GetComponent<Renderer>().material = frameMat;
        DestroyImmediate(pole.GetComponent<Collider>());

        // 2. Sign Outer Box Frame
        GameObject frame = GameObject.CreatePrimitive(PrimitiveType.Cube);
        frame.name = "SignFrame";
        frame.transform.SetParent(transform, false);
        frame.transform.localScale = new Vector3(0.65f, 0.38f, 0.08f);
        frame.transform.localPosition = new Vector3(0f, 0.35f, 0f);
        frame.GetComponent<Renderer>().material = frameMat;
        DestroyImmediate(frame.GetComponent<Collider>());

        // 3. Glowing Green Face Plate
        GameObject face = GameObject.CreatePrimitive(PrimitiveType.Cube);
        face.name = "SignFace";
        face.transform.SetParent(transform, false);
        face.transform.localScale = new Vector3(0.58f, 0.32f, 0.02f);
        face.transform.localPosition = new Vector3(0f, 0.35f, -0.045f);
        face.GetComponent<Renderer>().material = greenMat;
        DestroyImmediate(face.GetComponent<Collider>());

        // 4. Pulsing Green Beacon Light
        GameObject lightObj = new GameObject("ExitBeaconLight");
        lightObj.transform.SetParent(transform, false);
        lightObj.transform.localPosition = new Vector3(0f, 0.35f, -0.25f);
        beaconLight = lightObj.AddComponent<Light>();
        beaconLight.type = LightType.Point;
        beaconLight.color = new Color(0.1f, 1f, 0.4f);
        beaconLight.range = 3.5f;
        beaconLight.intensity = 1.5f;

        // 5. 3D Worldspace Text Canvas on Sign Face
        GameObject canvasObj = new GameObject("ExitSignCanvas");
        canvasObj.transform.SetParent(transform, false);
        canvasObj.transform.localPosition = new Vector3(0f, 0.35f, -0.06f);
        Canvas canvas = canvasObj.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.WorldSpace;
        RectTransform rt = canvasObj.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(260f, 140f);
        canvasObj.transform.localScale = Vector3.one * 0.0022f;

        // Title Text
        GameObject titleObj = new GameObject("ExitTitle");
        titleObj.transform.SetParent(canvasObj.transform, false);
        exitTitleText = titleObj.AddComponent<Text>();
        exitTitleText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (exitTitleText.font == null)
            exitTitleText.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        exitTitleText.alignment = TextAnchor.MiddleCenter;
        exitTitleText.fontSize = 22;
        exitTitleText.fontStyle = FontStyle.Bold;
        exitTitleText.color = Color.white;
        RectTransform titleRt = titleObj.GetComponent<RectTransform>();
        titleRt.anchorMin = new Vector2(0f, 0.4f);
        titleRt.anchorMax = new Vector2(1f, 0.95f);
        titleRt.sizeDelta = Vector2.zero;

        // Running Man / Arrow Icon Text
        GameObject subObj = new GameObject("ExitSub");
        subObj.transform.SetParent(canvasObj.transform, false);
        exitSubText = subObj.AddComponent<Text>();
        exitSubText.font = exitTitleText.font;
        exitSubText.alignment = TextAnchor.MiddleCenter;
        exitSubText.fontSize = 16;
        exitSubText.fontStyle = FontStyle.Bold;
        exitSubText.color = new Color(0.9f, 1f, 0.9f);
        RectTransform subRt = subObj.GetComponent<RectTransform>();
        subRt.anchorMin = new Vector2(0f, 0.05f);
        subRt.anchorMax = new Vector2(1f, 0.45f);
        subRt.sizeDelta = Vector2.zero;

        UpdateLanguageTexts();
    }

    public void UpdateLanguageTexts()
    {
        if (exitTitleText == null || exitSubText == null) return;
        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;

        switch (lang)
        {
            case LanguageManager.Language.Hindi:
                exitTitleText.text = "आपातकालीन निकास";
                exitSubText.text = "🏃 ➔ FIRE EXIT";
                break;
            case LanguageManager.Language.Santali:
                exitTitleText.text = "ᱚᱰᱳᱠᱚᱜ ᱦᱚᱨᱟ";
                exitSubText.text = "🏃 ➔ FIRE EXIT";
                break;
            default:
                exitTitleText.text = "EMERGENCY EXIT";
                exitSubText.text = "🏃 ➔ FIRE EXIT";
                break;
        }
    }
}
