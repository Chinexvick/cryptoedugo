/* ==========================================================================
   Neko Academy — Downloadable certificate image generator.
   Renders a brand-styled certificate to a <canvas> and hands back a PNG Blob.
   All values (name, course, code, date) are passed in by the caller — this
   file has no data access of its own, it only draws.
   ========================================================================== */

let fontsLoaded = false;
async function ensureFonts() {
  if (fontsLoaded) return;
  if (!document.getElementById('cert-font-link')) {
    const link = document.createElement('link');
    link.id = 'cert-font-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Space+Grotesk:wght@600;700&family=Inter:wght@400;600;700&display=swap';
    document.head.appendChild(link);
  }
  try {
    await Promise.all([
      document.fonts.load('700 90px "Playfair Display"'),
      document.fonts.load('italic 600 90px "Playfair Display"'),
      document.fonts.load('700 34px "Space Grotesk"'),
      document.fonts.load('600 26px "Space Grotesk"'),
      document.fonts.load('700 22px "Inter"'),
      document.fonts.load('600 20px "Inter"'),
      document.fonts.load('400 20px "Inter"'),
    ]);
  } catch (e) { /* fonts best-effort — canvas falls back to system fonts */ }
  fontsLoaded = true;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draws the certificate and resolves with a PNG Blob.
 * @param {{studentName:string, courseTitle:string, certCode:string, issuedDate:Date, scorePercent?:number}} opts
 */
export async function renderCertificate(opts) {
  await ensureFonts();

  const W = 2400, H = 1600; // 3:2 landscape, high-res for crisp printing/downloads
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const PRIMARY = '#865df7';
  const CYAN = '#22d3ee';
  const GLOW = '#a78bfa';
  const MINT = '#34e0a1';
  const BLACK = '#0e0e10';

  // ---- Background: brand dark gradient + soft corner glows ----
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#1a1030');
  bgGrad.addColorStop(0.6, BLACK);
  bgGrad.addColorStop(1, '#120a22');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  function glow(x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
    g.addColorStop(1, color + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  glow(0, 0, 900, PRIMARY, 0.35);
  glow(W, H, 950, CYAN, 0.28);
  glow(W * 0.5, H * 0.15, 700, GLOW, 0.12);

  // ---- Ornamental double border ----
  ctx.strokeStyle = 'rgba(167,139,250,0.55)';
  ctx.lineWidth = 3;
  roundRectPath(ctx, 48, 48, W - 96, H - 96, 24);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, 68, 68, W - 136, H - 136, 18);
  ctx.stroke();

  // Corner accent ticks (brand-colored, four corners)
  function cornerTick(cx, cy, sx, sy) {
    ctx.strokeStyle = PRIMARY;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 70 * sy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + 70 * sx, cy);
    ctx.stroke();
  }
  cornerTick(96, 96, 1, 1);
  cornerTick(W - 96, 96, -1, 1);
  cornerTick(96, H - 96, 1, -1);
  cornerTick(W - 96, H - 96, -1, -1);

  // ---- Header: logo + wordmark ----
  try {
    const logo = await loadImage('assets/img/logo-icon.png');
    const logoSize = 84;
    ctx.drawImage(logo, W / 2 - logoSize / 2, 118, logoSize, logoSize);
  } catch (e) { /* logo optional if it fails to load */ }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 40px "Space Grotesk", sans-serif';
  ctx.fillText('NEKO ACADEMY', W / 2, 250);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 20px "Inter", sans-serif';
  ctx.save();
  ctx.letterSpacing = '4px';
  ctx.fillText('CRYPTO & BLOCKCHAIN EDUCATION', W / 2, 286);
  ctx.restore();

  // ---- Title ----
  const titleGrad = ctx.createLinearGradient(W / 2 - 500, 0, W / 2 + 500, 0);
  titleGrad.addColorStop(0, '#c9b6ff');
  titleGrad.addColorStop(0.5, PRIMARY);
  titleGrad.addColorStop(1, CYAN);
  ctx.fillStyle = titleGrad;
  ctx.font = '700 66px "Space Grotesk", sans-serif';
  ctx.save();
  ctx.letterSpacing = '6px';
  ctx.fillText('CERTIFICATE OF COMPLETION', W / 2, 420);
  ctx.restore();

  // ---- Body copy ----
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '400 26px "Inter", sans-serif';
  ctx.fillText('This certifies that', W / 2, 500);

  // Student name — large, elegant
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 700 96px "Playfair Display", serif';
  ctx.fillText(opts.studentName, W / 2, 610);

  // underline flourish beneath the name
  const nameWidth = Math.min(ctx.measureText(opts.studentName).width + 80, W - 400);
  ctx.strokeStyle = GLOW;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameWidth / 2, 648);
  ctx.lineTo(W / 2 + nameWidth / 2, 648);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '400 26px "Inter", sans-serif';
  ctx.fillText('has successfully completed the course', W / 2, 720);

  ctx.fillStyle = CYAN;
  ctx.font = '700 42px "Space Grotesk", sans-serif';
  wrapCenteredText(ctx, opts.courseTitle, W / 2, 780, W - 500, 52);

  if (opts.scorePercent != null) {
    ctx.fillStyle = MINT;
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillText(`Final assessment score: ${opts.scorePercent}%  •  Pass mark: 70%`, W / 2, 860);
  }

  // ---- Seal ----
  const sealX = W / 2, sealY = 990, sealR = 78;
  const sealGrad = ctx.createLinearGradient(sealX - sealR, sealY - sealR, sealX + sealR, sealY + sealR);
  sealGrad.addColorStop(0, PRIMARY);
  sealGrad.addColorStop(1, CYAN);
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 10, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '700 30px "Inter", sans-serif';
  ctx.fillText('✓', sealX, sealY + 12);
  ctx.font = '700 12px "Inter", sans-serif';
  ctx.fillText('OFFICIAL', sealX, sealY + 44);

  // ---- Footer: issuer + verification, split left/right ----
  const footerY = H - 190;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px "Space Grotesk", sans-serif';
  ctx.fillText('Neko Academy', 160, footerY);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillText('Issued by Neko Academy, a CAC-registered company (Nigeria).', 160, footerY + 30);
  ctx.fillText(`Issued on ${opts.issuedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`, 160, footerY + 58);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px "Space Grotesk", sans-serif';
  ctx.fillText('Verify this certificate', W - 160, footerY);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillText('learn.nekomeowtoken.com/verify-certificate.html', W - 160, footerY + 30);
  ctx.fillStyle = GLOW;
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.fillText(opts.certCode, W - 160, footerY + 62);

  // ---- Legal notice ----
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 16px "Inter", sans-serif';
  ctx.fillText('This certificate is unique to Neko Academy and can be verified using the code above.', W / 2, H - 96);
  ctx.fillStyle = 'rgba(239,68,68,0.75)';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText('Any forgery or unauthorized alteration of this certificate will result in legal action.', W / 2, H - 68);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1));
}

function wrapCenteredText(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
