using UnityEngine;
using UnityEngine.XR.ARFoundation;

/// <summary>
/// Configures AR tracking for better accuracy.
/// Attach to the XR Origin or AR Session object.
/// </summary>
public class ARTrackingConfig : MonoBehaviour
{
    void Start()
    {
        // Configure plane detection to horizontal only (more accurate for floors)
        var planeManager = FindAnyObjectByType<ARPlaneManager>();
        if (planeManager != null)
        {
            planeManager.requestedDetectionMode = UnityEngine.XR.ARSubsystems.PlaneDetectionMode.Horizontal;
            Debug.Log("[ARTrackingConfig] Set plane detection to Horizontal only.");
        }

        // Ensure frame rate matching for smoother tracking
        var arSession = FindAnyObjectByType<ARSession>();
        if (arSession != null)
        {
            arSession.matchFrameRateRequested = true;
            Debug.Log("[ARTrackingConfig] Enabled frame rate matching.");
        }

        // Set target frame rate for smoother experience
        Application.targetFrameRate = 60;
        Debug.Log("[ARTrackingConfig] Set target frame rate to 60.");
    }
}
