import { chromium } from '@playwright/test';
import path from 'path';

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/be3451dc-1e2a-4ca9-af26-2ff90e1829b8';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Capturing Homepage Light...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(brainDir, 'preview-home-light.png'), fullPage: false });

  console.log('Capturing Homepage Dark...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(brainDir, 'preview-home-dark.png'), fullPage: false });

  console.log('Capturing Blog list...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(brainDir, 'preview-blog.png'), fullPage: false });

  console.log('Capturing Blog Detail...');
  await page.goto('http://localhost:3000/blog/reflecting-after-two-months', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(brainDir, 'preview-blog-detail.png'), fullPage: false });

  console.log('Capturing Projects...');
  await page.goto('http://localhost:3000/projects', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(brainDir, 'preview-projects.png'), fullPage: false });

  console.log('Capturing Photos...');
  await page.goto('http://localhost:3000/photos', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(brainDir, 'preview-photos.png'), fullPage: false });

  console.log('Capturing Admin Overview...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(brainDir, 'preview-admin.png'), fullPage: false });

  await browser.close();
  console.log('ALL_PREVIEWS_DONE');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
