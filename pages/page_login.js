// ../../pages/page_login.js
import { By } from 'selenium-webdriver';

export default {
    inputUsername: By.css('[data-test="username"]'),
    inputPassword: By.css('[data-test="password"]'),
    buttonLoggin: By.css('[data-test="login-button"]')
};
