import Image from 'next/image';

interface BackgroundMediaProps {
  videoUrl?: string;
  imageUrl?: string;
}

export default function BackgroundMedia({ videoUrl, imageUrl }: BackgroundMediaProps) {
  if (videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center calc(50%)' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt="Background"
        fill
        className="object-cover"
                  style={{ objectPosition: 'center bottom' }}
        priority
      />
    );
  }

  return null;
}
