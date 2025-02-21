import { ChangeEvent, useState } from "react";
interface Props {
  imageURLs?: string[];
  onChange: (url: string[]) => void;
  isRequired?: boolean;
}

export default function ImagesInput({
  onChange,
  imageURLs: dataURLs,
  isRequired,
}: Props) {
  const [selectedImages, setSelectedImages] = useState<(string | null)[]>(
    dataURLs ?? [],
  );

  async function imageFileToDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string")
          throw new Error("unexpected FileReader behavior");
        return resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFileSelectionChange(ev: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(ev.target.files ?? []);

    const updatedSelectedImages: (string | null)[] = files.map(() => null);
    setSelectedImages(updatedSelectedImages);

    const promises = Array.from(files).map(async (file, idx) => {
      const dataUrl = await imageFileToDataURL(file);
      setSelectedImages((prev) => {
        const copy = [...prev];
        copy[idx] = dataUrl;
        return copy;
      });
      return dataUrl;
    });

    const urls = await Promise.all(promises);
    onChange(urls);
  }
  return (
    <div className="flex flex-col items-stretch gap-2">
      <label className="relative text-zinc-700 border-zinc-300 border rounded px-2 py-1 w-full ">
        {!selectedImages?.length ? "select images" : "change images"}
        <input
          onChange={handleFileSelectionChange}
          required={isRequired}
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="text-transparent bg-transparent absolute inset-0 rounded"
        />
      </label>
      <div className="flex gap-2 flex-wrap">
        {selectedImages.map((url, idx) => (
          <div
            key={idx}
            className="overflow-hidden size-16 flex items-center border-zinc-200 border rounded"
          >
            {url ? (
              <img src={url} className="size="></img>
            ) : (
              <span className="text-xs text-zinc-700">loading...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
