using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace JohAR.AR
{
    /// <summary>
    /// ReturnToReactBridge seamlessly handles exiting the Unity AR simulation
    /// and returning control to the JohAR React frontend.
    /// On Android: Closes the Unity activity via currentActivity.finish() or triggers deep-link.
    /// In Editor / Standalone: Resets the AR drill gracefully.
    /// </summary>
    public class ReturnToReactBridge : MonoBehaviour, IPointerClickHandler
    {
        private Button button;
        private static bool isReturning = false;

        private void Awake()
        {
            isReturning = false;
            button = GetComponent<Button>();
            if (button != null)
            {
                button.onClick.RemoveAllListeners();
                button.onClick.AddListener(ExecuteReturn);
            }
        }

        public void OnPointerClick(PointerEventData eventData)
        {
            ExecuteReturn();
        }

        public static void ExecuteReturn()
        {
            if (isReturning) return;
            isReturning = true;

            Debug.Log("[ReturnToReactBridge] Returning to JohAR React Hub...");

            // Restore screen orientation to portrait
            Screen.autorotateToPortrait = true;
            Screen.autorotateToPortraitUpsideDown = false;
            Screen.autorotateToLandscapeLeft = false;
            Screen.autorotateToLandscapeRight = false;
            Screen.orientation = ScreenOrientation.Portrait;

#if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                using (AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
                {
                    if (currentActivity != null)
                    {
                        bool fireCompleted = (ARFireManager.Instance != null && ARFireManager.Instance.IsFireExtinguished);
                        bool gasCompleted = (ARGasLeakManager.Instance != null && ARGasLeakManager.Instance.IsCompleted);
                        bool wasCompleted = fireCompleted || gasCompleted;
                        string currentWorkerId = PlayerPrefs.GetString("WorkerID", "W-7042");

                        if (wasCompleted)
                        {
                            float duration = 8.5f;
                            int score = 100;
                            string drillType = "fire_safety";

                            if (gasCompleted)
                            {
                                drillType = "gas_leak";
                                duration = ARGasLeakManager.Instance.CompletionDuration;
                                score = ARGasLeakManager.Instance.FinalScore;
                            }
                            else if (fireCompleted)
                            {
                                drillType = "fire_safety";
                                duration = PlayerPrefs.GetFloat($"Drill_FireSafety_Time_{currentWorkerId}", 8.5f);
                                score = PlayerPrefs.GetInt($"Drill_FireSafety_Score_{currentWorkerId}", 100);
                            }

                            using (AndroidJavaObject resultIntent = new AndroidJavaObject("android.content.Intent"))
                            {
                                resultIntent.Call<AndroidJavaObject>("putExtra", "duration", duration);
                                resultIntent.Call<AndroidJavaObject>("putExtra", "score", score);
                                resultIntent.Call<AndroidJavaObject>("putExtra", "worker_id", currentWorkerId);
                                resultIntent.Call<AndroidJavaObject>("putExtra", "drill_type", drillType);
                                currentActivity.Call("setResult", -1 /* Activity.RESULT_OK */, resultIntent);
                            }

                            Debug.Log($"[ReturnToReactBridge] Drill {drillType} COMPLETED! Calling Android activity.finish() with RESULT_OK (time={duration:F1}s, score={score})...");
                        }
                        else
                        {
                            Debug.Log("[ReturnToReactBridge] Drill NOT completed / dismissed without completion. Calling Android activity.finish() with RESULT_CANCELED...");
                            currentActivity.Call("setResult", 0 /* Activity.RESULT_CANCELED */);
                        }

                        currentActivity.Call("finish");
                        return;
                    }
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning("[ReturnToReactBridge] Android activity finish exception: " + ex.Message);
            }

            // Fallback: Open custom scheme deep link to return to React app
            try
            {
                bool wasCompleted = (ARFireManager.Instance != null && ARFireManager.Instance.IsFireExtinguished);
                if (wasCompleted)
                {
                    Application.OpenURL("joharapp://dashboard?drill_completed=true");
                }
                else
                {
                    Application.OpenURL("joharapp://dashboard");
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning("[ReturnToReactBridge] URL launch exception: " + ex.Message);
            }
#else
            Debug.Log("[ReturnToReactBridge] Running in Editor / Non-Android. Reloading 2_FireSafetyAR simulation for testing...");
            isReturning = false;
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
#endif
        }
    }
}
