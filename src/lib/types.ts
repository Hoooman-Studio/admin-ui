/** UI SDK parts accept `className` as a function of state; ours take a plain string merged with `cn`. */
type WithClass<T> = Omit<T, "className"> & { className?: string };

export type { WithClass };
