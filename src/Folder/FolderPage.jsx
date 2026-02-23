import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Plus } from "lucide-react";
import { Popover } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import Navbar from "../Component/Navbar";
import { PageWrapper } from "../Animation/PageWrapper";
import SearchBar from "../Component/SearchBar";
import Loader from "../Component/Loader";
import ConfirmDialog from "../Component/ConfirmDialog";
import CreateFolderModal from "./CreateFolderModal";
import { showSuccess,showError } from "../Animation/aleart";

import {
  fetchAllFolders,
  fetchAllAchivedFolders,
  createFolder,
  deleteFolder,
  archiveFolder,
  restoreFolder,
  searchFolder,
} from "../api/folderApi";

export default function FolderPage() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [achived, setAchived] = useState(false);

  const selectedFolderRef = useRef(null);

  const softGradients = [
    "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))",
    "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(59,130,246,0.12))",
    "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(20,184,166,0.12))",
    "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(245,158,11,0.12))",
    "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(251,113,133,0.12))",
  ];

  /* ---------------- LOAD FOLDERS ---------------- */
  useEffect(() => {
    loadFolders();
  }, [achived]);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const res = achived
        ? await fetchAllAchivedFolders()
        : await fetchAllFolders();
      setFolders(res.data || []);
    } catch {
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async (text) => {
    setSearch(text);

    if (!text.trim()) {
      loadFolders();
      return;
    }

    try {
      const res = await searchFolder(text, achived ? "ACHIEVED" : "ACTIVE");
      setFolders(res.data.content || []);
    } catch {
      setFolders([]);
    }
  };

  /* ---------------- CREATE ---------------- */
const handleCreateFolder = async (name) => {
  try {
    await createFolder({ folderName: name });
    setShowModal(false);
    loadFolders(); // reload the folder list
    showSuccess("Folder created successfully");
  } catch (err) {
    const errorMsg = err.message || "Something went wrong";
    showError(errorMsg);
  }
};

  /* ---------------- DELETE ---------------- */
  const confirmDelete = async () => {
    const folder = selectedFolderRef.current;
    if (!folder) return;

    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
    setDeleteOpen(false);
    selectedFolderRef.current = null;

    try {
      await deleteFolder(folder.id);
    } catch {
      loadFolders();
    }
  };

  /* ---------------- ARCHIVE / RESTORE ---------------- */
  const handleArchiveOrRestore = async (folder) => {
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));

    try {
      if (!achived) {
        await archiveFolder(folder.id);
      } else {
        await restoreFolder(folder.id);
      }
    } catch {
      loadFolders();
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 py-10">
          <SearchBar value={search} onChange={handleSearch} />

          <div className="flex justify-between items-center my-6">
            <h2 className="text-3xl font-semibold text-[#008080]">My Folder</h2>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2 text-white shadow-lg"
            >
              <Plus size={18} />
              Create
            </button>
          </div>

          {/* Toggle Active / Achieved */}
          <div className="flex gap-4 mb-8 mt-4">
            <button
              onClick={() => setAchived(false)}
              className={`px-4 py-1 rounded ${
                !achived ? "bg-cyan-500 text-white" : "bg-white border border-gray-300"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setAchived(true)}
              className={`px-4 py-1 rounded ${
                achived ? "bg-cyan-500 text-white" : "bg-white border border-gray-300"
              }`}
            >
              Achieved
            </button>
          </div>

          {loading && <Loader />}

          {!loading && folders.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-red-500 mb-4">No folders found</p>

              <button
                onClick={() => setShowModal(true)}
                className="bg-cyan-500 text-white px-6 py-2 rounded"
              >
                Create Your First Folder
              </button>
            </div>
          )}

          {!loading && folders.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder, index) => {
                const bg = softGradients[index % softGradients.length];

                return (
                  <div
                    key={folder.id}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                    style={{ background: bg }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-white p-3 flex items-center justify-center">
                        <Folder className="h-5 w-5 text-slate-700" />
                      </div>

                      <Popover className="relative">
                        <Popover.Button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center outline-none"
                        >
                          <MoreVertical size={18} />
                        </Popover.Button>

                        <Popover.Panel
                          className="absolute right-0 z-50 mt-2 w-32 bg-white rounded shadow border flex flex-col"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/folder/${folder.id}`)}
                            className="block w-full px-4 py-2 text-sm hover:bg-slate-100 text-center"
                          >
                            Open
                          </button>

                          <button
                            onClick={() => handleArchiveOrRestore(folder)}
                            className="block w-full px-4 py-2 text-sm hover:bg-slate-100 text-center"
                          >
                            {!achived ? "Archive" : "Restore"}
                          </button>

                          <button
                            onClick={() => {
                              selectedFolderRef.current = folder;
                              setDeleteOpen(true);
                            }}
                            className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-slate-100 text-center"
                          >
                            Delete
                          </button>
                        </Popover.Panel>
                      </Popover>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-800">{folder.folderName}</h3>
                    <p className="mt-3 text-sm text-slate-500">Open this folder to view diaries</p>
                  </div>
                );
              })}
            </section>
          )}
        </main>

        {/* CREATE MODAL */}
        {showModal && (
          <CreateFolderModal
            onClose={() => setShowModal(false)}
            onSave={handleCreateFolder}
          />
        )}

        {/* DELETE DIALOG */}
        <ConfirmDialog
          open={deleteOpen}
          setOpen={setDeleteOpen}
          title="Delete Folder?"
          message="This folder will move to trash."
          confirmText="Delete"
          confirmColor="bg-red-500"
          onConfirm={confirmDelete}
        />
      </div>
    </PageWrapper>
  );
}