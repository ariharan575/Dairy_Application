import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../Component/SearchBar";
import Navbar from "../Component/Navbar";
import { PageWrapper } from "../Animation/PageWrapper";
import { useNavigate } from "react-router-dom";
import { Plus, PenLine, MoreVertical } from "lucide-react";
import { Popover, Dialog } from "@headlessui/react";
import {truncateText} from "../utils/truncateText"
import useResponsiveLimit from "../utils/truncateText"
import {
  fetchDiaries,
  formatDate,
  deleteDiaryApi,
  achieveDiaryApi,
  fetchTodayDiaries,
  fetchWeekDiaries,
  fetchMonthDiaries,
  searchDiariesApi
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
  

  const selectedDiaryRef = useRef(null);

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
      setError(null)
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
    } catch(err) {
      setDiaries([]);
      setError(err.message)
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- COLORS (SOFT) ---------------- */

  // 🔥 UI CHANGE: soft pastel gradients (low opacity look)
  const softGradients = [
    "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))",
    "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(59,130,246,0.12))",
    "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(20,184,166,0.12))",
    "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(245,158,11,0.12))",
  ];

  const icons = [PenLine];

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      const res = await fetchDiaries("ACTIVE");
      setDiaries(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDiary = (id) => {
  navigate(`/write-diary/${id}`, {
    state: { status: "ACTIVE" }
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
    const diary = selectedDiaryRef.current;
    if (!diary) return;

    setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    setDeleteOpen(false);
    selectedDiaryRef.current = null;

    try {
      await deleteDiaryApi(diary.id);
    } catch {
      loadDiaries();
    }
  };

  const filteredDiaries = diaries.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="bg-slate-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 py-10 h-[100vh]">
          <SearchBar value={search} onChange={handleSearch} />

          {/* ---------------- HEADER ---------------- */}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl mb-4 font-semibold">
              My Diary
            </p>
          </div>

          {/* ---------------- BUTTONS ---------------- */}

          <div className="flex gap-3 gap-md-4 mb-2">
            <button onClick={() => filterDiaries("TODAY")} className="text-cyan-600 font-medium hover:underline">
              Today
            </button>
            <button onClick={() => filterDiaries("WEEK")} className="text-cyan-600 font-medium hover:underline">
              Week
            </button>
            <button onClick={() => filterDiaries("MONTH")} className="text-cyan-600 font-medium hover:underline">
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

         {loading && (
            <Loader/>
          )}

           { !loading && filteredDiaries.length === 0 && (
              <div className="text-center mt-5">
                       {error && !loading && (
                  <p className="text-center my-4 text-red-500 text-xl font-semibold">{error}</p>
                        )}
                <button
                  className="px-4 py-2 bg-cyan-500 text-white rounded"
                  onClick={() => navigate("/write-diary")}
                >
                  Write Your First Diary
                </button>
              </div>
            )}
 
          {/* ---------------- GRID ---------------- */}

          {!loading && filteredDiaries.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {diaries.map((card, index) => {
                const Icon = icons[index % icons.length];
                const bg = softGradients[index % softGradients.length];

                return (
                  <div
                    key={card.id}
                    onClick={() => openDiary(card.id)}

                    
                    style={{ background: bg }}

                    className="relative cursor-pointer rounded-2xl min-h-[210px] max-h-[225px] p-4
                               shadow-md hover:shadow-xl transition"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <span className="bg-white p-2 rounded-xl shadow">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </span>

                      <Popover className="relative">
                        <Popover.Button
                          onClick={(e) => e.stopPropagation()}
                          className="d-flex outline-none focus:outline-none focus:ring-0 active:outline-none"
                        >
                          <p className="text-gray-500 text-sm fw-semibold">
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
                              achieveDiary(card.id);
                            }}
                            className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Achieve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDiary(card);
                              setDeleteOpen(true);
                              selectedDiaryRef.current = card;
                            }}
                            className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </Popover.Panel>
                      </Popover>
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-semibold mt-3 text-slate-800">
                      {truncateText(card.title,limit)}
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

      {/* ---------------- DELETE CONFIRM ---------------- */}

      <Dialog open={deleteOpen} onClose={setDeleteOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg w-80">
            <Dialog.Title className="font-semibold text-lg">
              Delete Diary?
            </Dialog.Title>

            <p className="text-sm text-gray-500 mt-2">
              This diary will move to trash.
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

export default Diary;
