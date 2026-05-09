import DOMPurify from "isomorphic-dompurify";

export type ParsedWikiLink = {
  raw: string;
  target: string;
  label: string;
};

export type WikiLinkTextPart =
  | { type: "text"; text: string }
  | { type: "wikiLink"; raw: string; target: string; label: string };

const allowedRenderedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "strike",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "hr",
  "a",
  "span",
];

const allowedRenderedAttributes = [
  "href",
  "title",
  "target",
  "rel",
  "class",
  "role",
  "aria-label",
];

const skippedAncestorTags = new Set(["A", "CODE", "PRE", "SCRIPT", "STYLE"]);

export function parseWikiLinkToken(token: string): ParsedWikiLink | null {
  if (!token.startsWith("[[") || !token.endsWith("]]")) {
    return null;
  }

  const content = token.slice(2, -2);

  if (!content || content.includes("[[") || content.includes("]]")) {
    return null;
  }

  const aliasSeparatorIndex = content.indexOf("|");
  const rawTarget =
    aliasSeparatorIndex === -1
      ? content
      : content.slice(0, aliasSeparatorIndex);
  const rawLabel =
    aliasSeparatorIndex === -1
      ? content
      : content.slice(aliasSeparatorIndex + 1);
  const target = rawTarget.trim();
  const label = rawLabel.trim();

  if (!target || !label) {
    return null;
  }

  return {
    raw: token,
    target,
    label,
  };
}

export function splitTextWithWikiLinks(input: string): WikiLinkTextPart[] {
  const parts: WikiLinkTextPart[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const openingIndex = input.indexOf("[[", cursor);

    if (openingIndex === -1) {
      appendTextPart(parts, input.slice(cursor));
      break;
    }

    appendTextPart(parts, input.slice(cursor, openingIndex));

    const closingIndex = input.indexOf("]]", openingIndex + 2);

    if (closingIndex === -1) {
      appendTextPart(parts, input.slice(openingIndex));
      break;
    }

    const raw = input.slice(openingIndex, closingIndex + 2);
    const parsed = parseWikiLinkToken(raw);

    if (parsed) {
      parts.push({ type: "wikiLink", ...parsed });
    } else {
      appendTextPart(parts, raw);
    }

    cursor = closingIndex + 2;
  }

  return parts;
}

export function renderWikiLinksInSafeHtml(html: string): string {
  if (!html.trim()) {
    return "";
  }

  const fragment = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedRenderedTags,
    ALLOWED_ATTR: allowedRenderedAttributes,
    ALLOW_DATA_ATTR: false,
    RETURN_DOM_FRAGMENT: true,
  }) as unknown as DocumentFragment;
  const textNodes = collectRenderableTextNodes(fragment);

  for (const textNode of textNodes) {
    replaceTextNodeWithWikiLinks(textNode);
  }

  const ownerDocument = fragment.ownerDocument;
  const container = ownerDocument.createElement("div");
  container.appendChild(fragment.cloneNode(true));

  return DOMPurify.sanitize(container.innerHTML, {
    ALLOWED_TAGS: allowedRenderedTags,
    ALLOWED_ATTR: allowedRenderedAttributes,
    ALLOW_DATA_ATTR: false,
  }).trim();
}

function appendTextPart(parts: WikiLinkTextPart[], text: string) {
  if (!text) {
    return;
  }

  const previousPart = parts.at(-1);

  if (previousPart?.type === "text") {
    previousPart.text += text;
    return;
  }

  parts.push({ type: "text", text });
}

function collectRenderableTextNodes(root: DocumentFragment) {
  const textNodes: Text[] = [];
  const walker = root.ownerDocument.createTreeWalker(root, 4);

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.nodeType === 3 && !hasSkippedAncestor(node)) {
      textNodes.push(node as Text);
    }
  }

  return textNodes;
}

function hasSkippedAncestor(node: Node) {
  let parent = node.parentElement;

  while (parent) {
    if (skippedAncestorTags.has(parent.tagName)) {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

function replaceTextNodeWithWikiLinks(textNode: Text) {
  const parts = splitTextWithWikiLinks(textNode.nodeValue ?? "");

  if (!parts.some((part) => part.type === "wikiLink")) {
    return;
  }

  const ownerDocument = textNode.ownerDocument;
  const fragment = ownerDocument.createDocumentFragment();

  for (const part of parts) {
    if (part.type === "text") {
      fragment.appendChild(ownerDocument.createTextNode(part.text));
      continue;
    }

    const wikiLink = ownerDocument.createElement("span");
    const accessibleLabel = `Wiki link target: ${part.target}`;
    wikiLink.className = "wiki-link";
    wikiLink.setAttribute("role", "text");
    wikiLink.setAttribute("title", accessibleLabel);
    wikiLink.setAttribute("aria-label", accessibleLabel);
    wikiLink.textContent = part.label;
    fragment.appendChild(wikiLink);
  }

  textNode.replaceWith(fragment);
}
