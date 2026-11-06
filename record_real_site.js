const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const videoDir = path.resolve(__dirname, 'raw_recordings');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const launchOptions = { headless: true };
  if (process.env.CHROME_PATH) {
    launchOptions.executablePath = process.env.CHROME_PATH;
  } else if (process.platform === 'win32' && fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
    launchOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  }
  const browser = await chromium.launch(launchOptions);

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to http://127.0.0.1:3000 ...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Showcase Hero & Introduction
  console.log('1. Hero view...');
  await page.waitForTimeout(1800);

  // 2. Smoothly scroll down to articles
  console.log('2. Scrolling to articles...');
  await page.evaluate(async () => {
    const scrollStep = (targetY, duration) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };
    await scrollStep(600, 1500);
  });
  await page.waitForTimeout(1200);

  // 3. Scroll down to Bookshelf & Vinyl shelf
  console.log('3. Scrolling to Bookshelf & Vinyl...');
  await page.evaluate(async () => {
    const scrollStep = (targetY, duration) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };
    await scrollStep(1300, 1500);
  });
  await page.waitForTimeout(1000);

  // 4. Click a book in the 3D Bookshelf (e.g. book 1: 原则)
  console.log('4. Interacting with 3D bookshelf...');
  const books = await page.locator('.book3').all();
  if (books.length > 1) {
    await books[1].click();
    await page.waitForTimeout(1600);
  }
  if (books.length > 4) {
    await books[4].click();
    await page.waitForTimeout(1600);
  }

  // 5. Scroll smoothly back to top
  console.log('5. Scrolling smoothly back to top...');
  await page.evaluate(async () => {
    const scrollStep = (targetY, duration) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };
    await scrollStep(0, 1500);
  });
  await page.waitForTimeout(1200);

  // Close context to flush video
  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const newest = files.map(f => ({ name: f, time: fs.statSync(path.join(videoDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time)[0];
    console.log('Video recorded successfully:', path.join(videoDir, newest.name));
  }
})();
