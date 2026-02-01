"use client";

import Link from "next/link";

export default function HomePage() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo-preview");
    demoSection?.scrollIntoView({ behavior: "smooth" });
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

      {/* Top Navigation */}
      <nav className="relative z-20 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Step Free
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={scrollToDemo}
                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
              >
                How it works
              </button>
              <a href="#accessibility" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
                Accessibility
              </a>
              <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
                About Transport for All
              </a>
            </div>
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform ring-2 ring-green-500/30">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              Step Free
            </h1>
            
            <p className="text-3xl lg:text-4xl font-bold text-gray-200 mb-4">
              Plan step-free. Replan fast.
            </p>
            
            <p className="text-lg lg:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get detailed, safety-conscious journeys that prioritise step-free access, low-sensory travel, fatigue limits, and backup routes—so you can travel with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/plan"
                className="group relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl shadow-green-900/50"
              >
                <span className="flex items-center gap-2">
                  Get started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <button
                onClick={scrollToDemo}
                className="text-gray-300 hover:text-green-400 transition-colors font-medium text-lg underline decoration-2 underline-offset-4"
              >
                See an example plan
              </button>
            </div>
          </div>
        </section>

        {/* Why Step Free Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-100 mb-12">
            Why Step Free
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Tile 1 */}
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-green-500/50 transition-all transform hover:scale-105 shadow-xl">
              <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mb-6 border border-green-700/30">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3">Step-free first</h3>
              <p className="text-gray-300 leading-relaxed">
                Routes that avoid stairs and highlight lift usage clearly.
              </p>
            </div>

            {/* Tile 2 */}
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-green-500/50 transition-all transform hover:scale-105 shadow-xl">
              <div className="w-16 h-16 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 border border-blue-700/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3">Sensory + fatigue aware</h3>
              <p className="text-gray-300 leading-relaxed">
                Less walking, fewer transfers, quieter options when possible.
              </p>
            </div>

            {/* Tile 3 */}
            <div className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-green-500/50 transition-all transform hover:scale-105 shadow-xl">
              <div className="w-16 h-16 bg-yellow-900/30 rounded-xl flex items-center justify-center mb-6 border border-yellow-700/30">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-3">Backup options built-in</h3>
              <p className="text-gray-300 leading-relaxed">
                Plan B/C so a broken lift doesn't end the journey.
              </p>
            </div>
          </div>
        </section>

        {/* Mini Demo Preview */}
        <section id="demo-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-100 mb-12">
            See it in action
          </h2>
          <div className="bg-gray-800 rounded-2xl p-8 lg:p-12 border-2 border-gray-700 shadow-2xl max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-100 mb-2">Enter Station A via lift</h4>
                  <p className="text-gray-300">
                    Use the main entrance lift located on the north side. The lift provides direct access to platform level.
                  </p>
                  <div className="mt-3 bg-green-900/30 rounded-md p-3 border border-green-700/30">
                    <p className="text-sm font-semibold text-green-300 mb-1">♿ Accessibility Notes</p>
                    <p className="text-sm text-green-200">Lift is wheelchair accessible and has audio announcements.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-100 mb-2">Stay on the platform near quiet zone</h4>
                  <p className="text-gray-300">
                    Wait near the designated quiet zone area, which has reduced lighting and noise levels.
                  </p>
                  <div className="mt-3 bg-blue-900/30 rounded-md p-3 border border-blue-700/30">
                    <p className="text-sm font-semibold text-blue-300 mb-1">🔊 Sensory Notes</p>
                    <p className="text-sm text-blue-200">This area is designed for low-sensory needs with minimal visual and auditory stimulation.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                    B
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Backup: If lift is out, use Station X</h4>
                    <p className="text-gray-300">
                      Alternative route via Station X which has step-free access from street level and connects to the same line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust + Partnership Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-gray-300 text-lg">
              Built for <span className="font-semibold text-green-400">Transport for All</span> • Designed for disabled travellers • <span className="font-semibold text-blue-400">Accessibility-first by default</span>
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-500/30">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-300">Built with Transport for All</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
