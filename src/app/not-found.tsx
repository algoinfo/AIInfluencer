import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center pb-20 pt-[112px] text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-fg-muted">
        This page does not exist. Try Genjutsu motion transfer or browse
        examples instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href="/motion-transfer" variant="secondary">
          Try Genjutsu
        </Button>
      </div>
    </div>
  );
}
