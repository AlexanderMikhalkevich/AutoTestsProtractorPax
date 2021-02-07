import {
    $,
    browser,
    ExpectedConditions as EC,
    WebElement,
    promise,
    ElementFinder,
} from "protractor";
import * as faker from "faker";
import { get } from "./request";
import configHelper from "./configHelper";
import User from "./IUser";

const baseUrl = configHelper.getConfig().params.baseUrl;

async function checkFor404(e: Error): Promise<void> {
    if (!(await $(".page_not_found").isPresent())) return;

    throw new Error("404 page: " + e.message);
}

async function checkForWhoops(): Promise<void> {
    const header = $(".exception-summary h1.exception-message");

    if (!(await header.isPresent())) return;

    const whoops = await header.getText();
    const title = await $(".trace-details > .trace-head span.exception_title").getText();
    const message = await $(".trace-details > .trace-head p.trace-message").getText();
    const stackTrace = await $(".trace-details > tbody").getText();

    throw new Error(`${whoops}\n${title}\n${message}\n${stackTrace}`);
}

async function tryToDo(
    action: promise.Promise<WebElement> | Promise<any> | Function,
): Promise<any> {
    try {
        if (action instanceof Function) return await action();
        return await action;
    } catch (e) {
        await checkFor404(e);
        await checkForWhoops();
        throw e;
    }
}

class QaHelper {
    getRandomUserData(): User {
        faker.seed(Math.random() * 1000000000000000000); // TODO there should be a better way to init faker with different seeds in parallel threads

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const randomInt = faker.random.number();
        const nick = `${firstName}_${lastName}_${randomInt}`.replace(/[']/g, "");
        const email = `${nick}@test.com`;

        return {
            firstName,
            lastName,
            nick,
            email,
        };
    }

    async createRandomUser(isVendor?: boolean, level: number = 0): Promise<User> {
        const userData = this.getRandomUserData();
        const userId = await this.createUser(userData.email, userData.nick, isVendor, level);
        return {
            id: userId,
            ...userData,
        };
    }

    async createUser(
        email: string,
        name: string,
        isVendor?: boolean,
        level: number = 0,
        isAffiliate?: boolean,
    ): Promise<number> {
        const res = await get("/helper-qa/create-user", {
            email,
            name,
            is_vendor: !!isVendor,
            is_affiliate: !!isAffiliate,
            level: level,
        });
        return res.data.user_id;
    }

    async activateEmail(userId: number, value?: boolean): Promise<void> {
        await get("/helper-qa/toggle-email-verification", {
            user_id: userId,
            value,
        });
    }

    async activate2faGoogle(userId: number): Promise<void> {
        await get("/helper-qa/enable-2fa-google", {
            user_id: userId,
        });
    }

    async activate2faSms(userId: number): Promise<void> {
        await get("/helper-qa/enable-2fa-sms", {
            user_id: userId,
        });
    }

    async deactivate2fa(userId: number): Promise<void> {
        await get("/helper-qa/enable-2fa-none", {
            user_id: userId,
        });
    }

    async togglePhoneVerification(userId: number, phone: string = "3726000014"): Promise<void> {
        await get("/helper-qa/toggle-phone-verification", {
            user_id: userId,
            phone,
        });
    }

    async updateUserStats(
        userId: number,
        feedback_positive: number,
        total_partners: number,
        total_btc: number,
        total_trades: number,
    ) {
        await get("/helper-qa/user-stats", {
            user_id: userId,
            feedback_positive,
            total_partners,
            total_btc,
            total_trades,
        });
    }

    async releasePhoneNumber(phone: string): Promise<void> {
        await get("/helper-qa/toggle-phone-verification", {
            phone,
            value: 0,
        });
    }

    getRandomFakeNumber(): string {
        return "3726" + Math.floor(100000 + Math.random() * 900000);
    }

    async saveSecurityAnswers(userId: number): Promise<void> {
        await get("/helper-qa/save-security-answers", {
            user_id: userId,
        });
    }

    async dropSecurityAnswers(userId: number): Promise<void> {
        await get("/helper-qa/drop-security-answers", {
            user_id: userId,
        });
    }

    async addBalance(userId: number, balance: number): Promise<void> {
        await get("/helper-qa/new-balance", {
            user_id: userId,
            balance,
        });
    }

    async createOffer(
        userId: number,
        currency: string,
        amount: number,
        paymentMethod: number,
        type: string,
    ): Promise<string> {
        const res = await get("/helper-qa/create-offer", {
            user_id: userId,
            currency,
            amount,
            payment_method: paymentMethod,
            type,
        });
        return res.data.offerHash;
    }

    async removeRestriction(userId: number): Promise<void> {
        await get("/helper-qa/remove-restrictions", {
            user_id: userId,
        });
    }

    async depositBond(userId: number): Promise<void> {
        await get("/helper-qa/deposit-bond", {
            user_id: userId,
        });
    }

    async withdrawBond(userId: number): Promise<void> {
        await get("/helper-qa/withdraw-bond", {
            user_id: userId,
        });
    }

    async changePass(userId: number, password: string): Promise<void> {
        await get("/helper-qa/change-password", {
            user_id: userId,
            password,
        });
    }

    async enableNotification(userId: number): Promise<void> {
        await get("/helper-qa/toggle-notification", {
            user_id: userId,
        });
    }

    async resetState(): Promise<void> {
        await browser.get(baseUrl + "/helper-qa/reset-state");
        await browser.driver.manage().deleteAllCookies();
        await browser.sleep(2000);
        // await browser.executeScript('window.localStorage.clear();');
        // await browser.executeScript('window.sessionStorage.clear();');
    }

    async getUserId(email: string): Promise<number> {
        const res = await get("/helper-qa/get-user-info", {
            email,
        });
        return res.data.user_id;
    }

    async getUserWallet(email: string): Promise<string> {
        const res = await get("/helper-qa/get-user-info", {
            email,
        });
        return res.data.wallet;
    }

    async updateUserstatus(userId: number, status: string) {
        await get("/helper-qa/update-statuses", {
            user_id: userId,
            [status]: 1,
        });
    }

    async toBeVisible(element: ElementFinder, time: number, error: string): Promise<void> {
        await tryToDo(browser.wait(EC.visibilityOf(element), time, error));
    }

    async stalenessOf(element: ElementFinder, time: number, error: string): Promise<void> {
        await tryToDo(browser.wait(EC.stalenessOf(element), time, error));
    }

    async toBeInvisible(element: ElementFinder, time: number, error: string): Promise<void> {
        await tryToDo(browser.wait(EC.invisibilityOf(element), time, error));
    }

    async textPresent(
        element: ElementFinder,
        text: string,
        time: number,
        error: string,
    ): Promise<void> {
        await tryToDo(browser.wait(EC.textToBePresentInElement(element, text), time, error));
    }

    async textPresentValue(element: ElementFinder, text: string, time: number): Promise<void> {
        await tryToDo(browser.wait(EC.textToBePresentInElementValue(element, text), time));
    }

    async toBeClickable(element: ElementFinder, time: number, error: string): Promise<void> {
        await tryToDo(browser.wait(EC.elementToBeClickable(element), time, error));
    }

    async urlIs(url: string, time: number, error: string): Promise<void> {
        await browser.wait(EC.urlIs(baseUrl + url), time, error);
    }

    async addNewRandomTag(
        userId: number = 1,
    ): Promise<{ id: number; name: string; description: string }> {
        const name = faker.lorem.words(2);
        const description = faker.lorem.sentence();
        const response = await get("/helper-qa/add-new-tag", {
            name,
            description,
            user_id: userId,
        });
        return {
            id: response.data.id,
            name,
            description,
        };
    }

    async toggleKycVerification(
        userId: number,
        options: { id?: boolean; document?: boolean } = { id: true, document: true },
    ): Promise<void> {
        for (let key in options) {
            if (!options[key]) delete options[key];
        }

        await get("/helper-qa/toggle-kyc-verification", {
            ...options,
            user_id: userId,
        });
    }

    async scrollToElement(element: ElementFinder): Promise<void> {
        await browser.executeScript((el) => {
            // window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 200); // adjust to the top + 200px
            window.scrollTo(
                0,
                el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
            ); // adjust to the middle
        }, element);
    }

    async scrollToTop(): Promise<void> {
        await browser.executeScript(() => {
            window.scrollTo(0, 0);
        });
    }

    async waitForPageToBeLoaded(): Promise<void> {
        await browser.sleep(50);
        while ((await browser.executeScript(() => document.readyState)) !== "complete") {
            await browser.sleep(50);
        }
        await browser.sleep(50);
    }

    async createSpecificOffer(
        options: {
            user_id?: number;
            currency?: string;
            amount?: number;
            payment_method?: number;
            type?: "sell" | "buy";
            require_verified_phone?: boolean;
            require_verification_id?: boolean;
            require_offer_currency_must_match_buyer_country?: boolean;
            show_limit_max_coins?: boolean;
            require_min_past_trades?: number;
            show_only_trusted_user?: boolean;
            block_anonymizer_users?: boolean;
            country_limitation_type?: 1 | 2;
            country_limitation_list?: string[];
            payment_method_label?: string;
            bank_name?: string;
            margin?: number;
            range_min?: number;
            range_max?: number;
            payment_window?: number;
            offer_terms?: string;
            trade_details?: string;
            tags?: number[];
        } = {},
    ): Promise<string> {
        const defaults = {
            currency: "usd",
            payment_method: 4,
            type: "sell",
            require_verified_phone: false,
            require_verification_id: false,
            require_offer_currency_must_match_buyer_country: false,
            show_limit_max_coins: false,
            require_min_past_trades: 0,
            show_only_trusted_user: false,
            block_anonymizer_users: false,
            country_limitation_list: [],
            payment_method_label: "payment method label text",
            margin: 0,
            payment_window: 30,
            offer_terms: "offer terms text",
        };

        for (const key in defaults) {
            if (options[key] === null || options[key] === undefined) {
                options[key] = defaults[key];
            }
        }

        if (!options.user_id) throw new Error("user_id is not specified");

        if (options.amount == null && options.range_min == null && options.range_max == null) {
            options.amount = 500;
        }

        const preparedOptions = {
            ...options,
            amount:
                options.amount != null
                    ? options.amount
                    : {
                          min: options.range_min,
                          max: options.range_max,
                      },
        };

        for (const key in preparedOptions) {
            if (preparedOptions[key] === true) preparedOptions[key] = 1;
            if (preparedOptions[key] === false) preparedOptions[key] = 0;
        }

        const createOffer = await get("/helper-qa/create-offer", preparedOptions);
        return createOffer.data.offerHash;
    }

    async navigateToUrl(url: string, expectedUrl?: string): Promise<void> {
        await browser.get(baseUrl + url); //overrides baseURL

        if (expectedUrl) {
            expect(await browser.getCurrentUrl()).toEqual(baseUrl + expectedUrl);
        } else {
            expect(await browser.getCurrentUrl()).toEqual(baseUrl + url);
        }
    }
    async navigateToRawUrl(url: string) {
        await browser.get(url);
        // expect(await browser.getCurrentUrl()).toEqual(url);
    }

    async initDB(): Promise<void> {
        await get("/helper-qa/init-database");
    }

    async getEnvironmentType(): Promise<string> {
        return (await get("/helper-qa/environment")).data.environment;
    }

    async switchToNewTab(): Promise<void> {
        await browser.driver.close();
        const handles = await browser.getAllWindowHandles();
        await browser.switchTo().window(handles[0]);
    }

    async startTrade(params: {
        user_id: number;
        offer_hash: string;
        amount_btc?: number;
        amount_fiat?: number;
    }): Promise<any> {
        const res = await get("/helper-qa/trades/start-new-trade", params);
        return res.data;
    }

    async cancelAllActiveTrades(): Promise<void> {
        await get("/helper-qa/trades/cancel-all");
    }

    async cancelAllActiveTradesOfAUser(user_id: number): Promise<void> {
        await get("/helper-qa/trades/cancel-all-of-user", {
            user_id,
        });
    }

    async cancelTrade(trade_hash: string): Promise<void> {
        await get(`/helper-qa/trades/${trade_hash}/cancel`);
    }

    async payInTrade(trade_hash: string): Promise<void> {
        await get(`/helper-qa/trades/${trade_hash}/pay`);
    }

    async releaseInTrade(trade_hash: string): Promise<void> {
        await get(`/helper-qa/trades/${trade_hash}/release`);
    }

    async reopenTrade(trade_hash: string): Promise<void> {
        await get(`/helper-qa/trades/${trade_hash}/reopen`);
    }

    async enableDeferredEscrow(user_id: number, enabled: boolean = true): Promise<void> {
        await get(`/helper-qa/users/enable-deferred-escrow`, {
            user_id,
            enabled,
        });
    }

    async sendMessageInTradeChat(
        trade_hash: string,
        user_id: number,
        message: string,
    ): Promise<void> {
        await get(`/helper-qa/trades/${trade_hash}/sendMessage`, {
            user_id,
            message,
        });
    }

    async verifyUsername(user_id: number, value: boolean, username?: string): Promise<void> {
        await get(`/helper-qa/verify-username`, {
            user_id,
            value,
            username,
        });
    }

    async setStateMachineFlags(state: boolean): Promise<void> {
        await get(`/helper-qa/setStateMachineFlags`, {
            state: +state
        });
    }

    async toggleNewTradePageInSettings(flag = 0): Promise<void> {
        await get(`/helper-qa/toggle-new-tradepage`, {
            flag,
        });
    }

    async enableNewTradeForUser(user_id: number): Promise<void> {
        await get(`/helper-qa/toggle-new-tradepage-user`, {
            user_id,
            flag: 1,
        });
    }
}

export default new QaHelper();
