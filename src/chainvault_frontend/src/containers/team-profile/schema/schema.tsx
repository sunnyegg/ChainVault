import { SchemaItem } from "./schema.type";
import { Hero } from "../layout/Hero";
import { Problem } from "../layout/Problem";
import { Solution } from "../layout/Solution";
import { HowItWorks } from "../layout/HowItWorks";
import { Impact } from "../layout/Impact";
import { Team } from "../layout/Team";
import { TryItOut } from "../layout/TryItOut";

export const contentSchema: SchemaItem[] = [
  {
    title: "Home",
    id: "hero",
    showTitle: false,
    children: <Hero />,
    hasBgSVG: true,
    styles: "min-h-screen bg-[#0B0E11] text-[#EAECEF]",
  },
  {
    title: "The Problem We Are Solving",
    id: "problem",
    showTitle: false,
    children: <Problem />,
    styles: "min-h-screen bg-[#181A20] text-[#EAECEF]",
  },
  {
    title: "Our Solution",
    id: "solution",
    showTitle: false,
    children: <Solution />,
    styles: "min-h-screen bg-[#0B0E11] text-[#EAECEF]",
  },
  {
    title: "How it works",
    id: "how-it-works",
    showTitle: false,
    children: <HowItWorks />,
    styles: "min-h-screen bg-[#181A20] text-[#EAECEF]",
  },
  {
    title: "Why it matters",
    id: "impact",
    showTitle: false,
    children: <Impact />,
    styles: "min-h-screen bg-[#0B0E11] text-[#EAECEF]",
  },
  {
    title: "Meet the Team",
    id: "team",
    showTitle: false,
    children: <Team />,
    styles: "min-h-screen bg-[#181A20] text-[#EAECEF]",
  },
  {
    title: "Try it out",
    id: "try-it-out",
    showTitle: false,
    children: <TryItOut />,
    styles: "min-h-screen bg-[#0B0E11] text-[#EAECEF]",
  },
] as const;
