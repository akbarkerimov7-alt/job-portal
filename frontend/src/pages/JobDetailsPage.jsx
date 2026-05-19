import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jobsApi } from '../api/jobsApi.js';
import ChatBox from '../components/ChatBox.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsApi
      .getById(id)
      .then(({ data }) => setJob(data))
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const removeJob = async () => {
    await jobsApi.remove(id);
    navigate('/');
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading job...</div>;
  }

  if (error || !job) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">{error}</div>;
  }

  const isOwner = isAuthenticated && user?.id === job.userId;
  const image = job.imageUrl || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';
  const mapQuery = encodeURIComponent(job.location || 'Бишкек');
  const mapUrl = `https://widgets.2gis.com/widget?type=search&query=${mapQuery}`;
  const mapLink = `https://2gis.kg/search/${mapQuery}`;

  return (
    <div className="space-y-6">
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <img src={image} alt={job.title} className="h-64 w-full object-cover" />
        <div className="space-y-6 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="mt-2 text-slate-500">{job.ownerName} - {job.location}</p>
            </div>
            <div className="flex gap-2">
              {isOwner && (
                <>
                  <Link className="btn-secondary" to={`/jobs/edit/${job.id}`}>
                    Edit
                  </Link>
                  <button className="btn-secondary border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-950/40" type="button" onClick={removeJob}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Info label="Category" value={job.category} />
            <Info label="Salary" value={`${job.salary} сом`} />
            <Info label="Payment" value={job.paymentType} />
            <Info label="Gender" value={job.genderRequirement || 'Any'} />
          </div>

          <section>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-line text-slate-700 dark:text-slate-300">{job.description}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{job.ownerEmail}</p>
              {job.ownerPhone && <p className="mt-1 text-slate-600 dark:text-slate-300">{job.ownerPhone}</p>}
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <iframe
                title="2GIS map"
                src={mapUrl}
                className="h-64 w-full border-0"
                loading="lazy"
              />
              <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <a className="text-sm font-semibold text-brand-700 dark:text-brand-100" href={mapLink} target="_blank" rel="noreferrer">
                  Open location in 2GIS
                </a>
              </div>
            </div>
          </section>
        </div>
      </article>

      {!isOwner && <ChatBox jobId={job.id} title={`Chat with ${job.ownerName}`} />}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
