"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Subject {
  _id: string;
  name: string;
  code: string;
  level: string;
  description: string;
}

interface Topic {
  _id: string;
  name: string;
  description: string;
  subject: {
    _id: string;
    name: string;
    code: string;
  };
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (!subjectId) return;

    // Get subject information
    fetch("http://localhost:5000/api/subjects")
      .then((response) => response.json())
      .then((data) => {
        const selectedSubject = data.find(
          (item: Subject) => item._id === subjectId
        );

        setSubject(selectedSubject || null);
      })
      .catch((error) => {
        console.error("Failed to fetch subject:", error);
      });

    // Get topics for this subject
    fetch(`http://localhost:5000/api/topics/subject/${subjectId}`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      })
      .catch((error) => {
        console.error("Failed to fetch topics:", error);
      });
  }, [subjectId]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Subject heading */}
        <h1 className="text-3xl font-bold text-slate-900">
          {subject ? subject.name : "Loading subject..."}
        </h1>

        <p className="mt-2 text-slate-600">
          Choose a topic to start studying.
        </p>

        {/* Topics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {topic.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {topic.description ||
                  "Study this topic and improve your understanding."}
              </p>

              <Link
                href={`/subjects/${subjectId}/topics/${topic._id}`}
                className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Study Topic
              </Link>
            </div>
          ))}
        </div>

        {/* No topics message */}
        {topics.length === 0 && subject && (
          <p className="mt-8 text-slate-500">
            No topics have been added for this subject yet.
          </p>
        )}
      </div>
    </main>
  );
}