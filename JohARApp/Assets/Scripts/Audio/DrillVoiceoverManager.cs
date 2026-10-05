using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Manages multilingual voiceover audio playback across all steps of the AR Fire Drill.
/// Supports dynamic loading from Resources/Audio/Voiceovers/<Language>/ as well as Inspector slots.
/// </summary>
public class DrillVoiceoverManager : MonoBehaviour
{
    public static DrillVoiceoverManager Instance { get; private set; }

    public enum DrillStep
    {
        Step0_ScanEnvironment,
        Step0_SpawnFire,
        Step0_ChooseEquipment,
        Step0_WarningWater,
        Step0_WarningCloth,
        Step1_RemoveSeal,
        Step2_PullPin,
        Step3_AimSqueeze,
        Step4_Spraying,
        Step5_FindFireExit,
        Step6_Victory
    }

    [Header("Audio Source")]
    public AudioSource voiceAudioSource;

    [Header("Inspector Audio Slots (Optional - Auto-loads from Resources if empty)")]
    public AudioClip[] englishClips = new AudioClip[11];
    public AudioClip[] hindiClips = new AudioClip[11];
    public AudioClip[] santaliClips = new AudioClip[11];

    // Clip File Mapping
    private static readonly Dictionary<DrillStep, string> StepClipNames = new Dictionary<DrillStep, string>
    {
        { DrillStep.Step0_ScanEnvironment, "vo_step0_scan" },
        { DrillStep.Step0_SpawnFire, "vo_step0_spawn_fire" },
        { DrillStep.Step0_ChooseEquipment, "vo_step0_choose_equipment" },
        { DrillStep.Step0_WarningWater, "vo_step0_warn_water" },
        { DrillStep.Step0_WarningCloth, "vo_step0_warn_cloth" },
        { DrillStep.Step1_RemoveSeal, "vo_step1_remove_seal" },
        { DrillStep.Step2_PullPin, "vo_step2_pull_pin" },
        { DrillStep.Step3_AimSqueeze, "vo_step3_aim_squeeze" },
        { DrillStep.Step4_Spraying, "vo_step4_spraying" },
        { DrillStep.Step5_FindFireExit, "vo_step5_fire_exit" },
        { DrillStep.Step6_Victory, "vo_step6_victory" }
    };

    private DrillStep currentStep = (DrillStep)(-1);
    private float lastSprayAudioTime = -999f;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else if (Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        if (voiceAudioSource == null)
        {
            voiceAudioSource = GetComponent<AudioSource>();
            if (voiceAudioSource == null)
            {
                voiceAudioSource = gameObject.AddComponent<AudioSource>();
            }
        }

        voiceAudioSource.playOnAwake = false;
        voiceAudioSource.spatialBlend = 0f; // 2D crisp voice narration
        voiceAudioSource.volume = 1f;
    }

    /// <summary>
    /// Plays the corresponding voiceover clip for the specified drill step and active language.
    /// </summary>
    public void PlayStepVoiceover(DrillStep step, bool allowReplay = false)
    {
        if (step == currentStep && !allowReplay) return;

        // Debounce spraying voiceover so it doesn't spam repeatedly while holding spray
        if (step == DrillStep.Step4_Spraying)
        {
            if (Time.time - lastSprayAudioTime < 6f) return;
            lastSprayAudioTime = Time.time;
        }

        currentStep = step;

        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.Hindi;

        AudioClip clip = GetAudioClip(step, lang);

        if (clip != null && voiceAudioSource != null)
        {
            voiceAudioSource.Stop();
            voiceAudioSource.clip = clip;
            voiceAudioSource.Play();
            Debug.Log($"<color=#38BDF8>[Voiceover]</color> Playing <b>{StepClipNames[step]}</b> ({lang})");
        }
        else
        {
            string langFolder = lang.ToString();
            string expectedPath = $"Assets/Audio/Voiceovers/{langFolder}/{StepClipNames[step]}.mp3";
            Debug.Log($"<color=#FCD34D>[Voiceover Ready]</color> Waiting for audio file: <b>{expectedPath}</b> for step <b>{step}</b> ({lang})");
        }
    }

    /// <summary>
    /// Stops any active voiceover playback.
    /// </summary>
    public void StopVoiceover()
    {
        if (voiceAudioSource != null && voiceAudioSource.isPlaying)
        {
            voiceAudioSource.Stop();
        }
    }

    private AudioClip GetAudioClip(DrillStep step, LanguageManager.Language lang)
    {
        int stepIdx = (int)step;

        // 1. Check Inspector-assigned arrays first
        AudioClip[] targetArray = lang switch
        {
            LanguageManager.Language.English => englishClips,
            LanguageManager.Language.Santali => santaliClips,
            _ => hindiClips
        };

        if (targetArray != null && stepIdx >= 0 && stepIdx < targetArray.Length && targetArray[stepIdx] != null)
        {
            return targetArray[stepIdx];
        }

        // 2. Dynamic Resources.Load fallback: Resources/Audio/Voiceovers/<Language>/<clipName>
        string langName = lang.ToString();
        string clipName = StepClipNames[step];
        string resourcePath = $"Audio/Voiceovers/{langName}/{clipName}";
        AudioClip loaded = Resources.Load<AudioClip>(resourcePath);

        if (loaded != null) return loaded;

        // 3. Flat resource load fallback: Resources/Audio/<clipName>_<langName>
        loaded = Resources.Load<AudioClip>($"Audio/{clipName}_{langName.ToLower()}");
        if (loaded != null) return loaded;

        // 4. Fallback for Santali to Hindi or English if Santali audio is not yet generated
        if (lang == LanguageManager.Language.Santali)
        {
            AudioClip fallback = Resources.Load<AudioClip>($"Audio/Voiceovers/Hindi/{clipName}");
            if (fallback == null && hindiClips != null && stepIdx >= 0 && stepIdx < hindiClips.Length)
                fallback = hindiClips[stepIdx];
            if (fallback == null) fallback = Resources.Load<AudioClip>($"Audio/Voiceovers/English/{clipName}");
            if (fallback != null) return fallback;
        }

        return null;
    }
}
