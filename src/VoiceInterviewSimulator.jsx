import React, { useState, useEffect, useRef } from "react";

export default function VoiceInterviewSimulator() {
  const [question, setQuestion] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);

  // Question dataset
  const questions = [
  {
    question:
      "Explain binary search. Why does it require a sorted array and what is its time complexity?",
    keywords: ["sorted", "mid", "log", "divide", "left", "right"]
  },
  {
    question:
      "What is the difference between linear search and binary search in terms of time complexity?",
    keywords: ["o(n)", "log", "sorted", "comparison"]
  },
  {
    question:
      "Explain the time and space complexity of merge sort.",
    keywords: ["divide", "conquer", "log", "n log n", "extra space"]
  },
  {
    question:
      "What is recursion? Explain the role of base condition.",
    keywords: ["function", "calls itself", "base case", "stack"]
  },
  {
    question:
      "Explain Kadane's Algorithm for maximum subarray sum.",
    keywords: ["current sum", "maximum", "iterate", "reset", "array"]
  },
  {
    question:
      "What is time complexity? Compare O(n), O(log n), and O(n^2).",
    keywords: ["growth", "input size", "linear", "logarithmic", "quadratic"]
  },
  {
    question:
      "What is a two pointer technique? Give an example problem.",
    keywords: ["left", "right", "array", "sorted", "optimize"]
  }
];


  // Setup Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  // Ask Question (Text + Voice)
  const askQuestion = () => {
    const random = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(random);
    setTranscript("");
    setFeedback("");

    const speech = new SpeechSynthesisUtterance(random.question);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current.stop();
    evaluateAnswer();
  };

  // Evaluate Answer
  const evaluateAnswer = () => {
  if (!question) return;

  const answer = transcript.toLowerCase();

  let matched = [];
  let missed = [];

  question.keywords.forEach((word) => {
    if (answer.includes(word)) {
      matched.push(word);
    } else {
      missed.push(word);
    }
  });

  const percentage =
    (matched.length / question.keywords.length) * 100;

  let result = "";
  if (percentage > 75) {
    result = "Excellent technical coverage!";
  } else if (percentage > 40) {
    result = "Good attempt. Add more technical clarity.";
  } else {
    result = "Needs improvement. Cover core concepts clearly.";
  }

  setFeedback({
    score: percentage.toFixed(0),
    result,
    matched,
    missed
  });
};


  return (
  <div className="container">
    <h1 className="title">🎤 AI Voice Interview Simulator</h1>

    <button className="button" onClick={askQuestion}>
      Ask Question
    </button>

    {question && (
      <>
        <div className="question-box">
          <strong>Question:</strong>
          <p>{question.question}</p>
        </div>

        <button className="button" onClick={startListening}>
          Start Answering
        </button>

        <button
          className="button button-danger"
          onClick={stopListening}
        >
          Stop & Evaluate
        </button>

        <div className="answer-box">
          <strong>Your Answer:</strong>
          <p>{transcript || "Start speaking..."}</p>
        </div>

        {feedback && (
  <div className="feedback-box">
    <strong>Score:</strong> {feedback.score}%  
    <p>{feedback.result}</p>

    <div style={{ marginTop: "10px" }}>
      <strong>✅ Covered Keywords:</strong>
      <p>
        {feedback.matched.length > 0
          ? feedback.matched.join(", ")
          : "None"}
      </p>
    </div>

    <div style={{ marginTop: "10px" }}>
      <strong>❌ Missing Keywords:</strong>
      <p>
        {feedback.missed.length > 0
          ? feedback.missed.join(", ")
          : "None"}
      </p>
    </div>
  </div>
)}

      </>
    )}
  </div>
);

}
