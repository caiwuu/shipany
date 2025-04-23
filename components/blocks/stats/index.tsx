import { Heart, Zap } from "lucide-react";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Stats({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container flex flex-col items-center gap-4">
        {section.label && (
          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
            {section.icon && (
              <Icon name={section.icon} className="h-6 w-auto border-primary" />
            )}
            {section.label}
          </div>
        )}
        <h2 className="text-center text-3xl font-semibold lg:text-4xl">
          {section.title}
        </h2>
        <p className="text-center text-muted-foreground lg:text-lg">
          {section.description}
        </p>
        <div className="w-full grid gap-10 md:grid-cols-3 lg:gap-0 mt-8">
          {section.items?.map((item, index) => {
            return (
              <div key={index} className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">
                  {item.title}
                </p>
                <p className="pt-2 text-7xl font-semibold lg:pt-4 text-primary">
                  {item.label}
                </p>
                <p className="text-xl mt-2 font-normal text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
