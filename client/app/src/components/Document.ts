export interface Document {
  id: number;
  user_id: number;
  filename: string;
  upload_date: string; // ISO date string, es. "2025-06-23T20:28:02.037Z"
  analysis: null; // Analysis può essere un'altra interfaccia, o null se non presente
  status: "uploaded" | "processing" | "analyzed" | "error"; // ipotizzo altri stati possibili
}
