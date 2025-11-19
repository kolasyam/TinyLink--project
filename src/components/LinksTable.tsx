"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink, RefreshCw, Search } from "lucide-react";
import CopyButton from "./CopyButton";
import FormatDate from "./FormatDate";

type LinkRow = {
  code: string;
  url: string;
  clicks: number;
  last_clicked?: string | null;
  created_at: string;
};

export default function LinksTable() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [origin, setOrigin] = useState("");
  const [page, setPage] = useState(1);
  const limit = 3;

  const [pagination, setPagination] = useState({
    totalPages: 1,
    total: 0,
  });

async function load(newPage = page, currentFilter = filter) {
  setLoading(true);

  const res = await fetch(
    `/api/links?page=${newPage}&limit=${limit}&search=${currentFilter}`
  );

  const json = await res.json();

  setLinks(json.data);
  setPagination(json.pagination);
  setPage(newPage);

  setLoading(false);
}

  // Load page 1 on mount
  useEffect(() => {
  setTimeout(() => {
    setOrigin(window.location.origin);
    load(1);
  }, 0);

    const listener = () => load(1); // After new link, go to page 1
    window.addEventListener("tinylink:created", listener);

    return () => window.removeEventListener("tinylink:created", listener);
  }, []);

  async function handleDelete(code: string) {
    if (!confirm("Delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });

    load(page); // reload current page
  }

  const shown = links.filter(
    (l) => l.code.includes(filter) || l.url.includes(filter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search by code or URL..."
            value={filter}
            onChange={(e) => {
                const value = e.target.value;
                setFilter(value);
                load(1, value);
                }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button
          onClick={() => load(page)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left">Code</th>
                <th className="py-3 px-4 text-left">Target URL</th>
                <th className="py-3 px-4 text-left">Clicks</th>
                <th className="py-3 px-4 text-left">Last Clicked</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shown.map((row) => (
                <tr key={row.code}>
                  <td className="py-3 px-4">
                    <a
                      href={`/code/${row.code}`}
                      className="text-blue-600 hover:underline"
                    >
                      {row.code}
                    </a>
                  </td>
                  <td className="py-3 px-4 max-w-[40ch] truncate">
                    <a href={row.url} target="_blank" className="hover:underline">
                      {row.url}
                    </a>
                  </td>
                  <td className="py-3 px-4">{row.clicks}</td>

                  <td className="py-3 px-4">
                    <FormatDate value={row.last_clicked} />
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {origin && <CopyButton text={`${origin}/${row.code}`} />}
                    <a
                      href={row.url}
                      target="_blank"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" /> Open
                    </a>
                    <button
                      onClick={() => handleDelete(row.code)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No links found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 1}
            onClick={() => load(page - 1, filter)}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => load(page + 1, filter)}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
