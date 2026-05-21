"use client";

import { useState } from "react";

import { FaqsContentSection } from "./FaqsContentSection";
import { FaqsHeroSection } from "./FaqsHeroSection";

export function FaqsPageSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <FaqsHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FaqsContentSection searchQuery={searchQuery} />
    </>
  );
}
