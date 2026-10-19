import { useRef } from "react";
import { FileCode, FileText, Presentation, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Material = {
  id: string;
  name: string;
  kind: "pdf" | "slides" | "doc" | "text" | "code";
  size: number;
  status: "ready" | "needs-processing";
  pages: number;
};

export const ACCEPT =
  ".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.cs,.go,.rs,.rb,.php,.sql,.html,.css,.json";

export function kindOf(name: string): Material["kind"] | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx"].includes(ext)) return "slides";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["txt", "md"].includes(ext)) return "text";
  if (ACCEPT.includes(`.${ext}`)) return "code";
  return null;
}

const icons = { pdf: FileText, slides: Presentation, doc: FileText, text: FileText, code: FileCode };

export function MaterialsPanel({
  materials,
  onFiles,
  onRemove,
}: {
  materials: Material[];
  onFiles: (files: FileList) => void;
  onRemove: (id: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="panel flex flex-col p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Study materials</h3>
          <p className="text-xs text-muted-foreground">Used as separate, page-cited sources</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => input.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> Add
        </Button>
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => { if (e.target.files) onFiles(e.target.files); e.target.value = ""; }}
        />
      </div>
      <div
        className="mt-3 space-y-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
      >
        {materials.length === 0 && (
          <button
            onClick={() => input.current?.click()}
            className="w-full rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground hover:bg-muted"
          >
            Drop PDF, PPT/PPTX, DOC/DOCX, TXT or code files
          </button>
        )}
        {materials.map((m) => {
          const Icon = icons[m.kind];
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
              <Icon className="h-4 w-4 shrink-0 text-cite-doc-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">
                  {m.status === "ready" ? `${m.pages} page${m.pages === 1 ? "" : "s"} indexed` : "Awaiting server-side text extraction"}
                </p>
              </div>
              {m.status !== "ready" && <Badge variant="outline">Pending</Badge>}
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onRemove(m.id)} aria-label={`Remove ${m.name}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
