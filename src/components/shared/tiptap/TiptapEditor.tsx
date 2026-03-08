import type { TiptapSelector } from "@/utils/sharedTypes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TiptapEditorMenuBar from "./TiptapEditorMenuBar";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  excludeSelectors?: TiptapSelector[];
}

const TiptapEditor = ({
  content,
  onChange,
  placeholder,
  className,
  excludeSelectors,
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor focus:outline-none max-h-[300px] min-h-[150px] overflow-y-auto p-4 border rounded-md",
      },
      handleDrop: () => true, // Disable drag and drop into the editor
    },
  });

  // Sync editor content when the prop changes externally (e.g. after store hydration).
  // Only update when the editor is currently empty and the new content is non-empty,
  // so we don't jump the cursor while the user is actively typing.
  useEffect(() => {
    if (editor && editor.isEmpty && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg border border-gray-200 shadow-sm",
        className,
      )}
    >
      <TiptapEditorMenuBar
        editor={editor}
        excludeSelectors={excludeSelectors}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
