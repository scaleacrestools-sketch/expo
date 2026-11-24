export function scrollToTop(behavior = 'smooth') {
  window.scrollTo({ top: 0, behavior });
}

/** Scrolls to a section, retrying briefly while the target mounts. */
export function scrollToHash(hash, { behavior = 'smooth', retries = 24, retryDelay = 125 } = {}) {
  const selector = hash.startsWith('#') ? hash : `#${hash}`;
  const attempt = (left) => {
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(top, 0), behavior });
      return;
    }
    if (left > 0) window.setTimeout(() => attempt(left - 1), retryDelay);
  };
  attempt(retries);
}

export function navigateToSection(hash, navigate, homePath, isHome) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  if (isHome) {
    window.history.replaceState(null, '', `${homePath}#${id}`);
    scrollToHash(`#${id}`);
    return;
  }
  navigate({ pathname: homePath, hash: id });
}
