import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <img
        src={job.imageUrl || fallbackImage}
        alt={job.title}
        className="h-36 w-full object-cover"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-semibold text-slate-950 dark:text-white">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.ownerName}</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
            {job.category}
          </span>
        </div>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span>{job.location}</span>
          <span className="text-right font-semibold">{job.salary} сом / {job.paymentType}</span>
        </div>
        <Link to={`/jobs/${job.id}`} className="btn-secondary w-full">
          View details
        </Link>
      </div>
    </article>
  );
}
