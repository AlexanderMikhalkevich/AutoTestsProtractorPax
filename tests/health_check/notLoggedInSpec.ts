import { $, browser, by, element } from "protractor";
import qaHelper from "../../utils/qaHelper";
import loginPage from "../../pages/loginPO";
import walletPage from "../../pages/walletPO";
import dashboardPage from "../../pages/dashboardPO";
import createOfferPage from "../../pages/createOfferPO";
import kioskPage from "../../pages/kiosk/kioskPO";
import offersPage from "../../pages/offersListPO";

describe("Not Logged in health check", () => {
    beforeAll(async () => {
        await qaHelper.resetState();
    });

    it("should login at the login page id5528", async () => {
        await loginPage.go();
        await loginPage.checkPageLoaded();
    });

    it("should navigate to the wallet page id5529", async () => {
        await walletPage.goNotLogged();
        await walletPage.checkPageLoadedNotLoggedIn();
    });

    it("should navigate to the vendor landing page id5530", async () => {
        await dashboardPage.goVendorDashboardNotLoggedIn();
        await dashboardPage.vendorDBPageLoadedNotLoggedIn();
    });

    it("should navigate to the create offer page id5531", async () => {
        await createOfferPage.navigateToCreateOfferPage();
        await createOfferPage.checkPageLoadedNotLoggedIn();
    });

    it("should navigate to the kiosk page id5532", async () => {
        await kioskPage.go();
        await kioskPage.checkPageLoaded();
    });

    it("should navigate to the buy bitcoin page id5533", async () => {
        await offersPage.goBuyBitcoin();
        await offersPage.checkBuyBitcoinPageIsLoaded();
    });

    it("should navigate to the sell bitcoin page id5534", async () => {
        await offersPage.goSellBitcoin();
        await offersPage.checkSellBitcoinPageIsLoaded();
    });

    [
        ["/pay-with-paxful", ".topSection h1", "Become a merchant at Paxful", 5535],
        ["/about", 'img[alt="Ray Youssef"]', "About", 5536],
        ["/how-to-buy-bitcoin", ".how_to_buy_widget", "Payment method", 5539],
        ["/privacy-notice", ["h1", "Paxful, Inc. Privacy Notice"], "Privacy Notice", 5541],
        ["/usa/buy-bitcoin", "#country-landing-wrapper", "Buy Bitcoin in USA", 5542],
        ["/buy-sell-bitcoin-china", ".language-switcher", "Buy Bitcoin in China", 5543],
        [
            "/buy-sell-bitcoin-nigeria",
            "#top-section .tutorial-video-link",
            "Buy Bitcoin in Nigeria",
            5544,
        ],
        ["/russia/buy-bitcoin", ["#top-section .title", "Russia"], "Buy Bitcoin in Russia", 5545],
    ].forEach(([url, locator, title, testCaseId]: [string, [string, string], string, number]) => {
        it(`Should navigate to the ${title} page id${testCaseId}`, async () => {
            await browser.get(browser.params.baseUrl + url);

            let el;
            if (locator instanceof Array) el = element(by.cssContainingText(...locator));
            else el = $(locator);

            await qaHelper.toBeVisible(el, 15000, `Can't open the ${url} page`);
        });
    });
});
