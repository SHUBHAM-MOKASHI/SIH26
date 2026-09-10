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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#081836] border border-blue-600 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-5 border-b border-blue-900/80 flex items-center justify-between bg-[#040d21]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-500 text-white">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-sans">
                Post Safety & Scam Analysis
              </h3>
              <p className="text-xs text-blue-300/80 font-mono">
                Post ID: #{post.id.toString().padStart(4, '0')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {/* Post Summary & Source */}
          <div className="p-4 rounded-xl bg-[#040d21] border border-blue-900/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">{post.username}</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-blue-200">{post.platform}</span>
                <span className="text-blue-300 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-blue-400" /> {post.region}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                post.risk_level === 'High' ? 'bg-white text-blue-950 border border-white' :
                post.risk_level === 'Medium' ? 'bg-blue-900 text-blue-200 border border-blue-600' :
                'bg-blue-950 text-blue-300 border border-blue-800'
              }`}>
                Threat Level: {post.risk_level}
              </span>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed font-sans pt-1">
              "{post.text}"
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#040d21] border border-blue-900/80 space-y-1">
              <span className="text-blue-300">Tone of Message:</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className={post.sentiment === 'Negative' ? 'text-blue-300' : 'text-white'}>
                  {post.sentiment === 'Negative' ? 'Angry / Panic' : post.sentiment === 'Positive' ? 'Positive' : 'Neutral'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#040d21] border border-blue-900/80 space-y-1">
              <span className="text-blue-300">Topic Tag:</span>
              <div className="text-sm font-bold text-white font-mono">
                {post.topic}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#040d21] border border-blue-900/80 space-y-1">
              <span className="text-blue-300">Location Origin:</span>
              <div className="text-sm font-bold text-blue-100">
                {post.region}, India
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#040d21] border border-blue-900/80 space-y-1">
              <span className="text-blue-300">Engagement Count:</span>
              <div className="text-sm font-bold text-blue-100 font-mono">
                🤍 {post.likes} Likes | 🔁 {post.retweets} Shares
              </div>
            </div>
          </div>

          {/* Recommended Safety Steps */}
          <div className="p-4 rounded-xl bg-[#040d21] border border-blue-900/80 text-xs space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              Recommended Safety Actions:
            </div>
            <ul className="list-disc list-inside text-blue-200/90 space-y-1 leading-relaxed pl-1">
              <li>Issue an official fact-check notice regarding <strong>{post.topic}</strong> for citizens in <strong>{post.region}</strong>.</li>
              <li>Monitor account <strong>{post.username}</strong> for repeated automated rumor posts.</li>
              <li>Report any attached fraudulent bank links or APKs to cybersecurity helplines.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-blue-900/80 bg-[#040d21] flex items-center justify-between font-sans text-xs">
          <button
            onClick={copyPayload}
            className="px-3.5 py-2 rounded-xl bg-blue-950 border border-blue-700 hover:border-blue-400 text-blue-200 text-xs flex items-center gap-1.5 transition font-medium"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy Post Info
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onFlagToggle && onFlagToggle(post.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                post.is_flagged
                  ? 'bg-blue-900 hover:bg-blue-800 text-white border border-blue-500'
                  : 'bg-white hover:bg-blue-50 text-blue-950 shadow-md shadow-blue-500/20'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {post.is_flagged ? 'Remove Flag' : 'Flag as Scam'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
