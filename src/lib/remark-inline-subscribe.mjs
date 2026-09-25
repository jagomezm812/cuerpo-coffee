// Zero-dependency remark plugin: inserts a raw-HTML email capture block
// right after an article's second H2, per the business plan's placement
// rule (the other required placement — after the final paragraph — is the
// EmailCapture Astro component already used in src/layouts/Article.astro).
//
// This emits raw HTML directly into the Markdown AST (a plain mdast `html`
// node) rather than hand-building a hast element tree, since Markdown's own
// native support for embedded HTML blocks means Astro renders it as-is with
// no extra dependency and no risk of mismatched hast property-name mapping
// (className vs class, htmlFor vs for, etc).
//
// The markup and classes here must stay in sync with
// src/components/EmailCapture.astro and the shared .email-capture rules in
// src/styles/global.css — this isn't that component, it's a byte-level
// twin of its output so the same page-wide script in EmailCapture.astro can
// find and wire up this form too (both share the .email-capture__form and
// .email-capture__message classes).
const EMAIL_CAPTURE_HTML = `<section class="email-capture">
  <h2>Get one good coffee idea a week.</h2>
  <p>No spam, no upsells in every email. Just what actually improves the cup.</p>
  <form class="email-capture__form">
    <label for="email-capture-input-mid" class="visually-hidden">Email address</label>
    <input id="email-capture-input-mid" type="email" name="email" placeholder="you@example.com" required>
    <button type="submit">Subscribe</button>
  </form>
  <p class="email-capture__message" hidden></p>
</section>`;

export default function remarkInlineSubscribe() {
  return (tree) => {
    let h2Count = 0;

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'heading' && node.depth === 2) {
        h2Count += 1;
        if (h2Count === 2) {
          tree.children.splice(i + 1, 0, { type: 'html', value: EMAIL_CAPTURE_HTML });
          break;
        }
      }
    }
  };
}
