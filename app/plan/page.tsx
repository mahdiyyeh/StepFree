"use client";

import { useState } from "react";
import { PlanResponse } from "@/lib/schema";

interface ApiResponse {
  ok: boolean;
  data?: PlanResponse;
  error?: string;
  debug?: {
    model?: string;
    latency_ms?: number;
    repaired?: boolean;
    rawResponse?: string;
    validationErrors?: string[];
  };
}

export default function Home() {
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    dateTime: "",
    stepFreeOnly: false,
    avoidStairs: false,
    lowSensory: false,
    wheelchairUser: false,
    maxWalkingMins: "",
    disruption: "none",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setCopied(false);

    try {
      // Format needs string from checkboxes
      const needsParts: string[] = [];
      if (formData.stepFreeOnly) needsParts.push("Step-free access only");
      if (formData.avoidStairs) needsParts.push("Avoid stairs");
      if (formData.lowSensory) needsParts.push("Low sensory environment preferred");
      if (formData.wheelchairUser) needsParts.push("Wheelchair user");
      if (formData.maxWalkingMins) {
        needsParts.push(`Maximum walking time: ${formData.maxWalkingMins} minutes`);
      }
      const needs = needsParts.length > 0 ? needsParts.join(". ") : undefined;

      // Format disruption
      const disruptionMap: Record<string, string> = {
        none: "",
        lift_out: "Lift out of service",
        too_crowded: "Too crowded",
        raining: "Raining",
        tired: "Tired/fatigue concerns",
      };
      const disruption = formData.disruption !== "none" ? disruptionMap[formData.disruption] : undefined;

      const apiResponse = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: formData.start,
          destination: formData.destination,
          dateTime: formData.dateTime || undefined,
          needs,
          disruption,
        }),
      });

      const data: ApiResponse = await apiResponse.json();

      if (!apiResponse.ok || !data.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyStaffScript = async () => {
    if (!response?.data?.staff_script) return;

    const scriptText = response.data.staff_script.join("\n");
    try {
      await navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* London Underground Map Background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Line - Red */}
          <path
            d="M 100 400 L 300 400 L 500 300 L 700 300 L 900 400 L 1100 400"
            stroke="#DC143C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Circle Line - Yellow */}
          <circle
            cx="600"
            cy="400"
            r="200"
            stroke="#FFD300"
            strokeWidth="8"
            fill="none"
          />
          {/* Northern Line - Black */}
          <path
            d="M 200 100 L 400 200 L 600 300 L 800 200 L 1000 100"
            stroke="#000000"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Piccadilly Line - Dark Blue */}
          <path
            d="M 150 500 L 350 500 L 550 600 L 750 600 L 950 500 L 1050 450"
            stroke="#003688"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* District Line - Green */}
          <path
            d="M 100 300 L 250 350 L 450 450 L 650 450 L 850 350 L 1000 300"
            stroke="#00782A"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Victoria Line - Light Blue */}
          <path
            d="M 300 200 L 500 250 L 700 250 L 900 200"
            stroke="#0098D4"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Jubilee Line - Silver/Gray */}
          <path
            d="M 400 100 L 600 150 L 800 150 L 1000 100"
            stroke="#A0A5A9"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hammersmith & City Line - Pink */}
          <path
            d="M 150 400 L 350 450 L 550 500 L 750 500 L 950 450 L 1050 400"
            stroke="#F3A9BB"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Metropolitan Line - Magenta */}
          <path
            d="M 200 500 L 400 550 L 600 550 L 800 500"
            stroke="#9B0056"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Bakerloo Line - Brown */}
          <path
            d="M 250 250 L 450 300 L 650 350 L 850 350 L 950 300"
            stroke="#B36305"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-105 transition-transform ring-2 ring-green-500/30">
            <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            Step Free
          </h1>
          <p className="text-xl lg:text-2xl font-medium text-gray-200 mb-2">Plan step-free. Replan fast.</p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-500/30 shadow-lg">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Supporting Transport for All</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8 mb-8 lg:mb-10 transform transition-all hover:shadow-green-900/20 hover:border-green-600/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-700">
            <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/30">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-100">Journey Details</h2>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <div className="space-y-1">
              <label htmlFor="start" className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Start Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="start"
                required
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-600"
                placeholder="e.g., King's Cross Station"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="destination" className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Destination <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="destination"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-600"
                placeholder="e.g., London Bridge"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="dateTime" className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-1">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700 text-gray-100 focus:bg-gray-600"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Accessibility Needs
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 border-gray-600 hover:border-green-500 hover:bg-green-900/20 transition-all bg-gray-700">
                <input
                  type="checkbox"
                  checked={formData.stepFreeOnly}
                  onChange={(e) => setFormData({ ...formData, stepFreeOnly: e.target.checked })}
                  className="w-5 h-5 text-green-500 border-gray-500 rounded focus:ring-green-500 bg-gray-600"
                />
                <span className="text-sm font-medium text-gray-200">Step-free only</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 border-gray-600 hover:border-green-500 hover:bg-green-900/20 transition-all bg-gray-700">
                <input
                  type="checkbox"
                  checked={formData.avoidStairs}
                  onChange={(e) => setFormData({ ...formData, avoidStairs: e.target.checked })}
                  className="w-5 h-5 text-green-500 border-gray-500 rounded focus:ring-green-500 bg-gray-600"
                />
                <span className="text-sm font-medium text-gray-200">Avoid stairs</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 border-gray-600 hover:border-green-500 hover:bg-green-900/20 transition-all bg-gray-700">
                <input
                  type="checkbox"
                  checked={formData.lowSensory}
                  onChange={(e) => setFormData({ ...formData, lowSensory: e.target.checked })}
                  className="w-5 h-5 text-green-500 border-gray-500 rounded focus:ring-green-500 bg-gray-600"
                />
                <span className="text-sm font-medium text-gray-200">Low sensory</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 border-gray-600 hover:border-green-500 hover:bg-green-900/20 transition-all bg-gray-700">
                <input
                  type="checkbox"
                  checked={formData.wheelchairUser}
                  onChange={(e) => setFormData({ ...formData, wheelchairUser: e.target.checked })}
                  className="w-5 h-5 text-green-500 border-gray-500 rounded focus:ring-green-500 bg-gray-600"
                />
                <span className="text-sm font-medium text-gray-200">Wheelchair user</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <div className="space-y-1">
              <label htmlFor="maxWalkingMins" className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Max Walking Time (minutes)
              </label>
              <input
                type="number"
                id="maxWalkingMins"
                min="0"
                value={formData.maxWalkingMins}
                onChange={(e) => setFormData({ ...formData, maxWalkingMins: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-600"
                placeholder="e.g., 10"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="disruption" className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Known Disruption
              </label>
              <select
                id="disruption"
                value={formData.disruption}
                onChange={(e) => setFormData({ ...formData, disruption: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700 text-gray-100 focus:bg-gray-600"
              >
                <option value="none" className="bg-gray-700">None</option>
                <option value="lift_out" className="bg-gray-700">Lift out of service</option>
                <option value="too_crowded" className="bg-gray-700">Too crowded</option>
                <option value="raining" className="bg-gray-700">Raining</option>
                <option value="tired" className="bg-gray-700">Tired/fatigue concerns</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Selecting a disruption will trigger backup planning for alternative routes
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 group relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl shadow-green-900/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating step-free plan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate step-free plan
                </span>
              )}
            </button>
            {response?.data && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="flex-1 sm:flex-initial bg-gray-700 border-2 border-gray-600 text-gray-200 py-3.5 px-6 rounded-xl font-semibold hover:border-green-500 hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? "Replanning..." : "Replan"}
              </button>
            )}
          </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-12 text-center transform transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-2xl mb-6 ring-2 ring-green-700/30">
              <svg className="animate-spin h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Generating your journey plan</h3>
            <p className="text-gray-400">Creating an accessibility-first route with backup options...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/80 border-l-4 border-red-600 text-red-200 p-4 rounded-lg shadow-lg mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">Error</p>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {response?.data && (
          <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom">
            {/* Summary & Assumptions */}
            <section className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8 transform transition-all hover:shadow-green-900/20 hover:border-green-600/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-700">
                <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Summary</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">{response.data.summary}</p>

              {response.data.assumptions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Assumptions</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {response.data.assumptions.map((assumption, idx) => (
                      <li key={idx}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Confidence Score */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b-2 border-gray-700">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="p-2 bg-gray-700 rounded-lg shadow-sm ring-1 ring-green-700/30">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Confidence</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl text-2xl font-bold shadow-lg ring-2 ${
                    response.data.confidence_score >= 80 ? 'bg-green-600 text-white ring-green-500/50' :
                    response.data.confidence_score >= 60 ? 'bg-yellow-500 text-white ring-yellow-400/50' :
                    'bg-orange-500 text-white ring-orange-400/50'
                  }`}>
                    {response.data.confidence_score}
                  </span>
                  <span className="text-lg font-semibold text-gray-200">%</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{response.data.confidence_rationale}</p>
            </section>

            {/* Primary Plan */}
            <section className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-700">
                <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Primary Plan</h2>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-green-400 mb-6 px-2">{response.data.primary_plan.title}</h3>

              <div className="space-y-4 lg:space-y-5">
                {response.data.primary_plan.steps.map((step, idx) => (
                  <div key={idx} className="border-2 border-gray-600 rounded-xl p-5 lg:p-6 hover:border-green-500 hover:shadow-lg transition-all bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ring-2 ring-green-500/30">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">{step.title}</h4>
                        <p className="text-gray-300 mb-3">{step.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-400">Time: </span>
                            <span className="text-gray-200">{step.estimated_time_mins} min</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Walking: </span>
                            <span className="text-gray-200">{step.walking_mins} min</span>
                          </div>
                        </div>

                        {step.accessibility_notes.length > 0 && (
                          <div className="mt-3 bg-green-900/30 rounded-md p-3 border border-green-700/30">
                            <p className="text-sm font-semibold text-green-300 mb-1">♿ Accessibility Notes</p>
                            <ul className="list-disc list-inside text-sm text-green-200 space-y-1">
                              {step.accessibility_notes.map((note, noteIdx) => (
                                <li key={noteIdx}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.sensory_notes.length > 0 && (
                          <div className="mt-3 bg-blue-900/30 rounded-md p-3 border border-blue-700/30">
                            <p className="text-sm font-semibold text-blue-300 mb-1">🔊 Sensory Notes</p>
                            <ul className="list-disc list-inside text-sm text-blue-200 space-y-1">
                              {step.sensory_notes.map((note, noteIdx) => (
                                <li key={noteIdx}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.risk_flags.length > 0 && (
                          <div className="mt-3 bg-yellow-900/30 rounded-md p-3 border border-yellow-700/30">
                            <p className="text-sm font-semibold text-yellow-300 mb-1">⚠️ Risk Flags</p>
                            <ul className="list-disc list-inside text-sm text-yellow-200 space-y-1">
                              {step.risk_flags.map((flag, flagIdx) => (
                                <li key={flagIdx}>{flag}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Backup Plans */}
            <section className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-700">
                <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-700/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Backup Plans</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {response.data.backup_plans.map((backup, idx) => (
                  <div key={idx} className="border-2 border-gray-600 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all bg-gradient-to-br from-gray-700 to-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      Backup {idx + 1}: {backup.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 italic">{backup.reason}</p>
                    <div className="space-y-2">
                      {backup.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="text-sm text-gray-300">
                          <span className="font-medium">{stepIdx + 1}. {step.title}</span>
                          <p className="text-gray-400 ml-4">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Staff Script */}
            <section className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b-2 border-gray-700">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-700/30">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Staff Script</h2>
                </div>
                <button
                  onClick={copyStaffScript}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-105 shadow-lg shadow-green-900/50"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy script
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-gray-600">
                {response.data.staff_script.map((line, idx) => (
                  <p key={idx} className="text-gray-300 mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </section>

            {/* Before You Leave Checklist */}
            <section className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-700">
                <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Before You Leave Checklist</h2>
              </div>
              <div className="space-y-2">
                {response.data.before_you_leave_checklist.map((item, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer hover:bg-green-900/20 p-3 rounded-lg border-2 border-transparent hover:border-green-700/50 transition-all bg-gray-700">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-green-500 border-gray-500 rounded focus:ring-green-500 bg-gray-600"
                    />
                    <span className="text-gray-200 font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Risk Flags */}
            {response.data.risk_flags.length > 0 && (
              <section className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 rounded-xl p-5 lg:p-6 shadow-2xl border-r border-t border-b border-yellow-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-900/50 rounded-lg border border-yellow-700/30">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-yellow-300">Risk Flags</h2>
                </div>
                <ul className="list-disc list-inside space-y-1 text-yellow-200">
                  {response.data.risk_flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Debug Accordion */}
            {response.debug && (
              <details className="bg-gray-800 rounded-lg shadow-lg border-2 border-gray-700 p-4 lg:p-6">
                <summary className="cursor-pointer font-semibold text-gray-200 mb-2">
                  Debug Information
                </summary>
                <div className="mt-4 space-y-4 pt-4 border-t border-gray-600">
                  {response.debug.model && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">Model: {response.debug.model}</p>
                    </div>
                  )}
                  {response.debug.latency_ms !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        Latency: {response.debug.latency_ms}ms
                      </p>
                    </div>
                  )}
                  {response.debug.repaired !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        Repaired: {response.debug.repaired ? "Yes" : "No"}
                      </p>
                    </div>
                  )}
                  {response.debug.rawResponse && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">Raw Response:</p>
                      <pre className="text-xs bg-gray-900 p-3 rounded border border-gray-600 overflow-auto max-h-64 text-gray-300">
                        {response.debug.rawResponse}
                      </pre>
                    </div>
                  )}
                  {response.debug.validationErrors && response.debug.validationErrors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">Validation Errors:</p>
                      <ul className="list-disc list-inside text-sm text-red-400">
                        {response.debug.validationErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
