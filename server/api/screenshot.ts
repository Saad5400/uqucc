import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser, Page } from "puppeteer-core";

const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
const width = 720;
const height = 720;

let browser: Browser | null = null;
let page: Page | null = null;

export default defineCachedEventHandler(async (event) => {
    const { path } = getQuery(event);
    if (!path) {
        throw createError({
            statusCode: 400,
            statusMessage: "path parameter is required"
        });
    }

    if (!browser) {
        browser = await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });
    }

    if (!page) {
        page = await browser.newPage();
    }

    const url = `https://uqucc.sb.sa${path}`;
    await page.goto(url);
    await page.setViewport({ width: width, height: height, deviceScaleFactor: 2 });
    const mainElement = await page.$("main");
    const screenshot = await mainElement?.screenshot({
        type: "jpeg",
        fullPage: false,
        clip: {
            x: 0,
            y: 0,
            width: width,
            height: height
        }
    });

    return new Response(screenshot, {
        headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": `public, max-age=${60 * 60 * 8}` // Cache for 8 hours
        }
    });
}, {
    maxAge: 60 * 60 * 8, // Cache for 8 hours
});
