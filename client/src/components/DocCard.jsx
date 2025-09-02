import React from 'react';
import { Link } from 'react-router-dom';

export default function DocCard({ doc, onSummarize, onGenTags }) {
  return (
    <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* Title & Author */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{doc.title}</h4>
        <span className="text-sm text-gray-500">by {doc.createdBy?.name || '—'}</span>
      </div>

      {/* Content / Summary */}
      <p className="text-gray-700 whitespace-pre-wrap mb-3">
        {doc.summary || (doc.content?.slice(0, 160) + '…')}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(doc.tags || []).map(t => (
          <span
            key={t}
            className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSummarize && onSummarize(doc)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Summarize
        </button>
        <button
          onClick={() => onGenTags && onGenTags(doc)}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          Generate Tags
        </button>
        <Link
          to={`/edit/${doc._id}`}
          className="px-3 py-1 text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
