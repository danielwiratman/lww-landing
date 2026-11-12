'use client';

import { Icon } from '@/components/icon';
import PageHeader from '@/components/page-header';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { ContactConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<ContactConnectionQuery>;
  locale: Locale;
  phone?: string | null;
};

export function ContactView({ tina, locale, phone }: Props) {
  const { data } = useTina(tina);
  const contact = data.contactConnection.edges?.[0]?.node;

  if (!contact) return null;

  const hero = contact.hero;
  const form = contact.form;

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Contact'}
        heading={hero?.heading ?? contact.title}
        subheading={contact.intro ?? undefined}
        locale={locale}
      />

      {contact.channels?.length ? (
        <section className='container-x py-12'>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {(contact.channels ?? [])
              .filter((channel): channel is NonNullable<typeof channel> => Boolean(channel))
              .map((channel) => (
                <li key={channel.label}>
                  <a href={channel.url ?? undefined} className='card p-6 h-full block hover:border-brand hover:-translate-y-1 transition-all'>
                    <div className='w-12 h-12 rounded-md bg-brand-50 text-brand flex items-center justify-center mb-4'>
                      <Icon name={channel.icon} className='w-6 h-6' />
                    </div>
                    <p className='text-xs uppercase tracking-wider text-ink-muted mb-1'>{channel.label}</p>
                    <p className='font-semibold'>{channel.value}</p>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {contact.map?.embedUrl ? (
        <section className='container-x pb-12'>
          <div className='rounded-2xl overflow-hidden border border-line bg-white'>
            <div className='aspect-[21/9] w-full'>
              <iframe
                src={contact.map.embedUrl}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='strict-origin-when-cross-origin'
                title={contact.map.title ?? 'Map'}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className='container-x py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='card p-6 md:p-8'>
              {form?.heading ? <h2 className='text-2xl font-bold mb-2'>{form.heading}</h2> : null}
              {form?.intro ? <p className='text-sm text-ink-muted mb-6'>{form.intro}</p> : null}

              <form name='contact' method='POST' data-netlify='true' netlify-honeypot='bot-field' action='/thank-you/' className='space-y-4'>
                <input type='hidden' name='form-name' value='contact' />
                <p className='hidden'>
                  <label>
                    Do not fill this out: <input name='bot-field' />
                  </label>
                </p>

                <div className='grid sm:grid-cols-2 gap-4'>
                  {(form?.fields ?? [])
                    .filter((field): field is NonNullable<typeof field> => Boolean(field))
                    .map((field) => (
                      <FieldControl key={field.name} field={field} locale={locale} />
                    ))}
                </div>

                <button type='submit' className='btn-primary mt-2'>
                  {form?.submitLabel ?? 'Send message'} →
                </button>
                <p className='text-xs text-ink-muted'>
                  By submitting this form you agree to be contacted regarding your enquiry. We never share your details with third parties.
                </p>
              </form>
            </div>
          </div>

          <aside className='space-y-6'>
            {contact.hours?.length ? (
              <div className='card p-6'>
                <h3 className='text-base font-bold mb-4 flex items-center gap-2'>
                  <Icon name='calendar' className='w-5 h-5' />
                  Business hours
                </h3>
                <ul className='space-y-3 text-sm'>
                  {(contact.hours ?? [])
                    .filter((hour): hour is NonNullable<typeof hour> => Boolean(hour))
                    .map((hour) => (
                      <li key={hour.day} className='flex items-start justify-between gap-3 pb-2 border-b border-line last:border-0 last:pb-0'>
                        <span className='text-ink-muted'>{hour.day}</span>
                        <span className='font-semibold text-right'>{hour.time}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}

            {contact.urgentHelp ? (
              <div className='card p-6'>
                <h3 className='text-base font-bold mb-2'>{contact.urgentHelp.heading}</h3>
                <p className='text-sm text-ink-muted mb-4'>{contact.urgentHelp.text}</p>
                <a href={`tel:${phone ?? ''}`} className='btn-primary w-full'>
                  {contact.urgentHelp.buttonLabel ?? phone}
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}

type FieldControlProps = {
  field: {
    name: string;
    label: string;
    type: string;
    required?: boolean | null;
    options?: Array<{ text: string } | null> | null;
  };
  locale: Locale;
};

function FieldControl({ field, locale }: FieldControlProps) {
  const id = `f-${field.name}`;
  const label = (
    <label htmlFor={id} className='block text-sm font-semibold mb-1.5'>
      {field.label} {field.required ? <span className='text-red-500'>*</span> : null}
    </label>
  );

  if (field.type === 'textarea') {
    return (
      <div className='sm:col-span-2'>
        {label}
        <textarea id={id} name={field.name} rows={5} required={field.required ?? false} className='input resize-y' />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className='sm:col-span-2'>
        {label}
        <select id={id} name={field.name} required={field.required ?? false} className='input'>
          <option value=''>{locale === 'id' ? 'Pilih…' : 'Please select…'}</option>
          {(field.options ?? [])
            .filter((option): option is { text: string } => Boolean(option))
            .map((option) => (
              <option key={option.text} value={option.text}>
                {option.text}
              </option>
            ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input id={id} type={field.type} name={field.name} required={field.required ?? false} className='input' />
    </div>
  );
}

export default ContactView;
