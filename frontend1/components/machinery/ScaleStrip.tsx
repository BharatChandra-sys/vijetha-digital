import { MACHINES, WIDEST_MM, formatFeet, formatMetres } from '@/lib/machinery';

const PERSON_MM = 1700;
const TICKS = Array.from({ length: Math.floor(WIDEST_MM / 500) + 1 }, (_, i) => i * 500);

/** Every machine's print width or bed length, drawn to one scale. */
export default function ScaleStrip() {
  const rows = [...MACHINES].sort((a, b) => b.widthMm - a.widthMm);
  const pct = (mm: number) => `${(mm / WIDEST_MM) * 100}%`;

  return (
    <figure className="vd-scale" aria-labelledby="scale-caption">
      <div className="vd-scale-ruler" aria-hidden="true">
        {TICKS.map((mm) => (
          <span key={mm} style={{ left: pct(mm) }}>{mm / 1000} m</span>
        ))}
      </div>

      <ul className="vd-scale-rows">
        {rows.map((m, i) => (
          <li key={m.slug} className="vd-scale-row">
            <span className="vd-scale-name">{m.name}</span>
            <span className="vd-scale-track">
              <span
                className={`vd-scale-bar vd-scale-bar--${m.group} wix-motion`}
                style={{ width: pct(m.widthMm), transitionDelay: `${i * 70}ms` }}
              />
            </span>
            <span className="vd-scale-value">
              {m.approx ? '≈ ' : ''}{formatMetres(m.widthMm)}
              <small>{formatFeet(m.widthMm)}{m.depthMm ? ' bed' : ''}</small>
            </span>
          </li>
        ))}
        <li className="vd-scale-row vd-scale-row--ref">
          <span className="vd-scale-name">A person, arms spread</span>
          <span className="vd-scale-track">
            <span className="vd-scale-bar vd-scale-bar--ref wix-motion" style={{ width: pct(PERSON_MM) }} />
          </span>
          <span className="vd-scale-value">≈ 1.7 m<small>for scale</small></span>
        </li>
      </ul>

      <figcaption id="scale-caption" className="vd-scale-key">
        <span><i className="vd-key--roll" />Roll printing</span>
        <span><i className="vd-key--uv" />UV printing</span>
        <span><i className="vd-key--cut" />Cutting, longest bed side</span>
        <span>≈ approximate size</span>
      </figcaption>
    </figure>
  );
}
