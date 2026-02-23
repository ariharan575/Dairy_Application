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

const AchievedDiary = () => {
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const colors = [
    "from-pink-400 to-purple-500",
    "from-blue-400 to-indigo-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-cyan-400 to-blue-500",
  ];

  /* ---------------- LOAD ACHIEVED ---------------- */

  useEffect(() => {
    loadAchieved();
  }, []);

  const loadAchieved = async () => {
    try {
      setLoading(true);
      const res = await fetchDiaries("ACHIEVED");
      setDiaries(res.data || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.response?.data?.message || "No achieved diaries found");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH ---------------- */

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      loadAchieved();
      return;
    }

    try {
      setLoading(true);
      const res = await searchDiariesApi(value, "ACHIEVED");
      setDiaries(res.data.content || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.response?.data?.message || "No achieved diary found");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OPEN ---------------- */

  const openDiary = (id) => {
    navigate(`/write-diary/${id}`, {
      state: { status: "ACHIEVED" },
    });
  };

  /* ---------------- RESTORE ---------------- */

  const handleRestore = async (diary) => {
    setDiaries((prev) => prev.filter((d) => d.id !== diary.id));

    try {
      await restoreDiaryApi(diary.id, "ACHIEVED");
    } catch {
      loadAchieved();
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
      loadAchieved();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
      <div className="bg-slate-100 h-[100vh]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 px-md-6 py-10 bg-slate-100 ">
          <SearchBar value={search} onChange={handleSearch} />

          <h2 className="text-3xl font-semibold text-[#008080] my-4 ps-2">
            Achieved Diaries
          </h2>

          {loading && <Loader />}

          {error && !loading && (
            <p className="text-center mt-5 text-red-500 font-semibold">
              {error}
            </p>
          )}

          {!loading && diaries.length === 0 && !error && (
            <div className="text-center mt-10 text-gray-500">
              No Achieved Diaries Found
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
                        type="ACHIEVED"
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

export default AchievedDiary;