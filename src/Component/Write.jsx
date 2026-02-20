import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import { PageWrapper } from "../Animation/PageWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createDiaryApi,
  createDiaryInFolderApi,
  fetchDiaryById,
  updateDiaryApi,
} from "../api/diaryApi";

export default function WriteDiary() {
  const location = useLocation();
  const navigate = useNavigate();

 const { diaryId } = useParams();


  const folderId = location.state?.folderId || null;
  const folderName = location.state?.folderName || null;
  const status = location.state?.status || "ACTIVE";


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (diaryId) loadDiary();
  }, [diaryId]);

const loadDiary = async () => {
  const res = await fetchDiaryById(diaryId, status);
  setTitle(res.data.title);
  setContent(res.data.content);
  setIsEdit(true);
};


  const saveDiary = async () => {
    if (!title || !content) {
      alert("Title and content required");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateDiaryApi(diaryId, { title, content });
        alert("Diary Updated");
      } else {
        if (folderId && folderName) {
          // ✅ FOLDER DIARY
          await createDiaryInFolderApi({
            title,
            content,
            folderId,
            folderName,
          });
        } else {
          // ✅ NORMAL DIARY
          await createDiaryApi({ title, content });
        }
        alert("Diary saved successfully");
      }

      setTitle("");
      setContent("");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Navbar />

      <div className="min-h-screen bg-slate-100 px-2 py-4 sm:px-6 md:px-10">
        <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-7xl overflow-hidden rounded-2xl bg-white shadow-xl">

          <aside className="hidden md:w-[200px] lg:w-[280px] border-r bg-white p-4 md:block">
            <button className="w-full rounded-full bg-cyan-500 py-2 text-sm font-semibold text-white"
            onClick={()=> navigate("/write_diary")}>
              + New Diary
            </button>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-base font-semibold">
                  {title || "Untitled"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toDateString()}
                </p>
              </div>
            </div>
          </aside>

          <main className="flex flex-1 flex-col sm:p-6 lg:p-8">
            <div className="mb-4 flex justify-between p-3">
              <h6 className="text-sm font-semibold text-gray-700">
                {folderName ? `Folder: ${folderName}` : "My Diary"}
              </h6>

              <button
                onClick={saveDiary}
                className="rounded-md bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-white"
              >
                {loading ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
            </div>

            <section className="flex flex-1 flex-col rounded-xl bg-[#f9fafc] p-4 sm:p-6">
              <input
                type="text"
                placeholder="Add a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className=" bg-transparent text-3xl h5 font-semibold outline-none"
              />

              <textarea
                placeholder="It's empty here, let's write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none rounded-lg bg-white p-4 outline-none"
              />
            </section>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
}
