import React from 'react';
import { ShieldCheck, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white pt-16 pb-8 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-accent-lightGreen"></div>
                  <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                  <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-600 bg-white"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight">CPA <span className="text-brand-200">CANADA</span></span>
            </div>
            <p className="text-brand-200 max-w-sm">
              The trusted platform connecting Canadian Small Businesses with verified Chartered Professional Accountants.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-accent-green transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-accent-green transition"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-accent-green transition"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-brand-100">Platform</h4>
            <ul className="space-y-2 text-brand-200">
              <li><a href="/pricing" className="hover:text-white transition">Pricing Packages</a></li>
              <li><a href="/signup/cpa" className="hover:text-white transition">For Accountants</a></li>
              <li><a href="/signup/smb" className="hover:text-white transition">For Businesses</a></li>
              <li><a href="/login" className="hover:text-white transition">Login</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-brand-100">Contact</h4>
            <ul className="space-y-2 text-brand-200">
              <li className="flex items-center gap-2"><Mail size={16} /> support@cpacanada.ca</li>
              <li>1-800-CPA-HELP</li>
              <li>Toronto, ON</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-400">
          <p>© 2025 CPA Canada Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure & Encrypted</span>
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
