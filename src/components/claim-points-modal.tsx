import { X, CloudDownload } from "lucide-react";
import { useState } from "react";

function ClaimPointsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState("");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-all duration-200 ease-out
          ${open ? "scale-100 translate-y-0" : "scale-95 translate-y-2"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Claim Your 25 Points</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
          <p>
            Sign up for Reclaim (free, no payment needed), then fill the form
            below:
          </p>

          <ol className="list-decimal pl-5 space-y-1">
            <li>Enter your Reclaim sign-up email.</li>
            <li>
              Upload a screenshot of your Reclaim profile showing your email.
            </li>
          </ol>

          <p className="font-medium">
            After verification, you’ll get <b>25 Flowva Points 🎉</b>
          </p>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Email used on Reclaim
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-purple-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Upload screenshot (mandatory)
            </label>

            <label className="flex flex-col items-center justify-center bg-gray-100 gap-2 border border-gray-300 rounded-lg py-2 cursor-pointer hover:bg-gray-50 transition">
              <p className="flex items-center gap-2 justify-center">
                <CloudDownload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">Choose file</span>
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>

            {fileName && (
              <p className="mt-1 text-xs text-gray-500">{fileName}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-medium disabled:opacity-50"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimPointsModal;
