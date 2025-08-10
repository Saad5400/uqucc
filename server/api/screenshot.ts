import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page } from "puppeteer-core";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.1/chromium-v138.0.1-pack.x64.tar";
const cache = 60 * 60 * 24; // 1 day

let browser: Browser | null = null;
let page: Page | null = null;

// aspect ratio constants (1.91:1)
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 377;

async function generateScreenshotBuffer(event: any) {
  const { path, width: wQ, height: hQ } = getQuery(event);
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "path parameter is required",
    });
  }

  const width = wQ ? parseInt(wQ as string, 10) : DEFAULT_WIDTH;
  const height = hQ ? parseInt(hQ as string, 10) : DEFAULT_HEIGHT;

  if (!browser) {
    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: process.env.DEV
        ? "/usr/bin/chromium"
        : await chromium.executablePath(remoteExecutablePath),
      headless: true,
    });
  }
  if (!page) {
    page = await browser.newPage();
  }

  // Determine protocol and host
  const host = event.req.headers.host || `localhost:${process.env.PORT || 3000}`;
  // Use HTTP for localhost or when in dev mode, HTTPS for production domains
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = process.env.DEV || isLocalhost ? 'http' : 'https';
  const url = `${protocol}://${host}${path}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (error) {
    console.error('Failed to navigate to URL:', url, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to navigate to ${path}`,
    });
  }
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    // @ts-ignore
    document.documentElement.style.scrollbarGutter = "auto";
    // @ts-ignore
    document.getElementsByTagName("header")[0].style.display = "none";
  });

  return await page.screenshot({
    type: "webp",
  });
}

async function screenshotHandler(event: any) {
  const buffer = await generateScreenshotBuffer(event);
  const base64Data = Buffer.from(buffer).toString('base64');

  // only send Cache-Control in prod
  const headers: Record<string, string> = { "Content-Type": "image/webp" };
  if (!process.env.DEV) {
    headers["Cache-Control"] = `public, max-age=${cache}`;
  }

  const responseBuffer = Buffer.from(base64Data, 'base64');
  return new Response(responseBuffer, { headers });
}

// export either a cached or plain handler
export default defineCachedEventHandler(screenshotHandler, {
  maxAge: process.env.DEV ? 0 : cache, // No caching in dev, full cache in prod
});

