using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class ReturnToHome : MonoBehaviour, IPointerClickHandler, IPointerDownHandler
{
    private Button button;
    private RectTransform rectTransform;
    private bool isReturning = false;

    private void Awake()
    {
        rectTransform = GetComponent<RectTransform>();
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

    public void OnPointerDown(PointerEventData eventData)
    {
        ExecuteReturn();
    }

    private void Update()
    {
        // Fail-safe direct touch / click detection in screen coordinates
        if (isReturning || !gameObject.activeInHierarchy) return;

        bool isTapped = false;
        Vector2 tapPos = Vector2.zero;

#if ENABLE_INPUT_SYSTEM
        if (Touchscreen.current != null && (Touchscreen.current.primaryTouch.press.wasPressedThisFrame || Touchscreen.current.primaryTouch.press.isPressed))
        {
            tapPos = Touchscreen.current.primaryTouch.position.ReadValue();
            isTapped = true;
        }
        else if (Mouse.current != null && (Mouse.current.leftButton.wasPressedThisFrame || Mouse.current.leftButton.isPressed))
        {
            tapPos = Mouse.current.position.ReadValue();
            isTapped = true;
        }
#else
        if (Input.touchCount > 0)
        {
            tapPos = Input.GetTouch(0).position;
            isTapped = true;
        }
        else if (Input.GetMouseButtonDown(0) || Input.GetMouseButton(0))
        {
            tapPos = Input.mousePosition;
            isTapped = true;
        }
#endif

        if (isTapped && rectTransform != null)
        {
            if (RectTransformUtility.RectangleContainsScreenPoint(rectTransform, tapPos, null))
            {
                ExecuteReturn();
            }
        }
    }

    public void ExecuteReturn()
    {
        if (isReturning) return;
        isReturning = true;

        Debug.Log("[ReturnToHome] Forwarding return request to ReturnToReactBridge...");
        JohAR.AR.ReturnToReactBridge.ExecuteReturn();
    }
}
