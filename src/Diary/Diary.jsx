import React, { useEffect, useState } from "react";
import SearchBar from "../Component/SearchBar";
import Navbar from "../Component/Navbar";
import { PageWrapper } from "../Animation/PageWrapper";
import { useNavigate } from "react-router-dom";
import { Plus, PenLine } from "lucide-react";
import { truncateText } from "../utils/truncateText";
import useResponsiveLimit from "../utils/truncateText";

import DiaryActionsPopover from "../Component/DiaryActionsPopover";
import ConfirmDialog from "../Component/ConfirmDialog";

import {
  fetchDiaries,
  formatDate,
  deleteDiaryApi,
  achieveDiaryApi,
  fetchTodayDiaries,
  fetchWeekDiaries,
  fetchMonthDiaries,
  searchDiariesApi,
} from "../api/diaryApi";

import Loader from "../Component/Loader";

const Diary = () => {
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const limit = useResponsiveLimit(12, 18, 22);

  /* ---------------- SEARCH ---------------- */

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      loadDiaries();
      return;
    }

    try {
      setLoading(true);
      const res = await searchDiariesApi(value);
      setDiaries(res.data.content || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filterDiaries = async (type) => {
    setLoading(true);

    try {
      let res;

      if (type === "TODAY") res = await fetchTodayDiaries();
      else if (type === "WEEK") res = await fetchWeekDiaries();
      else if (type === "MONTH") res = await fetchMonthDiaries();

      setDiaries(res.data || []);
      setError(null);
    } catch (err) {
      setDiaries([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- COLORS ---------------- */

  const softGradients = [
    "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))",
    "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(59,130,246,0.12))",
    "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(20,184,166,0.12))",
    "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(245,158,11,0.12))",
  ];

  const icons = [PenLine];

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      setLoading(true);
      const res = await fetchDiaries("ACTIVE");
      setDiaries(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */

  const openDiary = (id) => {
    navigate(`/write-diary/${id}`, {
      state: { status: "ACTIVE" },
    });
  };

  const achieveDiary = async (id) => {
    setDiaries((prev) => prev.filter((d) => d.id !== id));

    try {
      await achieveDiaryApi(id);
    } catch {
      loadDiaries();
    }
  };

  const confirmDelete = async () => {
    if (!selectedDiary) return;

    setDiaries((prev) =>
      prev.filter((d) => d.id !== selectedDiary.id)
    );

    setDeleteOpen(false);

    try {
      await deleteDiaryApi(selectedDiary.id);
    } catch {
      loadDiaries();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
      <div className="bg-slate-100 h-[100vh]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 py-10 h-[100vh] bg-slate-100">
          <SearchBar value={search} onChange={handleSearch} />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl mb-4 font-semibold">
              My Diary
            </p>
          </div>

          <div className="flex gap-3 mb-2">
            <button
              onClick={() => filterDiaries("TODAY")}
              className="text-cyan-600 font-medium hover:underline"
            >
              Today
            </button>

            <button
              onClick={() => filterDiaries("WEEK")}
              className="text-cyan-600 font-medium hover:underline"
            >
              Week
            </button>

            <button
              onClick={() => filterDiaries("MONTH")}
              className="text-cyan-600 font-medium hover:underline"
            >
              Month
            </button>

            <button
              onClick={() => navigate("/write-diary")}
              className="ms-auto flex items-center gap-1 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          {loading && <Loader />}

          {!loading && diaries.length === 0 && (
            <div className="text-center mt-5">
              {error && (
                <p className="text-red-500 text-xl font-semibold">
                  {error}
                </p>
              )}

              <button
                className="px-4 py-2 bg-cyan-500 text-white rounded"
                onClick={() => navigate("/write-diary")}
              >
                Write Your First Diary
              </button>
            </div>
          )}

          {!loading && diaries.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {diaries.map((card, index) => {
                const Icon = icons[index % icons.length];
                const bg = softGradients[index % softGradients.length];

                return (
                  <div
                    key={card.id}
                    onClick={() => openDiary(card.id)}
                    style={{ background: bg }}
                    className="relative cursor-pointer rounded-2xl min-h-[210px] 
                    max-h-[225px] p-4 shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-white p-2 rounded-xl shadow">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </span>

                      <DiaryActionsPopover
                        date={formatDate(card.createdAt)}
                        type="ACTIVE"
                        onOpen={() => openDiary(card.id)}
                        onArchive={() => achieveDiary(card.id)}
                        onDelete={() => {
                          setSelectedDiary(card);
                          setDeleteOpen(true);
                        }}
                      />
                    </div>

                    <h5 className="text-lg font-semibold mt-3 text-slate-800">
                      {truncateText(card.title, limit)}
                    </h5>

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

      <ConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Diary?"
        message="This diary will move to trash."
        confirmText="Delete"
        confirmColor="bg-red-500"
        onConfirm={confirmDelete}
      />
    </PageWrapper>
  );
};

export default Diary;