"use client";

import { useState, useRef, useEffect } from "react";
import { IconMic } from "@/components/ui/Icons";

export default function VoiceButton({
  lang = "auto",
  onTranscript,
  isStreaming = false,
  className = "",
  variant = "default",
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup audio stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (isRecording || isProcessing || isStreaming) return;
    setErrorMsg("");

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported by your browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : undefined,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Release mic stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (audioBlob.size > 0) {
          await handleTranscribe(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Microphone permission denied."
          : err.message || "Failed to start audio recording."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Fallback
      }
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (audioBlob) => {
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("lang", lang);

      const response = await fetch("/api/agent/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Transcription failed (${response.status})`);
      }

      const data = await response.json();
      if (data.transcript && onTranscript) {
        onTranscript(data.transcript);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to transcribe audio.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Visual audio pulse rings */}
      {isRecording && (
        <span
          className="absolute -inset-1.5 rounded-full bg-emerald-500/30 animate-ping motion-reduce:animate-none pointer-events-none"
          aria-hidden="true"
        />
      )}
      {isRecording && (
        <span
          className="absolute -inset-1 rounded-full border border-emerald-600/50 animate-pulse motion-reduce:animate-none pointer-events-none"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={toggleRecording}
        disabled={isProcessing || isStreaming}
        aria-pressed={isRecording}
        aria-label={
          isRecording
            ? "Stop audio recording"
            : isProcessing
            ? "Transcribing voice audio..."
            : "Voice input: press to speak in English, Hindi, or Marathi"
        }
        className={
          variant === "pill"
            ? `relative z-10 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-150 active:scale-95 shadow-xs cursor-pointer border ${
                isRecording
                  ? "bg-rose-500 text-white border-rose-600 scale-105 animate-pulse shadow-md"
                  : isProcessing
                  ? "bg-zinc-100 text-zinc-500 border-zinc-300 cursor-wait"
                  : "bg-white text-zinc-800 border-zinc-300 hover:bg-emerald-50/70 hover:border-emerald-400 hover:text-emerald-800"
              } disabled:opacity-40 disabled:cursor-not-allowed`
            : `relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-[0.93] shadow-xs cursor-pointer ${
                isRecording
                  ? "bg-rose-500 text-white shadow-rose-500/30 scale-105 animate-pulse"
                  : isProcessing
                  ? "bg-zinc-100 text-zinc-400 cursor-wait"
                  : "bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              } disabled:opacity-40 disabled:cursor-not-allowed`
        }
      >
        {isProcessing ? (
          <>
            <svg
              className="w-4 h-4 animate-spin motion-reduce:animate-none text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            {variant === "pill" && <span className="text-xs">Transcribing...</span>}
          </>
        ) : isRecording ? (
          <>
            <div className="w-2.5 h-2.5 rounded-xs bg-white" />
            {variant === "pill" && <span className="text-xs font-semibold">Listening...</span>}
          </>
        ) : (
          <>
            <IconMic className="w-4 h-4 text-emerald-600" />
            {variant === "pill" && <span className="text-zinc-800 font-medium">Voice</span>}
          </>
        )}
      </button>

      {errorMsg && (
        <span
          role="alert"
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-xl shadow-xs font-semibold"
        >
          {errorMsg}
        </span>
      )}
    </div>
  );
}
