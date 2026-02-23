import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import { useAuth } from "../auth/AuthContext";
import {
  fetchDiaries,
  formatDate,
  fetchTodayDiaries,
  fetchWeekDiaries,
  fetchMonthDiaries,
  achieveDiaryApi,
  deleteDiaryApi,
} from "../api/diaryApi";
import { truncateText } from "../utils/truncateText";
import useResponsiveLimit from "../utils/truncateText";
import Loader from "../Component/Loader";
import DiaryActionsPopover from "../Component/DiaryActionsPopover";
import ConfirmDialog from "../Component/ConfirmDialog";

export default function LandingPage() {
  const { logout } = useAuth();
  const firstName = localStorage.getItem("firstName");
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null); // For spinner overlay

  // -------------------- FIX ADDED --------------------
  // Show "No diary entries yet" after last diary is archived/deleted
  useEffect(() => {
    if (!loading && diaries.length === 0) {
      setError("No diary entries yet");
    } else {
      setError(null);
    }
  }, [diaries, loading]);
  // ---------------------------------------------------

  const filterDiaries = async (type) => {
    setLoading(true);
    try {
      let res;
      if (type === "TODAY") res = await fetchTodayDiaries();
      else if (type === "WEEK") res = await fetchWeekDiaries();
      else if (type === "MONTH") res = await fetchMonthDiaries();
      else res = await fetchDiaries("ACTIVE");
      setDiaries(res.data || []);
    } catch (err) {
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    setLoading(true);
    try {
      const res = await fetchDiaries("ACTIVE");
      setDiaries(res.data);
    } catch (err) {
      if (err.code === "DIARY_NOT_FOUND") {
        setError("No diary entries yet ");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-md-slate-200 px-md-3 py-md-3 px-4 h-[100vh]">
        <div className="mx-auto max-w-7xl space-y-10">
          {/* HERO SECTION */}
          <section className="rounded-md-xl my-0 my-md-5 bg-white p-4 shadow-md-md text-center">
            <h1 className="mb-3 text-3xl font-bold text-[#111827]">
              Hi there, {firstName} 👋
            </h1>
            <p className="mx-auto max-w-2xl text-[#6b7280]">
              Where your thoughts find reflection. This is your private space
              to write, reflect, and relive your memories anytime, anywhere.
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate("/write-diary")}
                className="rounded-md bg-cyan-500 px-1.5  px-md-6 py-md-2 text-sm 
                      font-semibold text-white shadow hover:bg-cyan-600 transition"
              >
                Write Diary
              </button>

              <button
                onClick={logout}
                className="rounded-md border border-gray-300 px-6 py-2 text-sm 
              font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Sign up
              </button>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="grid bg-white grid-cols-1 px-md-2 mb-0 gap-6 md:grid-cols-3 ">
            <QuickCard
              icon="bi bi-journal-plus"
              title="My Folder"
              subtitle="View Folder"
              onClick={() => navigate("/folder")}
            />
            <QuickCard
              icon="bi bi-card-text"
              title="My Diaries"
              subtitle="View All Entries"
              onClick={() => navigate("/diary")}
            />
            <QuickCard
              icon="bi bi-calendar-date"
              title="Calendar"
              subtitle="View by Date"
              onClick={() => navigate("/calender")}
            />
          </section>

          {/* RECENT DIARY */}
          <section className="rounded-xl bg-white p-md-3 shadow-md-md">
            <div className="mb-md-6 flex items-center justify-between">
              <p className="text-xl h1 font-semibold pt-5 pb-2 text-[#111827]">
                Recent Diary
              </p>
            </div>

            <div className="contain d-flex gap-2 gap-md-4 mb-3">
              <button
                className="text-cyan-600 cursor-pointer font-medium hover:underline decoration-1.5"
                onClick={() => filterDiaries("TODAY")}
              >
                Today
              </button>

              <button
                className="text-cyan-600 cursor-pointer font-medium hover:underline decoration-1.5"
                onClick={() => filterDiaries("WEEK")}
              >
                Week
              </button>

              <button
                className="text-cyan-600 font-medium cursor-pointer hover:underline decoration-1.5"
                onClick={() => filterDiaries("MONTH")}
              >
                Month
              </button>

              <button
                className="text-cyan-600 font-medium ms-auto text-sm me-2 me-lg-5 cursor-pointer hover:underline decoration-1.5"
                onClick={() => navigate("/diary")}
              >
                View All
              </button>
            </div>

            {loading && <Loader />}

            {error && !loading && (
              <div className="text-center mt-5 min-vh-100">
                <h2 className=" text-3xl fw-bold text-[#008080]">{error}</h2>
                <button
                  type="submit"
                  className="px-4 m-auto text-white p-2.5 font-semibold rounded-1
              my-4 bg-cyan-500 shadow-md hover:bg-cyan-700 transition"
                  onClick={() => navigate("/write-diary")}
                >
                  Write Your First Diary
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diaries.map((item, index) => (
                <DiaryCard
                  key={item.id}
                  item={item}
                  index={index}
                  loadDiaries={loadDiaries}
                  loadingItemId={loadingItemId}
                  setLoadingItemId={setLoadingItemId}
                  diaries={diaries}
                  setDiaries={setDiaries}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// --------------------- QuickCard ---------------------
function QuickCard({ title, subtitle, onClick, icon }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl p-6 bg-gray-100 mt-2 
      shadow-md transition hover:-translate-y-1 hover:shadow-lg hover:bg-gradient-to-r from-cyan-100 to-blue-100"
    >
      <p className={` fs-3 text-success float-left me-3 ${icon}`}></p>
      <h3 className="text-lg h4 font-semibold text-[#111827]">{title}</h3>
      <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
    </div>
  );
}

// --------------------- DiaryCard ---------------------
function DiaryCard({
  item,
  index,
  loadDiaries,
  diaries,
  setDiaries,
  loadingItemId,
  setLoadingItemId,
}) {
  const navigate = useNavigate();
  const colors = ["bg-yellow-400", "bg-indigo-400", "bg-green-400"];
  const limit = useResponsiveLimit(12, 18, 22);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const color = colors[index % colors.length];

  const openDiary = () => {
    if (loadingItemId === item.id) return; // prevent click while spinner
    navigate(`/write-diary/${item.id}`);
  };

  // Optimistic Achieve
  const achieveDiary = async (e) => {
    e?.stopPropagation();
    setLoadingItemId(item.id);
    setDiaries((prev) => prev.filter((d) => d.id !== item.id));
    try {
      await achieveDiaryApi(item.id);
    } catch {
      setDiaries((prev) => [...prev, item]);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Optimistic Delete
  const confirmDelete = async () => {
    setLoadingItemId(item.id);
    setDiaries((prev) => prev.filter((d) => d.id !== item.id));
    setDeleteOpen(false);
    try {
      await deleteDiaryApi(item.id);
    } catch {
      setDiaries((prev) => [...prev, item]);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div
      className="relative rounded-xl bg-gray-100 p-6 shadow-sm transition 
      min-h-[200px] hover:-translate-y-1 hover:shadow-lg hover:shadow-md"
      onClick={openDiary}
    >
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${color}`} />

      <div className="mb-2 flex items-start justify-between font-semibold text-[#111827]">
        <span className="text-md">{truncateText(item.title, limit)}</span>

        <DiaryActionsPopover
          date={formatDate(item.createdAt)}
          onOpen={openDiary}
          onArchive={achieveDiary}
          onDelete={() => {
            setSelectedDiary(item);
            setDeleteOpen(true);
          }}
          type="ACTIVE"
        />
      </div>

      <p className="text-sm text-[#6b7280] break-words line-clamp-3">{item.content}</p>

      {/* Spinner Overlay */}
      {loadingItemId === item.id && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Diary?"
        message="This diary will move to trash."
        confirmText="Delete"
        onConfirm={confirmDelete}
        confirmColor="bg-red-500"
      />
    </div>
  );
}