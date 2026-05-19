import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsApi } from '../api/jobsApi.js';
import JobForm from '../components/JobForm.jsx';

export default function CreateJobPage({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(editMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editMode) {
      return;
    }

    jobsApi
      .getById(id)
      .then(({ data }) => setJob(data))
      .catch(() => setError('Could not load job.'))
      .finally(() => setLoading(false));
  }, [editMode, id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = editMode ? await jobsApi.update(id, payload) : await jobsApi.create(payload);
      navigate(`/jobs/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save job.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading form...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">{editMode ? 'Edit job' : 'Post a job'}</h1>
        <p className="mt-1 text-slate-500">Publish a clear vacancy with salary, category, and location.</p>
      </div>
      {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
      <JobForm initialValues={job} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
