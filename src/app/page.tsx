import AddLinkForm from "../components/AddLinkForm";
import LinksTable from "../components/LinksTable";

export default async function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Create Link Card */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Create a short link
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Paste any long URL and generate a shareable short link.
        </p>
        <AddLinkForm />
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Links</h2>
          <p className="text-sm text-gray-500">
            Manage and track all the URLs you’ve created.
          </p>
        </div>
        <LinksTable />
      </div>
    </div>
  );
}
