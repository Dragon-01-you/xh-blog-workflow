import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.env.SCREENSHOT_OUT_DIR || path.join(process.cwd(), '.scratch', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const launchOptions = { headless: true };
  if (process.env.PLAYWRIGHT_CHANNEL) {
    launchOptions.channel = process.env.PLAYWRIGHT_CHANNEL;
  }
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1100 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log(`Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1200);

  const turntable = page.locator('.braun-turntable-chassis').first();
  if (await turntable.count() === 0) {
    console.log('Turntable not mounted on current page. Skipping capture.');
    await browser.close();
    return;
  }

  await turntable.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 1. Capture Turntable Idle
  await turntable.screenshot({ path: path.join(outDir, 'braun-turntable-idle.png') });
  console.log('Captured braun-turntable-idle.png');

  // 2. Click Lower Needle & Play
  const playBtn = turntable.locator('button:has-text("LOWER NEEDLE & PLAY")').first();
  if (await playBtn.count() > 0) {
    await playBtn.click();
    await page.waitForTimeout(1000);

    // 3. Capture Turntable Playing with rotating disc & tonearm engaged
    await turntable.screenshot({ path: path.join(outDir, 'braun-turntable-playing.png') });
    console.log('Captured braun-turntable-playing.png');
  }

  // 4. Capture Dark mode playing
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await turntable.screenshot({ path: path.join(outDir, 'braun-turntable-dark.png') });
  console.log('Captured braun-turntable-dark.png');

  await browser.close();
  console.log('ALL_TURNTABLE_CAPTURES_SUCCESS');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
