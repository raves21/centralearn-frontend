import { cn } from "@/lib/utils";

type Props = {
  content: string;
  className?: string;
};

export default function RenderTiptapHTML({ content, className }: Props) {
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none tiptap-editor p-4 rounded-lg bg-white shadow-sm",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
