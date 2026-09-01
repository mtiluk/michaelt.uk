import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

function Shell({ caption, stickyFirstColumn, children, }: { caption?: string;stickyFirstColumn?: boolean; children: ReactNode; }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-foreground/10">
      <div
        className={cn(
          "overflow-x-auto",
          stickyFirstColumn &&
            "[&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-10 [&_td:first-child]:bg-background [&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-10 [&_th:first-child]:bg-background",
        )}
      >
        {children}
      </div>

      {caption && (
        <figcaption className="border-t border-foreground/10 px-4 py-2 text-[10px] tracking-wide text-foreground/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const tableComponents = {
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <Shell>
      <table
        className="w-full min-w-140 border-collapse text-left text-[12px]"
        {...props}
      >
        {children}
      </table>
    </Shell>
  ),

  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead
      className="border-b border-foreground/10 bg-text-highlight/4"
      {...props}
    />
  ),

  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody
      className="[&>tr>td:first-child]:text-text-highlight [&>tr:last-child]:border-0"
      {...props}
    />
  ),

  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className="border-b border-foreground/8 transition-colors hover:bg-foreground/3"
      {...props}
    />
  ),

  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-3 py-2.5 align-bottom text-[10px] font-medium uppercase tracking-wider text-foreground/50"
      {...props}
    />
  ),

  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn(
        "px-3 py-2.5 align-top leading-relaxed text-foreground/80 [&_strong]:font-medium [&_strong]:text-text-highlight",
        className,
      )}
      {...props}
    />
  ),
};

export default function Table({
  columns,
  rows,
  caption,
  stickyFirstColumn = false,
}: {
  columns: ReactNode[];
  rows: ReactNode[][];
  caption?: string;
  stickyFirstColumn?: boolean;
}) {
  return (
    <Shell caption={caption} stickyFirstColumn={stickyFirstColumn}>
      <table className="w-full min-w-140 border-collapse text-left text-[12px]">
        <thead className="border-b border-foreground/10 bg-text-highlight/4">
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                scope="col"
                className="px-3 py-2.5 align-bottom text-[10px] font-medium uppercase tracking-wider text-foreground/50"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-foreground/8 transition-colors last:border-0 hover:bg-foreground/3"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-3 py-2.5 align-top leading-relaxed",
                    j === 0
                      ? "font-medium text-text-highlight"
                      : "text-foreground/80",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
