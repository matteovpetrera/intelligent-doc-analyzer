"use client";

import { useEffect, useState } from "react";

interface DocumentMeta {
  id: string;
  title: string;
}

interface DocumentDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // Carica lista documenti
  useEffect(() => {
    fetch("http://localhost:5001/api/documents") // cambia porta se diversa
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Errore nel fetch dei documenti:", err));
  }, []);

  // Carica documento selezionato
  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      fetch(`http://localhost:5001/api/documents/${selectedId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedDoc(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Errore nel fetch del documento:", err);
          setLoading(false);
        });
    } else {
      setSelectedDoc(null);
    }
  }, [selectedId]);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Visualizza Documento</h1>

      <label className="block mb-2 font-medium">Seleziona documento:</label>
      <select
        className="border rounded px-3 py-2 mb-6 w-full"
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="" disabled>
          -- Scegli un documento --
        </option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.title}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="italic text-gray-600">Caricamento...</p>
      ) : selectedDoc ? (
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">{selectedDoc.title}</h2>
          <p className="text-sm text-gray-500 mb-2">Creato il: {selectedDoc.createdAt}</p>
          <p>{selectedDoc.content}</p>
        </div>
      ) : (
        <p className="text-gray-600 italic">Nessun documento selezionato.</p>
      )}
    </main>
  );
}
