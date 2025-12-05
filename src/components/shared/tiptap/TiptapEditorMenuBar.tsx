import { Editor, useEditorState } from "@tiptap/react";

type Props = {
  editor: Editor;
};

export default function TiptapEditorMenuBar({ editor }: Props) {
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
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={`p-1 rounded-md p-2 ${editorState.isBold ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={`p-1 rounded-md p-2 ${editorState.isItalic ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={`p-1 rounded-md p-2 ${editorState.isStrike ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={`p-1 rounded-md p-2 ${editorState.isCode ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        Clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-1 rounded-md p-2 ${editorState.isParagraph ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading1 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading2 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading3 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading4 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading5 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`p-1 rounded-md p-2 ${editorState.isHeading6 ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded-md p-2 ${editorState.isBulletList ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded-md p-2 ${editorState.isOrderedList ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 rounded-md p-2 ${editorState.isCodeBlock ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded-md p-2 ${editorState.isBlockquote ? "bg-mainaccent text-white" : "hover:bg-gray-100"}`}
      >
        Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        Redo
      </button>
    </div>
  );
}
