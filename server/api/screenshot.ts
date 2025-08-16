// server/api/screenshot.get.ts
import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page, BrowserContext } from "puppeteer-core";
import { defineEventHandler, getQuery, createError, getRequestURL } from "h3";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.1/chromium-v138.0.1-pack.x64.tar";

const cache = 60 * 60 * 1; // 1 hour

let browser: Browser | null = null;
let launchingPromise: Promise<Browser> | null = null;

async function launchBrowser(): Promise<Browser> {
  return puppeteerCore.launch({
    args: chromium.args,
    executablePath: process.env.DEV
      ? "/usr/bin/chromium"
      : await chromium.executablePath(remoteExecutablePath),
    headless: true,
  });
}

async function getBrowser(): Promise<Browser> {
  const crashed = browser && browser.process()?.exitCode !== null;
  const disconnected = browser && !browser.isConnected();

  if (!browser || crashed || disconnected) {
    if (!launchingPromise) {
      launchingPromise = launchBrowser()
        .then((b) => (browser = b))
        .finally(() => { launchingPromise = null; });
    }
    return launchingPromise!;
  }
  return browser;
}

async function withPage<T>(fn: (p: Page) => Promise<T>): Promise<T> {
  const b = await getBrowser();
  const ctx: BrowserContext = await b.createIncognitoBrowserContext();
  const page = await ctx.newPage();
  try {
    // ⬇️ 5-second timeouts
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(5000);
    return await fn(page);
  } finally {
    try { await page.close(); } catch {}
    try { await ctx.close(); } catch {}
  }
}

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 377;

export default defineEventHandler(async (event) => {
  const { path, width: wQ, height: hQ } = getQuery(event);
  if (!path) throw createError({ statusCode: 400, statusMessage: "path parameter is required" });

  const width = wQ ? parseInt(wQ as string, 10) : DEFAULT_WIDTH;
  const height = hQ ? parseInt(hQ as string, 10) : DEFAULT_HEIGHT;

  let buffer: Buffer;
  try {
    buffer = await withPage(async (page) => {
      await page.setViewport({ width, height, deviceScaleFactor: 2 });

      const origin = getRequestURL(event).origin;
      const url = new URL(String(path), origin).toString();

      // ⬇️ 5-second navigation timeout
      await page.goto(url, { waitUntil: "networkidle2", timeout: 5000 });

      await page.evaluate(() => {
        // @ts-ignore
        document.documentElement.style.scrollbarGutter = "auto";
        // @ts-ignore
        document.querySelectorAll(".screenshot-hidden").forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      });

      return (await page.screenshot({ type: "webp" })) as Buffer;
    });
  } catch (error) {
    console.error("Screenshot handler error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to generate screenshot" });
  }

  const headers: Record<string, string> = { "Content-Type": "image/webp" };
  if (!process.env.DEV) headers["Cache-Control"] = `public, max-age=${cache}`;
  // @ts-ignore
  return new Response(buffer, { headers });
});
