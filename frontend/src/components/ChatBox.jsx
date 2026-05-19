import { useCallback, useEffect, useRef, useState } from 'react';
import { chatApi } from '../api/chatApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatBox({ jobId, participantId, title = 'Chat with employer' }) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!isAuthenticated || !jobId) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await chatApi.messages(jobId, participantId);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load chat.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, jobId, participantId]);

  useEffect(() => {
    loadMessages();
    const intervalId = window.setInterval(loadMessages, 5000);
    return () => window.clearInterval(intervalId);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    setSending(true);
    setError('');
    try {
      const payload = {
        content: content.trim(),
        receiverId: participantId || undefined,
      };
      const { data } = await chatApi.send(jobId, payload);
      setMessages((current) => [...current, data]);
      setContent('');
      window.dispatchEvent(new Event('jobportal:chat-updated'));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">Login to open chat and send messages.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">Messages are linked to this vacancy.</p>
        </div>
        <button type="button" onClick={loadMessages} className="btn-secondary">
          Refresh
        </button>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}

      <div className="mt-4 h-72 space-y-3 overflow-y-auto rounded-md bg-slate-50 p-4 dark:bg-slate-950">
        {loading ? (
          <p className="text-center text-sm text-slate-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No messages yet.</p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === user?.id;
            return (
              <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] rounded-lg px-4 py-2 text-sm ${mine ? 'bg-brand-600 text-white' : 'bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100'}`}>
                  <p className="text-xs opacity-75">{mine ? 'You' : message.senderName}</p>
                  <p className="mt-1 whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          className="field"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a message"
        />
        <button type="submit" disabled={sending} className="btn-primary">
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
