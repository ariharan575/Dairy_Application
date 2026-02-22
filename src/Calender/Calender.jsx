import React, { useEffect, useState ,useRef} from "react";
import Navbar from "../Component/Navbar";
import SearchBar from "../Component/SearchBar";
import WorkCalendar from "./WorkCalender";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { PageWrapper } from "../Animation/PageWrapper";
import { Popover, Dialog } from "@headlessui/react";
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


export default function Calendar() {
  
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  

  const limit = useResponsiveLimit(12,18,20)

  const selectedDiaryRef = useRef(null);


  const handleSearch = async (value) => {

    setSearch(value);
  
    if (!value.trim()) {
      loadDiaries(); // reset
      return;
    }
  
    try {
      setLoading(true);
      const res = await searchDiariesApi(value);
      setDiaries(res.data.content || []); // Page<Diary>
    } catch (err) {
      setDiaries([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaries();
  }, []);

const loadDiaries = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await fetchDiaries("ACTIVE");

    // ✅ EMPTY IS VALID
    setDiaries(res.data || []);
    if(diaries.length === 0){
      setError("No more diary Exists");
    }
  } catch (err) {
    // ✅ If backend says "not found", treat as empty list
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
    navigate(`/write_diary/${id}`);
  };
  
const achieveDiary = async (id) => {

  setDiaries((prev) => prev.filter((d) => d.id !== id));

  try {
    await achieveDiaryApi(id);
  } catch (err) {

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
  } catch (err) {
    
    loadDiaries();
  }
};
      const filteredDiaries = diaries;

  return (
    <>
    <PageWrapper>

      <Navbar />

      <main className="min-h-screen bg-slate-100 px-2.5 px-md-5 mx-auto py-4">
        <div className="mb-4">
                    <SearchBar
                      value={search}       
                      onChange={handleSearch} 
                     />
        </div>

        <div className="flex flex-col md:flex-row gap-3  gap-lg-5">

          {/* LEFT PANEL */}
          <aside
            className="
              w-full
              md:w-[270px]
              lg:w-[320px]
              md:sticky md:top-4
              md:h-[calc(100vh-2rem)]
              md:overflow-hidden
            "
          >
             {/* DATE INFO */}
            <div className="hidden md:flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm mb-4">
              <i className="bi bi-brightness-high-fill text-warning fs-4"></i>
              <div>
                <p className="text-sm font-semibold text-slate-800">12:10 AM</p>
                <p className="text-xs text-slate-500">Tuesday, Dec 2026</p>
              </div>
            </div>

            {/* QUICK STATS (NEW FEATURE) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm p-3 mb-4">
              <p className="text-xs text-slate-500">Total Diaries</p>
              <p className="text-xl font-bold text-cyan-600">
                {diaries.length}
              </p>
            </div>

            {/* CALENDAR */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <h4 className="ps-5 mb-2">Calendar</h4>
              <WorkCalendar onDateSelect={handleDateSelect} />
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section
            className="
              flex-1
              md:h-[calc(100vh-2rem)]
            "
          >
            {loading && (
              <p className="text-center text-slate-500">Loading...</p>
            )}

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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ">
                
               {filteredDiaries.map((item, index) => {
                    const gradient = colors[index % colors.length];

                  return (
                    <article
                      key={item.id}
                      className="
                        relative bg-white border px-4 py-3 shadow-sm
                        min-h-[200px] flex flex-col
                      "
                   onClick={() => openDiary(item.id)}>
                   <div className={`absolute inset-0 m-1 rounded-3`}
                                               style={{ background: gradient }} />

                      <Popover className="relative ">
                          <Popover.Button
                            className="w-full flex items-center justify-between outline-none 
                            focus:outline-none focus:ring-0 active:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-gray-700 fw-semibold">
                              {formatDate(item.createdAt)}
                            </p>
                            <MoreVertical size={18} />
                          </Popover.Button>
                            <Popover.Panel className="absolute right-0 z-50 mt-2 w-32 bg-white rounded shadow border">
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDiary(item.id);
                                  }}
                                className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                Open
                              </button>
                              <button
                                 onClick={(e) => {e.stopPropagation();
                                  achieveDiary(item.id);}}
                                className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                Achieve
                              </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              selectedDiaryRef.current = item; // ✅ instant (no async)
                              setSelectedDiary(item);          // keep your state
                              setDeleteOpen(true);
                            }}
                            className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>

                            </Popover.Panel>
                       </Popover>

                      <p className="text-sm h5 font-semibold mb-2">
                        {truncateText(item.title || "Untitled",limit)}
                      </p>

                      <p className="text-sm text-slate-600 mb-3 break-words line-clamp-3">
                         {truncateText(item.content, 40)}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
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
    </>
  );
}
