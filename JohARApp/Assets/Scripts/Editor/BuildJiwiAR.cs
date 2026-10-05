#if UNITY_EDITOR
using System;
using System.IO;
using System.Diagnostics;
using UnityEditor;
using UnityEditor.Build;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace JiwiAR.Editor
{
    public static class BuildJiwiAR
    {
        private const string APK_OUTPUT_PATH = "../Jiwi-AR.apk";
        private const string SCENE_AR = "Assets/Scenes/2_FireSafetyAR.unity";

        [MenuItem("Jiwi-AR/1. Sync React Assets to StreamingAssets", false, 10)]
        public static void SyncReactAssets()
        {
            string projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
            string reactDist = Path.Combine(projectRoot, "JohAR-Web-Hub", "dist");
            string targetStreaming = Path.Combine(Application.dataPath, "StreamingAssets", "web");

            if (!Directory.Exists(reactDist))
            {
                Debug.LogError($"[Jiwi-AR] React dist folder not found at: {reactDist}. Run 'npm run build' first.");
                return;
            }

            if (Directory.Exists(targetStreaming))
            {
                Directory.Delete(targetStreaming, true);
            }

            CopyDirectory(reactDist, targetStreaming);
            AssetDatabase.Refresh();
            Debug.Log($"[Jiwi-AR] Successfully synchronized React Web Hub build into: {targetStreaming}");
        }

        public static void SetupEquipmentPrefabsAndScene()
        {
            Debug.Log("[Jiwi-AR] Setting up 3D Equipment Prefabs (Bucket, Cloth, Extinguisher)...");

            // 1. Bucket Prefab
            GameObject bucketModel = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Models/Bucket/metal_bucket.obj");
            if (bucketModel == null)
                bucketModel = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Models/Bucket/metal_bucket.fbx");
            Material bucketMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Models/Bucket/MetalBucketMat.mat");
            Material waterMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Models/Bucket/WaterSurfaceMat.mat");

            if (bucketModel != null)
            {
                Mesh bucketMesh = null;
                MeshFilter mfSrc = bucketModel.GetComponentInChildren<MeshFilter>();
                if (mfSrc != null) bucketMesh = mfSrc.sharedMesh;

                if (bucketMesh != null)
                {
                    GameObject bucketGo = new GameObject("BucketPrefab");
                    MeshFilter mf = bucketGo.AddComponent<MeshFilter>();
                    mf.sharedMesh = bucketMesh;
                    MeshRenderer mr = bucketGo.AddComponent<MeshRenderer>();
                    if (bucketMat != null) mr.sharedMaterial = bucketMat;

                    BoxCollider bc = bucketGo.AddComponent<BoxCollider>();
                    bc.size = new Vector3(0.36f, 0.42f, 0.36f);
                    bc.center = new Vector3(0f, 0.20f, 0f);

                    // Water surface child
                    GameObject waterGo = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                    waterGo.name = "WaterSurface";
                    waterGo.transform.SetParent(bucketGo.transform, false);
                    waterGo.transform.localPosition = new Vector3(0f, 0.20f, 0f);
                    waterGo.transform.localScale = new Vector3(0.20f, 0.005f, 0.20f);
                    UnityEngine.Object.DestroyImmediate(waterGo.GetComponent<Collider>());
                    if (waterMat != null) waterGo.GetComponent<Renderer>().sharedMaterial = waterMat;

                    PrefabUtility.SaveAsPrefabAsset(bucketGo, "Assets/Prefabs/AR/BucketPrefab.prefab");
                    PrefabUtility.SaveAsPrefabAsset(bucketGo, "Assets/Resources/Prefabs/AR/BucketPrefab.prefab");
                    UnityEngine.Object.DestroyImmediate(bucketGo);
                    Debug.Log("[Jiwi-AR] Successfully generated native BucketPrefab.prefab!");
                }
            }

            // 2. Cloth Prefab
            GameObject clothModel = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Models/Cloth/wet_cloth.obj");
            Material clothMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Models/Cloth/WetClothMat.mat");

            if (clothModel != null)
            {
                Mesh clothMesh = null;
                MeshFilter mfSrc = clothModel.GetComponentInChildren<MeshFilter>();
                if (mfSrc != null) clothMesh = mfSrc.sharedMesh;

                if (clothMesh != null)
                {
                    GameObject clothGo = new GameObject("ClothPrefab");
                    MeshFilter mf = clothGo.AddComponent<MeshFilter>();
                    mf.sharedMesh = clothMesh;
                    MeshRenderer mr = clothGo.AddComponent<MeshRenderer>();
                    if (clothMat != null) mr.sharedMaterial = clothMat;

                    BoxCollider bc = clothGo.AddComponent<BoxCollider>();
                    bc.size = new Vector3(0.42f, 0.35f, 0.32f);
                    bc.center = new Vector3(0f, 0.16f, 0f);

                    PrefabUtility.SaveAsPrefabAsset(clothGo, "Assets/Prefabs/AR/ClothPrefab.prefab");
                    PrefabUtility.SaveAsPrefabAsset(clothGo, "Assets/Resources/Prefabs/AR/ClothPrefab.prefab");
                    UnityEngine.Object.DestroyImmediate(clothGo);
                    Debug.Log("[Jiwi-AR] Successfully generated native ClothPrefab.prefab!");
                }
            }

            // 3. Extinguisher Prefab in Resources
            GameObject extSrc = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
            if (extSrc != null)
            {
                PrefabUtility.SaveAsPrefabAsset(extSrc, "Assets/Resources/Prefabs/AR/ExtinguisherPrefab.prefab");
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            // 4. Update Scene References
            var scene = UnityEditor.SceneManagement.EditorSceneManager.OpenScene(SCENE_AR);
            var mgr = UnityEngine.Object.FindAnyObjectByType<ARFireManager>();
            if (mgr != null)
            {
                mgr.extinguisherPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
                mgr.bucketPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/BucketPrefab.prefab");
                mgr.clothPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ClothPrefab.prefab");
                UnityEditor.EditorUtility.SetDirty(mgr);
                UnityEditor.SceneManagement.EditorSceneManager.SaveScene(scene);
                Debug.Log("[Jiwi-AR] Successfully bound all 3 prefabs to ARFireManager in scene!");
            }
        }

        [MenuItem("Jiwi-AR/2. Build Single Native Android APK (Jiwi-AR.apk)", false, 20)]
        public static void BuildSingleAPK()
        {
            SyncReactAssets();
            SetupEquipmentPrefabsAndScene();

            Debug.Log("[Jiwi-AR] Configuring PlayerSettings for Jiwi-AR...");
            PlayerSettings.companyName = "Jiwi";
            PlayerSettings.productName = "Jiwi-AR";
            PlayerSettings.SetApplicationIdentifier(NamedBuildTarget.Android, "com.jiwiar.app");
            PlayerSettings.SplashScreen.show = false;
            PlayerSettings.SplashScreen.showUnityLogo = false;

            string iconAssetPath = "Assets/AppIcon/jiwiAR_logo.png";
            AssetDatabase.ImportAsset(iconAssetPath);
            Texture2D appIcon = AssetDatabase.LoadAssetAtPath<Texture2D>(iconAssetPath);
            if (appIcon != null)
            {
                PlayerSettings.SetIconsForTargetGroup(BuildTargetGroup.Android, new Texture2D[] { appIcon });
                PlayerSettings.SetIconsForTargetGroup(BuildTargetGroup.Unknown, new Texture2D[] { appIcon });
                Debug.Log("[Jiwi-AR] Successfully configured jiwiAR_logo.png as application icon in PlayerSettings.");
            }

            EditorUserBuildSettings.buildAppBundle = false;
            EditorUserBuildSettings.exportAsGoogleAndroidProject = false;

            string[] scenes = new string[] { SCENE_AR };

            string outputPath = Path.GetFullPath(Path.Combine(Application.dataPath, APK_OUTPUT_PATH));
            Debug.Log($"[Jiwi-AR] Starting unified APK build to: {outputPath} ...");

            BuildPlayerOptions buildOptions = new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = outputPath,
                target = BuildTarget.Android,
                options = BuildOptions.None
            };

            var report = BuildPipeline.BuildPlayer(buildOptions);
            if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded)
            {
                string rootPath = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", "Jiwi-AR.apk"));
                try { File.Copy(outputPath, rootPath, true); } catch {}
                Debug.Log($"[Jiwi-AR] BUILD SUCCEEDED! Total size: {report.summary.totalSize / (1024 * 1024):F1} MB. Output: {outputPath} & {rootPath}");
            }
            else
            {
                Debug.LogError($"[Jiwi-AR] BUILD FAILED with {report.summary.totalErrors} errors.");
            }
        }

        [MenuItem("Jiwi-AR/3. Build & Install to Device via ADB", false, 30)]
        public static void BuildAndInstall()
        {
            BuildSingleAPK();
            InstallExistingAPK();
        }

        [MenuItem("Jiwi-AR/4. Install Existing APK to Connected Device", false, 35)]
        public static void InstallExistingAPK()
        {
            string outputPath = Path.GetFullPath(Path.Combine(Application.dataPath, APK_OUTPUT_PATH));
            string rootPath = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", "Jiwi-AR.apk"));

            // Ensure copies exist in both locations
            if (File.Exists(outputPath))
            {
                try { File.Copy(outputPath, rootPath, true); } catch {}
            }
            else if (File.Exists(rootPath))
            {
                try { File.Copy(rootPath, outputPath, true); } catch {}
            }

            string targetApk = File.Exists(outputPath) ? outputPath : rootPath;

            if (!File.Exists(targetApk))
            {
                Debug.LogError($"[Jiwi-AR] Could not find APK at {targetApk}. Run 'Build Single Native Android APK' first.");
                EditorUtility.DisplayDialog("APK Not Found", $"Could not find APK at:\n{targetApk}\n\nPlease run 'Build Single Native Android APK' first.", "OK");
                return;
            }

            string adbPath = GetAdbPath();
            Debug.Log($"[Jiwi-AR] Using ADB binary at: {adbPath}");

            try
            {
                // Verify if an authorized Android device is connected
                ProcessStartInfo checkDevPsi = new ProcessStartInfo
                {
                    FileName = adbPath,
                    Arguments = "devices",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (Process proc = Process.Start(checkDevPsi))
                {
                    string devOut = proc.StandardOutput.ReadToEnd();
                    proc.WaitForExit();
                    Debug.Log($"[Jiwi-AR] Connected Devices:\n{devOut}");

                    if (!devOut.Contains("\tdevice"))
                    {
                        Debug.LogWarning($"[Jiwi-AR] WARNING: No authorized Android device detected.\nAPK is built and ready at: {targetApk}\nPlease connect your phone via USB and enable USB Debugging.");
                        EditorUtility.DisplayDialog("No Android Device Detected",
                            $"Jiwi-AR.apk is ready at:\n{targetApk}\n\nNo connected Android device was detected with USB Debugging.\n\nPlease:\n1. Connect your Android phone with a USB cable\n2. Enable Developer Options & USB Debugging\n3. Tap 'Allow USB Debugging' on your phone\n4. Re-run 'Install Existing APK to Connected Device'",
                            "OK");
                        return;
                    }
                }

                Debug.Log($"[Jiwi-AR] Deploying Jiwi-AR.apk ({new FileInfo(targetApk).Length / (1024 * 1024)} MB) to connected Android device...");
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = adbPath,
                    Arguments = $"install -r -d -g \"{targetApk}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (Process proc = Process.Start(psi))
                {
                    string stdout = proc.StandardOutput.ReadToEnd();
                    string stderr = proc.StandardError.ReadToEnd();
                    proc.WaitForExit();

                    Debug.Log($"[Jiwi-AR] ADB Output: {stdout}");
                    if (!string.IsNullOrEmpty(stderr)) Debug.LogWarning($"[Jiwi-AR] ADB Warning: {stderr}");
                    if (stdout.Contains("Success"))
                    {
                        Debug.Log("<color=green>[Jiwi-AR] SUCCESS! Jiwi-AR.apk successfully installed on connected device!</color>");

                        // Automatically launch MainActivity
                        try
                        {
                            Process.Start(new ProcessStartInfo
                            {
                                FileName = adbPath,
                                Arguments = "shell am start -n com.jiwiar.app/.MainActivity",
                                UseShellExecute = false,
                                CreateNoWindow = true
                            });
                        }
                        catch {}

                        EditorUtility.DisplayDialog("Jiwi-AR Installed!", "Jiwi-AR.apk was successfully installed and launched on your connected Android device!", "Great!");
                    }
                    else
                    {
                        EditorUtility.DisplayDialog("ADB Installation Result", stdout, "OK");
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[Jiwi-AR] ADB Installation Exception: {ex.Message}");
                EditorUtility.DisplayDialog("ADB Error", $"Failed to execute ADB at: {adbPath}\n\nError: {ex.Message}\n\nAPK is available at:\n{targetApk}", "OK");
            }
        }

        private static string GetAdbPath()
        {
            // 1. Try Unity's configured Android SDK path
            try
            {
                string unitySdk = EditorPrefs.GetString("AndroidSdkRoot");
                if (!string.IsNullOrEmpty(unitySdk))
                {
                    string candidate = Path.Combine(unitySdk, "platform-tools", "adb");
                    if (File.Exists(candidate)) return candidate;
                }
            }
            catch {}

            // 2. Candidate paths on macOS
            string[] candidatePaths = new string[]
            {
                "/Volumes/CrucialX9/Library/AndroidStudio/sdk/platform-tools/adb",
                "/Volumes/CrucialX9/Unity/Editor/6000.5.10f1-arm64/PlaybackEngines/AndroidPlayer/SDK/platform-tools/adb",
                "/opt/homebrew/bin/adb",
                "/opt/homebrew/Caskroom/android-platform-tools/36.0.0/platform-tools/adb",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Library/Android/sdk/platform-tools/adb"),
                "/usr/local/bin/adb"
            };

            foreach (var path in candidatePaths)
            {
                if (File.Exists(path)) return path;
            }
            return "adb";
        }

        private static void CopyDirectory(string sourceDir, string destinationDir)
        {
            var dir = new DirectoryInfo(sourceDir);
            if (!dir.Exists) return;

            Directory.CreateDirectory(destinationDir);

            foreach (FileInfo file in dir.GetFiles())
            {
                if (file.Name.EndsWith(".meta")) continue;
                string targetFilePath = Path.Combine(destinationDir, file.Name);
                file.CopyTo(targetFilePath, true);
            }

            foreach (DirectoryInfo subDir in dir.GetDirectories())
            {
                string nextTargetSubDir = Path.Combine(destinationDir, subDir.Name);
                CopyDirectory(subDir.FullName, nextTargetSubDir);
            }
        }
    }
}
#endif
