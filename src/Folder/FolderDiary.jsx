import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import SearchBar from "../Component/SearchBar";
import { PageWrapper } from "../Animation/PageWrapper";
import { PenLine, Plus, MoreVertical } from "lucide-react";
import { Popover, Dialog } from "@headlessui/react";
import {
  fetchDiaryByFolder,
  permanantlyDelete,
  restoreFolderDiaryApi,
  formatDate,
} from "../api/diaryApi";
import api from "../api/axios";
import Loader from "../Component/Loader";

const FolderDiary = () => {
  const { id } = useParams(); // folderId
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selectedDiaryRef = useRef(null);

  const colors = [
    "from-yellow-400 to-yellow-500",
    "from-indigo-400 to-indigo-500",
    "from-green-400 to-green-500",
    "from-teal-400 to-teal-500",
  ];

  const icons = [PenLine];

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadFolder();
    loadDiaries();
  }, [id]);

  const loadFolder = async () => {
    try {
      const res = await api.get(`/folder/fetch/${id}`);
      setFolderName(res.data.folderName);
    } catch {
      setFolderName("Folder Diaries");
    }
  };

  const loadDiaries = async () => {
    try {
      setLoading(true);
      const res = await fetchDiaryByFolder(id);
      setDiaries(res.data.content || []);
    } catch {
      setError("Failed to load diaries");
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  /* ---------------- ACTIONS ---------------- */

  const openDiary = (diaryId) => {
    navigate(`/write-diary/${diaryId}`, {
      state: { status: "ACTIVE" },
    });
  };

  const confirmDelete = async () => {
    const diary = selectedDiaryRef.current;
    if (!diary) return;

    try {
      await permanantlyDelete(diary.id);
      setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    } catch (err) {
      console.error("Permanent delete failed", err);
      loadDiaries();
    } finally {
      setDeleteOpen(false);
      selectedDiaryRef.current = null;
    }
  };

  const handleRestore = async (diary) => {
    try {
      await restoreFolderDiaryApi(diary.id, id, "ACTIVE");
      setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredDiaries = diaries.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
          <SearchBar value={search} onChange={handleSearch} />

          <div className="my-4 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#008080]">
              {folderName}
            </h2>

            <button
              onClick={() =>
                navigate("/write-diary", {
                  state: { folderId: id, folderName },
                })
              }
              className="flex items-center gap-1 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          {loading && (
            <Loader/>
          )}

          {!loading && filteredDiaries.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-red-500 fs-4 mb-4">
                No diary exists in this folder
              </p>

              <button
                onClick={() =>
                  navigate("/write-diary", {
                    state: { folderId: id, folderName },
                  })
                }
                className="bg-cyan-500 text-white px-6 py-2 rounded"
              >
                Write Your First Diary
              </button>
            </div>
          )}

          {!loading && filteredDiaries.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {filteredDiaries.map((card, index) => {
                const Icon = icons[index % icons.length];
                const gradient = colors[index % colors.length];

                return (
                  <div
                    key={card.id}
                    className="relative cursor-pointer bg-white min-h-[205px] p-4 shadow-md hover:shadow-xl"
                    onClick={() => openDiary(card.id)}
                  >
                    <div
                      className={`absolute inset-0 m-1 bg-gradient-to-r ${gradient} opacity-20 rounded`}
                    ></div>

                    <div className="flex justify-between items-center">
                      <span className="bg-white p-2 rounded-xl shadow relative z-10">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </span>

                      <Popover className="relative z-10">
                        <Popover.Button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 outline-none"
                        >
                          <p className="text-gray-500 text-sm">
                            {formatDate(card.createdAt)}
                          </p>
                          <MoreVertical size={18} />
                        </Popover.Button>

                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-32 bg-white rounded shadow border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDiary(card.id);
                            }}
                            className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Open
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(card);
                            }}
                            className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Restore
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              selectedDiaryRef.current = card;
                              setDeleteOpen(true);
                            }}
                            className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </Popover.Panel>
                      </Popover>
                    </div>

                    <h4 className="text-lg font-semibold mt-2 relative z-10">
                      {card.title}
                    </h4>

                    <p className="text-sm text-slate-500 line-clamp-3 relative z-10">
                      {card.content}
                    </p>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      </div>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteOpen} onClose={setDeleteOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg w-80">
            <Dialog.Title className="font-semibold text-lg">
              Delete Diary?
            </Dialog.Title>

            <p className="text-sm text-gray-500 mt-2">
              This diary will be permanently deleted.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeleteOpen(false)}>Cancel</button>

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
    </PageWrapper>
  );
};

export default FolderDiary;
