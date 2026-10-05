import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Award, 
  ChevronRight,
  BookOpen,
  RotateCcw,
  Zap,
  Clock,
  ExternalLink,
  Target,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PPE_COURSE_DATA } from '../data/ppeCourseData';

// Fisher-Yates shuffle returning a fresh copy
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate randomized question sequence (random 3 out of 7) and randomized option sequence for each question
function createQuizSession(questions, count = 3) {
  if (!questions || !questions.length) return [];
  const selectedQuestions = shuffleArray(questions).slice(0, count);
  return selectedQuestions.map(q => {
    const optionIndices = shuffleArray([0, 1, 2, 3]);
    return {
      id: q.id,
      optionIndices
    };
  });
}

export default function PPECourseModal({
  worker,
  language = 'English',
  onClose,
  onCompleteCourse
}) {
  const [currLang, setCurrLang] = useState(language);
  // Stages: 'part1' -> 'scenario' -> 'quiz1' -> 'part2' -> 'quiz2' -> 'results'
  const [stage, setStage] = useState('part1');
  const [pageIndex, setPageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  // Scenario Stage State (40 points, before Quiz 1)
  const [scenarioOptionIndices, setScenarioOptionIndices] = useState(() => shuffleArray([0, 1, 2, 3]));
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(null);
  const [isScenarioChecked, setIsScenarioChecked] = useState(false);
  const [scenarioScore, setScenarioScore] = useState(0); // 0 or 40

  // Dynamic Randomized Quiz Sessions (random 3 of 7 questions, and options shuffled each attempt)
  const [quiz1Session, setQuiz1Session] = useState(() => 
    createQuizSession(PPE_COURSE_DATA.English.quiz1Questions, 3)
  );
  const [quiz2Session, setQuiz2Session] = useState(() => 
    createQuizSession(PPE_COURSE_DATA.English.quiz2Questions, 3)
  );

  // Quiz Interaction States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quiz1Results, setQuiz1Results] = useState([]);
  const [quiz2Results, setQuiz2Results] = useState([]);

  // Audio / Speech Synthesis State
  const [audioActive, setAudioActive] = useState(false);
  const startTimeRef = useRef(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Course Data for active language (fall back to English if missing)
  const course = PPE_COURSE_DATA[currLang] || PPE_COURSE_DATA.English;

  // Haptic Feedback Helper
  const triggerHaptic = (ms = 25) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  // Keep track of training duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stop audio speech when changing slide or stage
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioActive(false);
  }, [stage, pageIndex, qIndex, currLang]);

  // Helper to retrieve active question with permuted options in current language
  const getActiveQuizItem = () => {
    const isQuiz1 = stage === 'quiz1';
    const session = isQuiz1 ? quiz1Session : quiz2Session;
    const questions = isQuiz1 ? course.quiz1Questions : course.quiz2Questions;

    const currentSessionItem = session && session[qIndex];
    if (!currentSessionItem) {
      const fallbackQ = questions[qIndex] || questions[0];
      return {
        questionObj: fallbackQ,
        displayOptions: fallbackQ.options,
        optionIndices: [0, 1, 2, 3]
      };
    }

    const questionObj = questions.find(q => q.id === currentSessionItem.id) || questions[qIndex] || questions[0];
    const displayOptions = currentSessionItem.optionIndices.map(origIdx => questionObj.options[origIdx]);

    return {
      questionObj,
      displayOptions,
      optionIndices: currentSessionItem.optionIndices
    };
  };

  // Audio narration handler
  const handleToggleAudio = () => {
    triggerHaptic(20);
    if (!('speechSynthesis' in window)) return;

    if (audioActive) {
      window.speechSynthesis.cancel();
      setAudioActive(false);
      return;
    }

    window.speechSynthesis.cancel();
    let textToSpeak = '';

    if (stage === 'part1' && course.part1Pages[pageIndex]) {
      const p = course.part1Pages[pageIndex];
      textToSpeak = `${p.title}. ${p.description}. ${p.cautionTip || ''}`;
    } else if (stage === 'scenario' && course.scenarioAssessment) {
      const sc = course.scenarioAssessment;
      textToSpeak = `${sc.title}. ${sc.scenarioText}. Question: ${sc.questionPrompt}`;
    } else if (stage === 'part2' && course.part2Pages[pageIndex]) {
      const p = course.part2Pages[pageIndex];
      textToSpeak = `${p.title}. ${p.description}. ${p.cautionTip || ''}`;
    } else if (stage === 'quiz1' || stage === 'quiz2') {
      const { questionObj, displayOptions } = getActiveQuizItem();
      textToSpeak = `${questionObj.question}. Options: ${displayOptions.join(', ')}`;
    }

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (currLang === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.95;
    utterance.onend = () => setAudioActive(false);
    utterance.onerror = () => setAudioActive(false);

    window.speechSynthesis.speak(utterance);
    setAudioActive(true);
  };

  // Navigation handlers for Part 1 & Part 2
  const handleNextPage = () => {
    triggerHaptic(25);
    if (stage === 'part1') {
      if (pageIndex < course.part1Pages.length - 1) {
        setPageIndex(pageIndex + 1);
      } else {
        // Transition to Practical Scenario Assessment (40 points)
        setStage('scenario');
        setSelectedScenarioIdx(null);
        setIsScenarioChecked(false);
      }
    } else if (stage === 'part2') {
      if (pageIndex < course.part2Pages.length - 1) {
        setPageIndex(pageIndex + 1);
      } else {
        // Start Quiz 2 with fresh random 3-of-7 questions & shuffled options
        setQuiz2Session(createQuizSession(PPE_COURSE_DATA.English.quiz2Questions, 3));
        setQuiz2Results([]);
        setStage('quiz2');
        setQIndex(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      }
    }
  };

  const handlePrevPage = () => {
    triggerHaptic(20);
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  // Scenario Selection (40 points)
  const handleSelectScenarioOption = (displayedIdx) => {
    if (isScenarioChecked) return;
    setSelectedScenarioIdx(displayedIdx);
    setIsScenarioChecked(true);

    const origIdx = scenarioOptionIndices[displayedIdx];
    const scenarioData = course.scenarioAssessment;
    const chosenOption = scenarioData.options[origIdx];
    const isCorrect = Boolean(chosenOption && chosenOption.isCorrect);

    if (isCorrect) {
      triggerHaptic(40);
      setScenarioScore(40);
    } else {
      triggerHaptic(75);
      setScenarioScore(0);
    }
  };

  // Continue from Scenario to Quiz 1
  const handleStartQuiz1FromScenario = () => {
    triggerHaptic(25);
    // Start Quiz 1 with fresh random 3-of-7 questions & shuffled options
    setQuiz1Session(createQuizSession(PPE_COURSE_DATA.English.quiz1Questions, 3));
    setQuiz1Results([]);
    setStage('quiz1');
    setQIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  // Option selection in Quiz (checks original correctIndex vs permuted chosen index)
  const handleSelectOption = (displayedIdx) => {
    if (isAnswerChecked) return; // already locked in
    setSelectedOption(displayedIdx);
    setIsAnswerChecked(true);

    const isQuiz1 = stage === 'quiz1';
    const { questionObj, optionIndices } = getActiveQuizItem();
    const originalChosenIndex = optionIndices[displayedIdx];
    const isCorrect = originalChosenIndex === questionObj.correctIndex;

    if (isCorrect) {
      triggerHaptic(35);
    } else {
      triggerHaptic(70);
    }

    if (isQuiz1) {
      setQuiz1Results(prev => [...prev, isCorrect]);
    } else {
      setQuiz2Results(prev => [...prev, isCorrect]);
    }
  };

  // Next question or next section
  const handleNextQuizQuestion = () => {
    triggerHaptic(25);
    const isQuiz1 = stage === 'quiz1';
    const session = isQuiz1 ? quiz1Session : quiz2Session;

    if (qIndex < session.length - 1) {
      setQIndex(qIndex + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Finished this quiz
      if (isQuiz1) {
        // Transition to Part 2 Hazard inspection
        setStage('part2');
        setPageIndex(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        // Transition to Results
        setStage('results');
        try {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    }
  };

  // Restart training with newly sampled 3-of-7 questions & shuffled options
  const handleRestartCourse = () => {
    triggerHaptic(30);
    setScenarioOptionIndices(shuffleArray([0, 1, 2, 3]));
    setSelectedScenarioIdx(null);
    setIsScenarioChecked(false);
    setScenarioScore(0);
    setQuiz1Session(createQuizSession(PPE_COURSE_DATA.English.quiz1Questions, 3));
    setQuiz2Session(createQuizSession(PPE_COURSE_DATA.English.quiz2Questions, 3));
    setQuiz1Results([]);
    setQuiz2Results([]);
    setStage('part1');
    setPageIndex(0);
    setQIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
  };

  // Scoring Calculation:
  // Scenario = 40 pts
  // Quiz 1 (3 questions) = 10 pts each -> 30 pts max
  // Quiz 2 (3 questions) = 10 pts each -> 30 pts max
  // Total Max = 100 pts
  const quiz1CorrectCount = quiz1Results.filter(Boolean).length;
  const quiz2CorrectCount = quiz2Results.filter(Boolean).length;
  const quiz1Score = quiz1CorrectCount * 10;
  const quiz2Score = quiz2CorrectCount * 10;
  const totalEarnedScore = scenarioScore + quiz1Score + quiz2Score;

  // Grade determination based on overall score
  const getGradeInfo = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'DGMS Exemplary Master', badgeClass: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30 shadow-emerald-500/10', stars: 3 };
    if (score >= 80) return { grade: 'A', label: 'Certified Safety Inspector', badgeClass: 'text-amber-400 bg-amber-500/15 border-amber-500/30 shadow-amber-500/10', stars: 3 };
    if (score >= 70) return { grade: 'B', label: 'DGMS Safety Qualified', badgeClass: 'text-blue-400 bg-blue-500/15 border-blue-500/30 shadow-blue-500/10', stars: 2 };
    if (score >= 60) return { grade: 'C', label: 'Conditional Pass', badgeClass: 'text-orange-400 bg-orange-500/15 border-orange-500/30 shadow-orange-500/10', stars: 1 };
    return { grade: 'D', label: 'Retake Required', badgeClass: 'text-rose-400 bg-rose-500/15 border-rose-500/30 shadow-rose-500/10', stars: 0 };
  };

  const gradeInfo = getGradeInfo(totalEarnedScore);

  // Complete and certify
  const handleCompleteAndCertify = () => {
    triggerHaptic(50);
    if (onCompleteCourse) {
      onCompleteCourse({
        score: totalEarnedScore,
        grade: gradeInfo.grade,
        gradeLabel: gradeInfo.label,
        stars: gradeInfo.stars,
        duration: elapsedSeconds || 120,
        moduleId: 'ppe_hazard',
        moduleType: 'PPE_INSPECTION',
        worker_id: worker?.worker_id,
        breakdown: {
          scenario: scenarioScore,
          quiz1: quiz1Score,
          quiz2: quiz2Score
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/95 backdrop-blur-xl flex flex-col items-center justify-between text-slate-100 overflow-hidden select-none animate-fadeIn">
      
      {/* Top Header Bar */}
      <header className="w-full max-w-md px-4 py-3 bg-[#090A0F]/90 border-b border-white/[0.08] flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-tight">
                {stage === 'part1' ? 'PPE Inspection' : 
                 stage === 'scenario' ? 'Field Scenario' : 
                 stage === 'quiz1' ? 'Quiz 1' : 
                 stage === 'part2' ? 'Hazard Inspection' : 
                 stage === 'quiz2' ? 'Final Quiz' : 'Certified'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
                DGMS
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              {stage === 'part1' ? `${course.pageIndicator} ${pageIndex + 1} ${course.ofText} ${course.part1Pages.length}` :
               stage === 'scenario' ? '40 PTS ASSESS' :
               stage === 'quiz1' ? `Question ${qIndex + 1} / ${quiz1Session.length}` :
               stage === 'part2' ? `${course.pageIndicator} ${pageIndex + 1} ${course.ofText} ${course.part2Pages.length}` :
               stage === 'quiz2' ? `Question ${qIndex + 1} / ${quiz2Session.length}` : 'Module Certified'}
            </p>
          </div>
        </div>

        {/* Action Controls: Lang Switcher, Audio, Close */}
        <div className="flex items-center gap-1.5">
          {/* Trilingual Toggle */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5 text-[10px] font-medium">
            <button
              type="button"
              onClick={() => { triggerHaptic(15); setCurrLang('English'); }}
              className={`px-1.5 py-0.5 rounded transition ${currLang === 'English' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => { triggerHaptic(15); setCurrLang('Hindi'); }}
              className={`px-1.5 py-0.5 rounded transition ${currLang === 'Hindi' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => { triggerHaptic(15); setCurrLang('Santali'); }}
              className={`px-1.5 py-0.5 rounded transition ${currLang === 'Santali' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              ᱥᱟ
            </button>
          </div>

          {/* Audio TTS Button */}
          {stage !== 'results' && (
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`p-1.5 rounded-lg border transition ${
                audioActive 
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 animate-pulse' 
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border-white/[0.08]'
              }`}
              title={course.audioNarrateBtn}
            >
              {audioActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={() => { triggerHaptic(20); setShowExitConfirm(true); }}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full max-w-md h-1 bg-white/[0.04] shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
          style={{
            width: stage === 'part1' ? `${((pageIndex + 1) / course.part1Pages.length) * 25}%` :
                   stage === 'scenario' ? '30%' :
                   stage === 'quiz1' ? `${30 + ((qIndex + 1) / quiz1Session.length) * 20}%` :
                   stage === 'part2' ? `${50 + ((pageIndex + 1) / course.part2Pages.length) * 25}%` :
                   stage === 'quiz2' ? `${75 + ((qIndex + 1) / quiz2Session.length) * 25}%` : '100%'
          }}
        />
      </div>

      {/* Main Body Container */}
      <main className="w-full max-w-md flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-start">
        
        {/* STAGE 1: PART 1 LEARNING (6 PAGES) */}
        {stage === 'part1' && (
          <div className="space-y-4 text-left animate-fadeIn">
            {/* Header Stage Label */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {course.part1Pages[pageIndex].tag}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {course.pageIndicator} {pageIndex + 1} / {course.part1Pages.length}
              </span>
            </div>

            {/* Title & Standard Code */}
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                {course.part1Pages[pageIndex].title}
              </h2>
              <p className="text-[11px] font-mono text-amber-400 mt-0.5">
                Standard: {course.part1Pages[pageIndex].keyStandard}
              </p>
            </div>

            {/* High-Resolution Graphic / Image Card */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.1] bg-zinc-900 shadow-lg group">
              <img 
                src={course.part1Pages[pageIndex].image} 
                alt={course.part1Pages[pageIndex].title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  e.currentTarget.src = './module_images/module_ppe_hazard_hero.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  DGMS Inspected
                </span>
                <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10 text-amber-300">
                  IS 2925 Certified
                </span>
              </div>
            </div>

            {/* Core DGMS Explanation */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {course.part1Pages[pageIndex].description}
              </p>

              {/* Inspection Checkpoints */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Daily Pre-Shift Audit Points:
                </span>
                {course.part1Pages[pageIndex].bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caution Alert Box */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-snug">
                <strong className="font-semibold text-amber-300">Mandatory Rule: </strong>
                {course.part1Pages[pageIndex].cautionTip}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 2: PRACTICAL SCENARIO ASSESSMENT (40 POINTS) */}
        {stage === 'scenario' && course.scenarioAssessment && (() => {
          const sc = course.scenarioAssessment;
          return (
            <div className="space-y-4 text-left animate-fadeIn">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-amber-400" />
                  {sc.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  40 PTS
                </span>
              </div>

              {/* Scenario Narrative Box */}
              <div className="bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-tight">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{sc.title}</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                  {sc.scenarioText}
                </p>
                <div className="pt-2 border-t border-white/[0.08]">
                  <p className="text-xs font-semibold text-white leading-snug">
                    {sc.questionPrompt}
                  </p>
                </div>
              </div>

              {/* 4 Image Options (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2.5">
                {scenarioOptionIndices.map((origIdx, displayedIdx) => {
                  const opt = sc.options[origIdx];
                  const isSelected = selectedScenarioIdx === displayedIdx;
                  const isCorrect = opt.isCorrect;

                  let borderStyle = 'border-white/[0.08] bg-zinc-900/80 hover:border-amber-500/40';
                  if (isScenarioChecked) {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30';
                    } else if (isSelected) {
                      borderStyle = 'border-red-500 bg-red-500/15 ring-2 ring-red-500/30';
                    } else {
                      borderStyle = 'border-white/[0.04] bg-zinc-900/40 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={displayedIdx}
                      type="button"
                      disabled={isScenarioChecked}
                      onClick={() => handleSelectScenarioOption(displayedIdx)}
                      className={`relative rounded-xl border p-2.5 text-left flex flex-col justify-between transition-all duration-200 group active:scale-[0.98] ${borderStyle}`}
                    >
                      {/* PPE Image */}
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black/60 mb-2">
                        <img 
                          src={opt.image} 
                          alt={opt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.currentTarget.src = './module_images/ppe_helmet.jpg';
                          }}
                        />
                        <div className="absolute top-1.5 right-1.5">
                          {isScenarioChecked && isCorrect && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                          {isScenarioChecked && isSelected && !isCorrect && (
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tag / Category */}
                      <span className="text-[9px] font-mono text-zinc-400 block truncate">
                        {opt.tag}
                      </span>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-white leading-tight mt-0.5 line-clamp-2">
                        {opt.title}
                      </h4>

                      {/* Subtitle Standard */}
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                        {opt.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Technical DGMS Explanation Card */}
              {isScenarioChecked && (
                <div className={`rounded-xl p-3.5 border animate-fadeIn ${
                  scenarioScore > 0 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {scenarioScore > 0 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Scenario Assessment Passed! (+40 PTS)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-red-300">Incorrect Priority (0 PTS)</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarioScore > 0 ? sc.correctExplanation : sc.incorrectExplanation}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* STAGE 3: QUIZ 1 (RANDOM 3 OF 7 QUESTIONS) */}
        {stage === 'quiz1' && (() => {
          const { questionObj, displayOptions, optionIndices } = getActiveQuizItem();
          return (
            <div className="space-y-4 text-left animate-fadeIn">
              {/* Header Stage Label */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {course.quiz1Title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    10 PTS / Q
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Question {qIndex + 1} / {quiz1Session.length}
                  </span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {questionObj.question}
                </h3>
              </div>

              {/* Options List (dynamically shuffled each attempt) */}
              <div className="space-y-2">
                {displayOptions.map((opt, displayedIdx) => {
                  const originalIdx = optionIndices[displayedIdx];
                  const isSelected = selectedOption === displayedIdx;
                  const isCorrect = originalIdx === questionObj.correctIndex;
                  let cardStyle = 'bg-white/[0.025] border-white/[0.08] text-zinc-200 hover:bg-white/[0.05] hover:border-white/[0.15]';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200';
                    } else if (isSelected) {
                      cardStyle = 'bg-red-500/15 border-red-500/50 text-red-200';
                    } else {
                      cardStyle = 'bg-white/[0.015] border-white/[0.04] text-zinc-500 opacity-60';
                    }
                  }

                  const letter = String.fromCharCode(65 + displayedIdx); // A, B, C, D

                  return (
                    <button
                      key={displayedIdx}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(displayedIdx)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isAnswerChecked && isCorrect 
                            ? 'bg-emerald-500 text-zinc-950' 
                            : isAnswerChecked && isSelected 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/[0.06] text-zinc-300'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-xs font-medium leading-snug">{opt}</span>
                      </div>

                      {isAnswerChecked && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[2.5] shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrect && (
                        <X className="w-4 h-4 text-red-400 stroke-[2.5] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card when answered */}
              {isAnswerChecked && (
                <div className="bg-white/[0.04] border border-white/[0.09] rounded-xl p-3.5 space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>DGMS Standard Explanation</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {questionObj.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* STAGE 4: PART 2 LEARNING (5 PAGES) */}
        {stage === 'part2' && (
          <div className="space-y-4 text-left animate-fadeIn">
            {/* Header Stage Label */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {course.part2Pages[pageIndex].tag}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {course.pageIndicator} {pageIndex + 1} / {course.part2Pages.length}
              </span>
            </div>

            {/* Title & Standard Code */}
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                {course.part2Pages[pageIndex].title}
              </h2>
              <p className="text-[11px] font-mono text-sky-400 mt-0.5">
                Standard: {course.part2Pages[pageIndex].keyStandard}
              </p>
            </div>

            {/* High-Resolution Graphic / Image Card */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.1] bg-zinc-900 shadow-lg group">
              <img 
                src={course.part2Pages[pageIndex].image} 
                alt={course.part2Pages[pageIndex].title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  e.currentTarget.src = './module_images/module_ppe_hazard_hero.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  Workface Hazard Scan
                </span>
                <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10 text-emerald-300">
                  CMR 2017 Compliant
                </span>
              </div>
            </div>

            {/* Core DGMS Explanation */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {course.part2Pages[pageIndex].description}
              </p>

              {/* Checkpoints */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Critical Workface Hazards:
                </span>
                {course.part2Pages[pageIndex].bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caution Alert Box */}
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-snug">
                <strong className="font-semibold text-red-200">Critical Warning: </strong>
                {course.part2Pages[pageIndex].cautionTip}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 5: QUIZ 2 (RANDOM 3 OF 7 QUESTIONS) */}
        {stage === 'quiz2' && (() => {
          const { questionObj, displayOptions, optionIndices } = getActiveQuizItem();
          return (
            <div className="space-y-4 text-left animate-fadeIn">
              {/* Header Stage Label */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {course.quiz2Title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    10 PTS / Q
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Question {qIndex + 1} / {quiz2Session.length}
                  </span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {questionObj.question}
                </h3>
              </div>

              {/* Options List (dynamically shuffled each attempt) */}
              <div className="space-y-2">
                {displayOptions.map((opt, displayedIdx) => {
                  const originalIdx = optionIndices[displayedIdx];
                  const isSelected = selectedOption === displayedIdx;
                  const isCorrect = originalIdx === questionObj.correctIndex;
                  let cardStyle = 'bg-white/[0.025] border-white/[0.08] text-zinc-200 hover:bg-white/[0.05] hover:border-white/[0.15]';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200';
                    } else if (isSelected) {
                      cardStyle = 'bg-red-500/15 border-red-500/50 text-red-200';
                    } else {
                      cardStyle = 'bg-white/[0.015] border-white/[0.04] text-zinc-500 opacity-60';
                    }
                  }

                  const letter = String.fromCharCode(65 + displayedIdx);

                  return (
                    <button
                      key={displayedIdx}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(displayedIdx)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isAnswerChecked && isCorrect 
                            ? 'bg-emerald-500 text-zinc-950' 
                            : isAnswerChecked && isSelected 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/[0.06] text-zinc-300'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-xs font-medium leading-snug">{opt}</span>
                      </div>

                      {isAnswerChecked && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[2.5] shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrect && (
                        <X className="w-4 h-4 text-red-400 stroke-[2.5] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card when answered */}
              {isAnswerChecked && (
                <div className="bg-white/[0.04] border border-white/[0.09] rounded-xl p-3.5 space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>DGMS Standard Explanation</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {questionObj.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* STAGE 6: RESULTS & DGMS GRADE CERTIFICATION */}
        {stage === 'results' && (
          <div className="space-y-4 text-center py-2 animate-fadeIn">
            {/* Grade Badge Header */}
            <div className={`w-20 h-20 rounded-3xl border flex flex-col items-center justify-center mx-auto shadow-2xl ${gradeInfo.badgeClass}`}>
              <span className="text-2xl font-extrabold font-mono tracking-tight leading-none">
                {gradeInfo.grade}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-1">
                GRADE
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {gradeInfo.label}
              </span>
              <h2 className="text-lg font-bold text-white mt-2">
                PPE &amp; Workface Certification Complete!
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Personnel: <strong className="text-white">{worker?.name || 'Worker'}</strong> ({worker?.worker_id || 'JH-WRK'})
              </p>
            </div>

            {/* Score & Stars Display */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Composite Competency Score</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black font-mono text-amber-400">{totalEarnedScore}</span>
                  <span className="text-xs font-mono text-zinc-400">/ 100 PTS ({totalEarnedScore}%)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">DGMS Rating</span>
                <span className="text-base text-amber-400 font-mono tracking-wider">
                  {'★'.repeat(gradeInfo.stars) + '☆'.repeat(3 - gradeInfo.stars)}
                </span>
              </div>
            </div>

            {/* Detailed Component Breakdown */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block px-1">
                Assessment Score Breakdown:
              </span>

              {/* 1. Scenario */}
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    scenarioScore > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {scenarioScore > 0 ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Field Scenario Critical PPE</span>
                    <span className="text-[10px] text-zinc-400">Practical Workface Assessment</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {scenarioScore} / 40 PTS
                </span>
              </div>

              {/* 2. Quiz 1 */}
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                    Q1
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Part 1: PPE Knowledge Check</span>
                    <span className="text-[10px] text-zinc-400">{quiz1CorrectCount} of 3 Questions Correct (10 pts each)</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {quiz1Score} / 30 PTS
                </span>
              </div>

              {/* 3. Quiz 2 */}
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-xs font-bold">
                    Q2
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Part 2: Workface Hazard Detection</span>
                    <span className="text-[10px] text-zinc-400">{quiz2CorrectCount} of 3 Questions Correct (10 pts each)</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {quiz2Score} / 30 PTS
                </span>
              </div>
            </div>

            {/* Unlocking Alert */}
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 text-left flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-200">
                  Module 2 Unlocked: Fire &amp; Explosion Response
                </p>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Your Grade {gradeInfo.grade} competency has been synchronized to the Central Safety Operations Center.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Footer */}
      <footer className="w-full max-w-md px-4 py-3 bg-[#090A0F]/95 border-t border-white/[0.08] shrink-0 sticky bottom-0 z-20">
        {/* Part 1 & Part 2 Navigation */}
        {(stage === 'part1' || stage === 'part2') && (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={handlePrevPage}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                pageIndex === 0 
                  ? 'bg-white/[0.02] text-zinc-600 cursor-not-allowed border border-white/[0.04]' 
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{course.prevBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition active:scale-[0.99]"
            >
              <span>
                {stage === 'part1' && pageIndex === course.part1Pages.length - 1
                  ? course.startScenarioBtn || 'Begin Scenario (40 Pts)'
                  : stage === 'part2' && pageIndex === course.part2Pages.length - 1
                    ? course.startQuiz2Btn
                    : course.nextBtn}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scenario Stage CTA */}
        {stage === 'scenario' && (
          <div>
            <button
              type="button"
              disabled={!isScenarioChecked}
              onClick={handleStartQuiz1FromScenario}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                !isScenarioChecked
                  ? 'bg-white/[0.03] text-zinc-500 cursor-not-allowed border border-white/[0.06]' 
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <span>{course.continueToQuiz1Btn || 'Continue to Quiz 1'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Quiz 1 & Quiz 2 Navigation */}
        {(stage === 'quiz1' || stage === 'quiz2') && (
          <div>
            <button
              type="button"
              disabled={!isAnswerChecked}
              onClick={handleNextQuizQuestion}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                !isAnswerChecked 
                  ? 'bg-white/[0.03] text-zinc-500 cursor-not-allowed border border-white/[0.06]' 
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <span>
                {stage === 'quiz1' && qIndex === quiz1Session.length - 1
                  ? course.startPart2Btn
                  : stage === 'quiz2' && qIndex === quiz2Session.length - 1
                    ? course.finishCourseBtn
                    : 'Continue'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Results Screen CTA */}
        {stage === 'results' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCompleteAndCertify}
              className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-[0.99]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>SAVE TO DASHBOARD &amp; UNLOCK FIRE SIMULATION</span>
            </button>
            <button
              type="button"
              onClick={handleRestartCourse}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08] flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Training with Fresh Random Questions</span>
            </button>
          </div>
        )}
      </footer>

      {/* Confirmation Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12151E] border border-white/[0.1] rounded-2xl p-5 max-w-xs w-full text-center space-y-4 animate-scaleUp">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Exit Training Module?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Your current module progress will not be saved. Are you sure you want to return to the dashboard?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08]"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
