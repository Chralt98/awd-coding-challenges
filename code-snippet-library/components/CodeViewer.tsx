"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  css: "css",
  html: "html",
  python: "python",
  java: "java",
  json: "json",
};

function getMonacoLanguage(language: string): string {
  return LANGUAGE_MAP[language.toLowerCase()] ?? "plaintext";
}

export default function CodeViewer({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button
          variant="outline"
          nativeButton={true}
          onClick={() => setShowEditor(!showEditor)}
        >
          {showEditor ? "Code Block" : "Editor"}
        </Button>
      </div>
      {showEditor ? (
        <Editor
          height="400px"
          language={getMonacoLanguage(language)}
          value={code}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            readOnly: false,
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      ) : (
        <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
