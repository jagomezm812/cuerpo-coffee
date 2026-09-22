// Astro's client:only hydration needs a statically-analyzable named import,
// so the component must live in its own module rather than being built
// inline inside keystatic.astro's frontmatter.
import { makePage } from '@keystatic/astro/ui';
import keystaticConfig from '../keystatic.config';

export const Keystatic = makePage(keystaticConfig);
