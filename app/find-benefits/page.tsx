import { CitizenProfileForm } from "@/components/citizen-profile-form";
import { SiteHeader } from "@/components/site-header";

const PAGE_CONTENT = {
  eyebrow: "Find benefits",
  title: "Tell us about yourself",
  description:
    "Answer a few questions so we can help you understand which government benefits may be relevant to you.",
} as const;

export default function FindBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <PageIntroduction />

        <CitizenProfileForm />
      </main>
    </div>
  );
}

function PageIntroduction() {
  return (
    <section className="mb-10 max-w-2xl" aria-labelledby="find-benefits-title">
      <p className="text-base font-bold text-primary">
        {PAGE_CONTENT.eyebrow}
      </p>

      <h1
        id="find-benefits-title"
        className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
      >
        {PAGE_CONTENT.title}
      </h1>

      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        {PAGE_CONTENT.description}
      </p>
    </section>
  );
}