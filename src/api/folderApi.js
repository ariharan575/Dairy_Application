import api from "./axios";

// ===============================
// FOLDER apis
// ===============================

// Create Folder
export const createFolder = (data) =>
  api.post("/folder/create", data);

// Fetch All Folders
export const fetchAllFolders = (status = "ACTIVE") =>
  api.get(`/folder/fetch_all?status=${status}`);

// Fetch All Achieved Folders
export const fetchAllAchivedFolders = (status = "ACHIEVED") =>
  api.get(`/folder/fetch_all?status=${status}`);

// Fetch Single Folder
export const fetchFolderById = (id, status = "ACTIVE") =>
  api.get(`/folder/fetch/${id}?status=${status}`);

export const fetchAchivedFolderById = (id, status = "ACHIEVED") =>
  api.get(`/folder/fetch/${id}?status=${status}`)

// Update Folder
export const updateFolder = (id, data, status = "ACTIVE") =>
  api.put(`/folder/update/${id}?status=${status}`, data);

// Delete Folder (Permanent)
export const deleteFolder = (id, status = "ACTIVE") =>
  api.delete(`/folder/delete/${id}?status=${status}`);

// Archive Folder
export const archiveFolder = (id) =>
  api.delete(`/folder/achieve/${id}?status=ACTIVE`);

// Restore Folder
export const restoreFolder = (id) =>
  api.put(`/folder/restore/${id}?status=ACHIEVED`);

// Search Folder
export const searchFolder = (text, status = "ACTIVE") =>
  api.get(`/folder/search?text=${text}&status=${status}`);


// ===============================
// DIARY INSIDE FOLDER
// ===============================

// Create Diary inside Folder
export const createDiaryInsideFolder = (data) =>
  api.post("/folder/create/diary", data);

// Fetch Diaries by Folder
export const fetchFolderDiaries = (folderId) =>
  api.get(`/folder/diary/${folderId}`);

// Restore Diary from Folder
export const restoreDiaryFromFolder = (id, folderId, status = "ACHIEVED") =>
  api.put(`/folder/diary/restore/${id}?folderId=${folderId}&status=${status}`);

/*  SEARCH DIARIES BY FOLDER ID + TEXT         */
export const searchDiaryByFolder = (folderId, text, status = "ACTIVE") =>
  api.get(`/folder/search/diary/${folderId}?status=${status}&text=${text}`)

