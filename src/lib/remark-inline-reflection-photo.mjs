// Zero-dependency remark plugin, same shape as remark-inline-subscribe.mjs:
// inserts a raw-HTML photo-space block right after a reflection essay's
// first H2. Session 5's "one in-essay photo space" requirement for
// ReflectionArticle.astro.
//
// Gated on frontmatter.category === 'reflection' via file.data.astro.
// frontmatter — confirmed this is actually populated before remark plugins
// run (not assumed from the docs): @astrojs/markdown-remark's
// createMarkdownProcessor() builds the VFile with
// `data: { astro: { frontmatter } }` before calling `parser.process()`,
// and remark-collect-headings.js (Astro's own rehype plugin, later in the
// same pipeline) reads frontmatter the same way. So every other article
// category is untouched by this plugin — it's a no-op for them, not just
// visually absent.
//
// Placed after the FIRST h2, deliberately distinct from
// remark-inline-subscribe's second-h2 placement — both plugins run on
// reflection essays (the newsletter capture isn't removed for this
// category, only added to), and inserting a non-heading node doesn't
// change the other plugin's own heading count, so registration order
// between the two doesn't matter.
//
// A reflection essay with 0 or 1 h2 simply never gets this block — the
// same "hidden, not empty" mechanism used everywhere else in this
// codebase, not a special case written for this one feature.
//
// Raw HTML (a plain mdast `html` node), not a hand-built hast tree, for
// the same reason as remark-inline-subscribe: no risk of mismatched hast
// property-name mapping. Styled in src/styles/global.css (unscoped, same
// reasoning as `.email-capture`: raw markdown-injected HTML can't be
// reached by any component's scoped <style>).
const REFLECTION_PHOTO_HTML = `<div class="reflection-inline-photo photo-settle" aria-hidden="true"></div>`;

export default function remarkInlineReflectionPhoto() {
  return (tree, file) => {
    if (file.data.astro?.frontmatter?.category !== 'reflection') return;

    let h2Count = 0;

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'heading' && node.depth === 2) {
        h2Count += 1;
        if (h2Count === 1) {
          tree.children.splice(i + 1, 0, { type: 'html', value: REFLECTION_PHOTO_HTML });
          break;
        }
      }
    }
  };
}
