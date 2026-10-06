"use client";

import { useEffect, useState } from "react";

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
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/topics")
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      })
      .catch((error) => {
        console.error("Failed to fetch topics:", error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Mathematics
        </h1>

        <p className="mt-2 text-slate-600">
          Choose a topic to start studying.
        </p>

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
                {topic.description}
              </p>

              <button className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                Study Topic
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}