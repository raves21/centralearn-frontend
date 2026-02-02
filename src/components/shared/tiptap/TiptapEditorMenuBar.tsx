import type { TiptapSelector } from "@/utils/sharedTypes";
import { Editor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Eraser,
  RemoveFormatting,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  FileCode,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

type Props = {
  editor: Editor;
  excludeSelectors?: TiptapSelector[];
};

export default function TiptapEditorMenuBar({
  editor,
  excludeSelectors,
}: Props) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="flex items-center gap-4 flex-wrap p-3">
      {!excludeSelectors?.includes("bold") && (
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`p-1 rounded-md p-2 ${editorState.isBold ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Bold size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("italic") && (
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`p-1 rounded-md p-2 ${editorState.isItalic ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Italic size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("strike") && (
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`p-1 rounded-md p-2 ${editorState.isStrike ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Strikethrough size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("code") && (
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`p-1 rounded-md p-2 ${editorState.isCode ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Code size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("eraser") && (
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <Eraser size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("removeFormatting") && (
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          <RemoveFormatting size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("paragraph") && (
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1 rounded-md p-2 ${editorState.isParagraph ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Pilcrow size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading1") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading1 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading1 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading2") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading2 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading2 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading3") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading3 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading3 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading4") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading4 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading4 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading5") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading5 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading5 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("heading6") && (
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={`p-1 rounded-md p-2 ${editorState.isHeading6 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Heading6 size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("bulletList") && (
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded-md p-2 ${editorState.isBulletList ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <List size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("orderedList") && (
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded-md p-2 ${editorState.isOrderedList ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <ListOrdered size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("codeBlock") && (
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded-md p-2 ${editorState.isCodeBlock ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <FileCode size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("blockquote") && (
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded-md p-2 ${editorState.isBlockquote ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Quote size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("undo") && (
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className={`p-1 rounded-md p-2 ${editorState.canUndo ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Undo size={18} />
        </button>
      )}
      {!excludeSelectors?.includes("redo") && (
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className={`p-1 rounded-md p-2 ${editorState.canRedo ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
        >
          <Redo size={18} />
        </button>
      )}
    </div>
  );
}
