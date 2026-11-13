import { Icon } from '@/components/icon';
import type { SolutionDoc } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  solution: SolutionDoc;
  href: string;
  learnMoreLabel: string;
};

export function SolutionCard({ solution, href, learnMoreLabel }: Props) {
  return (
    <Link href={href} className='group card overflow-hidden hover:border-brand hover:-translate-y-1 transition-all flex flex-col h-full'>
      <div className='relative aspect-[16/10] bg-brand-50 border-b border-line overflow-hidden'>
        {solution.product?.image ? (
          <Image
            src={solution.product.image}
            alt={solution.product.name ?? solution.title}
            fill
            sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            className='object-contain p-4 transition group-hover:scale-[1.03]'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center text-brand'>
            <Icon name={solution.icon} className='w-8 h-8' />
          </div>
        )}
      </div>
      <div className='p-7 flex flex-col flex-1'>
        {solution.product?.name ? <p className='text-xs font-semibold uppercase tracking-wider text-brand mb-2'>{solution.product.name}</p> : null}
        <h3 className='text-lg font-bold mb-2 group-hover:text-brand transition'>{solution.title}</h3>
        <p className='text-sm text-ink-muted leading-relaxed'>{solution.shortDescription}</p>
        <p className='mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand'>
          {learnMoreLabel}
          <Icon name='arrow-right' className='w-4 h-4' />
        </p>
      </div>
    </Link>
  );
}

export default SolutionCard;
