import Image from 'next/image';
import { galleryImages } from '@/lib/data';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Gallery() {
  return (
    <section className="bg-lavender py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Field Notes"
          title={
            <>
              India, as our travellers{' '}
              <span className="accent-serif text-violet-mid">saw it</span>
            </>
          }
          description="Unfiltered frames from recent journeys — palaces, peaks, coastlines, and everything between."
        />
        <div className="mt-14 columns-2 gap-4 sm:gap-5 lg:columns-4 [&>*]:mb-4 sm:[&>*]:mb-5">
          {galleryImages.map((image, i) => (
            <Reveal key={image.src} delay={(i % 4) * 80} as="figure">
              <div
                className={`group relative w-full overflow-hidden rounded-2xl ${
                  image.tall ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
