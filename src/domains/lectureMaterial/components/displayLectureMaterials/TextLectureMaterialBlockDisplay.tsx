import type { TextAttachment } from "@/utils/sharedTypes";

type Props = {
  material: TextAttachment;
};

export default function TextLectureMaterialBlockDisplay({ material }: Props) {
  return (
    <div
      className="prose prose-lg max-w-none tiptap-editor p-5 rounded-lg bg-white shadow-sm"
      dangerouslySetInnerHTML={{ __html: material.content }}
    />
  );
}
