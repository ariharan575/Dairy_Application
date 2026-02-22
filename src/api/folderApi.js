import { data } from "react-router-dom";
import api from "./axios";

/* CREATE FOLDER */
export const createFolder = (data) =>
  api.post("/folder/create", data);

/* FETCH ALL FOLDERS */
export const fetchAllFolders = (status = "ACTIVE") =>
  api.get("/folder/fetch_all", { params: { status } });

export const fetchAllAchivedFolders = (status = "ACHIEVED") =>
  api.get("/folder/fetch_all", { params: { status } });

/* SEARCH FOLDER */
export const searchFolder = (text, status = "ACTIVE") =>
  api.get("/folder/search", { params: { text, status } });

/* DELETE FOLDER */
export const deleteFolder = (id) =>
  api.delete(`/folder/delete/${id}`);

/* ARCHIVE FOLDER */
export const archiveFolder = (id) =>
  api.delete(`/folder/achieve/${id}`);

