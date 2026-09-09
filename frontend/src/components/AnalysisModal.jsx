import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Bot, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Share2, 
  Lock,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function AnalysisModal({ post, onClose, onFlagToggle }) {
  if (!post) return null;

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(post, null, 2));
    alert("Threat Intelligence Payload copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c1427] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                AI Deep Threat Forensic Assessment
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Incident ID: #INC-NETRA-{post.id.toString().padStart(4, '0')}
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
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Post Summary & Source */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300">{post.username}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{post.platform}</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {post.region}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold ${
                post.risk_level === 'High' ? 'bg-red-950 text-red-400 border border-red-800' :
                post.risk_level === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                Risk: {post.risk_level}
              </span>
            </div>
            <p className="text-sm text-slate-100 leading-relaxed font-sans pt-1">
              "{post.text}"
            </p>
          </div>

          {/* Forensic Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400">Sentiment Score:</span>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <span className={post.sentiment === 'Negative' ? 'text-red-400' : 'text-emerald-400'}>
                  {post.sentiment_score} ({post.sentiment})
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400">Threat Narrative Tag:</span>
              <div className="text-base font-bold text-cyan-300">
                {post.topic}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400">Geospatial Marker:</span>
              <div className="text-sm font-bold text-slate-200">
                Lat: {post.latitude}, Lon: {post.longitude}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400">Amplification Metrics:</span>
              <div className="text-sm font-bold text-slate-200">
                ❤️ {post.likes} Likes | 🔁 {post.retweets} Shares
              </div>
            </div>
          </div>

          {/* AI SOC Countermeasures */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Automated SOC Countermeasure Advisory:
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1 leading-relaxed pl-1">
              <li>Deploy official fact-check broadcast on <strong>{post.topic}</strong> in <strong>{post.region}</strong> region.</li>
              <li>Add originating account <strong>{post.username}</strong> to real-time bot-monitoring queue.</li>
              <li>Export hash and narrative vectors to CERT-In / LEA threat intelligence repository.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={copyPayload}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" /> Copy Incident JSON
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onFlagToggle && onFlagToggle(post.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                post.is_flagged
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {post.is_flagged ? 'Unflag Incident' : 'Quarantine & Flag'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
