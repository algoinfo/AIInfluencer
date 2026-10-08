import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `Terms and conditions for using ${SITE_NAME} at genjutsu.online.`,
  path: "/terms",
  keywords: ["Terms of Service", "Genjutsu"],
});

const LAST_UPDATED = "October 8, 2026";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <LegalSection title="Agreement to terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of {SITE_NAME} at {SITE_URL} (the &ldquo;Service&rdquo;), operated
          by {SITE_NAME}. By accessing or using the Service, you agree to be
          bound by these Terms. If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Description of the service">
        <p>
          {SITE_NAME} is an AI video motion-transfer service. You upload a
          character image and a motion reference video (and an optional prompt)
          to generate a new video that applies the reference motion to your
          character or scene. The Service offers a free exploration tier and
          paid credit packs for additional generations.
        </p>
        <p>
          Generated videos use AI-assisted motion transfer. Output quality,
          identity preservation, and realism may vary. We do not guarantee that
          results will be indistinguishable from real footage.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 13 years old to use the Service. If you are under
          18, you may use the Service only with the involvement and consent of a
          parent or legal guardian. By using the Service, you represent that you
          meet these requirements.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          Some features require an account. You are responsible for maintaining
          the confidentiality of your login credentials and for all activity
          under your account. Notify us promptly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent transition-colors hover:text-fg"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
        <p>
          You agree to provide accurate account information and to keep it up to
          date.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You retain ownership of images, videos, text prompts, and other
          materials you upload (&ldquo;User Content&rdquo;). By uploading User
          Content, you grant {SITE_NAME} a limited, non-exclusive license to
          store, process, and transmit that content solely to operate the
          Service and deliver your requested outputs.
        </p>
        <p>
          You represent and warrant that you own or have all necessary rights,
          licenses, and permissions for your User Content, including the right
          to use any person&apos;s likeness featured in your uploads.
        </p>
      </LegalSection>

      <LegalSection title="Likeness, deepfakes, and consent">
        <p>
          Motion transfer can place a person&apos;s likeness into new motion.
          You may only upload or generate content involving a real person&apos;s
          face or identity if you have the right and, where required, their
          informed consent.
        </p>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Use someone&apos;s likeness without authorization for fraud,
            harassment, or deception
          </li>
          <li>
            Create non-consensual intimate deepfakes or sexualized content of
            any real person
          </li>
          <li>
            Impersonate any person for scams, political manipulation, or
            unlawful content
          </li>
          <li>
            Depict deceased individuals in a misleading or exploitative way
            without authorization from their estate or family
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Content policy — prohibited generation and uploads">
        <p>
          {SITE_NAME} is an AI image and video generation service. You must not
          use the Service to generate, upload, request, store, or share content
          in the categories below. These rules apply to all inputs (images,
          videos, prompts) and all outputs. Our full{" "}
          <Link
            href="/acceptable-use"
            className="text-accent transition-colors hover:text-fg"
          >
            Acceptable Use Policy
          </Link>{" "}
          lists all six prohibited content categories and our moderation
          procedures.
        </p>

        <p className="font-medium text-fg">Violence / gore — strictly prohibited</p>
        <p>You must not generate or upload content that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Depicts graphic violence, gore, torture, mutilation, or severe
            physical injury in a realistic or sensationalized manner
          </li>
          <li>
            Glorifies, celebrates, or encourages physical harm against any
            person or group
          </li>
          <li>
            Provides instructions or encouragement for committing violent acts,
            assault, or self-harm
          </li>
        </ul>

        <p className="font-medium text-fg">Hate speech — strictly prohibited</p>
        <p>You must not generate or upload content that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Attacks, demeans, dehumanizes, or incites hatred or violence against
            individuals or groups based on race, ethnicity, national origin,
            religion, gender, gender identity, sexual orientation, disability,
            age, or other protected characteristics
          </li>
          <li>Promotes supremacist, extremist, or genocidal ideologies</li>
          <li>
            Uses slurs, stereotypes, or degrading language intended to harass or
            intimidate a protected group
          </li>
        </ul>

        <p className="font-medium text-fg">
          Child-unsafe content (CSAM) — zero tolerance
        </p>
        <p>You must not generate or upload content that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Depicts, describes, sexualizes, or exploits any minor (any person
            under 18), in any form — including AI-generated, synthetic, or
            &ldquo;fictional&rdquo; depictions
          </li>
          <li>
            Constitutes child sexual abuse material (CSAM) or any sexual content
            involving minors
          </li>
          <li>
            Uploads photos or videos of minors without verified parental or
            guardian consent for the specific use of AI generation
          </li>
        </ul>
        <p>
          Violations involving child safety are actioned immediately, may result
          in permanent account termination without refund, and will be reported
          to the National Center for Missing &amp; Exploited Children (NCMEC),
          law enforcement, or other authorities as required by applicable law.
        </p>
        <p>
          If you encounter violating generated content — on {SITE_NAME}, on a
          shared link, or elsewhere attributable to our Service — please report
          it using the channels in the{" "}
          <Link
            href="/acceptable-use#reporting"
            className="text-accent transition-colors hover:text-fg"
          >
            Reporting
          </Link>{" "}
          section of our Acceptable Use Policy or below under &ldquo;Reporting
          violations.&rdquo;
        </p>
      </LegalSection>

      <LegalSection title="Reporting violations" id="reporting-violations">
        <p>
          Anyone may report content or behavior that violates our content
          standards or these Terms. Reports are reviewed by our trust &amp;
          safety team.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Email (preferred):</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Content%20Report`}
              className="text-accent transition-colors hover:text-fg"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            — use subject line <strong>Content Report</strong>
          </li>
          <li>
            <strong>Site footer:</strong> use the contact email shown in the
            footer of any {SITE_NAME} page
          </li>
        </ul>
        <p>
          Full reporting procedures are in our{" "}
          <Link
            href="/acceptable-use#reporting"
            className="text-accent transition-colors hover:text-fg"
          >
            Acceptable Use Policy — Reporting
          </Link>
          . We may remove generated content, warn or suspend accounts, and refer
          critical violations to authorities. See{" "}
          <Link
            href="/acceptable-use#content-moderation"
            className="text-accent transition-colors hover:text-fg"
          >
            Content Moderation
          </Link>{" "}
          and{" "}
          <Link
            href="/acceptable-use#report-handling"
            className="text-accent transition-colors hover:text-fg"
          >
            Report Review and Enforcement
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          In addition to the content policy above, you agree not to use the
          Service to:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Violate any applicable law or regulation</li>
          <li>Infringe intellectual property, privacy, or publicity rights</li>
          <li>
            Generate or upload pornography, NSFW content, non-consensual
            deepfakes, or content infringing copyright or trademarks (see our{" "}
            <Link
              href="/acceptable-use"
              className="text-accent transition-colors hover:text-fg"
            >
              Acceptable Use Policy
            </Link>
            )
          </li>
          <li>Harass, threaten, or defame others</li>
          <li>
            Circumvent usage limits, credit systems, moderation, or security
            measures
          </li>
          <li>Reverse engineer, scrape, or overload the Service</li>
          <li>
            Resell or redistribute the Service without our written permission
          </li>
        </ul>
        <p>
          We may suspend or terminate access if we reasonably believe you have
          violated these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Credits and payments">
        <p>
          Paid features are sold as one-time credit packs. Credits are deducted
          when you use billable features (such as motion-transfer generations).
          Credit costs are displayed before generation where applicable.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Credits do not expire while your account remains active</li>
          <li>All purchases are final unless required by applicable law</li>
          <li>
            Prices and credit amounts may change; existing balances are honored
            at time of use
          </li>
          <li>
            Payment processing is handled by third-party providers (such as
            Waffo) subject to their own terms
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Free tier">
        <p>
          Guests and free accounts may explore the studio with limited demo
          generations or welcome credits. Free-tier limits, watermarks (if any),
          and quality caps may apply. Accessing additional generations requires
          a paid credit balance or eligible purchase.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The {SITE_NAME} name, logo, website design, and underlying software
          are owned by us or our licensors. These Terms do not grant you any
          rights to our branding or technology except the limited right to use
          the Service as intended.
        </p>
        <p>
          Subject to these Terms and applicable law, you may use outputs you
          generate for personal or commercial purposes, provided your inputs and
          use comply with these Terms and do not infringe third-party rights.
        </p>
        <p>
          {SITE_NAME} (genjutsu.online) is an independent site and is not
          affiliated with, endorsed by, or sponsored by Higgsfield or any
          third-party model provider unless explicitly stated.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free,
          or that outputs will meet your expectations. AI-generated content may
          contain inaccuracies or artifacts. You are solely responsible for
          reviewing outputs before sharing them.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_NAME.toUpperCase()} AND
          ITS OPERATORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
          DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE IS LIMITED
          TO THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS
          BEFORE THE CLAIM, OR (B) USD $50.
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You agree to indemnify and hold harmless {SITE_NAME} and its operators
          from any claims, damages, losses, or expenses (including reasonable
          legal fees) arising from your User Content, your use of the Service,
          or your violation of these Terms or any third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your access at our discretion, with or without notice, for
          conduct that we believe violates these Terms or harms the Service or
          other users.
        </p>
        <p>
          Upon termination, your right to use the Service ends. Provisions that
          by their nature should survive (including ownership, disclaimers,
          limitation of liability, and indemnification) will survive
          termination.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the State of Delaware, United
          States, without regard to conflict-of-law principles. Any dispute
          arising from these Terms or the Service shall be resolved in the state
          or federal courts located in Delaware, and you consent to their
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may modify these Terms at any time. We will post the updated Terms
          on this page and update the &ldquo;Last updated&rdquo; date. Material
          changes may be communicated through the Service or by email. Continued
          use after changes become effective constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent transition-colors hover:text-fg"
          >
            {CONTACT_EMAIL}
          </a>
          . See also our{" "}
          <Link
            href="/privacy"
            className="text-accent transition-colors hover:text-fg"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
