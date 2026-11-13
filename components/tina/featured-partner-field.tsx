'use client';

type Partner = {
  name?: string | null;
  logo?: string | null;
};

type Props = {
  input: {
    value?: { name?: string | null } | null;
    onChange: (value: unknown) => void;
  };
  form?: {
    values?: Record<string, unknown>;
  };
};

export function FeaturedPartnerField({ input, form }: Props) {
  const partners = ((form?.values?.partners as Partner[] | undefined) ?? []).filter((partner) => Boolean(partner?.name));
  const selected = input.value?.name ?? '';

  if (!partners.length) {
    return (
      <input
        type='text'
        value={selected}
        placeholder='Nama mitra utama'
        onChange={(event) => input.onChange({ name: event.target.value })}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
        }}
      />
    );
  }

  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#64748b' }}>Klik logo untuk menjadikan mitra utama yang tampil besar di beranda.</p>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.5rem' }}>
        {partners.map((partner, index) => {
          const isSelected = selected === partner.name;

          return (
            <li key={`${partner.name}-${index}`}>
              <button
                type='button'
                onClick={() => input.onChange(isSelected ? { name: null } : { name: partner.name })}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.625rem',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid #475b29' : '1px solid #e2e8f0',
                  background: isSelected ? '#f3f6ee' : '#ffffff',
                }}
              >
                {partner.logo ? (
                  <img src={partner.logo} alt='' style={{ height: '2rem', width: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ height: '2rem' }} />
                )}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>{partner.name}</span>
                {isSelected ? (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#475b29',
                    }}
                  >
                    Mitra utama
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FeaturedPartnerField;
