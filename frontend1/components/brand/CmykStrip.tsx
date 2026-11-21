// Signature taken from the logo's process-colour chips. It is the only place the
// site uses C, M and Y, so keep it small and don't spread these colours further.

/** Three small chips, for use beside a section label. */
export function CmykChips() {
  return (
    <span className="vd-cmyk-chips" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

/** Full-width printer's colour bar, which wipes in on scroll. */
export function CmykRule() {
  return (
    <div className="vd-cmyk-rule wix-motion vd-rule-reveal" aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}
