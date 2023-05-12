import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { MAX_FILE_SIZE, type PreviewThumbnail } from "../constants";

export function useThumbnail(originalThumbnail: string | null = null) {
  const [thumbnail, setThumbnail] = useState<File>();
  const [previewThumbnail, setPreviewThumbnail] =
    useState<PreviewThumbnail>(originalThumbnail);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    setThumbnail(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      e.target && setPreviewThumbnail(e.target.result);
    };
    reader.readAsDataURL(new Blob([file], { type: file.type }));
  };

  const handleRemoveThumbnail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewThumbnail(null);
    setThumbnail(undefined);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return {
    thumbnail,
    previewThumbnail,
    getRootProps,
    getInputProps,
    handleRemoveThumbnail,
  };
}
