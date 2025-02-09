// icons.js
// This file handles both preloading icons and drawing them.

const iconPaths = {
    undo: 'images/icons/undo.png',
    pencil: 'images/icons/pencil.png',
    erase: 'images/icons/eraser.png',
    hint: 'images/icons/games-hint.png',
    save: 'images/icons/save.png',
    resume: 'images/icons/resume.png'
  };
  
  export const Icons = {}; // Stores the loaded Image objects keyed by icon name.
  
  /**
   * Loads all icons asynchronously. Returns a Promise that resolves when they're loaded.
   */
  export function preloadIcons() {
    const keys = Object.keys(iconPaths);
    const promises = keys.map((key) => {
      return new Promise((resolve, reject) => {

        const img = wx.createImage(); 
        img.src = iconPaths[key];
        img.onload = () => {
          Icons[key] = img;
          resolve();
        };
        img.onerror = (err) => {
          console.error(`Failed to load icon: ${key}`, err);
          reject(err);
        };
      });
    });
  
    return Promise.all(promises);
  }
  
  /**
   * Draws a preloaded icon on the canvas, centered at (centerX, centerY).
   * @param {CanvasRenderingContext2D} ctx 
   * @param {string} iconKey - One of the keys in Icons (e.g. "redo", "erase")
   * @param {number} centerX - The center x position where we want to draw the icon.
   * @param {number} centerY - The center y position where we want to draw the icon.
   * @param {number} width - Desired width of the icon.
   * @param {number} height - Desired height of the icon.
   */
  export function drawIcon(ctx, iconKey, centerX, centerY, width, height) {
    const image = Icons[iconKey];
    if (!image) return;  // If the icon isn't preloaded or doesn't exist
  
    // Draw the icon so that (centerX, centerY) is the icon's center.
    ctx.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
  }
  