// Reusable puppeteer-core helpers for real-browser verification on this project.
// Requires puppeteer-core installed (temporarily, --no-save) — see SKILL.md.
import puppeteer from 'puppeteer-core';

export const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * Launch a real local Chrome, run `fn(page)` against it, then close it.
 *
 * @param {object} opts
 * @param {'light'|'dark'} [opts.theme] - emulates prefers-color-scheme; omit for no preference
 * @param {{width:number,height:number}} [opts.viewport] - defaults to 1100x900
 * @param {(page: import('puppeteer-core').Page) => Promise<void>} fn
 */
export async function withPage({ theme, viewport = { width: 1100, height: 900 } } = {}, fn) {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    if (theme) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    }
    await fn(page);
  } finally {
    await browser.close();
  }
}

/** Move the mouse over an element (by selector) and settle, for hover-state checks. */
export async function hoverSelector(page, selector, settleMs = 300) {
  const el = await page.$(selector);
  if (!el) throw new Error(`hoverSelector: no element matching ${selector}`);
  const box = await el.boundingBox();
  if (!box) throw new Error(`hoverSelector: ${selector} has no bounding box (not visible?)`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise((r) => setTimeout(r, settleMs));
  return box;
}

/**
 * Grid hit-test an element's interior for a stacking/z-index check — more reliable
 * than a screenshot crop, which can look like a leak at a rounded corner even when
 * stacking is correct. Returns elements found that are NOT the target or its descendants.
 */
export async function findStackingLeaks(page, targetSelector, { stepsX = 6, stepsY = 6, inset = 8 } = {}) {
  return page.evaluate(
    (sel, stepsX, stepsY, inset) => {
      const target = document.querySelector(sel);
      if (!target) return { error: `no element matching ${sel}` };
      const rect = target.getBoundingClientRect();
      const leaks = [];
      for (let i = 0; i <= stepsX; i++) {
        for (let j = 0; j <= stepsY; j++) {
          const x = rect.left + inset + ((rect.width - inset * 2) * i) / stepsX;
          const y = rect.top + inset + ((rect.height - inset * 2) * j) / stepsY;
          const hit = document.elementFromPoint(x, y);
          if (hit && !target.contains(hit)) {
            leaks.push({ x, y, tag: hit.tagName, className: hit.className });
          }
        }
      }
      return { leaks };
    },
    targetSelector,
    stepsX,
    stepsY,
    inset,
  );
}
