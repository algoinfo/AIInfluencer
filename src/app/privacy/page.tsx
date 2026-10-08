import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your images, videos, and account data.`,
  path: "/privacy",
});

const LAST_UPDATED = "October 8, 2026";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <LegalSection title="Overview">
        <p>
          {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          operates the AI video motion-transfer service at {SITE_URL}. This
          Privacy Policy explains what information we collect, how we use it,
          and the choices you have.
        </p>
        <p>
          By using {SITE_NAME}, you agree to the collection and use of
          information as described here. If you do not agree, please do not use
          the service.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>
          <strong className="font-medium text-fg">Account information.</strong>{" "}
          If you create an account, we collect your email address and a hashed
          version of your password. We do not store plain-text passwords. If you
          sign in with Google, we receive basic profile information needed for
          authentication.
        </p>
        <p>
          <strong className="font-medium text-fg">Content you provide.</strong>{" "}
          When you use the studio, you may upload character images, motion
          reference videos, enter prompts, and generate video outputs. We store
          this content as needed so you can create, download, and manage your
          generations.
        </p>
        <p>
          <strong className="font-medium text-fg">Usage and billing data.</strong>{" "}
          We record session activity, generation counts, credit balances, credit
          transactions, and payment records associated with your account.
        </p>
        <p>
          <strong className="font-medium text-fg">Technical data.</strong> We use
          session cookies to keep you signed in and to enforce free-tier limits.
          We may also collect standard server logs (such as IP address, browser
          type, and request timestamps) for security and reliability.
        </p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, operate, and improve the {SITE_NAME} service</li>
          <li>
            Process your images, videos, and prompts to generate motion-transfer
            outputs
          </li>
          <li>Authenticate your account and manage credits and purchases</li>
          <li>
            Enforce usage limits, prevent abuse, and protect the security of our
            systems
          </li>
          <li>Respond to support requests and communicate service-related updates</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="AI processing and third-party providers">
        <p>
          To generate video, we send relevant inputs (such as your character
          image, reference video, and optional prompt) to third-party AI
          infrastructure providers. These providers process data on our behalf
          solely to deliver the requested output.
        </p>
        <p>Our infrastructure and service providers may include:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-fg">Cloud storage</strong> — for
            uploaded images, videos, and generated outputs
          </li>
          <li>
            <strong className="font-medium text-fg">Turso (libSQL)</strong> —
            account, session, billing, and job metadata
          </li>
          <li>
            <strong className="font-medium text-fg">AI model providers</strong> —
            motion-transfer and related video generation models
          </li>
          <li>
            <strong className="font-medium text-fg">Payment processors</strong>{" "}
            (such as Waffo) — to process one-time credit purchases (we receive
            transaction confirmation, not full card details)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="We do not train on your uploads">
        <p>
          <strong className="font-medium text-fg">
            Your images and videos are never used to train our own AI models.
          </strong>{" "}
          We use your uploads only to generate the output you request. We do not
          sell your uploads to third parties for model training or advertising
          purposes. Third-party AI providers process inputs under their own
          terms solely to fulfill your generation request.
        </p>
      </LegalSection>

      <LegalSection title="Likeness and consent">
        <p>
          When you upload a person&apos;s image or video, you confirm that you
          have the right to use that likeness for AI generation. You are
          responsible for obtaining consent before using someone else&apos;s
          face or identity.
        </p>
        <p>
          Do not use {SITE_NAME} to impersonate others without authorization,
          including public figures, colleagues, or deceased persons without
          proper consent from authorized representatives.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          We retain account data and your creations for as long as your account
          is active or as needed to provide the service. You may delete
          individual files or creations from your account where those features
          are available.
        </p>
        <p>
          We may retain limited records (such as billing and security logs) for
          a longer period when required for legal, accounting, or
          fraud-prevention purposes.
        </p>
        <p>
          Anonymous or aggregated usage data that cannot reasonably identify you
          may be kept indefinitely for analytics and service improvement.
        </p>
      </LegalSection>

      <LegalSection title="Data security">
        <p>
          We use industry-standard measures to protect your data, including
          encrypted connections (HTTPS), hashed passwords, and access controls
          on cloud storage. No method of transmission or storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Your choices and rights">
        <p>Depending on where you live, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate account information</li>
          <li>Request deletion of your account and associated content</li>
          <li>Export your creations where download features are available</li>
          <li>Opt out of non-essential communications</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent transition-colors hover:text-fg"
          >
            {CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection title="Children&apos;s privacy">
        <p>
          {SITE_NAME} is not directed at children under 13, and we do not
          knowingly collect personal information from children under 13. If you
          believe a child has provided us with personal information, please
          contact us and we will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection title="International users">
        <p>
          {SITE_NAME} is operated from the United States. If you access the
          service from outside the U.S., your information may be transferred to
          and processed in the U.S. or other countries where our service
          providers operate. By using {SITE_NAME}, you consent to this transfer.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;Last updated&rdquo; date at the top of this
          page. Material changes may also be communicated via the website or
          email. Continued use after changes take effect constitutes acceptance
          of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          Questions about this Privacy Policy? Email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent transition-colors hover:text-fg"
          >
            {CONTACT_EMAIL}
          </a>
          . See also our{" "}
          <Link
            href="/terms"
            className="text-accent transition-colors hover:text-fg"
          >
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
