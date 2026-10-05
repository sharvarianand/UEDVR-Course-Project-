using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class UIFlowHelper : MonoBehaviour
{
    public string sceneToLoad;
    public GameObject panelToToggle;

    void Start()
    {
        Button btn = GetComponent<Button>();
        if (btn != null)
        {
            btn.onClick.AddListener(OnClick);
        }
    }

    void OnClick()
    {
        if (!string.IsNullOrEmpty(sceneToLoad))
            SceneManager.LoadScene(sceneToLoad);
            
        if (panelToToggle != null)
            panelToToggle.SetActive(!panelToToggle.activeSelf);
    }
}
