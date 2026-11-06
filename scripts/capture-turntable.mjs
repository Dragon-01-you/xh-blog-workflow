import { chromium } from '@playwright/test';
import path from 'path';

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/be3451dc-1e2a-4ca9-af26-2ff90e1829b8';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1100 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1200);

  const turntable = page.locator('.braun-turntable-chassis').first();
  await turntable.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 1. Capture Turntable Idle
  await turntable.screenshot({ path: path.join(brainDir, 'braun-turntable-idle.png') });
  console.log('Captured braun-turntable-idle.png');

  // 2. Click Lower Needle & Play
  const playBtn = turntable.locator('button:has-text("LOWER NEEDLE & PLAY")').first();
  await playBtn.click();
  await page.waitForTimeout(1000);

  // 3. Capture Turntable Playing with rotating disc & tonearm engaged
  await turntable.screenshot({ path: path.join(brainDir, 'braun-turntable-playing.png') });
  console.log('Captured braun-turntable-playing.png');

  // 4. Capture Dark mode playing
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await turntable.screenshot({ path: path.join(brainDir, 'braun-turntable-dark.png') });
  console.log('Captured braun-turntable-dark.png');

  await browser.close();
  console.log('ALL_TURNTABLE_CAPTURES_SUCCESS');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
