import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import Link from "next/link";
import { Section as SectionType } from "@/types/blocks/section";

export default function CTA({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="px-8">
        <div className='flex items-center justify-center rounded-2xl  bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
          <div className="mx-auto max-w-screen-md">
            <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground md:text-lg">
              {section.description}
            </p>
            {section.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {section.buttons.map((item, idx) => (
                  <Button key={idx} variant={item.variant || "default"}>
                    <Link
                      href={item.url || ""}
                      target={item.target}
                      className="flex items-center justify-center gap-1"
                    >
                      {item.title}
                      {item.icon && (
                        <Icon name={item.icon as string} className="size-6" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
