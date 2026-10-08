import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu API",
  description:
    "Developer-oriented overview of a Genjutsu-style motion transfer API workflow, inputs, outputs and availability notes.",
  path: "/genjutsu-api",
});

const faqs = [
  {
    q: "Is there a live Genjutsu API on this site?",
    a: "Not yet. This page documents the intended workflow shape for developers. No keys, endpoints or fake responses are provided.",
  },
  {
    q: "What would a Genjutsu API accept?",
    a: "Typically a character asset (image or identity reference), a motion reference video, and generation options such as duration or output size.",
  },
  {
    q: "What would it return?",
    a: "A generated video asset URL or job ID for async rendering, plus status for long-running generations.",
  },
];

export default function GenjutsuApiPage() {
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title="Genjutsu API"
        subtitle="A documentation-style overview of how a motion transfer API could work. No live integration is claimed here."
        tags={["API", "Motion Transfer", "AI Video"]}
      />

      <section className="section-pad">
        <div className="page-shell grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="What is Genjutsu API?"
            body="A programmatic interface for character + reference video → motion transfer → AI video. Useful for apps that need automated short-form generation."
          />
          <FeatureCard
            title="API workflow"
            body="Authenticate → submit character + reference → poll or webhook for completion → download output video."
          />
          <FeatureCard
            title="Input"
            body="Character image or identity pack, reference video file/URL, optional prompts for restyle, and output constraints."
          />
          <FeatureCard
            title="Output"
            body="Rendered MP4/WebM (or job metadata). Exact formats depend on the upstream provider you integrate."
          />
          <FeatureCard
            title="Authentication"
            body="Expected pattern: API keys or OAuth scoped to a project. Do not embed secrets in client-side apps."
          />
          <FeatureCard
            title="Pricing / availability"
            body="Availability and pricing depend on the underlying video provider. This site does not sell API access today."
          />
        </div>

        <div className="page-shell mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Example shape
          </h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-fg-muted">
{`// Illustrative only — not a real endpoint
POST /v1/motion-transfer
{
  "character": { "image_url": "..." },
  "reference": { "video_url": "..." },
  "options": { "duration_sec": 4 }
}

// Response (async job)
{ "job_id": "mt_...", "status": "queued" }`}
          </pre>
        </div>

        <div className="page-shell mt-12 space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            FAQ
          </h2>
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-border bg-surface/50 p-5"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {item.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
