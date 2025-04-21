import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

describe('Google Search Test', function () {
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it.only('Visit Saucedemo and sort test with Chrome', async function () {
        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();
        console.log("ini test case 1");

        assert.strictEqual(title, 'Swag Labs');

        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current.png", imgBuffer);  // ✅ fixed typo

        if (!fs.existsSync("baseline.png")) {
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved.");
        }

        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if (numDiffPixels > 0) {
            console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
        } else {
            console.log("No visual differences found.");
        }
    });

    afterEach(async function () {
        await driver.quit();  // ✅ proper async cleanup
    });
});
