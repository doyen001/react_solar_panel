"use client";

import { useState } from "react";
import Image from "next/image";

const reviews = [
  {
    logo: "/images/home/review-logo.svg",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud",
    name: "Sameer Rai",
    title: "Product Head",
    avatar: "/images/home/review-avatar.png",
    photo: "/images/home/review-person.png",
  },
  {
    logo: "/images/home/review-logo.svg",
    quote:
      "Easylink Solar made the entire process seamless. From the initial consultation to final installation, everything was handled professionally and efficiently.",
    name: "Sarah Chen",
    title: "Homeowner",
    avatar: "/images/home/review-avatar.png",
    photo: "/images/home/review-person.png",
  },
  {
    logo: "/images/home/review-logo.svg",
    quote:
      "The quality of the BLUETTI products and the installation service exceeded our expectations. Highly recommend Easylink Solar to anyone considering solar energy.",
    name: "Michael Torres",
    title: "Business Owner",
    avatar: "/images/home/review-avatar.png",
    photo: "/images/home/review-person.png",
  },
];

export function CustomerReviewsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  const review = reviews[current];

  return (
    <section className="bg-frost px-4 py-16 sm:px-6 lg:py-[86px]">
      <div className="mx-auto max-w-[1242px]">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-source-sans text-3xl font-bold tracking-[-0.9px] text-ink sm:text-[40px]">
            Customer Reviews
          </h2>
          <p className="mx-auto mt-4 max-w-[627px] font-source-sans text-base leading-6 text-muted">
            Easylink Solar - Making solar energy accessible and affordable for
            every Australian home and business.
          </p>
        </div>

        {/* Review card with arrows */}
        <div className="mt-14 flex flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-center">
          {/* Left arrow */}
          <button onClick={prev} aria-label="Previous review">
            <Image
              src="/images/home/review-arrow-left.svg"
              alt=""
              width={48}
              height={48}
            />
          </button>

          {/* Card */}
          <div className="order-1 w-full max-w-[963px] overflow-hidden rounded-[22px] border border-warm-ink/20 bg-white shadow-[0_8px_32px_-8px_rgba(17,28,39,0.12)] lg:order-0">
            <div className="flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:gap-[59px]">
              {/* Photo */}
              <div className="relative mx-auto h-[280px] w-[280px] shrink-0 overflow-hidden rounded-xl sm:h-[332px] sm:w-[338px] lg:mx-0">
                <Image
                  src={review.photo}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/home/review-play.svg"
                    alt="Play"
                    width={57}
                    height={56}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-7">
                  <Image
                    src={review.logo}
                    alt="Feedspace"
                    width={145}
                    height={29}
                  />
                  <p className="font-source-sans text-base leading-relaxed text-dusk sm:text-lg">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-8 flex items-end gap-4 lg:mt-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={55}
                    height={55}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-source-sans text-lg font-bold text-indigo-night">
                      {review.name}
                    </p>
                    <p className="font-source-sans text-lg text-dusk">
                      {review.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          {/* <button
            onClick={next}
            className="order-3 mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-primary transition hover:bg-teal-bright lg:mx-0"
            aria-label="Next review"
          > */}
          <button onClick={next}>
            <Image
              src="/images/home/review-arrow-right.svg"
              alt=""
              width={48}
              height={48}
            />
          </button>
          {/* </button> */}
        </div>
      </div>
    </section>
  );
}
