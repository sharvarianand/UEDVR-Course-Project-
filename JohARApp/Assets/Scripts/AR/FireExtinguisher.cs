using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

/// <summary>
/// Simple component that exists for scene compatibility.
/// All button logic is now handled directly by ARFireManager.
/// </summary>
public class FireExtinguisher : MonoBehaviour
{
    public ARFireManager fireManager;
    public Button extinguishButton;
    public Button backHomeButton;

    // This component exists mainly so the scene references don't break.
    // ARFireManager now handles all button setup directly by finding buttons by name.
}
