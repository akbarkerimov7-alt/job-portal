import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { chatApi } from '../api/chatApi.js';
import { jobsApi } from '../api/jobsApi.js';
import ChatBox from '../components/ChatBox.jsx';
import JobCard from '../components/JobCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    const { data } = await chatApi.conversations();
    setConversations(data);
    setActiveConversation((current) => {
      if (current) {
        return current;
      }
      return data[0] || null;
    });
  }, []);

  useEffect(() => {
    jobsApi
      .mine()
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
    loadConversations();

    const intervalId = window.setInterval(loadConversations, 5000);
    window.addEventListener('jobportal:chat-updated', loadConversations);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('jobportal:chat-updated', loadConversations);
    };
  }, [loadConversations]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="mt-1 text-slate-500">{user?.email}</p>
            {user?.phone && <p className="mt-1 text-slate-500">{user.phone}</p>}
            <p className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
              {user?.role}
            </p>
          </div>
          <Link to="/jobs/create" className="btn-primary">
            Post new job
          </Link>
        </div>
      </section>

      <section id="chats" className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Chats</h2>
              <p className="text-sm text-slate-500">{conversations.length} conversation(s)</p>
            </div>
            <button type="button" onClick={loadConversations} className="btn-secondary">
              Refresh
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {conversations.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950">
                No messages yet. When someone writes about your vacancy, the dialog will appear here.
              </p>
            ) : (
              conversations.map((conversation) => {
                const active =
                  activeConversation?.jobId === conversation.jobId &&
                  activeConversation?.participantId === conversation.participantId;
                return (
                  <button
                    key={`${conversation.jobId}-${conversation.participantId}`}
                    type="button"
                    onClick={() => setActiveConversation(conversation)}
                    className={`w-full rounded-md border p-3 text-left transition ${active ? 'border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-700/20' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950'}`}
                  >
                    <p className="font-semibold">{conversation.participantName}</p>
                    <p className="text-sm text-slate-500">{conversation.jobTitle}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{conversation.lastMessage}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
        {activeConversation ? (
          <ChatBox
            jobId={activeConversation.jobId}
            participantId={activeConversation.participantId}
            title={`Chat with ${activeConversation.participantName}`}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            Select a conversation to reply.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My jobs</h2>
          <span className="text-sm text-slate-500">{jobs.length} total</span>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center text-slate-500 dark:border-slate-700">
            You have not posted any jobs yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
