"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function PracticePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const topicId = params.topicId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`http://localhost:5000/api/questions/topic/${topicId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load practice questions.");
        }

        return response.json();
      })
      .then((data: Question[]) => {
        setQuestions(data);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") {
          console.error("Failed to fetch practice questions:", fetchError);
          setError("Questions could not be loaded. Please try again later.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [topicId]);

  const currentQuestion = questions[currentIndex];
  const isComplete = !loading && !error && questions.length > 0 && currentIndex >= questions.length;
  const percentage = questions.length === 0 ? 0 : Math.round((score / questions.length) * 100);

  function submitAnswer() {
    if (!currentQuestion || !selectedAnswer || submitted) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    }

    setSubmitted(true);
  }

  function nextQuestion() {
    if (!submitted) return;

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
  }

  function tryAgain() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/subjects/${subjectId}/topics/${topicId}`}
          className="inline-flex items-center gap-2 font-medium text-blue-700 hover:text-blue-900"
        >
          <span aria-hidden="true">←</span> Back to topic
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Topic practice
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Practice Questions
              </h1>
            </div>
            {currentQuestion && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {loading ? (
            <p className="mt-8 text-slate-600">Loading questions...</p>
          ) : error ? (
            <p role="alert" className="mt-8 text-red-700">{error}</p>
          ) : questions.length === 0 ? (
            <p className="mt-8 text-slate-600">
              No practice questions have been added for this topic yet.
            </p>
          ) : isComplete ? (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Practice Complete</h2>
              <p className="mt-6 text-lg text-slate-700">Score:</p>
              <p className="text-4xl font-bold text-blue-700">
                {score} / {questions.length}
              </p>
              <p className="mt-4 text-lg text-slate-700">Percentage:</p>
              <p className="text-3xl font-bold text-slate-900">{percentage}%</p>
              <button
                type="button"
                onClick={tryAgain}
                className="mt-8 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Try Again
              </button>
            </div>
          ) : currentQuestion ? (
            <div className="mt-8">
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{Math.round((currentIndex / questions.length) * 100)}% complete</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Practice progress"
                  aria-valuemin={0}
                  aria-valuemax={questions.length}
                  aria-valuenow={currentIndex}
                  className="h-2 overflow-hidden rounded-full bg-slate-200"
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold leading-8 text-slate-900">
                {currentQuestion.question}
              </h2>

              <div role="radiogroup" aria-label="Answer options" className="mt-6 space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = submitted && option === currentQuestion.correctAnswer;
                  const isIncorrectSelection = submitted && isSelected && !isCorrect;
                  const optionStyle = isCorrect
                    ? "border-green-600 bg-green-50 text-green-900"
                    : isIncorrectSelection
                      ? "border-red-600 bg-red-50 text-red-900"
                      : isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50";

                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={submitted}
                      onClick={() => setSelectedAnswer(option)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                        {isCorrect ? "✓" : isIncorrectSelection ? "×" : isSelected ? "•" : ""}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  role="status"
                  className={`mt-6 rounded-xl border p-4 ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? "border-green-200 bg-green-50 text-green-900"
                      : "border-red-200 bg-red-50 text-red-900"
                  }`}
                >
                  <p className="font-bold">
                    {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite."}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Correct answer: </span>
                    {currentQuestion.correctAnswer}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="mt-2">{currentQuestion.explanation}</p>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {submitted ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                    className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}