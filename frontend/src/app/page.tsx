"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [cloned, setCloned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ Important for hydration

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem("cloneHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, [mounted]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !isValidUrl(url)) {
      setMessage("❌ Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setMessage("");
    setCloned(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/clone-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok) {
        setCloned(true);
        setMessage(data.message);
        const updated = [url, ...history];
        setHistory(updated);
        localStorage.setItem("cloneHistory", JSON.stringify(updated));
      } else {
        setMessage(data.detail || "Failed to clone website.");
      }
    } catch (err) {
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <button
        className="absolute top-4 right-4 text-sm px-3 py-1 bg-gray-600 text-white rounded-md"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 flex items-center gap-3">
          🌐 Website Cloner
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a website URL"
            className="px-4 py-2 rounded-lg text-black w-72 sm:w-96"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors text-white"
          >
            Clone
          </button>
        </form>

        {loading && (
          <p className="text-blue-400 mt-4 animate-pulse">
            Cloning site, please wait...
          </p>
        )}

        {message && (
          <p
            className={`mt-4 text-lg font-medium ${
              cloned ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {cloned && (
          <iframe
            src="http://127.0.0.1:8000/cloned"
            className="mt-6 w-full max-w-6xl h-[600px] border rounded-lg"
          ></iframe>
        )}

        {history.length > 0 && (
          <div className="mt-10 text-left w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-2">🔁 Clone History:</h2>
            <ul className="list-disc list-inside space-y-1">
              {history.map((h, i) => (
                <li key={i} className="text-blue-300 underline">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
