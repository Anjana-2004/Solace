// src/pages/Quiz.js
import React, { useState } from 'react';
import './Quiz.css';

const questions = [
  {
    id: 1,
    question: "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?"
  },
  {
    id: 2,
    question: "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?"
  },
  {
    id: 3,
    question: "Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?"
  },
  {
    id: 4,
    question: "Over the last 2 weeks, how often have you felt tired or had little energy?"
  },
  {
    id: 5,
    question: "Over the last 2 weeks, how often have you had poor appetite or overeating?"
  },
  {
    id: 6,
    question: "Over the last 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?"
  },
  {
    id: 7,
    question: "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or watching television?"
  },
  {
    id: 8,
    question: "Over the last 2 weeks, how often have you been moving or speaking so slowly that others might have noticed? Or the opposite – being so fidgety or restless?"
  },
  {
    id: 9,
    question: "Over the last 2 weeks, how often have you had thoughts that you would be better off dead or of hurting yourself?"
  }
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResultModal, setShowResultModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswerChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    // Check if the current question has an answer
    if (answers[currentQuestionIndex] === null) {
      alert("Please select an answer before proceeding.");
      return;
    }

    // If not on the last question, move to the next one
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If on the last question, calculate the score and show the modal
      const score = answers.reduce((acc, curr) => acc + curr, 0);
      setTotalScore(score);
      setShowResultModal(true);
    }
  };

  // Function to generate an assessment based on total score.
  // (These ranges follow the typical PHQ-9 interpretation.)
  const getAssessment = () => {
    if (totalScore <= 4) {
      return "Minimal or no depressive symptoms. Your mental health appears to be within a normal range.";
    } else if (totalScore <= 9) {
      return "Mild symptoms of depression. You seem to be doing relatively well, but monitor your feelings.";
    } else if (totalScore <= 14) {
      return "Moderate symptoms of depression. It might be helpful to talk to someone about how you feel.";
    } else if (totalScore <= 19) {
      return "Moderately severe symptoms. We recommend seeking professional advice.";
    } else {
      return "Severe symptoms. Please consider seeking professional help immediately.";
    }
  };

  const closeModal = () => {
    setShowResultModal(false);
    // Optionally, reset quiz state here if you want to allow retakes.
  };

  return (
    <div className="quiz-container">
      <h1>Mental Health Assessment Quiz</h1>
      <div className="question-container">
        <h2>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p>{questions[currentQuestionIndex].question}</p>
        <div className="options-container">
          {options.map((option) => (
            <label key={option.value} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option.value}
                checked={answers[currentQuestionIndex] === option.value}
                onChange={handleAnswerChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleNext} className="next-btn">
        {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
      </button>

      {showResultModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Result</h2>
            <p>{getAssessment()}</p>
            <button onClick={closeModal} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
