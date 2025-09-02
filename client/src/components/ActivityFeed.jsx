import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function ActivityFeed() {
  const [acts, setActs] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/docs/', { params: { limit: 5 } });
      setActs(data);
    })();
  }, []);

  return (
    <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
      <h4 className="font-semibold text-gray-800 mb-3">Team Activity</h4>
      <ul className="space-y-2">
        {acts.map(d => (
          <li key={d._id} className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">{d.title}</span> ·{" "}
            {d.createdBy?.name || "Unknown"} ·{" "}
            {new Date(d.updatedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
