import TiptapEditor from "@/components/shared/tiptap/TiptapEditor";
import {
  useManageLectureContentStore,
  type ContentBlock,
} from "../../stores/useManageLectureContentStore";

type Props = {
  block: ContentBlock;
};

export default function EditTextBlock({ block }: Props) {
  const updateBlock = useManageLectureContentStore(
    (state) => state.updateBlock,
  );
  return (
    <TiptapEditor
      content={block.content as string}
      onChange={(content) => updateBlock(block.id, content)}
    />
  );
}
