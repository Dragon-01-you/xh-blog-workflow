import { chromium } from '@playwright/test';
import path from 'path';

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/be3451dc-1e2a-4ca9-af26-2ff90e1829b8';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1200 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);

  const turntable = page.locator('.braun-turntable-chassis').first();
  await turntable.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Capture parent section
  const section = page.locator('section:has(.braun-turntable-chassis)').first();
  await section.screenshot({ path: path.join(brainDir, 'braun-vinyl-shelf-full-view.png') });
  console.log('Captured braun-vinyl-shelf-full-view.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
