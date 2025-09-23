import { useState } from "react";

export function useImageUploadState() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return { image, setImage, preview, setPreview };
}
