import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../MainComponent/Navbar";
import SearchBar from "../Component/SearchBar";
import { PageWrapper } from "../Animation/PageWrapper";
import { MoreVertical, BookOpen } from "lucide-react";
import { Popover, Dialog } from "@headlessui/react";

import {
  fetchDiaries,
  permanantlyDelete,
  restoreDiaryApi,
  formatDate,
  searchDiariesApi,   
} from "../api/diaryApi";

const AchievedDiary = () => {
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const selectedDiaryRef = useRef(null);

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

  /* ---------------- BACKEND SEARCH ---------------- */

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
    navigate(`/write_diary/${id}`, {
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
    const diary = selectedDiaryRef.current;
    if (!diary) return;

    setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    setDeleteOpen(false);
    selectedDiaryRef.current = null;

    try {
      await permanantlyDelete(diary.id);
    } catch {
      loadAchieved();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <PageWrapper>
      <div className="bg-slate-100 h-[100vh]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-3 px-md-6 py-10">
          {/* ✅ FIXED SEARCHBAR CONNECTION */}
          <SearchBar value={search} onChange={handleSearch} />

          <h2 className="text-3xl font-semibold text-[#008080] my-4 ps-2">
            Achieved Diaries
          </h2>

          {loading && (
            <p className="text-center text-slate-500 mt-10">
              Loading ...
            </p>
          )}

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
                    className="relative rounded-2xl p-4 p-md-4.5 bg-white min-h-[210px] max-h-[225px] shadow-md hover:shadow-xl transition"
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-10`}
                    />

                    {/* HEADER */}
                    <div className="flex justify-between items-center relative">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-purple-500 mt-0" size={21} />
                      </div>

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

                        <Popover.Panel className="absolute right-0 mt-2 w-32 bg-white rounded shadow border z-50">
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

                    {/* CONTENT */}
                    <p className="text-lg h5 font-semibold relative">
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

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onClose={setDeleteOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg w-80">
            <Dialog.Title className="font-semibold text-lg">
              Permanently Delete?
            </Dialog.Title>

            <p className="text-sm text-gray-500 mt-2">
              This diary will be permanently removed.
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

export default AchievedDiary;
