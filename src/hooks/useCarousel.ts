import { useCallback, useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  direction?: "rtl" | "ltr";
}

export function useCarousel({ direction = "rtl" }: UseCarouselOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    // In RTL browsers scrollLeft is negative (0 at the visual start).
    const current = Math.abs(el.scrollLeft);
    setCanScrollStart(current > 1);
    setCanScrollEnd(current < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scroll = useCallback(
    (to: "start" | "end") => {
      const el = scrollRef.current;
      if (!el) return;
      const card = el.firstElementChild as HTMLElement | null;
      const cardWidth = card?.offsetWidth ?? el.clientWidth * 0.75;
      const distance = cardWidth + 16;
      const isRtl =
        direction === "rtl" ||
        getComputedStyle(el).direction === "rtl";
      // RTL: moving to the visual end decreases scrollLeft (negative values).
      const sign = isRtl ? -1 : 1;
      const delta = (to === "end" ? distance : -distance) * sign;
      el.scrollBy({ left: delta, behavior: "smooth" });
    },
    [direction],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null || touchStartY.current == null) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const endX = touch.clientX;
      const endY = touch.clientY;
      const diffX = touchStartX.current - endX;
      const diffY = touchStartY.current - endY;
      touchStartX.current = null;
      touchStartY.current = null;

      // Ignore vertical swipes or very small movements
      if (Math.abs(diffX) < Math.abs(diffY) || Math.abs(diffX) < 24) return;

      if (diffX > 0) {
        // Swiped left (finger moved left) -> go to visual end in RTL
        scroll("end");
      } else {
        // Swiped right (finger moved right) -> go to visual start in RTL
        scroll("start");
      }
    },
    [scroll],
  );

  return {
    scrollRef,
    canScrollStart,
    canScrollEnd,
    scroll,
    onTouchStart,
    onTouchEnd,
  };
}
