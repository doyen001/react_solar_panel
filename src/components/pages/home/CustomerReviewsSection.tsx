"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icons";

const reviews = [
  {
    name: "Dalton Tolentino Sandico",
    rating: 5,
    quote:
      "I'm happy with the service that i have received from Easylink Solar. Highly Recommended!!",
    image: "/images/feedback/1.jpg",
  },
  {
    name: "Joy-cris Tan",
    rating: 5,
    quote:
      "Hi Sujay and team, thank you for helping me save power cost thru a proper and professional way of solar system installation. I highly recommend this company if you want to save and earn power credits. The after sales program is awesome! Give them a call now! Thanks again.",
    image: "/images/feedback/2.jpg",
  },
  {
    name: "Cha Chie",
    rating: 5,
    quote:
      "Sales representative Sujay is very transparent, a man of his words and will help you all the way, doesn't miss a call and messages. Very optimistic and professional. I've got a single phase main switch but the inverter I've chosen is a 3 phase inverter, they actually convert my single phase main switch to 3 phase free of charge! As for the team of installers led by David, exceptional as well. Very professional and installs the system neatly! Very happy with the experience! Thank you Easylink Solar!",
    image: "/images/feedback/3.jpg",
  },
  {
    name: "Verified Customer",
    rating: 5,
    quote:
      "Another successful installation at Kariong, for Ms. Kim and Mr. Robert - 13.3kW and 15kW inverter with future system upgrade capacity and battery.",
    image: "/images/feedback/4.png",
  },
  {
    name: "Saad Abood",
    rating: 5,
    quote: "Very accurate. Good panels and inverters. Professional installation.",
    image: "/images/feedback/5.png",
  },
];

const AUTO_ADVANCE_MS = 5000;

export function CustomerReviewsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [current]);

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
                  key={review.image}
                  src={review.image}
                  alt={`Solar installation for ${review.name}`}
                  fill
                  sizes="(min-width: 640px) 338px, 280px"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-7">
                  <div
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`Rated ${review.rating} out of 5`}
                  >
                    {Array.from({ length: review.rating }, (_, star) => (
                      <Icon
                        key={star}
                        name="Star"
                        className="size-5 text-gold"
                      />
                    ))}
                  </div>
                  <p className="font-source-sans text-base leading-relaxed text-dusk sm:text-lg">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-8 flex items-end gap-4 lg:mt-0">
                  <div>
                    <p className="font-source-sans text-lg font-bold text-indigo-night">
                      {review.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          <button onClick={next} aria-label="Next review">
            <Image
              src="/images/home/review-arrow-right.svg"
              alt=""
              width={48}
              height={48}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
