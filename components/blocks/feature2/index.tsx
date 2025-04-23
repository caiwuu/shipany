"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import Fade from "embla-carousel-fade";
import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

const DURATION = 5000;

export default function Feature2({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const [api, setApi] = useState<CarouselApi>();
  const [currentAccordion, setCurrentAccordion] = useState("1");

  useEffect(() => {
    api?.scrollTo(+currentAccordion - 1);
    const interval = setInterval(() => {
      setCurrentAccordion((prev) => {
        const next = parseInt(prev) + 1;
        return next > 3 ? "1" : next.toString();
      });
    }, DURATION);

    return () => clearInterval(interval);
  }, [api, currentAccordion]);

  return (
    <section id={section.name} className="py-32">
      <div className="container">
        <div className="mx-auto grid gap-20 lg:grid-cols-2">
          <div>
            {section.label && (
              <Badge variant="outline" className="mb-4">
                {section.label}
              </Badge>
            )}
            <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
              {section.title}
            </h2>
            <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
              {section.description}
            </p>
            <Accordion
              type="single"
              value={currentAccordion}
              onValueChange={(value) => {
                setCurrentAccordion(value);
                console.log(value);
                api?.scrollTo(+value - 1);
              }}
            >
              {section.items?.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={(i + 1).toString()}
                  className="border-b-0 border-secondary"
                >
                  <AccordionTrigger className="text-left data-[state=closed]:text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      {item.icon && (
                        <p className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          <Icon
                            name={item.icon}
                            className="size-5 shrink-0 lg:size-6"
                          />
                        </p>
                      )}
                      <span className="font-medium lg:text-lg">
                        {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground lg:text-base">
                    {item.description}
                    <div className="mt-8 h-px bg-muted">
                      <div
                        className="h-px animate-progress bg-primary"
                        style={{
                          animationDuration: `${DURATION}ms`,
                        }}
                      ></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <Carousel
              opts={{
                duration: 50,
              }}
              setApi={setApi}
              plugins={[Fade()]}
            >
              <CarouselContent>
                {section.items?.map((item, i) => (
                  <CarouselItem key={i}>
                    <div>
                      <img
                        src={item.image?.src}
                        alt={item.image?.alt || item.title}
                        className="max-h-auto w-full object-cover lg:max-h-none rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
