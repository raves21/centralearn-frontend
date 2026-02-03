import type { TiptapSelector } from "@/utils/sharedTypes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TiptapEditorMenuBar from "./TiptapEditorMenuBar";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

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

  // // Update editor content if the prop changes externally (optional, but good for initial load or reset)
  // useEffect(() => {
  //   if (editor && content !== editor.getHTML()) {
  //     // Only set content if it's different to avoid cursor jumping issues if we were to sync on every keystroke
  //     // strictly speaking, for local state driven by this editor, we might not need this useEffect
  //     // if we trust the editor state is the source of truth while active.
  //     // But for initial load it is needed.
  //     if (editor.isEmpty && content) {
  //       editor.commands.setContent(content);
  //     }
  //   }
  // }, [content, editor]);

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
