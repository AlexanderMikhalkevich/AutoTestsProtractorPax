import { $, browser, by, element, ExpectedConditions as EC } from "protractor";

import qaHelper from "../utils/qaHelper";
import createOfferPage from "./createOfferPO";

class DashboardPage {
    public elements = {
        vendorDashboardPage: {
            sectionFeatures: $("#section-features"),
            middleText: $("text-center.title-help.col-md-8.block-center"),
            vendorsLandingContainer: $(".qa-vendorsLanding"),
            message: $("div.promo.promo-dark.promo-flat.promo-full"),
            createOffer: element(by.linkText("Create your offer")),
            viewOffer: element(by.cssContainingText(".a", "View")),
            myOffers: $("#overview .offersTableWrapper .sectionTitle"),
            frozenMessageTitle: $("div.frozen-account-message > div> div> h3"),
        },
        languageModal: $("#vendorLanguagesModal"),
        languageModalCloseButton: $(
            "#vendorLanguagesModal > div.modal-dialog > div > div.modal-header > button",
        ),
        setMyLanguagesButton: $("#vendorLanguagesModal .modal-footer .btn"),
        verifyYourIDWarning: element(
            by.cssContainingText(".qa-offerRowInformation > p", "verify your ID"),
        ),
        sellOffersTabButton: element(
            by.cssContainingText(".qa-vendor_dashboard__tab", "Offers to Sell"),
        ),
        buyOffersTabButton: element(
            by.cssContainingText(".qa-vendor_dashboard__tab", "Offers to Buy"),
        ),
        viewOffer: element(by.cssContainingText(".a", "View")),
        balanceRequiredMsg: element(
            by.xpath(
                ".//td[contains(text(),'Your offer is currently not visible to other traders due to insufficient funds in your wallet. Please deposit at least 0.02 BTC ')][1]",
            ),
        ),
        classicDashboardPage: {
            content: $("#content"),
            createOffer: element(by.linkText("Create your offer")),
            viewOffer: $(".offersTableWrapper .offersTable td a.view-offer"),
            myOffers: element(
                by.xpath(
                    ".//h3[contains(@class, 'sectionTitle') and contains(text(), 'My Offers')]",
                ),
            ),
        },
        activeTrades: {
            activeTradesTable: $(".qa-active-trades-table"),
            chatButton: $(".qa-active-trade-chat-button"),
        },
    };

    public async closeLanguageModalIfOpened(): Promise<void> {
        const isPresented = await this.elements.languageModal.isPresent();
        if (!isPresented) return;

        const isDisplayed = await this.elements.languageModal.isDisplayed();
        if (!isDisplayed) return;

        await browser.sleep(500);
        await this.elements.languageModalCloseButton.click();
        await browser.sleep(500);
    }

    // VENDOR DASHBOARD FUNCTIONS
    public async goVendorDashboardLoggedIn() {
        await browser.get(browser.params.baseUrl + "/vendor/dashboard"); // overrides baseURL
        await this.closeLanguageModalIfOpened();
    }

    public async goVendorDashboardNotLoggedIn() {
        await browser.get(browser.params.baseUrl + "/vendors"); // overrides baseURL
    }

    public async vendorDBPageLoadedNotLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.vendorDashboardPage.vendorsLandingContainer,
            15000,
            `Can't open the Vendor Dashboard page`,
        );
    }

    public async vendorDBPageLoadedLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.vendorDashboardPage.sectionFeatures,
            15000,
            `Can't open the Vendor Dashboard page`,
        );
    }

    public async openActiveTrade() {
        await this.elements.activeTrades.chatButton.click();
        await qaHelper.switchToNewTab();
    }

    public async checkAccountFrozenMessage() {
        await browser.wait(
            EC.textToBePresentInElement(
                this.elements.vendorDashboardPage.message,
                "Your account is frozen. You cannot withdraw or sell Bitcoin.",
            ),
            10000,
            "message account is frozen did not load in 10 seconds on dashboard",
        );
    }

    public async checkBalanceRequiredAndMinAmountCoveredMsgVendorDashboard(
        minAmount: number,
        shouldBeShown = true,
    ) {
        const messageText = `Your offer is currently not visible to other traders due to insufficient funds in your wallet. Please deposit at least 0.02 BTC`;
        const messageElement = element(
            by.xpath(`//div[@id='no-coins-no_coins0'][contains(text(), '${messageText}')]`),
        );
        await qaHelper.scrollToElement(this.elements.vendorDashboardPage.myOffers);

        if (shouldBeShown) {
            expect(await messageElement.isDisplayed()).toBeTruthy(
                "balance requirement message should be displayed",
            );
        } else {
            expect(await messageElement.isPresent()).toBeFalsy(
                "balance requirement message should not be displayed",
            );
        }
    }

    public async checkBalanceRequiredAndMinAmountCoveredMsg(
        minAmount: number,
        shouldBeShown = true,
    ) {
        const messageText = `Your offer is currently not visible to other traders due to insufficient funds in your wallet. Please deposit at least 0.02 BTC`;
        const messageElement = element(
            by.cssContainingText(".qa-offerRowInformation > p", messageText),
        );

        await qaHelper.scrollToElement(this.elements.classicDashboardPage.myOffers);

        if (shouldBeShown) {
            expect(await messageElement.isDisplayed()).toBeTruthy(
                "balance requirement message should be displayed",
            );
        } else {
            expect(await messageElement.isPresent()).toBeFalsy(
                "balance requirement message should not be displayed",
            );
        }
    }

    public async checkBalanceRequiredMsgIsNotDisplayed() {
        await qaHelper.scrollToElement(this.elements.classicDashboardPage.myOffers);
        throw new Error("uncomment the code below and fix incompatible types");
        // const titleIsNotFoo = EC.not(EC.titleIs(elements.balanceRequiredMsg));
        // await browser.wait(titleIsNotFoo, 5000, 'looks for balance requirement message for 10 seconds');
    }

    public async clickEditOfferWithLabel(label) {
        await element(
            by.xpath(".//td/small[text()='" + label + "']/../../td/a[text()='Edit']"),
        ).click();
    }

    public async clickCreateOffer() {
        await this.elements.classicDashboardPage.createOffer.click();
    }

    public async clickViewOffer() {
        await browser.sleep(5000);
        await this.elements.classicDashboardPage.viewOffer.click();
    }

    // CLASSIC DASHBOARD FUNCTIONS
    public async goClassicDashboardLoggedIn() {
        await browser.get(browser.params.baseUrl + "/classic-dashboard"); // overrides baseURL
        await this.closeLanguageModalIfOpened();
    }

    public async classicDBPageLoadedLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.classicDashboardPage.content,
            15000,
            `Can't open the Classic Dashboard page`,
        );
    }

    public async openEditFormForNthOfferFromList(n: number): Promise<void> {
        const el = element(
            by.cssContainingText(`#my-offers-table > div > div:nth-child(${n}) a`, "Edit"),
        );
        await qaHelper.scrollToElement(el);
        await el.click();
        await createOfferPage.checkPageLoadedLoggedIn();
    }

    public async switchToSellOffersTab(): Promise<void> {
        const el = this.elements.sellOffersTabButton;
        await browser.wait(EC.elementToBeClickable(el));
        await el.click();
        await browser.sleep(500);
    }

    public async switchToBuyOffersTab(): Promise<void> {
        const el = this.elements.buyOffersTabButton;
        await browser.wait(EC.elementToBeClickable(el));
        await qaHelper.scrollToElement(el);
        await el.click();
        await browser.sleep(500);
    }
}

export default new DashboardPage();
