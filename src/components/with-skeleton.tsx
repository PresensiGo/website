import { cn } from "@/lib/utils";
import type { ComponentProps, PropsWithChildren } from "react";
import { Skeleton } from "./ui/skeleton";

interface WithSkeletonProps extends PropsWithChildren, ComponentProps<"div"> {
  isLoading?: boolean;
}

export const WithSkeleton = ({
  children,
  isLoading = false,
  className,
}: WithSkeletonProps) => {
  const Comp = isLoading ? Skeleton : "div";

  return (
    <>
      <Comp className={cn(isLoading && className)}>
        <div className={cn(isLoading && "invisible")}>{children}</div>
      </Comp>
    </>
  );
};
