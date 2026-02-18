import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-gray-400 py-12 px-6 border-t border-slate-800 overflow-hidden font-sans">
     
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
    
          <div className="space-y-5">
            <h2 className="text-white font-bold text-2xl tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </span>
              Courier<span className="text-blue-500">MS</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Next-generation logistics management. We provide seamless tracking and delivery solutions across the region with 100% reliability.
            </p>
          </div>
          <div className="space-y-5">
            <h3 className="text-white font-semibold text-xs uppercase tracking-[0.2em]">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@courier.com" className="flex items-center gap-3 hover:text-blue-400 transition-colors group">
                  <div className="p-2 bg-slate-800 rounded group-hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  support@courier.com
                </a>
              </li>
              <li>
                <a href="tel:+9779765537958" className="flex items-center gap-3 hover:text-blue-400 transition-colors group">
                  <div className="p-2 bg-slate-800 rounded group-hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  +977-9765537958
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:items-end space-y-5">
            <h3 className="text-white font-semibold text-xs uppercase tracking-[0.2em] md:text-right w-full">Connect With Us</h3>
            <div className="grid grid-cols-4 gap-3">
        
              <SocialLink href="https://www.facebook.com/sushil.bhatta88" icon="fb" label="Facebook Main" />
            
              <SocialLink href="https://www.facebook.com/subodh.bhatta.58" icon="fb" label="Facebook Support" />
             
              <SocialLink href="https://www.instagram.com/_sushil_bhatta/" icon="insta" label="Instagram Official" />
            </div>
            <p className="text-[10px] text-slate-500 md:text-right uppercase tracking-widest font-medium">Follow for latest updates</p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 Courier Management System. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function SocialLink({ href, icon, label }) {
  const isFb = icon === 'fb';
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      title={label}
      className={`p-3 bg-slate-800 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${isFb ? 'hover:bg-blue-600' : 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600'}`}
    >
      {isFb ? (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )}
    </a>
  );
}