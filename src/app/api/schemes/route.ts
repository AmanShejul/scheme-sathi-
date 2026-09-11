import { getAllSchemes, schemeValidation } from "@/backend/data/schemeRepository";

export function GET(): Response {
  if (!schemeValidation.valid) {
    return Response.json(
      { error: { code: "scheme_catalog_unavailable", message: "The scheme catalog is temporarily unavailable." } },
      { status: 500 },
    );
  }

  return Response.json(getAllSchemes(), { status: 200 });
}
