/**
 * Horizontal ticker: rows scroll in alternating directions — the first row
 * travels left, the second right.
 */
export function ClientMarquee({ items, rows = 2 }: { items: string[]; rows?: number }) {
  if (!items.length) return null;

  const rowCount = Math.max(1, Math.min(rows, items.length));
  const perRow = Math.ceil(items.length / rowCount);

  const chunks = Array.from({ length: rowCount }, (_, row) => items.slice(row * perRow, row * perRow + perRow)).filter((chunk) => chunk.length > 0);

  return (
    <div className='client-marquee' role='list' aria-label='Client list'>
      {chunks.map((row, rowIndex) => (
        <div key={rowIndex} className={`client-marquee-row ${rowIndex % 2 === 1 ? 'client-marquee-row-reverse' : ''}`}>
          <div className='client-marquee-track'>
            {[...row, ...row].map((name, index) => (
              <span key={`${name}-${index}`} className='client-marquee-item' role='listitem' aria-hidden={index >= row.length ? 'true' : undefined}>
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClientMarquee;
