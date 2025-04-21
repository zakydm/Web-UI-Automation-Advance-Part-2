import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import page_login from '../../pages/page_login.js';
import fs from 'fs';

describe('Google Search Test', function () {
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('Visit Saucedemo and sort test with Chrome', async function () {
        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();
        console.log("ini test case 1");

        assert.strictEqual(title, 'Swag Labs');

        // Ambil screenshot
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync('screenshott.png', screenshot, 'base64');

        // Login
        const inputUsername = await driver.findElement(page_login.inputUsername);
        const inputPassword = await driver.findElement(page_login.inputPassword);
        const buttonLogin = await driver.findElement(page_login.buttonLoggin);

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        // Tunggu tombol cart & sort muncul
        const buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
            3000
        );

        const buttonSort = await driver.wait(
            until.elementLocated(By.css('[data-test="product-sort-container"]')),
            3000
        );

        await buttonSort.click();

        // Pilih sort Z to A
        const optionZA = await driver.wait(
            until.elementLocated(By.css('option[value="za"]')),
            2000
        );
        await optionZA.click();

        // Cek apakah produk benar diurutkan dari Z ke A
        const productNames = await driver.findElements(By.css('.inventory_item_name'));
        const names = [];

        for (let product of productNames) {
            names.push(await product.getText());
        }

        const expected = [...names].sort().reverse();

        console.log(
            JSON.stringify(names) === JSON.stringify(expected)
                ? "✅ Produk sudah terurut dari Z ke A."
                : "❌ Urutan produk belum sesuai Z ke A."
        );

        await buttonCart.isDisplayed();
        await driver.sleep(3000);
    });

    it('Visit Saucedemo and add to cart', async function () {
        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();
        console.log("ini test case 2");

        assert.strictEqual(title, 'Swag Labs');

        const inputUsername = await driver.findElement(page_login.inputUsername);
        const inputPassword = await driver.findElement(page_login.inputPassword);
        const buttonLogin = await driver.findElement(page_login.buttonLoggin);

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        // Add to cart
        const buttonAddToCart = await driver.wait(
            until.elementLocated(By.css('[data-test^="add-to-cart"]')),
            5000
        );
        await buttonAddToCart.click();

        // Verifikasi tombol berubah jadi "Remove"
        const buttonRemove = await driver.findElement(By.css('[data-test^="remove"]'));
        assert.ok(await buttonRemove.isDisplayed(), "Produk berhasil ditambahkan ke cart");

        const buttonCart = await driver.findElement(By.css('.shopping_cart_link'));
        await buttonCart.click();

        await buttonCart.isDisplayed();
        await driver.sleep(3000);
    });

    afterEach(async function () {
        await driver.quit();
    });
});
