import React, { useEffect, useState ,useRef} from "react";
import Navbar from "../Component/Navbar";
import SearchBar from "../Component/SearchBar";
import WorkCalendar from "./WorkCalender";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../Animation/PageWrapper";
import {truncateText} from "../utils/truncateText"
import useResponsiveLimit from "../utils/truncateText"

import {
  fetchDiaries,
  formatDate,
  fetchDiaryByDate,
  deleteDiaryApi,
  achieveDiaryApi,
  searchDiariesApi
} from "../api/diaryApi";
import Loader from "../Component/Loader";
import ConfirmDialog from "../Component/ConfirmDialog";
import DiaryActionsPopover from "../Component/DiaryActionsPopover";
import { BookOpen } from "lucide-react";

export default function Calendar() {
  
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  const selectedDiaryRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = dateTime.getHours();

  const isNight = hour >= 19 || hour < 6;

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const limit = useResponsiveLimit(12,18,20)

  useEffect(() => {
    loadDiaries();
  }, []);

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
    } catch (err) {
      setDiaries([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDiaries = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchDiaries("ACTIVE");
      setDiaries(res.data || []);
      if(diaries.length === 0){
        setError("No more diary Exists");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setDiaries([]);
        setError(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "linear-gradient(135deg, rgba(99, 101, 241, 0.2), rgba(169, 85, 247, 0.24))",
    "linear-gradient(135deg, rgba(34, 211, 238, 0.22), rgba(59, 131, 246, 0.29))",
    "linear-gradient(135deg, rgba(52, 211, 153, 0.22), rgba(20, 184, 165, 0.21))",
    "linear-gradient(135deg, rgba(251, 146, 60, 0.23), rgba(245,158,11,0.12))",
  ];

  const handleDateSelect = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDiaryByDate(date);
      setDiaries(res.data || []);
    } catch (err) {
      setDiaries([]);
      setError("No diary found for this date");
    } finally {
      setLoading(false);
    }
  };

  const openDiary = (id) => {
    navigate(`/write-diary/${id}`);
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

  const filteredDiaries = diaries;

  return (
    <PageWrapper>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-2.5 px-md-5 mx-auto py-4">
        <div className="mb-4">
          <SearchBar value={search} onChange={handleSearch} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 gap-lg-5">

          {/* LEFT PANEL (UNCHANGED) */}
          <aside className="w-full md:w-[270px] lg:w-[320px] md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:overflow-hidden">
            <div className="hidden md:flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm mb-4">
              {isNight ? (
                <i className="bi bi-moon-fill text-secondary" style={{ fontSize: "25px" }}></i>
              ) : (
                <i className="bi bi-brightness-high-fill text-warning fs-4"></i>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800">{formattedTime}</p>
                <p className="text-xs text-slate-500">{formattedDate}</p>
              </div>
            </div>

            <div className="hidden md:block bg-white rounded-xl shadow-sm p-3 mb-4">
              <p className="text-xs text-slate-500">Total Diaries</p>
              <p className="text-xl font-bold text-cyan-600">
                {diaries.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-3">
              <h4 className="ps-5 mb-2">Calendar</h4>
              <WorkCalendar onDateSelect={handleDateSelect} />
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="flex-1 md:h-[calc(100vh-2rem)]">
            {loading && <Loader/>}

            {!loading && filteredDiaries.length === 0 && (
              <div className="text-center mt-5">
                       {error && !loading && (
                  <p className="text-center my-4 text-red-500 text-xl font-semibold">{error}</p>
                        )}
                <button
                  className="px-4 py-2 bg-cyan-500 text-white rounded"
                  onClick={() => navigate("/write_diary")}
                >
                  Write Your First Diary
                </button>
              </div>
            )}

            {!loading && filteredDiaries.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDiaries.map((item, index) => {
                  const gradient = colors[index % colors.length];

                  return (
                    <article
                      key={item.id}
                      className="relative bg-white border px-4 py-3 shadow-sm min-h-[200px] flex flex-col"
                      onClick={() => openDiary(item.id)}
                    >
                      <div className="absolute inset-0 m-1 rounded-3" style={{ background: gradient }} />

                      <div className="flex justify-between items-center relative">
                        <div className="flex items-center gap-2">
                        <BookOpen
                          className="text-purple-500 mt-0"
                          size={21}
                        />
                      </div>

                      {/* CENTRALIZED POPOVER */}
                      <DiaryActionsPopover
                        date={formatDate(item.createdAt)}
                        type="ACTIVE"
                        onOpen={() => openDiary(item.id)}
                        onArchive={() => achieveDiary(item.id)}
                        onDelete={() => {
                          selectedDiaryRef.current = item;
                          setSelectedDiary(item);
                          setDeleteOpen(true);
                        }}
                      />
                    </div>

                      <p className="text-sm h6 font-semibold mb-2">
                        {truncateText(item.title || "Untitled",limit)}
                      </p>

                      <p className="text-sm text-[#6b7280] break-words line-clamp-3">
                        {item.content}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* CENTRALIZED CONFIRM DIALOG */}
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
}
