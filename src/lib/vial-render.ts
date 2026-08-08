/**
 * Canvas vial mockup for Label Studio — white powder default,
 * cream / yellow / blue powder, or clear solution.
 */

import type { LabelFields } from "@/lib/label-artwork";
import type { VialAppearance } from "@/lib/vial-forms";

export async function renderVialPhoto(
  fields: LabelFields,
  appearance: VialAppearance,
  labelSvg: string,
  size = 900,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round(size * 1.15);
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  // Soft studio background
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#f4f4f4");
  bg.addColorStop(1, "#e4e4e4");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const vialTop = h * 0.1;
  const vialH = h * 0.78;
  const vialW = w * 0.34;
  const left = cx - vialW / 2;
  const right = cx + vialW / 2;
  const bottom = vialTop + vialH;
  const neckH = vialH * 0.12;
  const shoulderY = vialTop + neckH + vialH * 0.06;
  const bodyTop = shoulderY + vialH * 0.04;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(cx, bottom + 8, vialW * 0.42, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cap
  const capH = neckH * 0.85;
  const capGrad = ctx.createLinearGradient(left, vialTop, right, vialTop);
  capGrad.addColorStop(0, "#8a8a8a");
  capGrad.addColorStop(0.5, "#d0d0d0");
  capGrad.addColorStop(1, "#6e6e6e");
  ctx.fillStyle = capGrad;
  roundRect(ctx, left + vialW * 0.18, vialTop - 2, vialW * 0.64, capH, 4);
  ctx.fill();
  ctx.fillStyle = "#5a5a5a";
  roundRect(ctx, left + vialW * 0.22, vialTop + capH * 0.55, vialW * 0.56, capH * 0.35, 2);
  ctx.fill();

  // Glass body
  const glass = ctx.createLinearGradient(left, bodyTop, right, bottom);
  glass.addColorStop(0, "rgba(255,255,255,0.55)");
  glass.addColorStop(0.35, "rgba(230,235,240,0.35)");
  glass.addColorStop(0.7, "rgba(200,210,220,0.25)");
  glass.addColorStop(1, "rgba(180,190,200,0.4)");

  ctx.beginPath();
  // neck
  ctx.moveTo(left + vialW * 0.28, vialTop + capH);
  ctx.lineTo(left + vialW * 0.28, shoulderY);
  ctx.quadraticCurveTo(left + vialW * 0.12, shoulderY + 20, left + 6, bodyTop + 30);
  ctx.lineTo(left + 4, bottom - 20);
  ctx.quadraticCurveTo(left + 4, bottom, cx, bottom);
  ctx.quadraticCurveTo(right - 4, bottom, right - 4, bottom - 20);
  ctx.lineTo(right - 6, bodyTop + 30);
  ctx.quadraticCurveTo(right - vialW * 0.12, shoulderY + 20, right - vialW * 0.28, shoulderY);
  ctx.lineTo(right - vialW * 0.28, vialTop + capH);
  ctx.closePath();
  ctx.fillStyle = glass;
  ctx.fill();
  ctx.strokeStyle = "rgba(120,130,140,0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Contents
  const fillTop = bottom - vialH * (appearance.kind === "liquid" ? 0.42 : 0.22);
  const fill = ctx.createLinearGradient(cx, fillTop, cx, bottom - 8);
  fill.addColorStop(0, appearance.fill.top);
  fill.addColorStop(0.55, appearance.fill.mid);
  fill.addColorStop(1, appearance.fill.bottom);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left + 10, fillTop);
  ctx.lineTo(left + 8, bottom - 18);
  ctx.quadraticCurveTo(left + 8, bottom - 4, cx, bottom - 4);
  ctx.quadraticCurveTo(right - 8, bottom - 4, right - 8, bottom - 18);
  ctx.lineTo(right - 10, fillTop);
  if (appearance.kind === "powder") {
    // cake surface
    ctx.quadraticCurveTo(cx, fillTop - 10, left + 10, fillTop);
  } else {
    ctx.lineTo(left + 10, fillTop);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (appearance.kind === "liquid") {
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(left + vialW * 0.2, fillTop + 8, vialW * 0.12, bottom - fillTop - 30);
  }
  ctx.restore();

  // Glass highlight
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left + vialW * 0.22, bodyTop + 40);
  ctx.lineTo(left + vialW * 0.2, bottom - 40);
  ctx.stroke();

  // Label wrap on vial
  const labelImg = await svgToImage(labelSvg);
  const lw = vialW * 0.92;
  const lh = lw * (336 / 600);
  const lx = cx - lw / 2;
  const ly = bodyTop + vialH * 0.14;
  // slight curve via scale
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 8;
  ctx.drawImage(labelImg, lx, ly, lw, lh);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.92,
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function svgToImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
