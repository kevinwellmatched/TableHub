export type WikiLinkResolutionCandidate = {
  id: string;
  title: string;
  aliases?: string[];
  href: string;
};

export type ResolvedWikiLink = {
  target: string;
  label: string;
  status: "resolved" | "unresolved" | "ambiguous";
  href?: string;
};

export function normalizeWikiLinkTarget(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveWikiLinkTarget(
  target: string,
  candidates: WikiLinkResolutionCandidate[],
  label = target,
): ResolvedWikiLink {
  const displayTarget = target.trim();
  const displayLabel = label.trim();
  const normalizedTarget = normalizeWikiLinkTarget(target);

  if (!normalizedTarget) {
    return {
      target: displayTarget,
      label: displayLabel,
      status: "unresolved",
    };
  }

  const matchedCandidates = new Map<string, WikiLinkResolutionCandidate>();

  for (const candidate of candidates) {
    if (normalizeWikiLinkTarget(candidate.title) === normalizedTarget) {
      matchedCandidates.set(candidate.id, candidate);
      continue;
    }

    if (
      candidate.aliases?.some(
        (alias) => normalizeWikiLinkTarget(alias) === normalizedTarget,
      )
    ) {
      matchedCandidates.set(candidate.id, candidate);
    }
  }

  if (matchedCandidates.size === 1) {
    const [candidate] = matchedCandidates.values();

    return {
      target: displayTarget,
      label: displayLabel,
      status: "resolved",
      href: candidate.href,
    };
  }

  if (matchedCandidates.size > 1) {
    return {
      target: displayTarget,
      label: displayLabel,
      status: "ambiguous",
    };
  }

  return {
    target: displayTarget,
    label: displayLabel,
    status: "unresolved",
  };
}
