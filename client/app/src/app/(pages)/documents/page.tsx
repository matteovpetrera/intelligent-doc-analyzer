"use client";

import { getDocumentById, getDocuments } from "@/api/documentApi";
import { SetStateAction, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  Theme,
  Card,
  Select,
  Text,
  Heading,
  Flex,
  Button,
  Separator,
  TextField,
  Tooltip,
  IconButton,
} from "@radix-ui/themes";
import { Document } from "@/components/Document";

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Fetch all documents on mount
  useEffect(() => {
    async function fetchDocs() {
      const docs = await getDocuments();
      setDocuments(docs);
    }
    fetchDocs();
  }, []);

  // Fetch selected document details
  useEffect(() => {
    async function fetchSelectedDoc() {
      if (selectedId) {
        setLoading(true);
        const doc = await getDocumentById(selectedId);
        setSelectedDoc(doc);
        setLoading(false);
      } else {
        setSelectedDoc(null);
      }
    }
    fetchSelectedDoc();
  }, [selectedId]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5001/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    // Refresh documents list
    const docs = await getDocuments();
    setDocuments(docs);
    setFile(null);
  };

  return (
    <Theme accentColor="yellow" grayColor="olive" panelBackground="solid" radius="full">
      <main className="p-8 max-w-6xl mx-auto">
        <Heading as="h1" size="8" mb="6">
          Dashboard Documenti
        </Heading>

        <Flex direction="row" gap="6" wrap="wrap">
          {/* SEZIONE VISUALIZZAZIONE */}
          <Card className="flex-1 min-w-[300px]" size="3">
            <Heading as="h2" size="5" mb="4">
              Visualizza Documenti
            </Heading>

            <Text as="label" size="2" mb="2" weight="medium">
              Seleziona un documento:
            </Text>

            <Select.Root
              value={selectedId ?? ""}
              onValueChange={(value: SetStateAction<string | null>) => setSelectedId(value)}
            >
              <Select.Trigger placeholder="Scegli un documento..." />
              <Select.Content>
                {documents.map((doc) => (
                  <Select.Item key={doc.id} value={String(doc.id)}>
                    {doc.filename}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Separator my="4" />

            {loading ? (
              <Text size="2" color="gray">
                Caricamento...
              </Text>
            ) : selectedDoc ? (
              <Flex direction="column" gap="2">
                <Heading size="4">{selectedDoc.filename}</Heading>
                <Text size="2" color="gray">
                  Caricato il: {new Date(selectedDoc.upload_date).toLocaleString()}
                </Text>
                <Text>Status: {selectedDoc.status}</Text>
              </Flex>
            ) : (
              <Text size="2" color="gray">
                Nessun documento selezionato.
              </Text>
            )}
          </Card>

          {/* SEZIONE UPLOAD */}
          <Card className="flex-1 min-w-[300px]" size="3">
            <Heading as="h2" size="5" mb="4">
              Carica Nuovo Documento
            </Heading>
            <Tooltip content="Upload a file">
              <IconButton radius="full">
                <PlusIcon></PlusIcon>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </IconButton>
            </Tooltip>

            <Button disabled={!file} onClick={handleUpload}>
              Carica Documento
            </Button>
          </Card>
        </Flex>
      </main>
    </Theme>
  );
}
