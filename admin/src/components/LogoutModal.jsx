import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4">
            <LogOut size={48} className="text-slate-900" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-10">
            Are You Sure You Want to Logout?
          </h3>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-6 bg-slate-500 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
