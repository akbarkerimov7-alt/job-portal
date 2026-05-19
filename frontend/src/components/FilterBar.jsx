import { useState } from 'react';

export default function FilterBar({ onSearch, onFilter, onReset }) {
  const [title, setTitle] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minSalary: '',
    maxSalary: '',
  });

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const submitSearch = (event) => {
    event.preventDefault();
    onSearch(title);
  };

  const submitFilter = (event) => {
    event.preventDefault();
    onFilter({
      category: filters.category || undefined,
      location: filters.location || undefined,
      minSalary: filters.minSalary || undefined,
      maxSalary: filters.maxSalary || undefined,
    });
  };

  const reset = () => {
    setTitle('');
    setFilters({ category: '', location: '', minSalary: '', maxSalary: '' });
    onReset();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
        <input
          className="field flex-1"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Search by title"
        />
        <button className="btn-primary" type="submit">
          Search
        </button>
      </form>

      <form onSubmit={submitFilter} className="mt-4 grid gap-3 md:grid-cols-5">
        <input className="field" name="category" value={filters.category} onChange={updateFilter} placeholder="Category" />
        <input className="field" name="location" value={filters.location} onChange={updateFilter} placeholder="Location" />
        <input className="field" name="minSalary" type="number" min="0" value={filters.minSalary} onChange={updateFilter} placeholder="Min salary" />
        <input className="field" name="maxSalary" type="number" min="0" value={filters.maxSalary} onChange={updateFilter} placeholder="Max salary" />
        <div className="flex gap-2">
          <button className="btn-secondary flex-1" type="button" onClick={reset}>
            Reset
          </button>
          <button className="btn-primary flex-1" type="submit">
            Filter
          </button>
        </div>
      </form>
    </section>
  );
}
