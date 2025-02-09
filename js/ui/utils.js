// utils.js: Helper functions for drawing

import { UI_CONFIG } from './config.js';
import { Icons, drawIcon } from '../../images/icons/icons.js'

export function drawCenteredText(ctx, text, centerX, centerY, fontSize, color) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${UI_CONFIG.fonts.base}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
}

/** draws a rounded rectangle. */
export function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
}

/** Draws a modern–styled button with a PNG icon and a label. */
export function drawModernButton(ctx, x, y, width, height, label, iconKey, options = {}) {
    const radius = 8;
    const grad = createVerticalGradient(
    ctx,
    x,
    y,
    width,
    height,
    lightenColor(options.bgColor, 20),
    options.bgColor
    );

    // Draw the button background with a drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    drawRoundedRect(ctx, x, y, width, height, radius, grad, null);
    ctx.restore();

    // Draw the PNG icon near the top center
    const iconX = x + width / 2;
    const iconY = y + height / 2 - 8;
    drawIcon(ctx, iconKey, iconX, iconY, 20, 20); 
    // 20x20 is a suggested icon size; tweak as desired.

    // Draw the label near the bottom center
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + width / 2, y + height - 4);
}

/** Creates a vertical gradient. */
export function createVerticalGradient(ctx, x, y, width, height, colorTop, colorBottom) {
  const grad = ctx.createLinearGradient(x, y, x, y + height);
  grad.addColorStop(0, colorTop);
  grad.addColorStop(1, colorBottom);
  return grad;
}

/** Lighten a hex color. */
export function lightenColor(color, percent) {
    let num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    R = R < 255 ? (R < 0 ? 0 : R) : 255;
    G = G < 255 ? (G < 0 ? 0 : G) : 255;
    B = B < 255 ? (B < 0 ? 0 : B) : 255;
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}