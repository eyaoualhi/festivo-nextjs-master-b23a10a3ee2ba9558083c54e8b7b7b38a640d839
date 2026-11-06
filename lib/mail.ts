import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

let transporter: Transporter | undefined;

/** Transport SMTP (D-31), créé une seule fois ; `null` quand `SMTP_HOST` n'est pas défini. */
function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  transporter ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(user ? { auth: { user, pass: process.env.SMTP_PASS } } : {}),
  });
  return transporter;
}

/** Sans `SMTP_HOST`, le message est écrit dans le terminal du serveur au lieu d'être envoyé. */
export async function sendMail(message: MailMessage): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.warn(
      `[mail] SMTP_HOST non défini : e-mail affiché ici au lieu d'être envoyé.\n` +
        `À : ${message.to}\nObjet : ${message.subject}\n\n${message.text}`,
    );
    return;
  }
  await transport.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    ...message,
  });
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
