import { Resend } from "resend";

const DEFAULT_FROM = "DevStash <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
    to,
    subject: "Verify your DevStash email",
    html: `
      <p>Welcome to DevStash!</p>
      <p>Click the link below to verify your email address. The link expires in 24 hours.</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If you did not create an account, you can ignore this email.</p>
    `,
  });

  return !error;
}
