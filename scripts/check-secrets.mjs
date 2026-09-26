import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const skipped = new Set([
  ".env.example",
  "scripts/check-secrets.mjs",
]);

const binaryExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip",
  ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".mov", ".avi",
]);

const tokenPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["Stripe live secret", /sk_live_[A-Za-z0-9]{16,}/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{20,}/],
];

const secretName =
  "(?:SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|STRIPE_SECRET_KEY|OPENAI_API_KEY|RESEND_API_KEY|META_ACCESS_TOKEN|WHATSAPP_ACCESS_TOKEN|PAYHERE_SECRET|JWT_SECRET|SESSION_SECRET|PRIVATE_KEY)";

const assignmentPattern = new RegExp(
  String.raw`(?:^|\n)\s*${secretName}\s*=\s*["']?([^"'\s#]+)`,
  "g",
);

const viteSecretPattern = /VITE_[A-Z0-9_]*(?:SECRET|PRIVATE|SERVICE_ROLE|TOKEN|PASSWORD|ACCESS_KEY)[A-Z0-9_]*/g;

const allowedPlaceholders = new Set([
  "changeme",
  "replace-me",
  "replace_me",
  "placeholder",
  "example",
  "your-secret-here",
]);

const findings = [];

for (const file of files) {
  if (skipped.has(file) || binaryExtensions.has(extname(file).toLowerCase())) continue;

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const [label, pattern] of tokenPatterns) {
    if (pattern.test(content)) findings.push(`${file}: possible ${label}`);
    pattern.lastIndex = 0;
  }

  assignmentPattern.lastIndex = 0;
  for (const match of content.matchAll(assignmentPattern)) {
    const value = match[1]?.trim() ?? "";
    if (value && !allowedPlaceholders.has(value.toLowerCase())) {
      findings.push(`${file}: secret-looking environment variable contains a committed value`);
    }
  }

  if (extname(file).toLowerCase() !== ".md") {
    const viteMatches = content.match(viteSecretPattern) ?? [];
    for (const variable of new Set(viteMatches)) {
      findings.push(
        `${file}: ${variable} uses the VITE_ prefix, which would expose it to the browser`,
      );
    }
  }
}

if (findings.length) {
  console.error("\nSecret-safety check failed:\n");
  for (const finding of findings) console.error(`- ${finding}`);
  console.error(
    "\nRemove the credential from Git history, rotate it immediately, and store it in the deployment/GitHub secret store instead.\n",
  );
  process.exit(1);
}

console.log(`Secret-safety check passed across ${files.length} tracked files.`);
