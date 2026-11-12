import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='container-x py-32 text-center'>
      <p className='eyebrow justify-center mb-4'>404</p>
      <h1 className='text-4xl md:text-5xl font-bold'>Nothing here...</h1>
      <p className='mt-4 text-ink-muted max-w-md mx-auto'>The page you are looking for may have moved or no longer exists.</p>
      <Link href='/' className='btn-primary mt-8'>
        Go home
      </Link>
    </section>
  );
}
