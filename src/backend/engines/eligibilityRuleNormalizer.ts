const ruleAliases: Record<string, string> = {
  state: "state",
  states: "state",
  occupation: "occupation",
  occupations: "occupation",
  category: "social_category",
  categories: "social_category",
  social_category: "social_category",
  or_social_category: "social_category",
  min_age: "min_age",
  minAge: "min_age",
  max_age: "max_age",
  maxAge: "max_age",
  annual_income_max: "annual_income_max",
  maxIncome: "annual_income_max",
  income_limit: "annual_income_max",
};

/** Maps known dataset aliases to the single key understood by deterministic engines. */
export function normalizeEligibilityRule(rule: string): string {
  const trimmedRule = rule.trim();
  return ruleAliases[trimmedRule] ?? trimmedRule;
}
