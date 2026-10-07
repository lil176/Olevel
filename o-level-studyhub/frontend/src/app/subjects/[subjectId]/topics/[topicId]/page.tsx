"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

interface Note {
  _id: string;
  title: string;
  content: string;
  topic: string;
}

export default function TopicPage() {
  const params = useParams();

  const subjectId = params.subjectId as string;
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId || !topicId) return;

    // Get topic information
    fetch(`http://localhost:5000/api/topics/subject/${subjectId}`)
      .then((response) => response.json())
      .then((data) => {
        const selectedTopic = data.find(
          (item: Topic) => item._id === topicId
        );

        setTopic(selectedTopic || null);
      })
      .catch((error) => {
        console.error("Failed to fetch topic:", error);
      });

    // Get notes for this topic
    fetch(`http://localhost:5000/api/notes/topic/${topicId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load notes.");
        }

        return response.json();
      })
      .then((data) => {
        setNotes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
        setNotesError("Notes could not be loaded. Please try again later.");
      })
      .finally(() => {
        setNotesLoading(false);
      });
  }, [subjectId, topicId]);

  if (!topic) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-slate-600">Loading topic...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">

        {/* Topic heading */}
        <div className="rounded-2xl bg-blue-700 p-8 text-white">
          <p className="text-sm font-medium text-blue-200">
            {topic.subject.name}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {topic.name}
          </h1>

          <p className="mt-4 text-blue-100">
            {topic.description}
          </p>
        </div>

        {/* Study options */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Study Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              📚 Study Notes
            </h2>

            <p className="mt-2 text-slate-600">
              {notes.length} {notes.length === 1 ? "study note" : "study notes"} for this topic.
            </p>

            <button
              onClick={() => setShowNotes(!showNotes)}
              aria-expanded={showNotes}
              aria-controls="topic-notes"
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              {showNotes ? "Hide Notes" : "Open Notes"}
            </button>
          </div>

          {/* Practice */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              📝 Practice
            </h2>

            <p className="mt-2 text-slate-600">
              Test your knowledge with practice questions.
            </p>

            <Link
              href={`/subjects/${subjectId}/topics/${topicId}/practice`}
              className="mt-5 inline-block rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              Practice
            </Link>
          </div>

          {/* Exam Tips */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              💡 Exam Tips
            </h2>

            <p className="mt-2 text-slate-600">
              Learn useful tips for answering exam questions.
            </p>

            <button className="mt-5 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700">
              View Tips
            </button>
          </div>

        </div>

        {/* Notes */}
        {showNotes && (
          <section id="topic-notes" className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                📚 {topic.name} Notes
              </h2>
              {!notesLoading && !notesError && (
                <p className="text-sm text-slate-500">
                  {notes.length} {notes.length === 1 ? "section" : "sections"}
                </p>
              )}
            </div>

            {notesLoading ? (
              <p className="mt-4 text-slate-600">Loading notes...</p>
            ) : notesError ? (
              <p role="alert" className="mt-4 text-red-700">
                {notesError}
              </p>
            ) : notes.length === 0 ? (
              <p className="mt-4 text-slate-600">
                No notes have been added for this topic yet.
              </p>
            ) : (
              <div className="mt-6 divide-y divide-slate-200">
                {notes.map((note, index) => (
                  <article key={note._id} className="py-6 first:pt-0 last:pb-0">
                    <h3 className="text-xl font-bold text-slate-900">
                      <span className="mr-3 text-sm font-semibold text-blue-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {note.title}
                    </h3>

                    <div className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                      {note.content}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}