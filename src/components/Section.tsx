"use client";

import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}

export function Section({
  children,
  className = "",
  id,
  containerClassName = "",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 lg:py-36 relative overflow-hidden ${className}`}>
      <div className={`max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
