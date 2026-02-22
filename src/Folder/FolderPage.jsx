import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Plus, MoreVertical } from "lucide-react";
import Navbar from "../Component/Navbar";
import { PageWrapper } from "../Animation/PageWrapper";
import SearchBar from "../Component/SearchBar";
import {
  fetchAllFolders,
  fetchAllAchivedFolders,
  createFolder,
  deleteFolder,
  archiveFolder,
  searchFolder,
} from "../api/folderApi";
import CreateFolderModal from "./CreateFolderModal";
import { Dialog } from "@headlessui/react";
import Loader from "../Component/Loader";

export default function FolderPage() {
  
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [achived,setAchived] = useState(false);

  const selectedFolderRef = useRef(null);

  // 🌈 SOFT / LIGHT ENTERPRISE COLORS
  const softGradients = [
    "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))",
    "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(59,130,246,0.12))",
    "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(20,184,166,0.12))",
    "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(245,158,11,0.12))",
    "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(251,113,133,0.12))",
    "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(217,70,239,0.12))",
  ];

  /* ---------------- LOAD ---------------- */

useEffect(() => {
  loadFolders();
}, [achived]);   

  const loadFolders = async () => {
    if(achived){
      try{
        setLoading(true);
        const res = await fetchAllAchivedFolders();
        setFolders(res.data || []);
      }catch(err){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    } else{

    try {
      setLoading(true);
      const res = await fetchAllFolders();
      setFolders(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }};

  /* ---------------- SEARCH ---------------- */

const handleSearch = async (text) => {
  setSearch(text);

  if (!text.trim()) {
    loadFolders();
    return;
  }

  try {
    const res = await searchFolder(text);
    setFolders(res.data.content);   
  } catch (err) {
    setFolders([]); 
  }
};


  /* ---------------- CREATE ---------------- */

  const handleCreateFolder = async (name) => {
    await createFolder({ folderName: name });
    setShowModal(false);
    loadFolders();
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

  /* ---------------- ARCHIVE ---------------- */

  const archive = async (id) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));

    try {
      await archiveFolder(id);
    } catch {
      loadFolders();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
    <div className="h-[100vh] bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-2.5 px-md-5 py-10">

        <SearchBar 
            value={search}
            onChange={handleSearch}
/>

        <div className="flex justify-between items-center px-2.5 px-md-5 my-6">
          <h2 className="text-3xl font-semibold text-[#008080]">
            My Folder
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-full bg-cyan-500  px-6 py-1.5 py-md-2 text-white shadow-lg"
          >
            <Plus size={18} />
            Create
          </button>
        </div>

        <div className="flex gap-4 mb-3.5 mt-5">
          <button
           onClick={() => setAchived(false)} 
            className={`px-4 py-1 rounded ${
               !achived
                ? "bg-cyan-500 text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            Active
          </button>

          <button
          onClick={() => setAchived(true)} 
            className={`px-4 py-1 rounded ${
               achived
                ? "bg-cyan-500 text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            Achieved
          </button>
        </div>

        {loading && (
          <Loader/>
        )}

        {!loading && folders.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-red-500 fs-5 mb-4">
              No folders created yet
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-cyan-500 text-white px-6 py-2 rounded"
            >
              Create Your First Folder
            </button>
          </div>
        )}

        {/* ================= FOLDER GRID ================= */}
        
        {!loading && folders.length > 0 && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder, index) => {
              const bg = softGradients[index % softGradients.length];

              return (
                <div
                  key={folder.id}
                  onClick={() => navigate(`/folder/${folder.id}`)}
                  style={{ background: bg }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl p-4 shadow-md
                   transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-white p-3">
                      <Folder className="h-5 w-5 text-slate-700" />
                    </div>

                    <div className="d-flex outline-none focus:outline-none focus:ring-0 active:outline-none">
                      <p className="text-gray-500 text-sm fw-semibold">
                        {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                  
                      <MoreVertical size={18}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === folder.id ? null : folder.id
                          );
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800">
                    {folder.folderName}
                  </h3>

                  <p className="mt-3 text-sm text-slate-500">
                    Open this folder to view diaries
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Open
                    </span>
                    <div className="h-2 w-12 rounded-full bg-slate-300" />
                  </div>

                  {/* ---------- MENU ---------- */}
                  {openMenuId === folder.id && (
                    <div
                      className="absolute right-4 top-12 z-30 w-32 bg-white shadow-lg rounded-lg text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/folder/${folder.id}`)
                        }
                        className="block w-full px-4 py-2 hover:bg-slate-100"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => archive(folder.id)}
                        className="block w-full px-4 py-2 hover:bg-slate-100"
                      >
                        Archive
                      </button>

                      <button
                        onClick={() => {
                          selectedFolderRef.current = folder;
                          setDeleteOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-red-500 hover:bg-slate-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>

      {showModal && (
        <CreateFolderModal
          onClose={() => setShowModal(false)}
          onSave={handleCreateFolder}
        />
      )}

      {/* ================= DELETE CONFIRM ================= */}
      <Dialog open={deleteOpen} onClose={setDeleteOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg w-80">
            <Dialog.Title className="font-semibold text-lg">
              Delete Folder?
            </Dialog.Title>

            <p className="text-sm text-gray-500 mt-2">
              This folder will move to trash.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
    </PageWrapper>
  );
}
 