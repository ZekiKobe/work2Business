const nodemailer = require("nodemailer");

const createTransporter = () => {
  // Support both production SMTP and dev fallback (ethereal/console)
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Dev fallback: log to console
  return null;
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
        <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:32px 40px;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Work2Business</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Your path from employment to ownership</p>
        </div>
        <div style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#f1f5f9;font-size:20px;font-weight:600;">Reset Your Password</h2>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
            You requested a password reset for your Work2Business account. Click the button below to set a new password. This link expires in <strong style="color:#e2e8f0;">1 hour</strong>.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
            Reset Password →
          </a>
          <p style="margin:32px 0 0;color:#64748b;font-size:13px;line-height:1.6;">
            If you didn't request this, you can safely ignore this email. Your password won't change.<br><br>
            Or copy this URL into your browser:<br>
            <span style="color:#3b82f6;word-break:break-all;">${resetUrl}</span>
          </p>
        </div>
        <div style="padding:20px 40px;background:#0f172a;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">&copy; ${new Date().getFullYear()} Work2Business. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    // Dev mode -log to console
    console.log("\n========== PASSWORD RESET EMAIL ==========");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("==========================================\n");
    return { success: true, preview: resetUrl };
  }

  const info = await transporter.sendMail({
    from: `"Work2Business" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Work2Business password",
    html
  });

  return { success: true, messageId: info.messageId };
};

exports.sendPlanGeneratedEmail = async (user, planTitle, ideaName) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const plansUrl = `${frontendUrl}/plans`;

  const html = `
    <!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Work2Business</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Your entrepreneurship platform</p>
      </div>
      <div style="padding:36px 40px;">
        <h2 style="margin:0 0 12px;color:#f1f5f9;font-size:18px;">Your business plan is ready! 🚀</h2>
        <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.7;">
          Hi ${user.firstName}, your AI-powered business plan for <strong style="color:#e2e8f0;">${ideaName}</strong> has been generated.
        </p>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:600;">${planTitle}</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:12px;">8-section personalized plan</p>
        </div>
        <a href="${plansUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;">
          View Your Plan →
        </a>
      </div>
      <div style="padding:16px 40px;background:#0f172a;border-top:1px solid #1e293b;">
        <p style="margin:0;color:#475569;font-size:11px;">&copy; ${new Date().getFullYear()} Work2Business · <a href="${frontendUrl}/settings" style="color:#475569;">Manage notifications</a></p>
      </div>
    </div>
    </body></html>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`\n[EMAIL] Plan generated for ${user.email}: ${planTitle}`);
    return;
  }
  await transporter.sendMail({
    from: `"Work2Business" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Your business plan for "${ideaName}" is ready`,
    html
  });
};

exports.sendMilestoneEmail = async (user, milestoneTitle) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = `
    <!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
      <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:32px 40px;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Work2Business</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Milestone achieved!</p>
      </div>
      <div style="padding:36px 40px;">
        <h2 style="margin:0 0 12px;color:#f1f5f9;font-size:18px;">You completed a milestone! ✓</h2>
        <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.7;">
          Hi ${user.firstName}, you just checked off a milestone on your journey to entrepreneurship:
        </p>
        <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #f59e0b;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:600;">${milestoneTitle}</p>
        </div>
        <a href="${frontendUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;">
          View Dashboard →
        </a>
      </div>
      <div style="padding:16px 40px;background:#0f172a;border-top:1px solid #1e293b;">
        <p style="margin:0;color:#475569;font-size:11px;">&copy; ${new Date().getFullYear()} Work2Business · <a href="${frontendUrl}/settings" style="color:#475569;">Manage notifications</a></p>
      </div>
    </div>
    </body></html>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`\n[EMAIL] Milestone completed for ${user.email}: ${milestoneTitle}`);
    return;
  }
  await transporter.sendMail({
    from: `"Work2Business" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Milestone completed: ${milestoneTitle}`,
    html
  });
};
