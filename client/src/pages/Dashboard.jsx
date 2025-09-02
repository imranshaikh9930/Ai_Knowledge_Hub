import React, { useEffect, useState } from 'react';
import api from '../api/client';
import DocCard from '../components/DocCard';
import ActivityFeed from '../components/ActivityFeed';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [tag, setTag] = useState('');

  useEffect(() => { load(); }, [tag]);

  async function load() {
    try {
      const { data } = await api.get('/docs/', { params: { tag } });
      setDocs(data);
    } catch (err) {
      console.error("Error loading docs:", err);
    }
  }

  async function summarize(doc) {
    try {
      const { data } = await api.post(`/docs/${doc._id}/summarize`);
      setDocs(docs.map(d => d._id === doc._id ? { ...d, summary: data.summary } : d));
    } catch (err) {
      console.error("Error summarizing doc:", err);
    }
  }

  async function genTags(doc) {
    try {
      const { data } = await api.post(`/docs/${doc._id}/tags`);
      setDocs(docs.map(d => d._id === doc._id ? { ...d, tags: data.tags } : d));
    } catch (err) {
      console.error("Error generating tags:", err);
      setDocs(docs.map(d => d._id === doc._id ? { ...d, tags: [] } : d));
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Section */}
      <div>
        {/* Filter Input */}
        <div className="mb-6">
          <input 
            placeholder="Filter by tag"
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Docs List */}
        <div className="space-y-4">
          {docs.length > 0 ? (
            docs?.map(d => (
              <DocCard
                key={d._id}
                doc={d}
                onSummarize={summarize}
                onGenTags={genTags}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No documents found</p>
          )}
        </div>
      </div>

      {/* Right Section - Activity Feed */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Activity Feed</h2>
        <ActivityFeed />
      </div>
    </div>
  );
}
