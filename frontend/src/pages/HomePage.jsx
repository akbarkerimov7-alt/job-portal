import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import JobCard from '../components/JobCard.jsx';
import { jobsApi } from '../api/jobsApi.js';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await jobsApi.getAll();
      setJobs(data);
    } catch {
      setError('Could not load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = async (title) => {
    if (!title.trim()) {
      loadJobs();
      return;
    }
    const { data } = await jobsApi.search(title);
    setJobs(data);
  };

  const handleFilter = async (params) => {
    const { data } = await jobsApi.filter(params);
    setJobs(data);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Find work that fits your skills and schedule
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Browse verified vacancies, compare salaries, and post openings for local and remote teams.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-brand-700 dark:text-brand-100">{jobs.length}</p>
              <p className="text-sm text-slate-500">Open jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-700 dark:text-brand-100">24h</p>
              <p className="text-sm text-slate-500">Fresh posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-700 dark:text-brand-100">JWT</p>
              <p className="text-sm text-slate-500">Secure auth</p>
            </div>
          </div>
        </div>
      </section>

      <FilterBar onSearch={handleSearch} onFilter={handleFilter} onReset={loadJobs} />

      {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700">
          No jobs found.
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      )}
    </div>
  );
}
