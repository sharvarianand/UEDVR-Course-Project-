using UnityEngine;
using UnityEditor;
using System.IO;

public class SetupKenneySprites
{
    [MenuItem("JohAR/Setup Kenney Sprites (9-Slice)")]
    public static void ConfigureSprites()
    {
        string rootPath = "Assets/UI/Kenney/PNG";
        if (!Directory.Exists(rootPath))
        {
            Debug.LogError("Kenney PNG directory not found at " + rootPath);
            return;
        }

        string[] guids = AssetDatabase.FindAssets("t:Texture2D", new[] { rootPath });
        int count = 0;

        foreach (string guid in guids)
        {
            string path = AssetDatabase.GUIDToAssetPath(guid);
            TextureImporter ti = AssetImporter.GetAtPath(path) as TextureImporter;
            if (ti != null)
            {
                bool modified = false;

                if (ti.textureType != TextureImporterType.Sprite)
                {
                    ti.textureType = TextureImporterType.Sprite;
                    ti.spriteImportMode = SpriteImportMode.Single;
                    modified = true;
                }

                // Check for 9-sliceable textures (buttons, panels, inputs, sliders)
                string filename = Path.GetFileNameWithoutExtension(path).ToLower();
                Vector4 border = Vector4.zero;

                if (filename.Contains("button_rectangle") || filename.Contains("input_rectangle") || filename.Contains("panel"))
                {
                    border = new Vector4(16, 16, 16, 16);
                }
                else if (filename.Contains("button_round"))
                {
                    border = new Vector4(24, 24, 24, 24);
                }
                else if (filename.Contains("button_square") || filename.Contains("input_square"))
                {
                    border = new Vector4(12, 12, 12, 12);
                }
                else if (filename.Contains("slide_horizontal") || filename.Contains("slide_vertical"))
                {
                    border = new Vector4(10, 10, 10, 10);
                }

                if (border != Vector4.zero && ti.spriteBorder != border)
                {
                    ti.spriteBorder = border;
                    modified = true;
                }

                if (modified)
                {
                    ti.SaveAndReimport();
                    count++;
                }
            }
        }

        AssetDatabase.SaveAssets();
        Debug.Log($"<b>[SetupKenneySprites] Configured {count} Kenney Sprites with 9-Slice borders!</b>");
    }
}
