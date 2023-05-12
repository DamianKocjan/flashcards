import {
  Certificate,
  Lightbulb,
  ThumbsUp,
  type IconProps,
} from "@phosphor-icons/react";
import React from "react";

type Feature = {
  title: string;
  description: string;
  icon: React.FC<IconProps>;
};

const FEATURES = [
  {
    title: "Relaxing and Learn",
    description:
      "Resources and tools that help students relax and reduce stress, while enhancing learning.",
    icon: ThumbsUp,
  },
  {
    title: "Certificates",
    description:
      "Section highlighting various academic and professional certificates and their requirements and benefits.",
    icon: Certificate,
  },
  {
    title: "Creative Thinking",
    description:
      "Information on courses, programs, and resources for students to develop their creative skills.",
    icon: Lightbulb,
  },
] satisfies Feature[];

const Feature: React.FC<Feature> = ({ description, icon: Icon, title }) => {
  return (
    <div className="rounded-3xl border border-blue-500 p-8">
      <div className="flex aspect-square w-20 items-center justify-center rounded-lg bg-blue-500 p-1 text-slate-50">
        <Icon className="h-12 w-12" aria-hidden="true" />
      </div>

      <h3 className="mt-2 text-xl font-semibold text-blue-500">{title}</h3>
      <p className="mt-2 text-xl font-medium text-blue-400">{description}</p>

      <button className="mt-16 rounded-3xl border border-blue-500 px-5 py-2 text-center text-lg font-semibold text-blue-500">
        Read more
      </button>
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <section className="p-8 pt-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-5xl font-semibold text-blue-500">Features</h2>
        <p className="mt-1 text-3xl font-semibold text-blue-400">
          Discover the benefits of our platform
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Feature {...feature} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
};
