import { ArrowLink } from "@/components/ui/ArrowLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-end bg-charcoal pb-[clamp(4rem,10vw,8rem)] pt-[calc(var(--header-h)+4rem)] text-ivory">
      <div className="container-x mx-auto max-w-[110rem]">
        <p className="eyebrow text-coral">404</p>
        <h1 className="display mt-6">Lost the plot.</h1>
        <p className="lead mt-6 max-w-[40ch] text-stone">The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to the work.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ArrowLink href="/">Back Home</ArrowLink>
          <ArrowLink href="/contact" variant="outline" className="text-ivory">Let&apos;s Talk</ArrowLink>
        </div>
      </div>
    </section>
  );
}
