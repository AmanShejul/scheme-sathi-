import { CitizenProfileForm } from "@/components/profile/citizen-profile-form";
import { SiteHeader } from "@/components/layout/site-header";

export default function FindBenefitsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-base font-bold text-primary">Find benefits</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Tell us about yourself</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Answer a few questions so we can help you understand which government benefits may be relevant to you.</p>
        </div>
        <CitizenProfileForm />
      </main>
    </div>
  );
}