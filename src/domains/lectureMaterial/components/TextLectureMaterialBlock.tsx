import type { TextAttachment } from "@/utils/sharedTypes";

type Props = {
  material: TextAttachment;
};

export default function TextLectureMaterialBlock({ material }: Props) {
  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: material.content }}
    />
  );
}
