"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { DOMParser as ProseMirrorDomParser } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  looksLikeHtml,
  sanitizeEntryHtml,
  type EntryBodyRenderFormat,
} from "@/lib/entry-body";
import {
  looksLikeMarkdown,
  normalizePastedTextForEditor,
} from "@/lib/markdown-paste";

type RichTextEditorProps = {
  name: string;
  initialContent?: string | null;
  initialFormat?: EntryBodyRenderFormat;
  label: string;
  description?: string;
  placeholder?: string;
  minHeight?: number;
  formatFieldName?: string;
  formatFieldValue?: EntryBodyRenderFormat;
  error?: string;
};

export function RichTextEditor({
  name,
  initialContent = "",
  initialFormat = "html",
  label,
  description,
  placeholder,
  minHeight = 220,
  formatFieldName,
  formatFieldValue = "html",
  error,
}: RichTextEditorProps) {
  const startingContent = useMemo(
    () => toEditorHtml(initialContent ?? "", initialFormat),
    [initialContent, initialFormat],
  );
  const [html, setHtml] = useState(() =>
    isEmptyEditorHtml(startingContent) ? "" : sanitizeEntryHtml(startingContent),
  );
  const errorId = `${name}-error`;
  const descriptionId = description ? `${name}-description` : undefined;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: startingContent,
    editorProps: {
      attributes: {
        class:
          "min-h-full outline-none prose-entry-editor text-sm leading-6 text-[var(--text-main)]",
        "aria-label": label,
      },
      handlePaste: (view, event) => {
        const pastedHtml = event.clipboardData?.getData("text/html");

        if (pastedHtml?.trim()) {
          return false;
        }

        const pastedText = event.clipboardData?.getData("text/plain");

        if (!pastedText?.trim()) {
          return false;
        }

        if (!looksLikeMarkdown(pastedText) && !pastedText.includes("\n")) {
          return false;
        }

        const nextHtml = normalizePastedTextForEditor(pastedText);

        if (!nextHtml) {
          return false;
        }

        event.preventDefault();

        const wrapper = document.createElement("div");
        wrapper.innerHTML = nextHtml;

        const parsedContent = ProseMirrorDomParser.fromSchema(
          view.state.schema,
        ).parseSlice(wrapper);
        const transaction = view.state.tr
          .replaceSelection(parsedContent)
          .scrollIntoView();

        view.dispatch(transaction);
        return true;
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const nextHtml = currentEditor.isEmpty
        ? ""
        : sanitizeEntryHtml(currentEditor.getHTML());
      setHtml(nextHtml);
    },
  });

  return (
    <div>
      <div>
        <label className="text-sm font-medium text-[var(--text-main)]">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      <div
        className="mt-2 overflow-hidden rounded-lg border border-[var(--line)] bg-black/25 transition focus-within:border-[#FCA311] focus-within:ring-2 focus-within:ring-[#FCA311]/20"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={[descriptionId, error ? errorId : undefined]
          .filter(Boolean)
          .join(" ") || undefined}
      >
        <Toolbar editor={editor} />
        <div className="relative px-3 py-3" style={{ minHeight }}>
          {editor?.isEmpty && placeholder ? (
            <p className="pointer-events-none absolute left-3 top-3 text-sm leading-6 text-[var(--text-muted)]">
              {placeholder}
            </p>
          ) : null}
          <EditorContent editor={editor} />
        </div>
      </div>

      <input type="hidden" name={name} value={html} />
      {formatFieldName ? (
        <input type="hidden" name={formatFieldName} value={formatFieldValue} />
      ) : null}

      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-[#FCA311]">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-[var(--line)] bg-black/20 p-2">
      <ToolbarButton
        label="Paragraph"
        title="Paragraph"
        active={editor?.isActive("paragraph") ?? false}
        onClick={() => editor?.chain().focus().setParagraph().run()}
        disabled={!editor}
      >
        <Pilcrow aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        title="Heading 2"
        active={editor?.isActive("heading", { level: 2 }) ?? false}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor}
      >
        <Heading2 aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        title="Heading 3"
        active={editor?.isActive("heading", { level: 3 }) ?? false}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor}
      >
        <Heading3 aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Bold"
        title="Bold"
        active={editor?.isActive("bold") ?? false}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor}
      >
        <Bold aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        title="Italic"
        active={editor?.isActive("italic") ?? false}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor}
      >
        <Italic aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strike"
        title="Strike"
        active={editor?.isActive("strike") ?? false}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor}
      >
        <Strikethrough aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        title="Bullet list"
        active={editor?.isActive("bulletList") ?? false}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        disabled={!editor}
      >
        <List aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        title="Ordered list"
        active={editor?.isActive("orderedList") ?? false}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        disabled={!editor}
      >
        <ListOrdered aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        title="Blockquote"
        active={editor?.isActive("blockquote") ?? false}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        disabled={!editor}
      >
        <Quote aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        title="Inline code"
        active={editor?.isActive("code") ?? false}
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor}
      >
        <Code aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        title="Code block"
        active={editor?.isActive("codeBlock") ?? false}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        disabled={!editor}
      >
        <span className="text-xs font-semibold">{"{}"}</span>
      </ToolbarButton>
      <ToolbarButton
        label="Undo"
        title="Undo"
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor || !editor.can().undo()}
      >
        <Undo2 aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        title="Redo"
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor || !editor.can().redo()}
      >
        <Redo2 aria-hidden="true" className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  active = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        active
          ? "inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#FCA311] bg-[#FCA311] text-black transition disabled:cursor-not-allowed disabled:opacity-50"
          : "inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] text-[var(--text-main)] transition hover:border-[#FCA311]/70 hover:text-[#FCA311] disabled:cursor-not-allowed disabled:opacity-50"
      }
      {...props}
    >
      {children}
    </button>
  );
}

function toEditorHtml(
  content: string,
  format: EntryBodyRenderFormat,
) {
  if (!content.trim()) {
    return "";
  }

  if (format === "html" || looksLikeHtml(content)) {
    return sanitizeEntryHtml(content);
  }

  return textToParagraphHtml(content);
}

function textToParagraphHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmptyEditorHtml(value: string) {
  return sanitizeEntryHtml(value).replace(/<[^>]+>/g, "").trim().length === 0;
}
