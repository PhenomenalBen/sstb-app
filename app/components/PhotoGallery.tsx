import Image from "next/image"

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
}

type PhotoGalleryProps = {
  images: GalleryImage[]
  className?: string
}

export default function PhotoGallery({ images, className = "" }: PhotoGalleryProps) {
  return (
    <div className={`mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 md:grid-cols-2 ${className}`}>
      {images.map((image) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-auto w-full rounded-2xl shadow-lg"
        />
      ))}
    </div>
  )
}
