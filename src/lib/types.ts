import type * as React from "react";

/** UI SDK parts accept `className` as a function of state; ours take a plain string merged with `cn`. */
type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Like WithClass, for parts whose children could also be a function of state: ours take plain nodes. */
type WithNodeChildren<T> = Omit<WithClass<T>, "children"> & {
  children?: React.ReactNode;
};

export type { WithClass, WithNodeChildren };
