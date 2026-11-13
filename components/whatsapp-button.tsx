import { Icon } from '@/components/icon';

export function WhatsAppButton({
  number,
  label,
}: {
  number?: string | null;
  label?: string | null;
}) {
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target='_blank'
      rel='noopener'
      className='fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-3 pl-2.5 pr-4 sm:pr-6 py-2.5 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 focus-visible:scale-105 transition'
      aria-label={label ? `WhatsApp: ${label}` : 'WhatsApp'}
    >
      <span className='grid place-items-center w-10 h-10 rounded-full bg-white/20 shrink-0'>
        <Icon name='whatsapp' className='w-6 h-6' fill='currentColor' stroke='none' />
      </span>
      {label ? <span className='text-sm font-semibold leading-tight'>{label}</span> : null}
    </a>
  );
}

export default WhatsAppButton;
