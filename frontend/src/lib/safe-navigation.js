"use client";

const isMobileViewport = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
};

const hardNavigate = (href, replace = false) => {
  if (typeof window === "undefined" || !href) {
    return;
  }

  if (replace) {
    window.location.replace(href);
    return;
  }

  window.location.assign(href);
};

export const safePush = (router, href) => {
  if (!href) {
    return;
  }

  if (isMobileViewport()) {
    hardNavigate(href);
    return;
  }

  router.push(href);
};

export const safeReplace = (router, href) => {
  if (!href) {
    return;
  }

  if (isMobileViewport()) {
    hardNavigate(href, true);
    return;
  }

  router.replace(href);
};
