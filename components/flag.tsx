/**
 * Inline flag icons by country code ("us", "id").
 * Designed for small sizes (20–24px) and clipped to a rounded rectangle.
 */
export function Flag({ code }: { code: 'us' | 'id' | string }) {
  const clipId = `flagClip${code}`;

  return (
    <svg className='lang-flag' viewBox='0 0 30 20' aria-hidden='true'>
      <defs>
        <clipPath id={clipId}>
          <rect x='0' y='0' width='30' height='20' rx='3' ry='3' />
        </clipPath>
      </defs>
      {code === 'us' ? (
        <g clipPath={`url(#${clipId})`}>
          <rect x='0' y='0' width='30' height='20' fill='#B22234' />
          <g fill='#FFFFFF'>
            <rect x='0' y='2' width='30' height='1.5' />
            <rect x='0' y='5' width='30' height='1.5' />
            <rect x='0' y='8' width='30' height='1.5' />
            <rect x='0' y='11' width='30' height='1.5' />
            <rect x='0' y='14' width='30' height='1.5' />
            <rect x='0' y='17' width='30' height='1.5' />
          </g>
          <rect x='0' y='0' width='12' height='10' fill='#3C3B6E' />
          <g fill='#FFFFFF'>
            {[
              [2.4, 2],
              [4.8, 2],
              [7.2, 2],
              [9.6, 2],
              [3.6, 3.5],
              [6, 3.5],
              [8.4, 3.5],
              [10.8, 3.5],
              [2.4, 5],
              [4.8, 5],
              [7.2, 5],
              [9.6, 5],
              [3.6, 6.5],
              [6, 6.5],
              [8.4, 6.5],
              [10.8, 6.5],
              [2.4, 8],
              [4.8, 8],
              [7.2, 8],
              [9.6, 8],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r='0.45' />
            ))}
          </g>
        </g>
      ) : (
        <g clipPath={`url(#${clipId})`}>
          <rect x='0' y='0' width='30' height='10' fill='#E70011' />
          <rect x='0' y='10' width='30' height='10' fill='#FFFFFF' />
        </g>
      )}
      <rect x='0.25' y='0.25' width='29.5' height='19.5' rx='2.75' ry='2.75' fill='none' stroke='rgba(0,0,0,0.08)' strokeWidth='0.5' />
    </svg>
  );
}

export default Flag;
