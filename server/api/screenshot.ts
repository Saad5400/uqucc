import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page } from "puppeteer-core";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v138.0.1/chromium-v138.0.1-pack.x64.tar";
const cache = 60 * 60 * 1; // 1 hour

let browser: Browser | null = null;
let pageCount = 0;
let lastUsed = Date.now();
const MAX_PAGES_BEFORE_RESTART = 10; // Much more aggressive restart
const MAX_IDLE_TIME = 30000; // 30 seconds idle time before restart
const TIMEOUT = 5000; // 5 second timeout

// Periodic cleanup every 60 seconds
setInterval(async () => {
  const now = Date.now();
  if (browser && now - lastUsed > MAX_IDLE_TIME) {
    console.log("Cleaning up idle browser instance");
    await killBrowserProcess();
    pageCount = 0;
    forceGC();
  }
}, 60000);

// Handle process termination
process.on("SIGINT", async () => {
  console.log("Received SIGINT, cleaning up...");
  await killBrowserProcess();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, cleaning up...");
  await killBrowserProcess();
  process.exit(0);
});

// aspect ratio constants (1.91:1)
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 377;

// Force garbage collection if available
function forceGC() {
  if (global.gc) {
    try {
      global.gc();
    } catch (e) {
      console.log("GC not available");
    }
  }
}

// Monitor memory usage
function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    rss: Math.round((used.rss / 1024 / 1024) * 100) / 100,
    heapTotal: Math.round((used.heapTotal / 1024 / 1024) * 100) / 100,
    heapUsed: Math.round((used.heapUsed / 1024 / 1024) * 100) / 100,
    external: Math.round((used.external / 1024 / 1024) * 100) / 100,
  };
}

async function killBrowserProcess() {
  if (browser) {
    try {
      const browserProcess = browser.process();
      if (browserProcess) {
        browserProcess.kill("SIGKILL");
      }
      await browser.close();
    } catch (error) {
      console.error("Error force-killing browser:", error);
    }
    browser = null;
  }
}

async function getBrowserInstance() {
  const now = Date.now();
  const memUsage = getMemoryUsage();

  // Force restart if idle too long, too many pages, or high memory usage
  const shouldRestart =
    !browser ||
    pageCount >= MAX_PAGES_BEFORE_RESTART ||
    now - lastUsed > MAX_IDLE_TIME ||
    memUsage.heapUsed > 200; // Restart if heap > 200MB

  if (shouldRestart) {
    console.log(
      `Restarting browser. Pages: ${pageCount}, Idle: ${now - lastUsed}ms, Memory: ${JSON.stringify(memUsage)}`
    );

    await killBrowserProcess();
    forceGC();

    browser = await puppeteerCore.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-default-apps",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-component-update",
        "--disable-domain-reliability",
        "--disable-sync",
        "--disable-client-side-phishing-detection",
        "--disable-permissions-api",
        "--disable-notifications",
        "--disable-desktop-notifications",
        "--disable-background-networking",
        "--memory-pressure-off",
        "--max_old_space_size=128", // Limit V8 heap
        "--aggressive-cache-discard",
        ...chromium.args,
      ],
      executablePath: process.env.DEV
        ? "/usr/bin/chromium"
        : await chromium.executablePath(remoteExecutablePath),
      headless: true,
      timeout: TIMEOUT,
    });
    pageCount = 0;
  }

  lastUsed = now;
  return browser;
}

async function screenshotHandler(event: any) {
  const startTime = Date.now();
  let page: Page | null = null;
  let browserInstance: Browser | null = null;

  try {
    const { path, width: wQ, height: hQ } = getQuery(event);
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: "path parameter is required",
      });
    }

    const width = wQ ? parseInt(wQ as string, 10) : DEFAULT_WIDTH;
    const height = hQ ? parseInt(hQ as string, 10) : DEFAULT_HEIGHT;

    browserInstance = await getBrowserInstance();
    if (!browserInstance) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to get browser instance",
      });
    }

    page = await browserInstance.newPage();
    pageCount++;

    // Set aggressive timeouts
    await page.setDefaultTimeout(TIMEOUT);
    await page.setDefaultNavigationTimeout(TIMEOUT);

    // Set viewport early
    await page.setViewport({ width, height, deviceScaleFactor: 1 }); // Reduced scale factor

    // Determine protocol and host
    const host =
      event.req.headers.host || `localhost:${process.env.PORT || 3000}`;
    const isLocalhost =
      host.includes("localhost") || host.includes("127.0.0.1");
    const protocol = process.env.DEV || isLocalhost ? "http" : "https";
    const url = `https://uqucc.sb.sa${path}`;

    console.log(`[${Date.now() - startTime}ms] Attempting screenshot: ${url}`);

    // Try to navigate, but don't fail if it times out
    try {
      await page.goto(url, {
        waitUntil: "networkidle2", // Wait for network to be mostly idle (images loaded)
        timeout: TIMEOUT,
      });
      console.log(`[${Date.now() - startTime}ms] Page fully loaded`);
    } catch (error: any) {
      console.log(
        `[${Date.now() - startTime}ms] Navigation timeout, but continuing with screenshot:`,
        error?.message || error
      );
      // Don't throw error, just continue with partial screenshot
    }

    console.log(
      `[${Date.now() - startTime}ms] Taking screenshot (ready or not)`
    );

    // Quick DOM manipulation
    await page.evaluate(() => {
      // @ts-ignore
      const header = document.querySelector("header");
      // @ts-ignore
      if (header) header.style.display = "none";
      // @ts-ignore
      document.documentElement.style.scrollbarGutter = "auto";
    });

    const buffer = await page.screenshot({
      type: "webp",
      quality: 80, // Reduced quality for faster processing
    });

    console.log(
      `[${Date.now() - startTime}ms] Screenshot completed, size: ${buffer.length} bytes`
    );

    const headers: Record<string, string> = { "Content-Type": "image/webp" };
    if (!process.env.DEV) {
      headers["Cache-Control"] = `public, max-age=${cache}`;
    }

    // @ts-ignore
    return new Response(buffer, { headers });
  } catch (error: any) {
    const memUsage = getMemoryUsage();
    console.error(
      `[${Date.now() - startTime}ms] Screenshot error:`,
      error?.message || error,
      "Memory:",
      memUsage
    );

    // Force browser restart on error
    await killBrowserProcess();
    pageCount = 0;
    forceGC();

    throw error;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error("Error closing page:", error);
      }
    }
    forceGC();
  }
}

// export either a cached or plain handler
export default defineEventHandler(screenshotHandler);
