import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import { useAuth } from "../auth/AuthContext";
import { fetchDiaries,
         formatDate,
         fetchTodayDiaries,
        fetchWeekDiaries,
        achieveDiaryApi,
        deleteDiaryApi,
      fetchMonthDiaries} from "../api/diaryApi";
import { Popover, Dialog } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import {truncateText} from "../utils/truncateText"
import useResponsiveLimit from "../utils/truncateText"

export default function LandingPage() {

  const {logout} = useAuth();
  const firstName = localStorage.getItem("firstName");
  const navigate = useNavigate();

  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

    const filterDiaries = async (type) => {
      setLoading(true);
  
    try {
      let res;
  
      if (type === "TODAY") {
        res = await fetchTodayDiaries();
      } 
      else if (type === "WEEK") {
        res = await fetchWeekDiaries();
      } 
      else if (type === "MONTH") {
        res = await fetchMonthDiaries();
      }
  
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
    <Navbar/>
    <div className="bg-md-slate-200 px-md-3 py-md-3 px-4 h-[100vh]">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* HERO SECTION */}
        <section className="rounded-md-xl my-0 my-md-5 bg-white p-4 shadow-md-md text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#111827]">
            Hi there, {firstName} 👋
          </h1>
          <p className="mx-auto max-w-2xl text-[#6b7280]">
            Where your thoughts find reflection. This is your private space to
            write, reflect, and relive your memories anytime, anywhere.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/write-diary")}
              className="rounded-md bg-cyan-500 p-2 md:px-6 py-md-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 transition"
            >
              Write Diary
            </button>

            <button
              onClick={logout}
              className="rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Sign up
            </button>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid bg-white grid-cols-1 px-md-2 mb-0 gap-6 md:grid-cols-3 ">
        
          <QuickCard
           icon='bi bi-journal-plus'
            title="My Folder"
            subtitle="View Folder"
            onClick={() => navigate("/folder")}

          />
          <QuickCard
            icon='bi bi-card-text'
            title="My Diaries"
            subtitle="View All Entries"
            onClick={()=> navigate("/diary")}
          />
          <QuickCard
          icon='bi bi-calendar-date'
            title="Calendar"
            subtitle="View by Date"
            onClick={() => navigate("/calender")}
          />
        </section>

        {/* RECENT DIARY */}
        <section className="rounded-xl  bg-white p-md-3 shadow-md-md">
          <div className="mb-md-6 flex items-center justify-between">
            <p className="text-xl h1 font-semibold pt-5 pb-2 text-[#111827]">
              Recent Diary
            </p>        
          </div>
           <div className="contain d-flex gap-2 gap-md-4 mb-3">
                 <button className="text-cyan-600 cursor-pointer
                      font-medium hover:underline decoration-1.5" onClick={()=> filterDiaries("TODAY")}>Today</button>

                 <button className="text-cyan-600 cursor-pointer
                      font-medium hover:underline decoration-1.5" onClick={()=> filterDiaries("WEEK")}>This Week</button>

                 <button className="text-cyan-600 d-none d-md-block font-medium cursor-pointer
                      hover:underline decoration-1.5" onClick={() => filterDiaries("MONTH")}>This Month</button>
            <button className="text-cyan-600 font-medium ms-auto text-sm me-2 me-lg-5 cursor-pointer hover:underline decoration-1.5 " onClick={()=>navigate("/diary")}>View All</button>
       </div> 

            { loading && <p>Loading...</p>}
            {  error &&  
            <div className='text-center mt-5 min-vh-100'>
              <h2 className=' text-3xl fw-bold text-[#008080]'>No diary entries yet</h2> 
            <button type="submit" className="px-4 m-auto text-white p-2.5 font-semibold rounded-1
              my-4 bg-cyan-500 shadow-md hover:bg-cyan-700 transition" onClick={()=> navigate("/write-diary")}>
                Write Your First Diary
            </button>
            </div>
            }
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diaries.map((item,index) => (
              <DiaryCard key={item.id} item={item} index={index} loadDiaries={loadDiaries}/>
            ))}
          </div>
        </section>

      </div>
    </div>
    </>
  );
}

function QuickCard({ title, subtitle, onClick,icon }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl p-6 bg-gray-100 mt-2 shadow-md transition hover:-translate-y-1 hover:shadow-lg hover:bg-gradient-to-r from-cyan-100 to-blue-100"
    >
      <p className={` fs-3 text-success float-left me-3 ${icon}`} ></p>
      <h3 className="text-lg h4 font-semibold text-[#111827]">{title}</h3>
      <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
    </div>
  );
}

function DiaryCard({ item,index,loadDiaries}) {

  const navigate = useNavigate();
    const colors = [
    "bg-yellow-400",
    "bg-indigo-400",
    "bg-green-400",
  ];

  const limit = useResponsiveLimit(12, 18, 22);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  
  const color = colors[index % colors.length];

  const openDiary = (id) => {
    navigate(`/write-diary/${id}`);
  };
  
    const achieveDiary = async (id) => {
      await achieveDiaryApi(id);
      loadDiaries();
    };

      const confirmDelete = async () => {
      await deleteDiaryApi(selectedDiary.id);
      setDeleteOpen(false);
      loadDiaries();
    };

  return (
    <div className="relative rounded-xl bg-gray-100 p-6 shadow-sm transition min-h-[170px] max-h-[170px] 
             hover:-translate-y-1 hover:shadow-lg hover:shadow-md" 
              onClick={(e) => {e.stopPropagation() ;
                   openDiary(item.id)}}>
      
      {/* Color Bar */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${color}`} />

<div className="mb-2 flex items-start justify-between font-semibold text-[#111827]">

  <span className="text-md">
    {truncateText(item.title, limit)}
  </span>

  <div className="flex items-center gap-3 text-xs text-slate-800">
    <Popover className="relative">
     <Popover.Button
       onClick={(e) => e.stopPropagation()}
       className="d-flex outline-none focus:outline-none focus:ring-0 active:outline-none"
     >
       <p className="text-gray-500 text-sm fw-semibold">
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
          onClick={(e) => {
            e.stopPropagation();
            achieveDiary(item.id);
          }}
          className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
        >
          Achieve
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDiary(item);
            setDeleteOpen(true);
          }}
          className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </Popover.Panel>
    </Popover>
  </div>
</div>


      <p className="text-sm text-[#6b7280] break-words line-clamp-3">
        {item.content}
      </p>

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
    </div>
  );
  
}
