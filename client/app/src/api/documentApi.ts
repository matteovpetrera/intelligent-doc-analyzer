import { Document } from "@/components/Document";

async function getDocuments() {
  try {
    const res = await fetch("http://localhost:5001/api/documents"); // aggiorna la porta se serve
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Errore nel fetch dei documenti: ${errorText}`);
    }
    const data: Document[] = await res.json();
    console.log("Documenti caricati:", data);
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getDocumentById(id: string) {
  return fetch(`http://localhost:5001/api/documents/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Errore nel fetch del documento ${id}: ${res.statusText}`);
      }
      return res.json();
    })
    .catch((err) => console.error(err));
}

export { getDocuments, getDocumentById };
