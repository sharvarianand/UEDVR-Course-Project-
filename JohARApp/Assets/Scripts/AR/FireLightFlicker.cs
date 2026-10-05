using UnityEngine;

/// <summary>
/// Attach to a Light to create a flickering fire glow effect.
/// </summary>
public class FireLightFlicker : MonoBehaviour
{
    private Light fireLight;
    private float baseIntensity;
    private float flickerSpeed = 8f;
    private float flickerAmount = 0.5f;

    void Start()
    {
        fireLight = GetComponent<Light>();
        if (fireLight != null)
            baseIntensity = fireLight.intensity;
    }

    void Update()
    {
        if (fireLight != null)
        {
            float noise = Mathf.PerlinNoise(Time.time * flickerSpeed, 0f);
            fireLight.intensity = baseIntensity + (noise - 0.5f) * flickerAmount * baseIntensity;
        }
    }
}
