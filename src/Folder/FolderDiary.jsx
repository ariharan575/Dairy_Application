import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import SearchBar from "../Component/SearchBar";
import { PageWrapper } from "../Animation/PageWrapper";
import { PenLine, Plus } from "lucide-react";
import {
  fetchDiaryByFolder,
  permanantlyDelete,
  restoreFolderDiaryApi,
  formatDate,
  achieveDiaryApi
} from "../api/diaryApi";
import {
  fetchAchivedFolderById,
  searchDiaryByFolder,
} from "../api/folderApi";
import api from "../api/axios";
import Loader from "../Component/Loader";
import ConfirmDialog from "../Component/ConfirmDialog";
import { truncateText } from "../utils/truncateText";
import DiaryActionsPopover from "../Component/DiaryActionsPopover";
import useResponsiveLimit from "../utils/truncateText";

const FolderDiary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [folderStatus, setFolderStatus] = useState({
    id: "",
    status: "ACTIVE", // default
  });

  const selectedDiaryRef = useRef(null);

  const limit = useResponsiveLimit(12, 18, 22);

  const colors = [
    "from-yellow-400 to-yellow-500",
    "from-indigo-400 to-indigo-500",
    "from-green-400 to-green-500",
    "from-teal-400 to-teal-500",
  ];

  /* ---------------- LOAD FOLDER ---------------- */
  useEffect(() => {
    loadFolder();
  }, [id]);

  const loadFolder = async () => {
    try {
      const res = await api.get(`/folder/fetch/${id}`);
      setFolderStatus({ id: res.data.id, status: res.data.status });
      setFolderName(res.data.folderName);
    } catch {
      try {
        const res = await fetchAchivedFolderById(id);
        setFolderStatus({ id: res.data.id, status: res.data.status });
        setFolderName(res.data.folderName);
      } catch {
        setFolderName("Folder Diaries");
      }
    }
  };

  /* ---------------- LOAD DIARIES ---------------- */
  useEffect(() => {
    if (!folderStatus.id) return;
    loadDiaries();
  }, [folderStatus]);

  const loadDiaries = async () => {
    try {
      setLoading(true);
      const res = await fetchDiaryByFolder(folderStatus.id);
      setDiaries(res.data.content || []);
      setError(null);
    } catch {
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search && folderStatus.id) {
        handleSearch(search);
      } else if (!search) {
        loadDiaries();
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delay);
  }, [search]);

  const handleSearch = async (value) => {
    if (!folderStatus.id) return;

    try {
      setLoading(true);
      const res = await searchDiaryByFolder(
        folderStatus.id,
        value,
        folderStatus.status
      );
      setDiaries(res.data.content || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const openDiary = (diaryId) => {
    navigate(`/write-diary/${diaryId}`, {
      state: { status: folderStatus.status },
    });
  };

    const hanldeAchieve = async (id) => {
     setDiaries((prev) => prev.filter((d) => d.id !== id));
  
      try {
        await achieveDiaryApi(id);
      } catch {
        loadDiaries();
      }
    };

  const confirmDelete = async () => {
    const diary = selectedDiaryRef.current;
    if (!diary) return;

    try {
      await permanantlyDelete(diary.id);
      setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    } catch {
      loadDiaries();
    } finally {
      setDeleteOpen(false);
      selectedDiaryRef.current = null;
    }
  };

  const handleRestore = async (diary) => {
    try {
      await restoreFolderDiaryApi(diary.id, folderStatus.id, folderStatus.status);
      setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    } catch {}
  };

  /* ---------------- UI ---------------- */
  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
          <SearchBar value={search} onChange={setSearch} />

          <div className="my-4 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#008080]">{folderName}</h2>

            <button
              onClick={() =>
                navigate("/write-diary", {
                  state: { folderId: folderStatus.id, folderName },
                })
              }
              className="flex items-center gap-1 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          {loading && <Loader />}

          {!loading && diaries.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-red-500 mb-4">No diary exists in this folder</p>
              <button
                onClick={() =>
                  navigate("/write-diary", {
                    state: { folderId: folderStatus.id, folderName },
                  })
                }
                className="bg-cyan-500 text-white px-6 py-2 rounded"
              >
                Write Your First Diary
              </button>
            </div>
          )}

          {!loading && diaries.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {diaries.map((card, index) => {
                const gradient = colors[index % colors.length];

                return (
                  <div
                    key={card.id}
                    className="relative cursor-pointer bg-white min-h-[205px] p-4 shadow-md hover:shadow-xl"
                    onClick={() => openDiary(card.id)}
                  >
                    <div
                      className={`absolute inset-0 m-1 bg-gradient-to-r ${gradient} opacity-20 rounded`}
                    />

                    <div className="flex justify-between items-center relative z-10">
                      <span className="bg-white p-2 rounded-xl shadow">
                        <PenLine className="h-5 w-5 text-slate-700" />
                      </span>

                      <DiaryActionsPopover
                        date={formatDate(card.createdAt)}
                        type={folderStatus.status === "ACHIEVED" ? "ACHIEVED" : "ACTIVE"}
                        onOpen={() => openDiary(card.id)}
                        onArchive={()=>hanldeAchieve(card.id)}
                        onRestore={() => handleRestore(card)}
                        onDelete={() => {
                          selectedDiaryRef.current = card;
                          setDeleteOpen(true);
                        }}
                      />
                    </div>

                    <h4 className="text-lg font-semibold mt-3 text-slate-800">
                      {truncateText(card.title, limit)}
                    </h4>

                    <p className="text-sm text-[#6b7280] break-words line-clamp-3">
                      {card.content}
                    </p>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      </div>

      {/* CENTRALIZED CONFIRM DIALOG */}
      <ConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Diary?"
        message="This diary will be permanently deleted."
        confirmText="Delete"
        confirmColor="bg-red-500"
        onConfirm={confirmDelete}
      />
    </PageWrapper>
  );
};

export default FolderDiary;