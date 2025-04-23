import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";

export default function FAQ({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <div className="text-center">
          {section.label && (
            <Badge className="text-xs font-medium">{section.label}</Badge>
          )}
          <h2 className="mt-4 text-4xl font-semibold">{section.title}</h2>
          <p className="mt-6 font-medium text-muted-foreground">
            {section.description}
          </p>
        </div>
        <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
          {section.items?.map((item, index) => (
            <div key={index} className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">
                {index + 1}
              </span>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-md text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
