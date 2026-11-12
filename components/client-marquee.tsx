/**
 * Vertical ticker: five horizontal rows scrolling at the same speed.
 * Odd rows scroll right-to-left, even rows left-to-right.
 */
export function ClientMarquee({ items }: { items: string[] }) {
  if (!items.length) return null;

  const rowCount = 5;
  const total = items.length;
  const perRow = Math.ceil(total / rowCount);

  const rows = Array.from({ length: rowCount }, (_, row) => {
    const offset = row * perRow;
    const slice: string[] = [];
    for (let i = offset; i < offset + perRow; i += 1) {
      slice.push(items[i % total]);
    }
    return slice;
  });

  return (
    <div className='client-marquee' role='list' aria-label='Client list'>
      {rows.map((row, rowIndex) => (
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
