import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page } from "puppeteer-core";

const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v138.0.1/chromium-v138.0.1-pack.x64.tar";
const cache = 60 * 60 * 8; // 8 hours

let browser: Browser | null = null;
let page: Page | null = null;

// aspect ratio constants (1.91:1)
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 377;

async function screenshotHandler(event: any) {
    const { path, width: wQ, height: hQ } = getQuery(event);
    if (!path) {
        throw createError({ statusCode: 400, statusMessage: "path parameter is required" });
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

    const url = `https://uqucc.sb.sa${path}`;
    await page.goto(url);
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.evaluate(() => {
        // @ts-ignore
        document.documentElement.style.scrollbarGutter = "auto";
        // @ts-ignore
        document.querySelector("header")?.remove();
    });
    // wait for 10ms so that the page can render properly
    await new Promise((resolve) => setTimeout(resolve, 10));
    const buffer = await page.screenshot({
        type: "webp",
    });

    // only send Cache-Control in prod
    const headers: Record<string, string> = { "Content-Type": "image/webp" };
    if (!process.env.DEV) {
        headers["Cache-Control"] = `public, max-age=${cache}`;
    }

    return new Response(buffer, { headers });
}

// export either a cached or plain handler
export default process.env.DEV
    ? defineEventHandler(screenshotHandler)
    : defineCachedEventHandler(screenshotHandler, { maxAge: cache });
