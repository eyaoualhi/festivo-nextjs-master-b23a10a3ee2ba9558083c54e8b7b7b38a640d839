"use client";

type InlineScriptProps = {
  html: string;
};

/** Script exécuté pendant l'analyse du HTML ; ignoré (`text/plain`) quand React rend côté client. */
export default function InlineScript({ html }: InlineScriptProps) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
