"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { type CitizenProfile, initialCitizenProfile, type DocumentStatus } from "@/types/citizen-profile";

const steps = ["About You", "Eligibility", "Documents", "Review"];

const documentFields: Array<{ key: keyof CitizenProfile["documents"]; label: string }> = [
  { key: "aadhaar", label: "Aadhaar" },
  { key: "incomeCertificate", label: "Income Certificate" },
  { key: "casteCertificate", label: "Caste Certificate" },
  { key: "domicileCertificate", label: "Domicile Certificate" },
  { key: "bonafideCertificate", label: "Bonafide Certificate" },
  { key: "bankAccount", label: "Bank Account" },
];

const fieldClassName =
  "mt-2 h-11 w-full rounded-sm border border-border bg-background px-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold text-foreground">
      {children}
    </label>
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={(event) => onChange(event.target.value)}
            className="size-4 accent-[var(--primary)]"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export function CitizenProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CitizenProfile>(initialCitizenProfile);
  const [errors, setErrors] = useState<string[]>([]);

  function updateProfile<K extends keyof CitizenProfile>(field: K, value: CitizenProfile[K]) {
    setProfile((current) => ({ ...current, [field]: value }));
    setErrors([]);
  }

  function updateDocument(field: keyof CitizenProfile["documents"], value: DocumentStatus) {
    setProfile((current) => ({
      ...current,
      documents: { ...current.documents, [field]: value },
    }));
    setErrors([]);
  }

  function toggleBenefit(benefit: string) {
    const benefits = profile.existingBenefits.includes(benefit)
      ? profile.existingBenefits.filter((item) => item !== benefit)
      : [...profile.existingBenefits, benefit];
    updateProfile("existingBenefits", benefits);
  }

  function validateCurrentStep() {
    const missing: string[] = [];

    if (step === 0) {
      if (!profile.age) missing.push("Age");
      if (!profile.gender) missing.push("Gender");
      if (!profile.state) missing.push("State");
      if (!profile.district) missing.push("District");
    }

    if (step === 1) {
      if (!profile.annualIncome) missing.push("Annual Family Income");
      if (!profile.occupation) missing.push("Occupation");
      if (!profile.category) missing.push("Category");
      if (!profile.studentStatus) missing.push("Student Status");
      if (!profile.disabilityStatus) missing.push("Disability Status");
      if (!profile.familySize) missing.push("Family Size");
    }

    if (step === 2) {
      documentFields.forEach(({ key, label }) => {
        if (!profile.documents[key]) missing.push(label);
      });
    }

    setErrors(missing);
    return missing.length === 0;
  }

  function nextStep() {
    if (validateCurrentStep()) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function renderStep() {
    if (step === 0) {
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="age">Age</FieldLabel>
            <input id="age" type="number" min="0" max="120" value={profile.age} onChange={(event) => updateProfile("age", event.target.value)} className={fieldClassName} placeholder="Enter your age" />
          </div>
          <div>
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <select id="gender" value={profile.gender} onChange={(event) => updateProfile("gender", event.target.value)} className={fieldClassName}>
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="state">State</FieldLabel>
            <select id="state" value={profile.state} onChange={(event) => updateProfile("state", event.target.value)} className={fieldClassName}>
              <option value="">Select state</option>
              <option>Andhra Pradesh</option>
              <option>Delhi</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Rajasthan</option>
              <option>Uttar Pradesh</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="district">District</FieldLabel>
            <input id="district" value={profile.district} onChange={(event) => updateProfile("district", event.target.value)} className={fieldClassName} placeholder="Enter your district" />
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="annualIncome">Annual Family Income</FieldLabel>
            <select id="annualIncome" value={profile.annualIncome} onChange={(event) => updateProfile("annualIncome", event.target.value)} className={fieldClassName}>
              <option value="">Select income range</option>
              <option>Below Rs. 1 lakh</option>
              <option>Rs. 1 lakh - Rs. 3 lakh</option>
              <option>Rs. 3 lakh - Rs. 5 lakh</option>
              <option>Above Rs. 5 lakh</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
            <select id="occupation" value={profile.occupation} onChange={(event) => updateProfile("occupation", event.target.value)} className={fieldClassName}>
              <option value="">Select occupation</option>
              <option>Student</option>
              <option>Farmer</option>
              <option>Self-employed</option>
              <option>Employed</option>
              <option>Unemployed</option>
              <option>Homemaker</option>
            </select>
          </div>
          <fieldset>
            <legend className="text-sm font-bold text-foreground">Category</legend>
            <RadioGroup name="category" value={profile.category} options={["General", "OBC", "SC", "ST"]} onChange={(value) => updateProfile("category", value)} />
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold text-foreground">Student Status</legend>
            <RadioGroup name="studentStatus" value={profile.studentStatus} options={["Yes", "No"]} onChange={(value) => updateProfile("studentStatus", value)} />
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold text-foreground">Disability Status</legend>
            <RadioGroup name="disabilityStatus" value={profile.disabilityStatus} options={["Yes", "No"]} onChange={(value) => updateProfile("disabilityStatus", value)} />
          </fieldset>
          <div>
            <FieldLabel htmlFor="familySize">Family Size</FieldLabel>
            <input id="familySize" type="number" min="1" value={profile.familySize} onChange={(event) => updateProfile("familySize", event.target.value)} className={fieldClassName} placeholder="Number of family members" />
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-bold text-foreground">Existing Benefits <span className="font-normal text-muted-foreground">(optional)</span></legend>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {["Scholarship", "Food support", "Housing support", "None"].map((benefit) => (
                <label key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={profile.existingBenefits.includes(benefit)} onChange={() => toggleBenefit(benefit)} className="size-4 accent-[var(--primary)]" />
                  {benefit}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="divide-y divide-border border-y border-border">
          {documentFields.map(({ key, label }) => (
            <fieldset key={key} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <legend className="text-sm font-bold text-foreground">{label}</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {["available", "not-available", "not-sure"].map((status) => (
                  <label key={status} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="radio" name={key} value={status} checked={profile.documents[key] === status} onChange={() => updateDocument(key, status as DocumentStatus)} className="size-4 accent-[var(--primary)]" />
                    {status === "available" ? "Available" : status === "not-available" ? "Not available" : "Not sure"}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-8 sm:grid-cols-2">
        <SummarySection title="About You" items={[
          ["Age", profile.age],
          ["Gender", profile.gender],
          ["State", profile.state],
          ["District", profile.district],
        ]} />
        <SummarySection title="Eligibility" items={[
          ["Annual Family Income", profile.annualIncome],
          ["Occupation", profile.occupation],
          ["Category", profile.category],
          ["Student Status", profile.studentStatus],
          ["Disability Status", profile.disabilityStatus],
          ["Family Size", profile.familySize],
          ["Existing Benefits", profile.existingBenefits.join(", ") || "None"],
        ]} />
        <SummarySection title="Documents" items={documentFields.map(({ key, label }) => [label, formatStatus(profile.documents[key])])} />
      </div>
    );
  }

  return (
    <div className="border border-border bg-background">
      <div className="grid border-b border-border sm:grid-cols-4">
        {steps.map((label, index) => (
          <div key={label} className={`border-b border-border px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${index === step ? "bg-[#fffaf6]" : "bg-background"}`}>
            <p className={`text-xs font-bold ${index === step ? "text-primary" : "text-muted-foreground"}`}>0{index + 1}</p>
            <p className={`mt-1 text-sm font-bold ${index === step ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
          </div>
        ))}
      </div>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="mb-8">
          <p className="text-sm font-bold text-primary">Step {step + 1} of 4</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">{steps[step]}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your information below. Fields marked as part of the form are required before continuing.</p>
        </div>

        {errors.length > 0 && (
          <div role="alert" className="mb-6 border border-primary/40 bg-[#fffaf6] px-4 py-3 text-sm text-foreground">
            Please complete: {errors.join(", ")}.
          </div>
        )}

        {renderStep()}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? <Button type="button" variant="outline" onClick={() => { setErrors([]); setStep((current) => current - 1); }}>Back</Button> : <span />}
          {step < steps.length - 1 ? <Button type="button" onClick={nextStep}>Next</Button> : <Button type="button" onClick={() => { if (validateCurrentStep()) router.push("/analysis"); }}>Analyze My Benefits</Button>}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, items }: { title: string; items: string[][] }) {
  return (
    <section>
      <h3 className="border-b border-border pb-3 text-lg font-bold text-foreground">{title}</h3>
      <dl className="divide-y divide-border">
        {items.map(([label, value]) => (
          <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-bold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatStatus(status: DocumentStatus) {
  if (status === "available") return "Available";
  if (status === "not-available") return "Not available";
  if (status === "not-sure") return "Not sure";
  return "Not provided";
}