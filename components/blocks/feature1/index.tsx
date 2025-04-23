import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature1({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {section.image && (
            <img
              src={section.image?.src}
              alt="placeholder hero"
              className="max-h-full w-full rounded-md object-cover"
            />
          )}
          <div className="flex flex-col lg:text-left">
            {section.title && (
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
                {section.description}
              </p>
            )}
            <ul className="flex flex-col justify-center gap-y-8">
              {section.items?.map((item, i) => (
                <li key={i} className="flex">
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      className="mr-2 size-6 shrink-0 lg:mr-2 lg:size-6"
                    />
                  )}
                  <div>
                    <div className="mb-3 h-5 text-sm font-semibold text-accent-foreground md:text-base">
                      {item.title}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground md:text-base">
                      {item.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
