
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = <ChevronRight className="h-4 w-4" />, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol"> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
BreadcrumbList.displayName = "BreadcrumbList"

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    )
  }
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  href?: string
  isCurrentPage?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, href, isCurrentPage = false, ...props }, ref) => {
    if (isCurrentPage) {
      return (
        <span
          aria-current="page"
          className={cn("font-medium text-foreground", className)}
          {...props}
          ref={ref}
        />
      )
    }

    return href ? (
      <Link
        to={href}
        className={cn(
          "transition-colors hover:text-foreground",
          className
        )}
        {...props}
        ref={ref}
      />
    ) : (
      <span
        className={cn(
          "transition-colors hover:text-foreground",
          className
        )}
        {...props}
        ref={ref}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      <ChevronRight className="h-3 w-3" />
    </li>
  )
})
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
}
