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
    viewport: { width: 1280, height: 1200 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log(`Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);

  const turntable = page.locator('.braun-turntable-chassis').first();
  if (await turntable.count() > 0) {
    await turntable.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const section = page.locator('section:has(.braun-turntable-chassis)').first();
    const targetPath = path.join(outDir, 'braun-vinyl-shelf-full-view.png');
    await section.screenshot({ path: targetPath });
    console.log(`Captured ${targetPath}`);
  } else {
    console.log('Turntable chassis not present on page, skipping section capture.');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
