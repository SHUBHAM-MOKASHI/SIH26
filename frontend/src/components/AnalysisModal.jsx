import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Share2, 
  Lock,
  Copy
} from 'lucide-react';

export default function AnalysisModal({ post, onClose, onFlagToggle }) {
  if (!post) return null;

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(post, null, 2));
    alert("Post details copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 font-sans">
                Post Safety & Scam Analysis
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Post ID: #{post.id.toString().padStart(4, '0')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {/* Post Summary & Source */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 font-mono">{post.username}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{post.platform}</span>
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {post.region}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold font-mono border ${
                post.risk_level === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                post.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                Threat Level: {post.risk_level}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
              "{post.text}"
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-1">
              <span className="text-slate-400">Tone of Message:</span>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span className={post.sentiment === 'Negative' ? 'text-rose-400' : 'text-emerald-400'}>
                  {post.sentiment === 'Negative' ? 'Angry / Panic' : post.sentiment === 'Positive' ? 'Positive' : 'Neutral'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-1">
              <span className="text-slate-400">Topic Tag:</span>
              <div className="text-sm font-bold text-cyan-400 font-mono">
                {post.topic}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-1">
              <span className="text-slate-400">Location Origin:</span>
              <div className="text-sm font-semibold text-slate-200">
                {post.region}, India
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-1">
              <span className="text-slate-400">Engagement Count:</span>
              <div className="text-sm font-bold text-slate-200 font-mono">
                🤍 {post.likes} Likes | 🔁 {post.retweets} Shares
              </div>
            </div>
          </div>

          {/* Recommended Safety Steps */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Recommended Safety Actions:
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1 leading-relaxed pl-1">
              <li>Issue an official fact-check notice regarding <strong>{post.topic}</strong> for citizens in <strong>{post.region}</strong>.</li>
              <li>Monitor account <strong>{post.username}</strong> for repeated automated rumor posts.</li>
              <li>Report any attached fraudulent bank links or APKs to cybersecurity helplines.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between font-sans text-xs">
          <button
            onClick={copyPayload}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition font-medium"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Post Info
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onFlagToggle && onFlagToggle(post.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                post.is_flagged
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {post.is_flagged ? 'Remove Flag' : 'Flag as Scam'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
