import { notFound } from "next/navigation";
import { ExternalLink, Link as LinkIcon, MousePointerClick, Globe, Clock } from "lucide-react";

type Props = { params: { code: string } };

export default async function CodePage({ params }: Props) {
  const { code } = params;
  const base = process.env.BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/links/${code}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const data = await res.json();
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Link Stats
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Detailed analytics for your shortened link
        </p>
      </div>
      {/* Card */}
      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6 border border-gray-100">

        {/* Short URL */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase text-gray-500 font-medium">
            Short URL
          </span>
          <a
            href={`${base}/${data.code}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all flex items-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            {base}/{data.code}
          </a>
        </div>
        {/* Target URL */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase text-gray-500 font-medium">
            Original URL
          </span>
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:underline break-all flex items-center gap-2"
          >
            <Globe className="h-4 w-4 text-gray-600" />
            {data.url}
          </a>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Clicks */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <MousePointerClick className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-lg font-semibold text-gray-800">{data.clicks}</p>
            </div>
          </div>
          {/* Last Clicked */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Clicked</p>
              <p className="text-lg font-medium text-gray-800">
                {data.last_clicked
                  ? new Date(data.last_clicked).toLocaleString("en-IN")
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
        {/* Created At */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase text-gray-500 font-medium">
            Created At
          </span>
          <span className="text-gray-800 font-medium">
            {new Date(data.created_at).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
