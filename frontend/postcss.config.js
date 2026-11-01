/**
 * The legacy global sheets below force !important rules on bare elements
 * (h1, img, section, body, a[class*="bg-plum"]...). The portals still rely on
 * them, but they break the storefront layout, so they are limited to pages that
 * are not marked data-surface="store". :where() keeps specificity unchanged,
 * so portal styling resolves exactly as it did before.
 */
const LEGACY_SHEETS =
  /src[\\/]styles[\\/](button-system|mobile-enhancements-clean|mobile-optimized|mobile-perfect|whatsapp-button-fix|critical-fixes)\.css$/;
const PORTAL_ONLY = ':where(html:not([data-surface="store"]))';

const scopeLegacySheets = {
  postcssPlugin: "scope-legacy-sheets",
  Once(root) {
    if (!LEGACY_SHEETS.test(root.source?.input?.file || "")) return;
    root.walkRules((rule) => {
      if (rule.parent?.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
      rule.selectors = rule.selectors.map((selector) =>
        /^(html|:root)\b/.test(selector)
          ? selector.replace(/^(html|:root)/, `html${PORTAL_ONLY}`)
          : `${PORTAL_ONLY} ${selector}`
      );
    });
  },
};

export default {
  plugins: [scopeLegacySheets, (await import("tailwindcss")).default, (await import("autoprefixer")).default],
};
