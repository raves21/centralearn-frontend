import type { TextAttachment } from "@/utils/sharedTypes";

type Props = {
  material: TextAttachment;
};

export default function TextLectureMaterialBlockDisplay({ material }: Props) {
  return (
    <div
      className="prose prose-lg max-w-none tiptap-editor"
      dangerouslySetInnerHTML={{ __html: material.content }}
    />
  );
}
