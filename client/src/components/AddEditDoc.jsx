import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function AddEditDoc() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [versions, setVersions] = useState([]);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    const { data } = await api.get(`/docs/${id}`);
    setForm({
      title: data.title,
      content: data.content,
      tags: (data.tags || []).join(', ')
    });
    setVersions(data.versions || []);
  }

  async function save() {
    const payload = {
      title: form.title,
      content: form.content,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (id) await api.patch(`/docs/${id}`, payload);
    else await api.post('/docs', payload);
    nav('/');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <div className="space-y-4 bg-white rounded-xl p-6 shadow-sm">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          rows={12}
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="tags (comma separated)"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={save}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>

      {/* Versions Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3">History</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {versions.map(v => (
            <li key={v.version} className="border-b border-gray-100 pb-2">
              <div className="font-medium text-gray-700">
                v{v.version} · {new Date(v.updatedAt).toLocaleString()}
              </div>
              <div className="text-gray-500 text-sm">
                {(v.summary || '').slice(0, 120)}…
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
