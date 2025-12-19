// ...WellnessPlan route component placeholder...
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/breathing.css";

export default function BreathingExercise() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(5);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const runningRef = useRef(false);
  const timerRef = useRef(null);

  /* ---------------- SPEECH ---------------- */

  const speak = (text, onEnd) => {
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    msg.pitch = 1;
    msg.volume = 1;
    msg.onend = onEnd || null;

    window.speechSynthesis.speak(msg);
  };

  const speakInstructions = (cb) => {
    speak(
      "Welcome to the breathing exercise. Relax your body. Follow my voice.",
      cb
    );
  };

  /* ---------------- BREATH ENGINE ---------------- */

  const runBreathCycle = (currentPhase, currentCount = 1) => {
    if (!runningRef.current) return;

    setPhase(currentPhase);
    setCount(currentCount);

    speak(String(currentCount), () => {
      if (!runningRef.current) return;

      if (currentCount < 5) {
        runBreathCycle(currentPhase, currentCount + 1);
      } else {
        const nextPhase = currentPhase === "inhale" ? "exhale" : "inhale";
        const phaseText =
          nextPhase === "inhale" ? "Breathe in" : "Breathe out";

        speak(phaseText, () => {
          runBreathCycle(nextPhase, 1);
        });
      }
    });
  };

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          stopExercise();
          alert("Breathing exercise complete. Well done.");
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, totalSeconds]);

  /* ---------------- CONTROLS ---------------- */

  const startExercise = () => {
    runningRef.current = true;
    setRunning(true);

    if (elapsedTime === 0) {
      setTotalSeconds(duration * 60);

      speakInstructions(() => {
        speak("Breathe in", () => {
          runBreathCycle("inhale", 1);
        });
      });
    } else {
      const phaseText = phase === "inhale" ? "Breathe in" : "Breathe out";
      speak(phaseText, () => {
        runBreathCycle(phase, count || 1);
      });
    }
  };

  const pauseExercise = () => {
    runningRef.current = false;
    setRunning(false);
    window.speechSynthesis.cancel();
  };

  const stopExercise = () => {
    runningRef.current = false;
    setRunning(false);
    setPhase("inhale");
    setCount(0);
    setElapsedTime(0);
    window.speechSynthesis.cancel();

    if (timerRef.current) clearInterval(timerRef.current);
  };

  /* ---------------- HELPERS ---------------- */

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const remainingTime = totalSeconds - elapsedTime;

  /* ---------------- UI ---------------- */

  return (
    <div className="breathing-container">
      <button onClick={() => navigate("/")}>← Back</button>

      <h2>Breathing Exercise</h2>

      {!running && elapsedTime === 0 && (
        <select value={duration} onChange={(e) => setDuration(+e.target.value)}>
          <option value={1}>1 minute</option>
          <option value={3}>3 minutes</option>
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
        </select>
      )}

      {totalSeconds > 0 && (
        <div>Time Remaining: {formatTime(remainingTime)}</div>
      )}

      <p className="phase">
        {phase === "inhale" ? "Breathe In" : "Breathe Out"}
      </p>

      <div className={`circle ${phase}`} />

      {running && count > 0 && <div className="count">{count}</div>}

      <div className="buttons">
        {!running && elapsedTime === 0 ? (
          <button onClick={startExercise}>Start</button>
        ) : !running ? (
          <>
            <button onClick={startExercise}>Resume</button>
            <button onClick={stopExercise}>Stop</button>
          </>
        ) : (
          <>
            <button onClick={pauseExercise}>Pause</button>
            <button onClick={stopExercise}>Stop</button>
          </>
        )}
      </div>
    </div>
  );
}