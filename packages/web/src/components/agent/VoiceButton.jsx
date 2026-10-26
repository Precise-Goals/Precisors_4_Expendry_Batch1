"use client";

import { useState, useRef, useEffect } from "react";

export default function VoiceButton({
  lang = "en",
  onTranscript,
  isStreaming = false,
  className = "",
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
          className="absolute -inset-1.5 rounded-full bg-[#26d464]/30 animate-ping motion-reduce:animate-none pointer-events-none"
          aria-hidden="true"
        />
      )}
      {isRecording && (
        <span
          className="absolute -inset-1 rounded-full border border-[#26d464]/50 animate-pulse motion-reduce:animate-none pointer-events-none"
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
        className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          isRecording
            ? "bg-red-500 text-white shadow-red-500/20 scale-105"
            : isProcessing
            ? "bg-neutral-800 text-neutral-400 cursor-wait"
            : "bg-neutral-900 border border-neutral-750 text-[#26d464] hover:bg-neutral-800 hover:border-[#26d464]/50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <svg
            className="w-5 h-5 animate-spin motion-reduce:animate-none text-[#26d464]"
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
        ) : isRecording ? (
          <div className="w-3.5 h-3.5 rounded-xs bg-white" />
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z"
            />
          </svg>
        )}
      </button>

      {errorMsg && (
        <span
          role="alert"
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] bg-red-950/90 text-red-300 border border-red-800/60 px-2 py-0.5 rounded shadow"
        >
          {errorMsg}
        </span>
      )}
    </div>
  );
}
