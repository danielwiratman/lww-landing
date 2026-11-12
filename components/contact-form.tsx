'use client';

import { type Locale, localePath } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

export type ContactField = {
  name: string;
  label: string;
  type: string;
  required?: boolean | null;
  options?: Array<{ text: string } | null> | null;
};

type Props = {
  fields: ContactField[];
  submitLabel?: string | null;
  successMessage?: string | null;
  locale: Locale;
};

/**
 * Netlify Forms submission.
 *
 * Next.js pre-renders pages into a cache rather than static HTML, so Netlify
 * cannot detect the form in the rendered markup. The form definitions live in
 * `public/__forms.html`; the payload is posted to that static file.
 */
export function ContactForm({ fields, submitLabel, successMessage, locale }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new URLSearchParams();

    for (const [key, value] of new FormData(form).entries()) {
      payload.append(key, String(value));
    }

    setStatus('sending');
    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      setStatus('done');
      router.push(localePath(locale, '/thank-you/'));
    } catch {
      setStatus('error');
    }
  }

  return (
    <form name='contact' onSubmit={handleSubmit} className='space-y-4'>
      <input type='hidden' name='form-name' value='contact' />
      <p className='hidden'>
        <label>
          Do not fill this out: <input name='bot-field' />
        </label>
      </p>

      <div className='grid sm:grid-cols-2 gap-4'>
        {fields.map((field) => (
          <FieldControl key={field.name} field={field} locale={locale} />
        ))}
      </div>

      <button type='submit' className='btn-primary mt-2' disabled={status === 'sending'}>
        {submitLabel ?? 'Send message'} →
      </button>

      {status === 'error' ? (
        <p className='text-sm text-red-600'>
          {locale === 'id' ? 'Terjadi kesalahan saat mengirim. Silakan coba lagi.' : 'Something went wrong while sending. Please try again.'}
        </p>
      ) : null}

      {successMessage ? (
        <p className='text-xs text-ink-muted'>{successMessage}</p>
      ) : (
        <p className='text-xs text-ink-muted'>
          {locale === 'id'
            ? 'Dengan mengirim formulir ini Anda setuju untuk dihubungi terkait pertanyaan Anda. Kami tidak pernah membagikan data Anda dengan pihak ketiga.'
            : 'By submitting this form you agree to be contacted regarding your enquiry. We never share your details with third parties.'}
        </p>
      )}
    </form>
  );
}

function FieldControl({ field, locale }: { field: ContactField; locale: Locale }) {
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

export default ContactForm;
