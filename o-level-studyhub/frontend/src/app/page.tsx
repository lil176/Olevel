"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subject {
  _id: string;
  name: string;
  code: string;
  level: string;
  description: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/subjects")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold">O-Level StudyHub</h1>

          <p className="mt-2 text-blue-100">
            Learn. Practice. Understand. Pass.
          </p>
        </div>
      </header>

      {/* Welcome section */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-900">
          Your O-Level Study Platform
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Study your O-Level subjects, revise important topics, practice
          questions, and track your progress in one place.
        </p>

        {/* Subjects */}
        <h3 className="mt-10 text-2xl font-bold text-slate-900">
          Subjects
        </h3>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h4 className="text-xl font-semibold text-slate-900">
                {subject.name}
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                {subject.description || `Study ${subject.name} for O-Level.`}
              </p>

              <Link
                href={`/subjects/${subject._id}`}
                className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Study Subject
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}