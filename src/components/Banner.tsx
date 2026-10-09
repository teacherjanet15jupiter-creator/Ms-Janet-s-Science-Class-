import React, { useState, useRef } from 'react';
import { Sparkles, Microscope, Award, Upload, Image as ImageIcon, Flame, CheckCircle, RefreshCw } from 'lucide-react';
import { ClassRoom } from '../types';

interface BannerProps {
  currentClass: ClassRoom;
  activeGroupCount: number;
  overallDiversity: number;
  streakCount: number;
}

export const Banner: React.FC<BannerProps> = ({
  currentClass,
  activeGroupCount,
  overallDiversity,
  streakCount
}) => {
  const [customBannerUrl, setCustomBannerUrl] = useState<string | null>(() => {
    return localStorage.getItem('ms_janet_custom_banner') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomBannerUrl(result);
        localStorage.setItem('ms_janet_custom_banner', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBanner = () => {
    setCustomBannerUrl(null);
    localStorage.removeItem('ms_janet_custom_banner');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-purple-100/80 mb-6 bg-gradient-to-r from-purple-100 via-indigo-50/50 to-emerald-100">
      {/* Background ambient decorative science bubbles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-200/35 rounded-full blur-2xl pointer-events-none" />

      {customBannerUrl ? (
        <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden">
          <img
            src={customBannerUrl}
            alt="Ms. Janet's Science Class Cartoon Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div>
              {currentClass.isPriorityModule && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-md mb-2 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Priority Classroom Module · Bina Bangsa School
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading drop-shadow-md">
                {currentClass.name}
              </h1>
              <p className="text-sm text-purple-100 mt-1 flex items-center gap-2">
                <span>Form Teacher: {currentClass.formTeacher}</span>
                <span>·</span>
                <span>Room {currentClass.room}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-medium text-white transition-all flex items-center gap-1.5"
                title="Change Banner Image"
              >
                <Upload className="w-3.5 h-3.5" /> Change Banner
              </button>
              <button
                onClick={handleResetBanner}
                className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-medium text-white transition-all"
                title="Switch to Animated Lab Theme"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Rich Animated Cartoon Scene capturing Ms. Janet, Einstein, Students, Cat, and Plant Cells */
        <div className="p-6 sm:p-8 lg:p-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 z-10">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                {currentClass.isPriorityModule ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Priority Classroom Module
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                    <Microscope className="w-3.5 h-3.5 text-purple-600" />
                    Science Lab Series
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Room {currentClass.room} · Grade {currentClass.gradeLevel}
                </span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> {streakCount} Day Class Streak
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
                {currentClass.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl leading-relaxed">
                Welcome to <strong className="text-purple-800 font-semibold">{currentClass.formTeacher}</strong>&apos;s science discovery arena! Group your students into balanced inquiry teams, inspect plant cell stomata, track lab safety badges, and evaluate scientific inquiry with custom rubrics.
              </p>

              {/* Quick Stat Pill Indicators */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {currentClass.students.length}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Active Roster</div>
                    <div className="text-xs font-bold text-slate-800">12 M · {currentClass.students.length - 12} F</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {activeGroupCount}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Formed Teams</div>
                    <div className="text-xs font-bold text-slate-800">4-5 Members / Team</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {overallDiversity}%
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Diversity Score</div>
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Optimal Balance
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload custom cartoon image button */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-xl border border-purple-200 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  Use uploaded cartoon image as banner
                </button>
              </div>
            </div>

            {/* Right Illustration: Cartoon Laboratory with Ms. Janet, Young Boy & Girl, Einstein, and Friendly Cat */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md bg-gradient-to-br from-white/90 via-purple-50/80 to-emerald-50/80 rounded-3xl p-5 border border-purple-200/70 shadow-md backdrop-blur-sm">
                {/* Visual badge top right */}
                <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  🔬 Science Inquiry Lab
                </div>

                {/* Character Tableau Representation */}
                <div className="flex items-end justify-around pt-3 pb-2">
                  {/* Young Girl with Microscope */}
                  <div className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center text-3xl shadow-inner border-2 border-purple-300">
                        👧🏻
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-base">🔬</span>
                      <span className="absolute -top-1 -left-1 text-xs">🌿</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 mt-1.5">Abigail</span>
                    <span className="text-[9px] text-purple-600 font-medium">Plant Cells</span>
                  </div>

                  {/* Ms. Janet (Science Teacher) */}
                  <div className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-purple-300 via-pink-100 to-emerald-200 flex items-center justify-center text-4xl shadow-md border-2 border-purple-400">
                        👩🏻‍🏫
                      </div>
                      <div className="absolute -bottom-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                        Ms. Janet
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-purple-950 mt-2">Lead Educator</span>
                    <span className="text-[9px] text-emerald-700 font-medium">Biology & Chemistry</span>
                  </div>

                  {/* Young Boy in Blue Hoodie */}
                  <div className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-blue-200 to-cyan-100 flex items-center justify-center text-3xl shadow-inner border-2 border-blue-300">
                        👦🏻
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-base">⚡</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 mt-1.5">Axel</span>
                    <span className="text-[9px] text-blue-600 font-medium">Robotics CCA</span>
                  </div>

                  {/* Dr. Einstein Cartoon Professor */}
                  <div className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-100 to-emerald-100 flex items-center justify-center text-3xl shadow-inner border-2 border-amber-300">
                        👨🏼‍🔬
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-xs">💡</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 mt-1.5">Dr. Einstein</span>
                    <span className="text-[9px] text-amber-700 font-medium">Physics Mentor</span>
                  </div>
                </div>

                {/* Lab Bench: Pet Ginger Cat, Test Tubes & Stomata Leaf Diagram */}
                <div className="mt-3 pt-3 border-t border-purple-150/70 flex items-center justify-between px-3 bg-white/70 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐱</span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        Ginger Lab Mascot <span className="text-[10px] text-amber-600 font-normal">🔔 Bell Collar</span>
                      </div>
                      <div className="text-[9px] text-slate-500">Watching chloroplast bubbles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="p-1 rounded-md bg-purple-100 text-purple-700" title="Cell Diagram">🧪</span>
                    <span className="p-1 rounded-md bg-emerald-100 text-emerald-700" title="Plant Leaf">🍃</span>
                    <span className="p-1 rounded-md bg-blue-100 text-blue-700" title="Microscope">🧫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Custom Banner Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};
