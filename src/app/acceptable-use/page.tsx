import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Acceptable Use Policy",
  description: `Acceptable use rules for ${SITE_NAME}, the AI video motion-transfer service.`,
  path: "/acceptable-use",
  keywords: ["Acceptable Use Policy", "Genjutsu"],
});

const LAST_UPDATED = "October 8, 2026";

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-base font-semibold text-fg">{children}</h3>
  );
}

const linkClass = "text-accent transition-colors hover:text-fg";

export default function AcceptableUsePage() {
  return (
    <LegalShell title="Acceptable Use Policy" lastUpdated={LAST_UPDATED}>
      <LegalSection title="Overview">
        <p>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) governs your access and
          use of {SITE_NAME} website and AI-powered service at {SITE_URL}. This
          document is incorporated into our{" "}
          <Link href="/terms" className={linkClass}>
            Terms of Service
          </Link>
          . By accessing or using our service, you agree to follow all rules in
          this AUP.
        </p>
        <p>
          {SITE_NAME} provides an AI video motion-transfer service: users upload
          a character image and a motion reference video (and an optional
          prompt) to generate new clips that apply the reference motion to their
          character, location, or product.
        </p>
      </LegalSection>

      <LegalSection title="1. User Responsibilities">
        <p>
          You are fully responsible for all images, videos, text prompts, and
          content you submit to our platform.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            You must own or hold proper explicit consent for every character
            image and reference video you upload.
          </li>
          <li>
            If the media shows another real identifiable person, you shall
            obtain that person&apos;s clear, informed, explicit consent before
            uploading.
          </li>
          <li>
            You shall comply with all applicable local, regional, and
            international laws when you use our service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Permitted Uses">
        <p>You may use {SITE_NAME} for lawful personal or commercial purposes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Transfer motion from a reference video onto characters, outfits, or
            products you own or have rights to use
          </li>
          <li>
            Recast scenes with new locations or looks while keeping the original
            motion, with proper consent for any real person&apos;s likeness
          </li>
          <li>
            Create marketing, social, or creative clips that comply with this
            AUP and applicable law
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Content Standards &amp; Prohibited Categories">
        <p>
          The Platform prohibits generating the following{" "}
          <strong>six categories</strong> of content:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Pornography / NSFW content</strong> — sexually explicit,
            pornographic, or otherwise not-safe-for-work material.
          </li>
          <li>
            <strong>Violence / gore</strong> — graphic violence, gore, torture,
            or content that glorifies physical harm.
          </li>
          <li>
            <strong>Hate speech</strong> — content that attacks, demeans, or
            incites hatred or violence against individuals or groups based on
            protected characteristics.
          </li>
          <li>
            <strong>Child-unsafe content (CSAM)</strong> — any sexual content
            involving minors, or content that exploits, endangers, or sexualizes
            children.
          </li>
          <li>
            <strong>Deepfakes / impersonation of real people</strong> —
            synthetic media that makes a real identifiable person appear to say
            or do something they did not, without proper consent, or used to
            deceive others.
          </li>
          <li>
            <strong>Content infringing copyright or trademarks</strong> —
            unauthorized use of copyrighted works, trademarked brands, or other
            intellectual property you do not own or have permission to use.
          </li>
        </ul>
        <p>The clauses below break these categories and other violations down further.</p>

        <div className="space-y-4 pt-2">
          <div>
            <Subheading>
              3.0 Explicit prohibitions — violence, hate speech, and child
              safety
            </Subheading>
            <p className="mt-2">
              The following apply to <strong>all user inputs</strong> (images,
              videos, prompts) and <strong>all generated outputs</strong>. You
              must not generate, upload, request, or share:
            </p>

            <p className="mt-3 font-medium text-fg">Violence / gore</p>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Graphic depictions of violence, gore, torture, or severe injury</li>
              <li>Content glorifying or encouraging physical harm</li>
              <li>
                Violent threats delivered through motion-transfer or generated
                video
              </li>
            </ul>

            <p className="mt-3 font-medium text-fg">Hate speech</p>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>
                Attacks or dehumanization based on race, ethnicity, religion,
                gender, sexual orientation, disability, or other protected traits
              </li>
              <li>
                Incitement to hatred, discrimination, or violence against any
                group or individual
              </li>
              <li>Extremist, supremacist, or genocidal propaganda in generated media</li>
            </ul>

            <p className="mt-3 font-medium text-fg">Child-unsafe content (CSAM)</p>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>
                Any sexual content involving minors, including AI-generated or
                synthetic depictions
              </li>
              <li>Exploitation, grooming, or endangerment of children</li>
              <li>
                Uploading minors&apos; photos or videos without verified parental
                or guardian consent for AI generation
              </li>
            </ul>
            <p className="mt-2">
              CSAM violations are zero tolerance: immediate termination and
              mandatory reporting to authorities. See also our{" "}
              <Link href="/terms" className={linkClass}>
                Terms of Service
              </Link>{" "}
              Content Policy section.
            </p>
          </div>

          <div>
            <Subheading>3.1 Absolutely Prohibited — Zero Tolerance</Subheading>
            <p className="mt-2">
              The following will be actioned immediately and may be reported to
              authorities:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Child sexual abuse material (CSAM) or any sexual content
                involving minors.
              </li>
              <li>
                Content that promotes or facilitates terrorism, extremism, or
                mass violence.
              </li>
              <li>Technical instructions for weapons of mass destruction.</li>
              <li>Content inciting genocide or ethnic hatred.</li>
              <li>
                Non-consensual deepfake sexual content targeting real
                individuals.
              </li>
              <li>
                Content that violates applicable local laws in your jurisdiction
                or ours, including laws governing AI-generated media, privacy,
                and likeness rights.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>3.2 Restricted — Subject to Review</Subheading>
            <p className="mt-2">
              The following may be permitted only with appropriate context,
              age-gating where required, and compliance with local rules.{" "}
              {SITE_NAME} is an image/video generation product — pornography and
              NSFW content remain prohibited under Section 3 above and are not
              permitted even on a restricted basis.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Violent content:</strong> must have a clear creative,
                journalistic, or educational context and must not glorify harm.
              </li>
              <li>
                <strong>Politically sensitive content:</strong> content that may
                be misleading or intended to influence elections or public
                opinion without disclosure.
              </li>
              <li>
                <strong>Medical / legal / financial advice:</strong> must comply
                with local regulations; {SITE_NAME} is not a substitute for
                professional advice.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>3.3 Generally Prohibited Conduct</Subheading>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Generating or spreading misinformation or disproven claims.</li>
              <li>
                Impersonating real individuals, brands, or organizations without
                authorization.
              </li>
              <li>
                Infringing intellectual property, publicity, or privacy rights of
                others.
              </li>
              <li>
                Deceiving users by passing AI-generated content off as
                human-created without disclosure where required.
              </li>
              <li>Bulk-generating spam or deceptive commercial content.</li>
              <li>
                Jailbreak prompts or other techniques designed to bypass Platform
                safety measures.
              </li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="4. Content Moderation" id="content-moderation">
        <p>
          We operate a multi-layer moderation system: automated review, human
          review, and periodic audits. User reports are routed into the same
          severity-based enforcement framework described in Section 4.4 and
          Section 5.5.
        </p>

        <div className="space-y-4 pt-2">
          <div>
            <Subheading>4.1 Automated Review (real-time)</Subheading>
            <p className="mt-2">
              Text prompts and generation requests submitted for
              motion-transfer video generation may be scanned{" "}
              <strong>before</strong> any AI model runs. Requests that fail
              screening are blocked and are not charged credits.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Input filtering:</strong> keyword, semantic, and
                policy-based screening of user-supplied prompts and uploads prior
                to generation where available.
              </li>
              <li>
                <strong>Output controls:</strong> generation proceeds only after
                an &ldquo;allow&rdquo; decision when screening is enabled;
                denied or flagged requests are rejected before video is produced.
                Generated videos that bypass or evade screening are subject to
                post-generation human review and takedown (see Sections 4.2 and
                5.5).
              </li>
              <li>
                <strong>Usage pattern analysis:</strong> monitoring for anomalous
                generation volume or repeated policy-violation attempts.
              </li>
              <li>
                <strong>Safety posture:</strong> when automated screening is
                unavailable, we may block generation (fail closed) or rely on
                post-generation review and user reports.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>4.2 Human Review</Subheading>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Auto-flagged generation attempts and user-reported content enter
                a human review queue.
              </li>
              <li>
                Reports sent to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                  {CONTACT_EMAIL}
                </a>{" "}
                are triaged, investigated, and actioned manually by our trust
                &amp; safety team.
              </li>
              <li>
                Reviewers follow internal content-safety guidelines, complete
                content-safety training, and are bound by confidentiality
                obligations when handling reports and user data.
              </li>
              <li>
                Human reviewers classify findings using the severity levels in
                Section 4.4 and apply the corresponding enforcement actions.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>4.3 Periodic Audits</Subheading>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Random sampling of flagged generation attempts, shared creations,
                and account activity is performed on a monthly basis.
              </li>
              <li>
                Regular evaluation and improvement of screening accuracy and
                policy coverage.
              </li>
              <li>
                Cooperation with payment and platform partners&apos; compliance
                requirements where applicable.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>4.4 Content Severity Levels</Subheading>
            <p className="mt-2">
              All moderation findings — whether from automated screening, user
              reports, or periodic audits — are classified at one of the
              following levels. Response times in the table are targets, not
              guarantees; L1 matters are handled with highest urgency.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-semibold text-fg">Level</th>
                    <th className="py-2 pr-4 font-semibold text-fg">
                      Description
                    </th>
                    <th className="py-2 pr-4 font-semibold text-fg">Review</th>
                    <th className="py-2 pr-4 font-semibold text-fg">
                      Response target
                    </th>
                    <th className="py-2 font-semibold text-fg">Action</th>
                  </tr>
                </thead>
                <tbody className="text-fg-muted">
                  <tr className="border-b border-border align-top">
                    <td className="py-3 pr-4 font-medium text-fg">
                      L1 — Critical
                    </td>
                    <td className="py-3 pr-4">Child safety, terrorism</td>
                    <td className="py-3 pr-4">
                      Auto-block + human confirmation
                    </td>
                    <td className="py-3 pr-4">
                      Immediate; child-safety reports within 24 hours
                    </td>
                    <td className="py-3">
                      Immediate ban + content removal + share link revocation +
                      report to authorities where required
                    </td>
                  </tr>
                  <tr className="border-b border-border align-top">
                    <td className="py-3 pr-4 font-medium text-fg">L2 — High</td>
                    <td className="py-3 pr-4">
                      Severe policy violations (e.g., non-consensual deepfakes,
                      CSAM-adjacent)
                    </td>
                    <td className="py-3 pr-4">
                      Auto-flag + priority human review
                    </td>
                    <td className="py-3 pr-4">Within 48 hours</td>
                    <td className="py-3">
                      Remove content + revoke share links + suspend account
                    </td>
                  </tr>
                  <tr className="border-b border-border align-top">
                    <td className="py-3 pr-4 font-medium text-fg">
                      L3 — Medium
                    </td>
                    <td className="py-3 pr-4">
                      General violations (hate, violence, IP infringement)
                    </td>
                    <td className="py-3 pr-4">Human review</td>
                    <td className="py-3 pr-4">Within 5 business days</td>
                    <td className="py-3">
                      Warning + removal + possible credit forfeiture
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-3 pr-4 font-medium text-fg">L4 — Low</td>
                    <td className="py-3 pr-4">
                      Minor or borderline violations
                    </td>
                    <td className="py-3 pr-4">
                      Report-triggered human review
                    </td>
                    <td className="py-3 pr-4">Within 10 business days</td>
                    <td className="py-3">
                      Warning + request to revise inputs; removal if unresolved
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="5. Reporting" id="reporting">
        <div className="space-y-4">
          <div>
            <Subheading>5.1 When to Report</Subheading>
            <p className="mt-2">Please report content or behavior if you observe:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Content or behavior violating this Policy&apos;s content standards.</li>
              <li>Critical violations involving child safety or terrorism.</li>
              <li>
                AI-generated videos that impersonate you or infringe your
                likeness, copyright, or trademark rights.
              </li>
              <li>
                Violating output shared via a {SITE_NAME} link (include the URL
                if available).
              </li>
              <li>Attempts to bypass moderation or abuse the generation system.</li>
              <li>
                Any other situation you believe violates this AUP or applicable
                law.
              </li>
            </ul>
          </div>

          <div>
            <Subheading>5.2 Reporting Channels</Subheading>
            <p className="mt-2">
              You can flag violating generated content through any of the
              following channels:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Email (primary channel):</strong> send a message to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Content%20Report`}
                  className={linkClass}
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                with the subject line <strong>Content Report</strong>.
              </li>
              <li>
                <strong>Site footer:</strong> on any page at {SITE_URL}, click
                the contact email shown in the footer — it opens the same
                reporting address.
              </li>
              <li>
                <strong>Terms of Service:</strong> our{" "}
                <Link href="/terms#reporting-violations" className={linkClass}>
                  Reporting violations
                </Link>{" "}
                section lists the same channels and principles.
              </li>
            </ul>
            <p className="mt-2">
              For urgent child-safety matters, email us immediately with subject
              line <strong>URGENT — Child Safety Report</strong>. We prioritize
              these reports and may escalate to law enforcement without delay.
            </p>
          </div>

          <div>
            <Subheading>5.3 What to Include in Your Report</Subheading>
            <p className="mt-2">To help us review quickly, please provide:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>A clear description of the violating generated content or behavior.</li>
              <li>
                The share link URL, account email, or other identifier that helps
                us locate the content.
              </li>
              <li>
                Which content standard you believe was violated (e.g., violence,
                hate speech, CSAM).
              </li>
              <li>
                Supporting screenshots or context (do not attach illegal material
                such as CSAM).
              </li>
              <li>
                Your relationship to the content (e.g., depicted person,
                copyright owner, witness).
              </li>
            </ul>
          </div>

          <div>
            <Subheading>5.4 Reporting Principles</Subheading>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Confidentiality:</strong> reporter identity is strictly
                protected to the extent permitted by law. We do not disclose your
                identity to the reported party without your consent or a legal
                requirement.
              </li>
              <li>
                <strong>Impartiality:</strong> all reports receive independent,
                objective review by our trust &amp; safety team, separate from
                commercial or user-relationship considerations.
              </li>
              <li>
                <strong>Anti-abuse:</strong> malicious, harassing, or knowingly
                false reports are recorded and may result in warnings,
                suspension, or other action against the reporter.
              </li>
            </ul>
            <p className="mt-2">
              We aim to acknowledge reports within a reasonable timeframe.
              Critical child-safety reports are handled with highest priority.
              Outcomes may include content removal, share link revocation,
              account suspension, or referral to authorities where required by
              law. See Section 5.5 for our full review and enforcement process.
            </p>
          </div>

          <div id="report-handling">
            <Subheading>5.5 Report Review and Enforcement</Subheading>
            <p className="mt-2">
              When we receive a report through any channel in Section 5.2, our
              trust &amp; safety team follows this process:
            </p>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>
                <strong>Intake and triage:</strong> we log the report, assign a
                severity level (L1–L4 per Section 4.4), and prioritize
                child-safety and terrorism-related reports immediately.
              </li>
              <li>
                <strong>Investigation:</strong> we locate the reported content
                using the share URL, account identifier, or other details you
                provide; review it against this AUP and applicable law; and
                preserve relevant records for enforcement and legal compliance.
              </li>
              <li>
                <strong>Automated cross-check:</strong> where applicable, we
                review associated generation logs, moderation screening results,
                and account history for repeat or coordinated abuse.
              </li>
              <li>
                <strong>Enforcement:</strong> based on severity, we may:
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    Delete or disable access to violating generated videos and
                    source uploads
                  </li>
                  <li>
                    Revoke public share links so violating content is no longer
                    accessible
                  </li>
                  <li>
                    Issue a warning, restrict generation, suspend, or permanently
                    ban the account
                  </li>
                  <li>
                    Forfeit credits associated with severe or repeated violations
                  </li>
                  <li>
                    Refer L1 matters (e.g., CSAM, terrorism) to NCMEC, law
                    enforcement, or other authorities as required by law
                  </li>
                </ul>
              </li>
              <li>
                <strong>Closure:</strong> we document the outcome internally. We
                may notify the reporter of the result when appropriate and
                permitted by law, but we generally do not disclose enforcement
                details to the reported party&apos;s accusers beyond what is
                required for safety or legal process.
              </li>
            </ol>
            <p className="mt-3 font-medium text-fg">
              Enforcement by severity level
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>L1 — Critical:</strong> content is removed and share
                links revoked immediately upon confirmation; the account is
                permanently banned; mandatory authority referral where
                applicable.
              </li>
              <li>
                <strong>L2 — High:</strong> priority review; content removed and
                links revoked; account suspended pending investigation;
                permanent ban for confirmed severe violations.
              </li>
              <li>
                <strong>L3 — Medium:</strong> human review; warning issued;
                content removed if confirmed; repeat violations escalate to
                suspension.
              </li>
              <li>
                <strong>L4 — Low:</strong> report-triggered review; warning and
                request to revise; content removed if the user does not comply
                or the violation is confirmed.
              </li>
            </ul>
            <p className="mt-2">
              Response-time targets for each level are listed in Section 4.4. If
              you believe we made an error, you may reply to our enforcement
              notice or contact{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>{" "}
              with subject line <strong>Moderation Appeal</strong>. We review
              good-faith appeals but do not guarantee reinstatement.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="6. Our Right to Take Action">
        <p>If we detect any violation against this AUP, we reserve the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Reject your AI generation request before or after moderation screening</li>
          <li>Temporarily suspend or permanently terminate your user account</li>
          <li>Remove violating generated content and revoke share links</li>
          <li>Forfeit unused credits associated with severe or repeated violations</li>
          <li>Report illegal content to law enforcement or relevant authorities</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>
          If you have questions about this Acceptable Use Policy, please contact
          us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
          . See also our{" "}
          <Link href="/terms" className={linkClass}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
