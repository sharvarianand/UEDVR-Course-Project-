using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.XR.ARFoundation;

public class FixJohAR
{
    [MenuItem("JohAR/Fix AR and Dropdown")]
    public static void Fix()
    {
        // 1. Fix Dropdown in Login Scene
        Scene loginScene = EditorSceneManager.OpenScene("Assets/Scenes/0_Login.unity", OpenSceneMode.Single);
        Dropdown dropdown = Object.FindAnyObjectByType<Dropdown>();
        if (dropdown != null)
        {
            RectTransform template = dropdown.template;
            if (template != null)
            {
                // Make the dropdown list template much taller
                template.sizeDelta = new Vector2(0, 400);
                
                // Fix the item text size
                var itemText = template.GetComponentInChildren<Text>();
                if (itemText != null)
                {
                    itemText.fontSize = 40;
                    RectTransform itemRt = itemText.GetComponent<RectTransform>();
                    itemRt.sizeDelta = new Vector2(0, 80);
                }
                
                // Fix item background height so items don't overlap
                Toggle toggle = template.GetComponentInChildren<Toggle>();
                if (toggle != null)
                {
                    toggle.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);
                }
            }
        }
        EditorSceneManager.SaveScene(loginScene, "Assets/Scenes/0_Login.unity");

        // 2. Fix AR Scene
        Scene arScene = EditorSceneManager.OpenScene("Assets/Scenes/2_FireSafetyAR.unity", OpenSceneMode.Single);
        
        // Remove old camera
        GameObject oldCam = GameObject.Find("Main Camera");
        if (oldCam != null) Object.DestroyImmediate(oldCam);

        // Try to execute the standard menu items for AR Setup
        bool createdSession = EditorApplication.ExecuteMenuItem("GameObject/XR/AR Session");
        bool createdOrigin = EditorApplication.ExecuteMenuItem("GameObject/XR/XR Origin (Mobile AR)");
        
        if (!createdOrigin)
        {
            // Fallback if menu item name changed in this Unity version
            createdOrigin = EditorApplication.ExecuteMenuItem("GameObject/XR/XR Origin (VR)");
        }

        // Find the XR Origin that was just created
        Unity.XR.CoreUtils.XROrigin origin = Object.FindAnyObjectByType<Unity.XR.CoreUtils.XROrigin>();
        
        if (origin != null)
        {
            // Add Raycast and Plane Managers to the XR Origin
            if (origin.gameObject.GetComponent<ARPlaneManager>() == null)
                origin.gameObject.AddComponent<ARPlaneManager>();
                
            if (origin.gameObject.GetComponent<ARRaycastManager>() == null)
                origin.gameObject.AddComponent<ARRaycastManager>();

            // Find our existing ARFireManager and move it to XR Origin
            ARFireManager oldManager = Object.FindAnyObjectByType<ARFireManager>();
            if (oldManager != null && oldManager.gameObject != origin.gameObject)
            {
                // Copy properties to a new manager on the XR Origin
                ARFireManager newManager = origin.gameObject.AddComponent<ARFireManager>();
                newManager.firePrefab = oldManager.firePrefab;
                newManager.instructionText = oldManager.instructionText;
                
                // Update FireExtinguisher reference
                FireExtinguisher extinguisher = Object.FindAnyObjectByType<FireExtinguisher>();
                if (extinguisher != null)
                {
                    extinguisher.fireManager = newManager;
                }
                
                // Destroy the old manager object
                Object.DestroyImmediate(oldManager.gameObject);
            }
        }
        else
        {
            Debug.LogError("Could not create XR Origin using Editor Menu items.");
        }

        EditorSceneManager.SaveScene(arScene, "Assets/Scenes/2_FireSafetyAR.unity");
        Debug.Log("Successfully fixed AR Scene and Login Dropdown!");
    }
}
