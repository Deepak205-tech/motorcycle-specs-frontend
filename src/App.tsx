import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/motorcycles')
      .then(res => res.json())
      .then(data => {
        setMotorcycles(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch motorcycles');
        setLoading(false);
      });
  }, []);

  // Get unique brands and types for filters
  const brands = Array.from(new Set(motorcycles.map(m => m.brand)));
  const types = Array.from(new Set(motorcycles.map(m => m.type)));

  // Filtering
  let filtered = motorcycles.filter(m =>
    (!filters.brand || m.brand === filters.brand) &&
    (!filters.type || m.type === filters.type) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase()))
  );

  // Sorting
  filtered = filtered.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Motorcycle Specs</h1>
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by name or brand..."
          className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={filters.brand || ''}
          onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={filters.type || ''}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="brand">Brand</option>
          <option value="year">Year</option>
          <option value="engine">Engine</option>
        </select>
        <button
          className="px-3 py-2 border rounded shadow-sm bg-white hover:bg-gray-200"
          onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
        >
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((m, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
            >
              <h2 className="text-xl font-semibold mb-2">{m.name}</h2>
              <div className="text-gray-600 mb-1">Brand: <span className="font-medium">{m.brand}</span></div>
              <div className="text-gray-600 mb-1">Type: <span className="font-medium">{m.type}</span></div>
              <div className="text-gray-600 mb-1">Year: <span className="font-medium">{m.year}</span></div>
              <div className="text-gray-600 mb-1">Engine: <span className="font-medium">{m.engine}</span></div>
              {m.image && <img src={m.image} alt={m.name} className="mt-3 rounded h-32 object-cover" />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App
