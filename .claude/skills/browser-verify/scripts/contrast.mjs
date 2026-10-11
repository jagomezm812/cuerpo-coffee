#!/usr/bin/env node
// WCAG contrast-ratio checker, with correct alpha compositing.
//
// A translucent color (rgba(...)) must be composited against what's actually
// behind it before computing contrast — treating it as already-opaque gives a
// wrong (often much worse) ratio. This project shipped exactly that mistake
// once, on an audit script, and it produced a false "near failure" for a real
// pass. Don't repeat it: always resolve to opaque hex before comparing.
//
// CLI usage:
//   node contrast.mjs "#f3eadf" "#231810"
//   node contrast.mjs "rgba(227,173,132,0.16)" "#33261d"              (fg translucent, composited onto bg directly)
//   node contrast.mjs "rgba(227,173,132,0.16)" "#f3eadf" --behind "#33261d"   (explicit "what's really behind it")
//
// Importable:
//   import { contrastRatio, parseColor, compositeOver } from './contrast.mjs';

export function parseColor(input) {
  const s = input.trim();
  const rgba = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] !== undefined ? +rgba[4] : 1 };
  }
  const hex = s.replace('#', '');
  if (hex.length === 3) {
    const [r, g, b] = hex.split('').map((c) => parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }
  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }
  throw new Error(`parseColor: unrecognized color "${input}"`);
}

/** Flatten a translucent color onto an opaque one behind it. */
export function compositeOver(fg, bg) {
  const a = fg.a ?? 1;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

function relLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(fgInput, bgInput) {
  let fg = typeof fgInput === 'string' ? parseColor(fgInput) : fgInput;
  const bg = typeof bgInput === 'string' ? parseColor(bgInput) : bgInput;
  if ((fg.a ?? 1) < 1) fg = compositeOver(fg, bg);
  const l1 = relLuminance(fg);
  const l2 = relLuminance(bg);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

// --- CLI ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const behindFlagIdx = args.indexOf('--behind');
  const behind = behindFlagIdx !== -1 ? args[behindFlagIdx + 1] : null;
  const positional = args.filter((a, i) => a !== '--behind' && args[i - 1] !== '--behind');
  const [fgArg, bgArg] = positional;

  if (!fgArg || !bgArg) {
    console.error('Usage: node contrast.mjs <fg> <bg> [--behind <real-background>]');
    process.exit(1);
  }

  let fg = parseColor(fgArg);
  let bg = parseColor(bgArg);

  if (behind) {
    // fg (or bg) is translucent and sits over `behind`, not directly over bg for display purposes —
    // composite it first, then compare against bg (the second arg) as the actual visual background.
    const behindColor = parseColor(behind);
    if ((fg.a ?? 1) < 1) fg = compositeOver(fg, behindColor);
    if ((bg.a ?? 1) < 1) bg = compositeOver(bg, behindColor);
  }

  const ratio = contrastRatio(fg, bg);
  const passNormal = ratio >= 4.5;
  const passLarge = ratio >= 3;
  console.log(`${ratio.toFixed(2)}:1`);
  console.log(`  normal text (4.5:1): ${passNormal ? 'PASS' : 'FAIL'}`);
  console.log(`  large text (3:1):    ${passLarge ? 'PASS' : 'FAIL'}`);
}
