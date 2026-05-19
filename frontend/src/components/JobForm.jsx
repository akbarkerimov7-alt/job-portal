import { useEffect, useState } from 'react';

const initialState = {
  title: '',
  description: '',
  category: '',
  salary: '',
  paymentType: 'month',
  location: '',
  imageUrl: '',
  genderRequirement: 'Any',
};

export default function JobForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        category: initialValues.category || '',
        salary: initialValues.salary || '',
        paymentType: initialValues.paymentType || 'month',
        location: initialValues.location || '',
        imageUrl: initialValues.imageUrl || '',
        genderRequirement: initialValues.genderRequirement || 'Any',
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category || !form.salary || !form.location) {
      setError('Please complete all required fields.');
      return;
    }

    onSubmit({
      ...form,
      salary: Number(form.salary),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Title</span>
          <input className="field" name="title" value={form.title} onChange={handleChange} placeholder="Senior Java Developer" />
        </label>
        <label className="space-y-2">
          <span className="label">Category</span>
          <input className="field" name="category" value={form.category} onChange={handleChange} placeholder="Software" />
        </label>
        <label className="space-y-2">
          <span className="label">Salary, сом</span>
          <input className="field" type="number" min="0" name="salary" value={form.salary} onChange={handleChange} placeholder="45000" />
        </label>
        <label className="space-y-2">
          <span className="label">Payment type</span>
          <select className="field" name="paymentType" value={form.paymentType} onChange={handleChange}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="project">Project</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="label">Location</span>
          <input className="field" name="location" value={form.location} onChange={handleChange} placeholder="Bishkek" />
        </label>
        <label className="space-y-2">
          <span className="label">Gender requirement</span>
          <select className="field" name="genderRequirement" value={form.genderRequirement} onChange={handleChange}>
            <option>Any</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="label">Image URL</span>
        <input className="field" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
      </label>

      <label className="space-y-2 block">
        <span className="label">Description</span>
        <textarea className="field min-h-36" name="description" value={form.description} onChange={handleChange} placeholder="Describe responsibilities, requirements, and benefits." />
      </label>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Saving...' : 'Save job'}
      </button>
    </form>
  );
}
