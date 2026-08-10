'use client';

import { Cookie, Info, Settings, ShieldCheck } from 'lucide-react';

export default function CookiePolicy() {
  const sections = [
    { id: 'intro', title: '1. Introduction', icon: Info },
    { id: 'what', title: '2. What are Cookies', icon: Cookie },
    { id: 'how', title: '3. How we use them', icon: ShieldCheck },
    { id: 'manage', title: '4. Managing Preferences', icon: Settings }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sticky Table of Contents */}
          <aside className="lg:w-1/4 hidden lg:block sticky top-32 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-6 flex items-center gap-2">
              <Settings size={14} />
              Contents
            </h4>
            <nav className="flex flex-col gap-4 border-l-2 border-slate-200 dark:border-slate-800 pl-4">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`} 
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-2"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Card */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-slate-900/50 p-8 md:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-900/5 backdrop-blur-sm transition-colors">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase mb-8 shadow-sm">
                <Cookie size={16} />
                <span>Legal</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
                Cookie Policy
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-12 font-light italic border-b border-slate-100 dark:border-slate-800 pb-8">
                Last updated: April 02, 2026
              </p>

              <div className="space-y-16">
                <section id="intro" className="scroll-mt-32 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <Info size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{sections[0].title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light pl-11">
                    At TravelHub, we value your privacy. This policy explains how we use cookies to ensure our booking platform remains fast, secure, and personalized to your travel needs.
                  </p>
                </section>

                <section id="what" className="scroll-mt-32 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <Cookie size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{sections[1].title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light pl-11">
                    Cookies are tiny text files stored in your browser. They allow us to "remember" you between pages—crucial for tasks like keeping items in your travel cart or remembering your currency selection.
                  </p>
                </section>

                <section id="how" className="scroll-mt-32 group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{sections[2].title}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                    {[
                      { t: 'Essential', d: 'Required for secure sign-ins and processing payments.' },
                      { t: 'Preferences', d: 'Remembers if you prefer USD or INR for tour pricing.' },
                      { t: 'Analytics', d: 'Helps us see which heritage treks are trending.' },
                      { t: 'Marketing', d: 'Used to show you relevant travel deals based on your history.' }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors duration-300">
                        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">{item.t}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="manage" className="scroll-mt-32 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <Settings size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{sections[3].title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light pl-11">
                    You can clear your cookies anytime via your browser settings. Note that disabling essential cookies may prevent you from completing a booking on TravelHub.
                  </p>
                </section>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>TravelHub System Documentation</span>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}