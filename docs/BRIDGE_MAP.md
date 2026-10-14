
# Ownership and gates
Control Plane: admission, authorization, source manifests, status and approvals. Strategic Minds AI: company-wide workflows. X1 Launch Engine: customer-facing approved visual template gallery. X1 Templates: back-office asset/skill library. Swarm Runtime: existing Railway workers. X1 Sandbox: existing local/cloud isolation. X1 System Management: independent QA.
PHASE 1: Discover current queue lease and healthy worker identity.
PHASE 2: Bind authenticated, tenant-scoped pack-to-existing-queue adapter. Do not use a general-purpose static token as enterprise multi-tenant auth.
PHASE 3: Execute exactly one idempotent synthetic sandbox build.
PHASE 4: Reachable Vercel noindex preview and independent validation.
PHASE 5: Readback to GPT via authenticated status and receipt route.
Protected actions remain approval gated. Rollback: revert development branch; no production touched.