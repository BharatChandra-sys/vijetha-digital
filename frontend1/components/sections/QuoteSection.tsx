import QuoteBuilder from '@/components/conversion/QuoteBuilder';

// Same figures as the home page FAQ schema in app/page.tsx. Change them together.
const TURNAROUND: [string, string][] = [
  ['Flex banners and standees, under 500 sq.ft', 'Same day'],
  ['Vehicle wraps', '1 to 2 days per vehicle'],
  ['Offset printing, brochures and flyers', '3 to 5 days'],
  ['LED sign boards', '5 to 7 working days'],
  ['ACP cladding and fabricated signs', '7 to 10 days'],
  ['Exhibition booth setups', '10 to 15 days'],
];

export default function QuoteSection() {
  return (
    <section id="quote" className="vd-section vd-section--white" aria-labelledby="quote-heading">
      <div className="wix-container">
        <div className="vd-quote-layout">
          <div className="wix-motion wix-fade-right">
            <h2 id="quote-heading" className="vd-h2">How long will your job take?</h2>
            <p className="vd-body">
              Typical production times from our Nacharam facility. Rush production is available
              for urgent work.
            </p>
            <table className="vd-table">
              <caption className="vd-sr-only">Typical turnaround by product at Vijetha Digital, Hyderabad</caption>
              <thead>
                <tr>
                  <th scope="col">Job</th>
                  <th scope="col">Typical time</th>
                </tr>
              </thead>
              <tbody>
                {TURNAROUND.map(([job, time]) => (
                  <tr key={job}>
                    <th scope="row">{job}</th>
                    <td>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="wix-motion wix-fade-left wix-delay-2">
            <QuoteBuilder />
          </div>
        </div>
      </div>
    </section>
  );
}
