import { Link ,useNavigate} from "react-router-dom";
import React from "react";

export default function DetailsDsh() {
  const navigate = useNavigate();
  const menuItems = [
    {
      title: "Customer Directory",
      path: "/admin/details/ViewCostumers",
      desc: "Full list of registered clients and their contact profiles.",
      icon: "👤",
      tag: "Directory",
      accent: "from-blue-500 to-cyan-400",
    },
    {
      title: "Shipment Logs",
      path: "/admin/details/ViewShipments",
      desc: "Comprehensive view of all active and past courier routes.",
      icon: "📋",
      tag: "Live Feed",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      title: "Staff Roster",
      path: "/admin/details/ViewStaffs",
      desc: "Information on all delivery personnel and their assigned areas.",
      icon: "🆔",
      tag: "Personnel",
      accent: "from-emerald-500 to-teal-400",
    },
    {
      title: "Logistics Methods",
      path: "/admin/details/ViewModes",
      desc: "Browse available transport types and cost multipliers.",
      icon: "🚛",
      tag: "Reference",
      accent: "from-orange-500 to-amber-400",
    },
    {
      title: "Status Definitions",
      path: "/admin/details/ViewStatus",
      desc: "Review the current stages used in the tracking lifecycle.",
      icon: "📍",
      tag: "Workflow",
      accent: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1e293b] p-8 font-sans text-slate-200">
            <button
          onClick={() => navigate(-1)}
               className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors"
                  >
               ← Back
       </button>
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Data <span className="text-slate-500">Archive</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-md">
              A secure, read-only interface for monitoring core system records and logistics performance.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              System Live • Feb 2026
            </span>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="group relative bg-[#334155]/40 hover:bg-[#334155]/60 border border-slate-700 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div className={`absolute -inset-px bg-linear-to-r ${item.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>

              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${item.accent} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 group-hover:border-slate-500 transition-colors">
                    {item.tag}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                Enter Records
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        <footer className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational Status: Nominal
          </div>
          <div>Read-Only Access Protocol Enabled</div>
        </footer>
      </div>
    </div>
  );
}