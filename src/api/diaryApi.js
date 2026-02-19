import api from "./axios";

/* ---------------- CREATE ---------------- */
export const createDiaryApi = (data) =>
  api.post("/diary/create", data);

/* ---------------- FETCH ALL ---------------- */
export const fetchDiaries = (status) =>
  api.get("/diary/fetch_all", {
    params: { status }
  });

/* ---------------- FETCH BY ID ---------------- */
export const fetchDiaryById = (id, status) =>
  api.get(`/diary/fetch/${id}`, {
    params: { status }
  });

/* ---------------- UPDATE ---------------- */
export const updateDiaryApi = (id, data) =>
  api.put(`/diary/update/${id}`, data);

/* ---------------- DELETE (TRASH) ---------------- */
export const deleteDiaryApi = (id) =>
  api.delete(`/diary/delete/${id}`);

/* ---------------- ACHIEVE ---------------- */
export const achieveDiaryApi = (id) =>
  api.delete(`/diary/achieve/${id}`);

/* -------- TODAY -------- */
export const fetchTodayDiaries = () =>
  api.get("/diary/today_diary");

/* -------- THIS WEEK -------- */
export const fetchWeekDiaries = () =>
  api.get("/diary/week_diary");

/* -------- THIS MONTH -------- */
export const fetchMonthDiaries = () =>
  api.get("/diary/month_diary");

/* ---------- SEARCH ---------- */
export const searchDiariesApi = (text, status) =>
  api.get("/diary/search", {
    params: { text, status }
  });


/* ---------- NEW (SPECIFIC DATE) ---------- */
export const fetchDiaryByDate = (date) =>
  api.get("/diary/specific_date_diary", {
    params: { date }, // dd-MM-yyyy
  });

  /* FETCH DIARY BY FOLDER */
export const fetchDiaryByFolder = (folderId) =>
  api.get(`/folder/diary/${folderId}`);

/* DELETE DIARY */
export const deleteDiary = (id) =>
  api.delete(`/diary/delete/${id}`);


export const permanantlyDelete = (id) => 
  api.delete(`/diary/permanent_delete/${id}`);


/* ARCHIVE DIARY */
export const archiveDiary = (id) =>
  api.delete(`/diary/achieve/${id}`);


/* ---------------- DATE FORMAT ---------------- */
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

/* FOLDER DIARY */
export const createDiaryInFolderApi = (data) =>
  api.post("/folder/create/diary", data);

export const restoreDiaryApi = (id, status) =>
  api.put(`/diary/restore/${id}`, null, {
    params: { status }
  });

export const restoreFolderDiaryApi = (id, folderId, status) =>
  api.put(`/folder/diary/restore/${id}`, null, {
    params: { folderId, status }
  });

export const restoreFromTrashOrAchieve = async (id) => {
  return await api.put(`/restore/${id}`);
};

