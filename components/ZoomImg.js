"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// Images in posts. When the column shrinks an image (screenshots), clicking it
// opens the full-size version in a dialog; Esc, a click or the button closes it.
export default function ZoomImg({ src, alt = "", ...rest }) {
  const img = useRef(null);
  const dialog = useRef(null);
  const [zoomable, setZoomable] = useState(false);

  const check = () => {
    const el = img.current;
    if (el) setZoomable(el.naturalWidth > el.clientWidth * 1.15);
  };
  // the image may finish loading before hydration, so onLoad alone can miss it;
  // the column also narrows on resize
  useEffect(() => {
    if (img.current?.complete) check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const open = () => {
    if (!zoomable) return;
    dialog.current?.showModal();
    track("image_zoom", { src, page_slug: window.location.pathname });
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <img
        ref={img}
        src={src}
        alt={alt}
        {...rest}
        onLoad={check}
        onClick={open}
        className={[rest.className, zoomable && "zoomable"].filter(Boolean).join(" ") || undefined}
        tabIndex={zoomable ? 0 : undefined}
        role={zoomable ? "button" : undefined}
        aria-label={zoomable ? `${alt} (click to enlarge)` : undefined}
        onKeyDown={(e) => zoomable && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
      />
      {zoomable ? (
        <dialog ref={dialog} className="zoom" onClick={close} aria-label={alt}>
          <button type="button" className="zoom-close" onClick={close} aria-label="Close">×</button>
          <img src={src} alt={alt} />
        </dialog>
      ) : null}
    </>
  );
}
