/* eslint-disable jsx-a11y/alt-text */
// Génération PDF d'un document LexAI via @react-pdf/renderer.
// - White-label par plan : Solo (LexAI en tête + footer), Cabinet (LexAI footer),
//   Enterprise (LexAI invisible).
// - Identité cabinet en en-tête : logo + nom + adresse + contacts + SIRET + Barreau.
// - Typographie Times (legal-friendly) sans bundler de fonts.

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { marked, type Tokens } from "marked";
import type { ToolId } from "./prompts";
import type { Plan } from "@/types/database";

const TOOL_LABELS: Record<ToolId, string> = {
  contrat: "Contrat",
  analyse: "Analyse juridique",
  "mise-en-demeure": "Mise en demeure",
  clause: "Clause contractuelle",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#F5F2ED",
    padding: 56,
    paddingBottom: 72, // room for footer
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#0D0D0D",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#0D0D0D",
    paddingBottom: 14,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  logoBox: {
    width: 64,
    height: 64,
    flexShrink: 0,
  },
  logo: {
    objectFit: "contain",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  cabinetName: {
    fontFamily: "Times-Bold",
    fontSize: 16,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  cabinetSubinfo: {
    fontFamily: "Times-Roman",
    fontSize: 8,
    color: "#6B6A66",
    lineHeight: 1.4,
  },
  brandDot: {
    color: "#C1392B",
  },
  metaRight: {
    fontFamily: "Helvetica",
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#6B6A66",
    textAlign: "right",
    maxWidth: 180,
  },
  toolLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#C1392B",
    marginTop: 8,
    marginBottom: 4,
  },
  docDate: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#6B6A66",
    marginBottom: 22,
  },
  h1: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    marginTop: 14,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    marginTop: 16,
    marginBottom: 10,
  },
  h3: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  italic: {
    fontFamily: "Times-Italic",
  },
  listItem: {
    marginBottom: 6,
    flexDirection: "row",
  },
  listBullet: {
    width: 14,
    fontFamily: "Times-Bold",
  },
  listText: {
    flex: 1,
  },
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#6B6A66",
    marginVertical: 18,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 56,
    right: 56,
    borderTopWidth: 0.5,
    borderTopColor: "#6B6A66",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#6B6A66",
  },
  pageNumber: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#6B6A66",
  },
});

type InlineNode =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "italic"; value: string };

function parseInline(tokens: Tokens.Generic[] | undefined): InlineNode[] {
  if (!tokens) return [];
  const result: InlineNode[] = [];
  for (const t of tokens) {
    if (t.type === "strong") {
      result.push({ kind: "bold", value: t.text ?? "" });
    } else if (t.type === "em") {
      result.push({ kind: "italic", value: t.text ?? "" });
    } else if (t.type === "codespan") {
      result.push({ kind: "text", value: t.text ?? "" });
    } else if (t.type === "text") {
      result.push({ kind: "text", value: t.text ?? "" });
    } else if (t.type === "br") {
      result.push({ kind: "text", value: "\n" });
    } else if ("text" in t && typeof t.text === "string") {
      result.push({ kind: "text", value: t.text });
    }
  }
  return result;
}

function InlineText({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.kind === "bold")
          return <Text key={i} style={styles.bold}>{n.value}</Text>;
        if (n.kind === "italic")
          return <Text key={i} style={styles.italic}>{n.value}</Text>;
        return <Text key={i}>{n.value}</Text>;
      })}
    </>
  );
}

function renderBlock(token: Tokens.Generic, key: number): React.ReactNode {
  switch (token.type) {
    case "heading": {
      const depth = token.depth as number;
      const style = depth === 1 ? styles.h1 : depth === 2 ? styles.h2 : styles.h3;
      return (
        <Text key={key} style={style}>
          <InlineText nodes={parseInline(token.tokens as Tokens.Generic[])} />
        </Text>
      );
    }
    case "paragraph":
      return (
        <Text key={key} style={styles.paragraph}>
          <InlineText nodes={parseInline(token.tokens as Tokens.Generic[])} />
        </Text>
      );
    case "list": {
      const items = (token.items ?? []) as Tokens.Generic[];
      return (
        <View key={key} style={{ marginBottom: 10 }}>
          {items.map((item, i) => {
            const bullet = token.ordered
              ? `${(token.start as number) + i}.`
              : "—";
            const inner = (item.tokens ?? []) as Tokens.Generic[];
            const paragraphs = inner.filter(
              (t) => t.type === "text" || t.type === "paragraph"
            );
            const nodes = paragraphs.flatMap((p) =>
              parseInline((p.tokens as Tokens.Generic[]) ?? [])
            );
            return (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{bullet}</Text>
                <Text style={styles.listText}>
                  <InlineText nodes={nodes} />
                </Text>
              </View>
            );
          })}
        </View>
      );
    }
    case "hr":
      return <View key={key} style={styles.hr} />;
    case "space":
      return null;
    case "blockquote":
      return (
        <View
          key={key}
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "#0D0D0D",
            paddingLeft: 12,
            marginBottom: 10,
          }}
        >
          {((token.tokens as Tokens.Generic[]) ?? []).map((t, i) =>
            renderBlock(t, i)
          )}
        </View>
      );
    default:
      if ("text" in token && typeof token.text === "string") {
        return (
          <Text key={key} style={styles.paragraph}>
            {token.text}
          </Text>
        );
      }
      return null;
  }
}

type CabinetBranding = {
  cabinet_name: string | null;
  cabinet_address: string | null;
  cabinet_phone: string | null;
  cabinet_email: string | null;
  cabinet_siret: string | null;
  cabinet_website: string | null;
  cabinet_logo_url: string | null;
  full_name: string | null;
  bar_id: string | null;
};

type GenerationForPdf = {
  tool: ToolId;
  output_md: string;
  created_at: string;
};

export type PdfOptions = {
  generation: GenerationForPdf;
  branding: CabinetBranding;
  plan: Plan | null;
};

function getBrandingLevel(plan: Plan | null) {
  if (plan === "enterprise") return "full"; // aucune mention LexAI
  if (plan === "cabinet") return "subtle"; // footer uniquement
  return "visible"; // header + footer (Solo, essai)
}

function CabinetHeader({ branding }: { branding: CabinetBranding }) {
  // Ordre de fallback pour le nom en tête : cabinet > avocat > LexAI
  const displayName =
    branding.cabinet_name ?? branding.full_name ?? "LexAI";

  // Construit la 2ème ligne (adresse, SIRET, Barreau)
  const subinfoParts: string[] = [];
  if (branding.cabinet_address) {
    subinfoParts.push(branding.cabinet_address.replace(/\n/g, " · "));
  }
  if (branding.cabinet_phone) subinfoParts.push(`Tél. ${branding.cabinet_phone}`);
  if (branding.cabinet_email) subinfoParts.push(branding.cabinet_email);
  if (branding.cabinet_website) subinfoParts.push(branding.cabinet_website);
  if (branding.cabinet_siret) subinfoParts.push(`SIRET ${branding.cabinet_siret}`);
  if (branding.bar_id) subinfoParts.push(`Barreau n° ${branding.bar_id}`);

  return (
    <View style={styles.headerLeft}>
      {branding.cabinet_logo_url && (
        <View style={styles.logoBox}>
          <Image
            src={branding.cabinet_logo_url}
            style={styles.logo}
          />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cabinetName}>
          {displayName}
          {!branding.cabinet_name && !branding.full_name && (
            <Text style={styles.brandDot}>.</Text>
          )}
        </Text>
        {subinfoParts.length > 0 && (
          <Text style={styles.cabinetSubinfo}>
            {subinfoParts.join(" · ")}
          </Text>
        )}
      </View>
    </View>
  );
}

function LexAIDocument({ generation, branding, plan }: PdfOptions) {
  const tokens = marked.lexer(generation.output_md) as Tokens.Generic[];
  const date = new Date(generation.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const brandingLevel = getBrandingLevel(plan);

  // Le "powered by" visible dans le header uniquement pour le niveau "visible" (Solo/essai)
  const showLexaiHeader = brandingLevel === "visible";
  const showLexaiFooter = brandingLevel !== "full";

  const toolLabel = TOOL_LABELS[generation.tool].toUpperCase();
  const footerTextLong = showLexaiFooter
    ? "Document généré avec LexAI — à relire et signer par un avocat qualifié."
    : "Document à relire et signer par un avocat qualifié.";

  const authorName =
    branding.cabinet_name ?? branding.full_name ?? undefined;

  return (
    <Document
      title={`${authorName ?? "LexAI"} — ${TOOL_LABELS[generation.tool]}`}
      author={authorName ?? "LexAI"}
      creator={authorName ?? "LexAI"}
      producer="LexAI"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <CabinetHeader branding={branding} />
          <Text style={styles.metaRight}>
            {showLexaiHeader ? `Propulsé par LexAI · ${date}` : date}
          </Text>
        </View>

        <Text style={styles.toolLabel}>{toolLabel}</Text>
        <Text style={styles.docDate}>Émis le {date}</Text>

        {tokens.map((token, i) => renderBlock(token, i))}

        <View style={styles.footer} fixed>
          <Text style={{ flex: 1 }}>{footerTextLong}</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export async function generateLexAIPdf(options: PdfOptions): Promise<Buffer> {
  return await renderToBuffer(<LexAIDocument {...options} />);
}
