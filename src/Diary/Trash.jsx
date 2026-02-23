import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import SearchBar from "../Component/SearchBar";
import { PageWrapper } from "../Animation/PageWrapper";
import { BookOpen } from "lucide-react";

import DiaryActionsPopover from "../Component/DiaryActionsPopover";
import ConfirmDialog from "../Component/ConfirmDialog";

import {
  fetchDiaries,
  permanantlyDelete,
  restoreDiaryApi,
  formatDate,
  searchDiariesApi,
} from "../api/diaryApi";

import Loader from "../Component/Loader";

const TrashDiary = () => {
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const colors = [
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-blue-400 to-indigo-500",
    "from-orange-400 to-red-500",
    "from-pink-400 to-purple-500",
  ];

  /* ---------------- LOAD TRASH ---------------- */

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await fetchDiaries("TRASH");
      setDiaries(res.data || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.response?.data?.message || "No trash diaries found");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      loadTrash();
      return;
    }

    try {
      setLoading(true);
      const res = await searchDiariesApi(value, "TRASH");
      setDiaries(res.data.content || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.response?.data?.message || "No diary found in trash");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OPEN ---------------- */

  const openDiary = (id) => {
    navigate(`/write-diary/${id}`, {
      state: { status: "TRASH" },
    });
  };

  /* ---------------- RESTORE ---------------- */

  const handleRestore = async (diary) => {
    setDiaries((prev) => prev.filter((d) => d.id !== diary.id));

    try {
      await restoreDiaryApi(diary.id, "TRASH");
    } catch {
      loadTrash();
    }
  };

  /* ---------------- DELETE ---------------- */

  const confirmDelete = async () => {
    if (!selectedDiary) return;

    setDiaries((prev) =>
      prev.filter((d) => d.id !== selectedDiary.id)
    );

    setDeleteOpen(false);

    try {
      await permanantlyDelete(selectedDiary.id);
    } catch {
      loadTrash();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
      <div className="bg-slate-100 h-[100vh]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 px-md-6 py-10 bg-slate-100">
          <SearchBar value={search} onChange={handleSearch} />

          <h2 className="text-3xl font-semibold text-[#008080] my-4 ps-2">
            Trashed Diaries
          </h2>

          {loading && <Loader />}

          {error && !loading && (
            <p className="text-center mt-5 text-red-500 font-semibold">
              {error}
            </p>
          )}

          {!loading && diaries.length === 0 && !error && (
            <div className="text-center mt-10 text-gray-500">
              No Diaries Found in Trash
            </div>
          )}

          {!loading && diaries.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {diaries.map((card, index) => {
                const gradient = colors[index % colors.length];

                return (
                  <div
                    key={card.id}
                    className="relative rounded-2xl p-4 p-md-4.5 bg-white min-h-[190px] sm:min-h-[200px] lg:min-h-[210px]
                      shadow-md hover:shadow-xl transition"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-10`}
                    />

                    {/* HEADER */}
                    <div className="flex justify-between items-center relative">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          className="text-purple-500 mt-0"
                          size={21}
                        />
                      </div>

                      <DiaryActionsPopover
                        date={formatDate(card.createdAt)}
                        type="TRASH"
                        onOpen={() => openDiary(card.id)}
                        onRestore={() => handleRestore(card)}
                        onDelete={() => {
                          setSelectedDiary(card);
                          setDeleteOpen(true);
                        }}
                      />
                    </div>

                    {/* CONTENT */}
                    <p className="text-lg h6 font-semibold relative">
                      {card.title}
                    </p>

                    <p className="text-sm text-slate-600 break-words line-clamp-3 relative">
                      {card.content}
                    </p>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Permanently Delete?"
        message="This diary will be permanently removed."
        confirmText="Delete"
        confirmColor="bg-red-500"
        onConfirm={confirmDelete}
      />
    </PageWrapper>
  );
};

export default TrashDiary;