import React, { useState } from 'react';
import api from '../api/client';
import DocCard from '../components/DocCard';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  async function keyword() {
    const { data } = await api.get('/search', { params: { q } });
    setResults(data);
  }

  async function semantic() {
    const { data } = await api.post('/search/semantic', { query: q, k: 5 });
    setResults(data);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={keyword}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Text
        </button>
        <button
          onClick={semantic}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Semantic
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map(r => (
          <DocCard key={r._id} doc={r} />
        ))}
      </div>
    </div>
  );
}
