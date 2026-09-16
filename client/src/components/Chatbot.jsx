import { useEffect, useState } from 'react';
import { MessageCircle, X, Send, Mic } from 'lucide-react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import './Chatbot.css';

export default function Chatbot() {
  const { lang } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I can help with bookings, offline/SMS mode, or finding workers.' },
  ]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (lang === 'hi') {
      setMessages([{ role: 'bot', text: 'नमस्ते! बुकिंग, ऑफ़लाइन/SMS मोड या कर्मचारी खोजने में मदद कर सकता हूँ।' }]);
    }
  }, [lang]);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true);
    try {
      const res = await api.aiChat(text, lang);
      setMessages((m) => [...m, { role: 'bot', text: res.data.reply }]);
    } catch {
      console.error('Chat API error:', err);
      setMessages((m) => [...m, { role: 'bot', text: 'Network weak. Try SMS: BOOK ELECTRICIAN 110017 to 56767' }]);
      
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="chatbot">
      {open && (
        <div className="chat-panel card fade-up">
          <div className="chat-head">
            <div>
              <strong>Swatantra Setu Assist</strong>
              <span>AI support · Voice & multilingual</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <button type="button" className="mic" aria-label="Voice input"><Mic size={16} /></button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about booking, SMS, or rates…"
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={busy}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      <button className="chat-fab" type="button" onClick={() => setOpen((v) => !v)} aria-label="Open assistant">
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
