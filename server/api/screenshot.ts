import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page } from "puppeteer-core";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.1/chromium-v138.0.1-pack.x64.tar";
const cache = 60 * 60 * 1; // 1 hour

let browser: Browser | null = null;

// aspect ratio constants (1.91:1)
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 377;

async function screenshotHandler(event: any) {
  const { path, width: wQ, height: hQ } = getQuery(event);
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "path parameter is required",
    });
  }

  const width = wQ ? parseInt(wQ as string, 10) : DEFAULT_WIDTH;
  const height = hQ ? parseInt(hQ as string, 10) : DEFAULT_HEIGHT;

  let currentPage: Page | null = null;

  try {
    if (!browser) {
      browser = await puppeteerCore.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
        ],
        executablePath: process.env.DEV
          ? "/usr/bin/chromium"
          : await chromium.executablePath(remoteExecutablePath),
        headless: true,
      });
    }

    // Create a new page for each request to avoid conflicts
    currentPage = await browser.newPage();

    // Determine protocol and host
    const host =
      event.req.headers.host || `localhost:${process.env.PORT || 3000}`;
    // Use HTTP for localhost or when in dev mode, HTTPS for production domains
    const isLocalhost =
      host.includes("localhost") || host.includes("127.0.0.1");
    const protocol = process.env.DEV || isLocalhost ? "http" : "https";
    const url = `${protocol}://${host}${path}`;
    // const url = `https://uqucc.sb.sa${path}`;

    try {
      await currentPage.goto(url, {
        waitUntil: "networkidle0",
        timeout: 5000,
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to navigate to ${path}`,
      });
    }
    await currentPage.setViewport({ width, height, deviceScaleFactor: 2 });

    await currentPage.evaluate(() => {
      // @ts-ignore
      document.documentElement.style.scrollbarGutter = "auto";
      // @ts-ignore
      document.getElementsByClassName("screenshot-hidden").forEach((el) => {
        el.style.display = "none";
      });
    });

    const buffer = await currentPage.screenshot({
      type: "webp",
    });

    // only send Cache-Control in prod
    const headers: Record<string, string> = { "Content-Type": "image/webp" };
    if (!process.env.DEV) {
      headers["Cache-Control"] = `public, max-age=${cache}`;
    }

    // @ts-ignore
    return new Response(buffer, { headers });
  } catch (error) {
    console.error("Screenshot handler error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate screenshot",
    });
  } finally {
    // Clean up the current page
    if (currentPage) {
      try {
        await currentPage.close();
      } catch (closeError) {
        console.error("Failed to close page:", closeError);
      }
    }
  }
}

// export either a cached or plain handler
export default defineEventHandler(screenshotHandler);
