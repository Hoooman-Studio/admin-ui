import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider";
import { AlertTriangleIcon, FileIcon, PauseIcon, PlayIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import { Badge } from "./badge";
import { Button } from "./button";
import { Field } from "./field";
import { Loader } from "./loader";
import { Progress } from "./progress";

type FileKind = "image" | "video" | "audio" | "file";

type FilePreviewProps = {
  kind: FileKind;
  /** The file's URL. Leave it out while you load it, and the tile shows a loader. A `"file"` tile needs none. */
  url?: string;
  /** Shown on audio and file tiles, and read by screen readers. */
  name?: string;
  className?: string;
} & (
  | { status?: "ready"; progress?: never }
  | {
      status: "uploading";
      /** From 0 to 1, or null while unknown. */
      progress: number | null;
    }
  | { status: "error"; progress?: never }
);

const kindNames: Record<FileKind, string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  file: "File",
};

// Images keep their ratio at a fixed height; video plays inline, so it gets room; audio and files are rows.
const frames: Record<FileKind, string> = {
  image: "au:h-32 au:w-fit au:min-w-32 au:max-w-64",
  video: "au:aspect-video au:w-full au:max-w-sm",
  audio: "au:h-16 au:w-full au:max-w-sm",
  file: "au:h-16 au:w-full au:max-w-sm",
};

// Pictures stay visible, dimmed, under the progress; a row's progress replaces it.
const uploadOverlays: Record<FileKind, string> = {
  image: "au:items-end au:bg-gray-50/80 au:pb-3",
  video: "au:items-end au:bg-gray-50/80 au:pb-3",
  audio: "au:items-center au:bg-gray-50",
  file: "au:items-center au:bg-gray-50",
};

/** Seconds as "1:05". */
function formatTime(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function AudioPlayer({ url, name }: { url: string; name: string }) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const toggle = React.useCallback(() => {
    const element = audio.current;
    if (element?.paused) {
      element.play().catch(() => setPlaying(false));
    } else {
      element?.pause();
    }
  }, []);
  const seek = React.useCallback((seconds: number) => {
    if (audio.current) {
      audio.current.currentTime = seconds;
    }
    setTime(seconds);
  }, []);
  const read = React.useCallback(
    (event: React.SyntheticEvent<HTMLAudioElement>) => {
      setTime(event.currentTarget.currentTime);
      // A stream reports Infinity until it ends.
      const length = event.currentTarget.duration;
      setDuration(Number.isFinite(length) ? length : 0);
    },
    []
  );
  const play = React.useCallback(() => setPlaying(true), []);
  const pause = React.useCallback(() => setPlaying(false), []);
  return (
    <div className="au:flex au:size-full au:items-center au:gap-3 au:px-3">
      {/* biome-ignore lint/a11y/useMediaCaption: an app's audio rarely has captions; the name labels the player. */}
      <audio
        onDurationChange={read}
        onLoadedMetadata={read}
        onPause={pause}
        onPlay={play}
        onTimeUpdate={read}
        preload="metadata"
        ref={audio}
        src={url}
      />
      <Button
        aria-label={playing ? `Pause ${name}` : `Play ${name}`}
        onClick={toggle}
        rounded
        size="icon-lg"
        variant="accent"
      >
        {playing ? (
          <PauseIcon fill="currentColor" />
        ) : (
          <PlayIcon className="au:translate-x-px" fill="currentColor" />
        )}
      </Button>
      <div className="au:flex au:min-w-0 au:flex-1 au:flex-col au:gap-1">
        <div className="au:flex au:items-baseline au:gap-2 au:text-sm">
          <span className="au:min-w-0 au:flex-1 au:truncate au:font-medium au:text-gray-950">
            {name}
          </span>
          <span className="au:tabular au:shrink-0 au:text-xs au:text-gray-500">
            {formatTime(time)} / {formatTime(duration)}
          </span>
        </div>
        {/* Its own field, so a FormField around the tile doesn't take the slider as its control. */}
        <Field className="au:gap-0">
          <Slider<number>
            disabled={duration === 0}
            format={formatTime}
            max={duration}
            onValueChange={seek}
            step={1}
            value={Math.min(time, duration)}
          >
            <SliderControl className="au:flex au:h-4 au:items-center">
              <SliderTrack className="au:h-1 au:w-full au:rounded-full au:bg-alpha/10">
                <SliderIndicator className="au:h-full au:rounded-full au:bg-accent" />
                <SliderThumb
                  aria-label={`Position in ${name}`}
                  className="au:top-1/2 au:size-3 au:-translate-x-1/2 au:-translate-y-1/2 au:rounded-full au:bg-accent au:shadow-sm au:transition-transform au:has-focus-visible:outline-2 au:has-focus-visible:outline-accent au:has-focus-visible:outline-offset-2 au:data-dragging:scale-125"
                />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </Field>
      </div>
    </div>
  );
}

function VideoPlayer({ url, name }: { url: string; name: string }) {
  const video = React.useRef<HTMLVideoElement>(null);
  const [started, setStarted] = React.useState(false);
  const start = React.useCallback(() => {
    setStarted(true);
    video.current?.play().catch(() => undefined);
  }, []);
  // The play button goes away and the video's own controls take over, so focus moves to them.
  React.useEffect(() => {
    if (started) {
      video.current?.focus();
    }
  }, [started]);
  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: captions are the app's to add; the name labels the video. */}
      <video
        aria-label={name}
        className="au:size-full au:bg-black au:object-contain"
        controls={started}
        playsInline
        preload="metadata"
        ref={video}
        // Asking for the first moment makes Safari show the first frame too.
        src={`${url}#t=0.001`}
        // Lets focus() reach it in every browser once its controls show.
        tabIndex={-1}
      />
      {started ? null : (
        <button
          aria-label={`Play ${name}`}
          className="au:group/play au:absolute au:inset-0 au:flex au:items-center au:justify-center au:outline-none"
          onClick={start}
          type="button"
        >
          <span className="au:flex au:size-12 au:items-center au:justify-center au:rounded-full au:bg-black/50 au:text-white au:backdrop-blur-sm au:transition-colors au:group-hover/play:bg-black/70 au:group-focus-visible/play:outline-2 au:group-focus-visible/play:outline-accent au:group-focus-visible/play:outline-offset-2">
            <PlayIcon
              aria-hidden="true"
              className="au:size-5 au:translate-x-px"
              fill="currentColor"
            />
          </span>
        </button>
      )}
    </>
  );
}

/** The file type from its name, like "PDF". */
function extension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : null;
}

function FileRow({ url, name }: { url: string | undefined; name: string }) {
  const type = extension(name);
  return (
    <div className="au:flex au:size-full au:items-center au:gap-3 au:px-3">
      <span className="au:flex au:size-10 au:shrink-0 au:items-center au:justify-center au:rounded-lg au:bg-alpha/5">
        <FileIcon aria-hidden="true" className="au:size-5 au:text-gray-500" />
      </span>
      {url ? (
        <a
          className="au:min-w-0 au:flex-1 au:truncate au:text-sm au:font-medium au:text-gray-950 au:hover:underline"
          href={url}
          rel="noopener"
          target="_blank"
        >
          {name}
        </a>
      ) : (
        <span className="au:min-w-0 au:flex-1 au:truncate au:text-sm au:font-medium au:text-gray-950">
          {name}
        </span>
      )}
      {type ? <Badge>{type}</Badge> : null}
    </div>
  );
}

function TileContent({
  kind,
  url,
  name,
  failed,
}: {
  kind: FileKind;
  url: string | undefined;
  name: string;
  failed: boolean;
}) {
  if (failed) {
    return (
      <div className="au:flex au:size-full au:flex-col au:items-center au:justify-center au:gap-1 au:px-3 au:text-center">
        <AlertTriangleIcon
          aria-hidden="true"
          className="au:size-5 au:text-red-500"
        />
        <span className="au:line-clamp-2 au:text-xs au:text-gray-600">
          {name}
        </span>
      </div>
    );
  }
  if (kind === "file") {
    return <FileRow name={name} url={url} />;
  }
  if (!url) {
    return <Loader label={`Loading ${name}`} />;
  }
  if (kind === "image") {
    return (
      // biome-ignore lint/correctness/useImageSize: its size is unknown; the tile's fixed height keeps the layout still.
      <img
        alt={name}
        className="au:h-full au:w-auto au:object-cover"
        src={url}
      />
    );
  }
  if (kind === "video") {
    // A new file starts a new player.
    return <VideoPlayer key={url} name={name} url={url} />;
  }
  return <AudioPlayer key={url} name={name} url={url} />;
}

/**
 * A file as a tile: an image thumbnail, a video that plays inline, a compact
 * audio player, or a file row with its type. Shows a loader while `url` is
 * missing, and the upload's progress or failure from `status`.
 */
function FilePreview({
  kind,
  url,
  name,
  className,
  ...state
}: FilePreviewProps) {
  const label = name ?? kindNames[kind];
  const failed = state.status === "error";
  return (
    <div
      className={cn(
        "au:relative au:flex au:shrink-0 au:items-center au:justify-center au:overflow-hidden au:rounded-xl au:border au:border-alpha/10 au:bg-gray-50",
        frames[kind],
        failed && "au:bg-red-500/10 au:ring-2 au:ring-red-500/30 au:ring-inset",
        className
      )}
      data-slot="file-preview"
    >
      {/* Under the upload's overlay, the controls are out of reach. */}
      <div className="au:contents" inert={state.status === "uploading"}>
        <TileContent failed={failed} kind={kind} name={label} url={url} />
      </div>
      {state.status === "uploading" ? (
        <div
          className={cn(
            "au:absolute au:inset-0 au:flex au:px-3",
            uploadOverlays[kind]
          )}
        >
          <Progress
            className="au:w-full"
            label={label}
            max={1}
            value={state.progress}
          />
        </div>
      ) : null}
    </div>
  );
}

export type { FileKind, FilePreviewProps };
export { FilePreview };
