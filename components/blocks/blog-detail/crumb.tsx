import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { BlogItem } from "@/types/blocks/blog";
import { Home } from "lucide-react";
import { Post } from "@/types/post";
import { useTranslations } from "next-intl";

export default function Crumb({ post }: { post: Post }) {
  const t = useTranslations();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={post.locale === "en" ? "/" : `/${post.locale}`}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={post.locale === "en" ? "/posts" : `/${post.locale}/posts`}
          >
            {t("blog.title")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{post.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
