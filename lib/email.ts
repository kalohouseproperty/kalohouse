import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // In development, log the email instead of sending
  if (process.env.NODE_ENV === "development") {
    console.log("\n====== DEV EMAIL ======");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML:\n${html}`);
    console.log("=======================\n");
    return;
  }

  if (!resend) {
    throw new Error("Missing RESEND_API_KEY");
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Kalohouse <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${getAppUrl()}/auth/verify?token=${encodeURIComponent(token)}`;

  // In development, log the verification token
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔐 VERIFICATION TOKEN (DEV ONLY):");
    console.log(`Email: ${email}`);
    console.log(`Token: ${token}`);
    console.log(`Verification URL: ${url}\n`);
  }

  await sendEmail({
    to: email,
    subject: "Verify your Kalohouse account",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h1>Verify your email</h1>
        <p>Use the button below to verify your Kalohouse account.</p>
        <p><a href="${url}" style="display:inline-block;background:#c9a646;color:#111827;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Verify email</a></p>
        <p>If the button does not work, open this link:</p>
        <p><a href="${url}">${url}</a></p>
      </div>
    `,
  });
}

export async function sendAgentInviteEmail(email: string, name: string, token: string, adminName: string) {
  const url = `${getAppUrl()}/auth/agent/register?token=${encodeURIComponent(token)}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n📧 AGENT INVITE (DEV ONLY):");
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Token: ${token}`);
    console.log(`Invite URL: ${url}\n`);
  }

  await sendEmail({
    to: email,
    subject: `${adminName} invited you to join Kalohouse as an Agent`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#C9A646;margin:0;font-size:24px">Kalohouse</h1>
        </div>
        <div style="padding:32px;background:#ffffff;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;margin-top:0">You're Invited!</h2>
          <p>Hello ${name},</p>
          <p><strong>${adminName}</strong> has invited you to join <strong>Kalohouse</strong> as a field agent in Kigali, Rwanda.</p>
          <p>Click the button below to set your password and activate your account:</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${url}" style="display:inline-block;background:#C9A646;color:#111827;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Accept Invitation</a>
          </p>
          <p>This link expires in 7 days.</p>
          <p>If the button does not work, open this link:</p>
          <p><a href="${url}" style="color:#C9A646">${url}</a></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#6b7280">Kalohouse — Kigali, Rwanda</p>
        </div>
      </div>
    `,
  });
}

export async function sendRefundRequestEmail({
  userEmail,
  userName,
  propertyTitle,
  propertyId,
  amount,
  reason,
}: {
  userEmail: string;
  userName: string;
  propertyTitle: string;
  propertyId: number;
  amount: number;
  reason: string;
}) {
  const appUrl = getAppUrl();
  const adminEmail = process.env.RESEND_FROM_EMAIL || "support@kalohouse.rw";

  await sendEmail({
    to: adminEmail,
    subject: `Refund Request — ${propertyTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#C9A646;margin:0;font-size:24px">Kalohouse</h1>
        </div>
        <div style="padding:32px;background:#ffffff;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;margin-top:0">New Refund Request</h2>
          <p>A client has requested a refund for a property purchase.</p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:4px 0"><strong>Client:</strong> ${userName} (${userEmail})</p>
            <p style="margin:4px 0"><strong>Property:</strong> ${propertyTitle}</p>
            <p style="margin:4px 0"><strong>Property ID:</strong> #${propertyId}</p>
            <p style="margin:4px 0"><strong>Amount:</strong> RWF ${amount.toLocaleString()}</p>
            <p style="margin:4px 0"><strong>Reason:</strong> ${reason}</p>
          </div>
          <p style="text-align:center;margin:32px 0">
            <a href="${appUrl}/dashboard/admin" style="display:inline-block;background:#C9A646;color:#111827;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Review Refund</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#6b7280">Kalohouse — Kigali, Rwanda</p>
        </div>
      </div>
    `,
  });
}

export async function sendRefundConfirmationEmail({
  userEmail,
  userName,
  propertyTitle,
  status,
}: {
  userEmail: string;
  userName: string;
  propertyTitle: string;
  status: "approved" | "rejected";
}) {
  const appUrl = getAppUrl();

  await sendEmail({
    to: userEmail,
    subject: `Refund ${status === "approved" ? "Approved" : "Update"} — ${propertyTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#C9A646;margin:0;font-size:24px">Kalohouse</h1>
        </div>
        <div style="padding:32px;background:#ffffff;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;margin-top:0">Refund ${status === "approved" ? "Approved" : "Update"}</h2>
          <p>Hello ${userName},</p>
          <p>Your refund request for <strong>${propertyTitle}</strong> has been <strong style="color:${status === "approved" ? "#22c55e" : "#ef4444"}">${status}</strong>.</p>
          ${status === "approved"
            ? "<p>The refund will be processed to your original payment method within 5-10 business days.</p>"
            : "<p>If you believe this decision was made in error, please contact our support team.</p>"
          }
          <p style="text-align:center;margin:32px 0">
            <a href="${appUrl}/dashboard/client" style="display:inline-block;background:#C9A646;color:#111827;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">View Dashboard</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#6b7280">Kalohouse — Kigali, Rwanda</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${getAppUrl()}/auth/reset?token=${encodeURIComponent(token)}`;

  // In development, log the reset token
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔑 PASSWORD RESET TOKEN (DEV ONLY):");
    console.log(`Email: ${email}`);
    console.log(`Token: ${token}`);
    console.log(`Reset URL: ${url}\n`);
  }

  await sendEmail({
    to: email,
    subject: "Reset your Kalohouse password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h1>Reset your password</h1>
        <p>Use the button below to choose a new password. This link expires soon.</p>
        <p><a href="${url}" style="display:inline-block;background:#c9a646;color:#111827;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Reset password</a></p>
        <p>If the button does not work, open this link:</p>
        <p><a href="${url}">${url}</a></p>
      </div>
    `,
  });
}

export async function sendContactFormEmail({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const adminEmail = process.env.RESEND_FROM_EMAIL || "dushimimanaelie@kalohouse.com";

  await sendEmail({
    to: adminEmail,
    subject: `Contact Form — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#C9A646;margin:0;font-size:24px">Kalohouse</h1>
        </div>
        <div style="padding:32px;background:#ffffff;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;margin-top:0">New Contact Form Submission</h2>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:4px 0"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin:4px 0"><strong>Email:</strong> ${email}</p>
          </div>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0"><strong>Message:</strong></p>
            <p style="margin:8px 0 0">${message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#6b7280">Kalohouse — Kigali, Rwanda</p>
        </div>
      </div>
    `,
  });
}
