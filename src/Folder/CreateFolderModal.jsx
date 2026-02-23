import React, { useState } from "react";

export default function CreateFolderModal({ onClose, onSave }) {

  const [folderName, setFolderName] = useState("");

const handleSubmit = () => {
  if (!folderName.trim()) return;
  onSave(folderName); 
  setFolderName("");
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] md:w-[50%] bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Folder</h2>

        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-cyan-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
