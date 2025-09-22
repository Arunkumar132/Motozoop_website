import Image from "next/image";

const ImageView = () => {
  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      <Image
        src="/path/to/image.jpg"
        alt="Preview"
        width={600}
        height={400}
        className="rounded-lg shadow-md"
      />
    </div>
  );
};

export default ImageView;
