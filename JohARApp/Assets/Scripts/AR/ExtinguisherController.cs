using UnityEngine;
using System.Collections;

/// <summary>
/// Controls the extinguisher: follows camera and sprays smoke particles.
/// Fire health logic is handled by ARFireManager.
/// </summary>
public class ExtinguisherController : MonoBehaviour
{
    [Header("References")]
    public Transform fireTarget;
    
    [Header("Extinguisher Parts")]
    public Transform sealObject;
    public Transform pinObject;
    public Transform[] allSealParts;

    [HideInInspector]
    public bool isSealRemoved = false;
    [HideInInspector]
    public bool isPinRemoved = false;

    [HideInInspector]
    public bool isSpraying = false;

    private ParticleSystem smokeSpray;
    private Camera arCamera;
    private bool isInitialized = false;

    void Awake()
    {
        FindParts();
    }

    public void FindParts()
    {
        var seals = new System.Collections.Generic.List<Transform>();
        Transform foundPin = null;

        foreach (Transform t in GetComponentsInChildren<Transform>(true))
        {
            if (t == transform) continue;
            string n = t.name.ToLower();
            if (n.Contains("seal"))
            {
                if (!seals.Contains(t)) seals.Add(t);
            }
            else if (n.Contains("pin"))
            {
                if (foundPin == null) foundPin = t;
            }
        }

        // If SealGroup has child meshes (e.g. SEAL1, SEAL2), use the child meshes directly
        Transform sealGroup = transform.Find("SealGroup");
        if (sealGroup != null && sealGroup.childCount > 0)
        {
            seals.Clear();
            for (int i = 0; i < sealGroup.childCount; i++)
            {
                seals.Add(sealGroup.GetChild(i));
            }
        }

        if (seals.Count > 0)
        {
            allSealParts = seals.ToArray();
            sealObject = allSealParts[0];
        }

        if (foundPin != null)
        {
            pinObject = foundPin;
        }

        Debug.Log($"[ExtinguisherController] Parts Found -> Seals: {seals.Count}, Pin: {(pinObject != null ? pinObject.name : "null")}");
    }

    void Start()
    {
        FindParts();

        // Find smoke spray - look for the nested one under SprayPoint
        var allPS = GetComponentsInChildren<ParticleSystem>(true);
        if (allPS.Length > 0)
        {
            smokeSpray = allPS[0];
            smokeSpray.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            Debug.Log("[ExtinguisherController] Found smoke particle system: " + smokeSpray.gameObject.name);
        }
        else
        {
            Debug.LogError("[ExtinguisherController] No particle system found on extinguisher!");
        }

        arCamera = Camera.main;
        if (arCamera == null)
            arCamera = FindAnyObjectByType<Camera>();

        isInitialized = (arCamera != null);
        Debug.Log("[ExtinguisherController] Init. Camera=" + (arCamera != null) + " Smoke=" + (smokeSpray != null));
    }

    void LateUpdate()
    {
        if (!isInitialized || arCamera == null) return;

        // Position extinguisher lower and further right so it doesn't block the view
        Vector3 targetPos = arCamera.transform.position
            + arCamera.transform.forward * 0.6f
            + arCamera.transform.up * -0.35f
            + arCamera.transform.right * 0.15f;

        transform.position = Vector3.Lerp(transform.position, targetPos, Time.deltaTime * 10f);
        transform.rotation = Quaternion.Slerp(transform.rotation, arCamera.transform.rotation, Time.deltaTime * 10f);
    }

    void Update()
    {
        if (smokeSpray == null) return;

        if (isSpraying && !smokeSpray.isPlaying)
        {
            smokeSpray.Play();
            Debug.Log("[ExtinguisherController] SMOKE ON");
        }
        else if (!isSpraying && smokeSpray.isPlaying)
        {
            smokeSpray.Stop();
            Debug.Log("[ExtinguisherController] SMOKE OFF");
        }
    }

    public void StartSpray()
    {
        isSpraying = true;
        Debug.Log("[ExtinguisherController] StartSpray called");
    }

    public void StopSpray()
    {
        isSpraying = false;
        Debug.Log("[ExtinguisherController] StopSpray called");
    }

    public void SetFireTarget(Transform target)
    {
        fireTarget = target;
    }

    public bool IsFireExtinguished()
    {
        return false; // Managed by ARFireManager now
    }

    public void RemoveSeal()
    {
        if (isSealRemoved) return;
        isSealRemoved = true;

        FindParts();

        var sealsToAnimate = new System.Collections.Generic.List<Transform>();
        if (allSealParts != null)
        {
            foreach (var p in allSealParts) if (p != null) sealsToAnimate.Add(p);
        }
        if (sealsToAnimate.Count == 0 && sealObject != null)
        {
            sealsToAnimate.Add(sealObject);
        }

        // Deep fallback: search entire hierarchy for any transform with "seal"
        if (sealsToAnimate.Count == 0)
        {
            foreach (Transform t in GetComponentsInChildren<Transform>(true))
            {
                if (t != transform && t.name.ToLower().Contains("seal"))
                {
                    sealsToAnimate.Add(t);
                }
            }
        }

        foreach (var seal in sealsToAnimate)
        {
            if (seal != null)
            {
                StartCoroutine(AnimateBreakAndFall(seal, (Vector3.down * 0.4f + Vector3.back * 0.2f + Random.insideUnitSphere * 0.1f)));
            }
        }

        Debug.Log($"[ExtinguisherController] RemoveSeal: Animated {sealsToAnimate.Count} seal objects.");
    }

    public void RemovePin()
    {
        if (isPinRemoved) return;
        isPinRemoved = true;

        FindParts();

        Transform targetPin = pinObject;
        if (targetPin == null)
        {
            foreach (Transform t in GetComponentsInChildren<Transform>(true))
            {
                if (t != transform && t.name.ToLower().Contains("pin"))
                {
                    targetPin = t;
                    break;
                }
            }
        }

        if (targetPin != null)
        {
            StartCoroutine(AnimatePinPullAndFall(targetPin));
            Debug.Log($"[ExtinguisherController] RemovePin: Animated pin object '{targetPin.name}'.");
        }
        else
        {
            Debug.LogWarning("[ExtinguisherController] RemovePin: No pin object found to animate!");
        }
    }

    private IEnumerator AnimateBreakAndFall(Transform obj, Vector3 initialPop)
    {
        if (obj == null) yield break;

        // Detach to world space so it falls realistically in AR!
        obj.SetParent(null, true);

        Vector3 velocity = initialPop * 1.5f;
        Vector3 randomTorque = new Vector3(Random.Range(-250f, 250f), Random.Range(-250f, 250f), Random.Range(-250f, 250f));
        Vector3 initialScale = obj.localScale;

        float elapsed = 0f;
        float totalDuration = 1.5f;

        while (elapsed < totalDuration)
        {
            if (obj == null) yield break;

            float dt = Time.deltaTime;
            velocity += Vector3.down * 9.8f * dt; // Gravity
            obj.position += velocity * dt;
            obj.Rotate(randomTorque * dt, Space.World);

            // Scale down gently in the last 0.4 seconds
            if (elapsed > totalDuration - 0.4f)
            {
                float fadeT = (totalDuration - elapsed) / 0.4f;
                obj.localScale = Vector3.Lerp(Vector3.zero, initialScale, fadeT);
            }

            elapsed += dt;
            yield return null;
        }

        if (obj != null)
        {
            Destroy(obj.gameObject);
        }
    }

    private IEnumerator AnimatePinPullAndFall(Transform pin)
    {
        if (pin == null) yield break;

        // Phase 1: Slide smoothly out of the valve (0.25 seconds)
        Vector3 pullDir = transform.right; // Extinguisher's right side
        Vector3 startPos = pin.position;
        Vector3 pulledPos = startPos + pullDir * 0.15f; // Pull out 15cm
        float pullElapsed = 0f;
        float pullDuration = 0.25f;

        while (pullElapsed < pullDuration)
        {
            if (pin == null) yield break;
            float t = pullElapsed / pullDuration;
            float ease = Mathf.SmoothStep(0f, 1f, t);
            pin.position = Vector3.Lerp(startPos, pulledPos, ease);
            pullElapsed += Time.deltaTime;
            yield return null;
        }

        // Phase 2: Detach into world space and fall with gravity!
        pin.SetParent(null, true);

        Vector3 velocity = (pullDir * 0.5f + Vector3.down * 0.2f);
        Vector3 randomTorque = new Vector3(Random.Range(-180f, 180f), Random.Range(-180f, 180f), Random.Range(-180f, 180f));
        Vector3 initialScale = pin.localScale;

        float elapsed = 0f;
        float fallDuration = 1.3f;

        while (elapsed < fallDuration)
        {
            if (pin == null) yield break;

            float dt = Time.deltaTime;
            velocity += Vector3.down * 9.8f * dt; // Gravity
            pin.position += velocity * dt;
            pin.Rotate(randomTorque * dt, Space.World);

            // Fade out scale at the end
            if (elapsed > fallDuration - 0.4f)
            {
                float fadeT = (fallDuration - elapsed) / 0.4f;
                pin.localScale = Vector3.Lerp(Vector3.zero, initialScale, fadeT);
            }

            elapsed += dt;
            yield return null;
        }

        if (pin != null)
        {
            Destroy(pin.gameObject);
        }
    }
}
