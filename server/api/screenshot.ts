import puppeteer, { Page } from "puppeteer";
import { downloadBrowsers } from "puppeteer/internal/node/install.js";

let _page: Page | null = null;
const width = 720;
const height = 720;

export default defineCachedEventHandler(async (event) => {
    const { path } = getQuery(event);
    if (!path) {
        throw createError({
            statusCode: 400,
            statusMessage: "path parameter is required"
        });
    }

    const url = `https://uqucc.sb.sa${path}`;
    let page = _page;
    if (!page) {
        await downloadBrowsers();

        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
            ],
            headless: true,
        });

        page = await browser.newPage();
        _page = page;
    }

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
