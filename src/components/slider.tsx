import {
  SliderControl,
  SliderIndicator,
  Slider as SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider";
import type * as React from "react";
import type { WithClass } from "../lib/types";

type SliderProps = Omit<
  WithClass<React.ComponentProps<typeof SliderRoot<number>>>,
  "children"
>;

/** A one-thumb slider on a thin accent track. `aria-label` names the thumb when no FieldLabel does. */
function Slider({ "aria-label": ariaLabel, ...props }: SliderProps) {
  return (
    <SliderRoot<number> {...props}>
      <SliderControl className="au:flex au:h-4 au:items-center">
        <SliderTrack className="au:h-1 au:w-full au:rounded-full au:bg-alpha/10">
          <SliderIndicator className="au:h-full au:rounded-full au:bg-accent" />
          <SliderThumb
            aria-label={ariaLabel}
            className="au:top-1/2 au:size-3 au:-translate-x-1/2 au:-translate-y-1/2 au:rounded-full au:bg-accent au:shadow-sm au:transition-transform au:has-focus-visible:outline-2 au:has-focus-visible:outline-accent au:has-focus-visible:outline-offset-2 au:data-dragging:scale-125"
          />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
}

export { Slider };
