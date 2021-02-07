import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";

import qaHelper from "../utils/qaHelper";
import tradePage from "./trade/tradePO";
import tradePageReact from "./trade/reactTradePO";

class OfferViewPage {
    elements = {
        pageTitle: $("h1.c-hero-x__title"),
        alert: $(".alert.alert-info"),
        alertCannotStartTrade: $(".alert.alert-danger:not(.qa-restriction-message)"),
        alertLink: $(".alert.alert-info a"),
        amountFiatField: $(".qa-fiat-amount"),
        amountBtc: $(".qa-crypto-amount"),
        dropDownValue: $('[value="25"]'),
        startTradeButton: $(".qa-trade-button"),
        understandSellingRisk: $(".qa-unverified-sell-warning .qa-sell-warning-submit"),
        understandBuyingWithGiftCardRisk: $(".qa-gift-card-warning .qa-understand-risk-button"),
        feePercentageBuyOffer: $(".qa-fee-percent"),
        linkCheckOtherOffers: element(by.xpath(".//a[text()='here']")),
        amountFieldDisabled: element(
            by.xpath(".//input[@class='qa-fiat-amount' and @disabled='disabled']"),
        ),
        vendorDoesNotHaveBitcoinMsg: element(
            by.xpath(
                "//span[normalize-space()='The vendor does not have enough Bitcoin to fund the escrow for this offer.']",
            ),
        ),
        offerNotPubliclyVisible: element(
            by.xpath(
                ".//span[contains(text(),'Offer owner does not have enough Bitcoin to make the offer publicly visible!')]",
            ),
        ),
        accountFrozenCannotTrade: element(
            by.xpath(
                ".//div[contains(text(),'Your account is frozen, you can') and ('t start trade')]",
            ),
        ),
        // In case there are multiple messages under the trade start button child 3 and 4 could be used
        underButtonMessageFirst: $$(".qa-restriction-message")
            .filter((el) => el.isDisplayed())
            .get(0),
        underButtonMessageSecond: $$(".qa-restriction-message")
            .filter((el) => el.isDisplayed())
            .get(1),
        underButtonMessageThird: $$(".qa-restriction-message")
            .filter((el) => el.isDisplayed())
            .get(2),
        underButtonMessageForth: $$(".qa-restriction-message")
            .filter((el) => el.isDisplayed())
            .get(3),
        noFundsWarning: $(".qa-no-funds-error"),
        trustedMessage: $(".offerInfo__trustedOnly"),
        alertMessage: $("#start-trade > div > div.style-msg.alertmsg > div"),
        //registration form
        email: $("#register_email"),
        emailAgain: $("#email-confirmation"),
        password: $("#register_password"),
        createAccountButton: $(".qa-create-account-button"),
        registerAccountButton: $("#registerForm .qa-register-cta"),
        //errors section
        emailNotVerified: $(".qa-confirm-email-message"),
        headerUsername: $(".qa-header-user-username"),
        flashMessage: $(".qa-session-alert"),
        emailEmptyError: $("#contact-form-overlay > div > form > div.col_half.email-container > p"),
        passwordEmptyError: $(
            "#contact-form-overlay > div > form > div.col_half.col_last.password-container > p",
        ),
        //Important yellow boxes
        confirmEmailYellowBox: $("#block-confirm-email-trade-start"),
        vendorDoesNotHaveBtcYellowBox: $("#start-trade-form > div:nth-child(7) > div"),
        //amounts
        minimumAmount: $(".qa-offer-minimum-amount"),
        maximumAmount: $(".qa-offer-maximum-amount"),
        offerTerms: $(".qa-offer-terms"),
        //error message on view offer list page
        errorMessage: $("#browse-search-form > div > div.style-msg.alertmsg > div"),

        paymentMethodLabel: $("#page-title .notopmargin"),
    };

    async getUnderButtonMessagesCount() {
        return await $$(".qa-restriction-message")
            .filter((el) => el.isDisplayed())
            .count();
    }

    async navigateToBuyOfferPage(offerHash) {
        await this.openOfferPage(offerHash);
    }

    async navigateToSellOfferPage(offerHash) {
        await this.openOfferPage(offerHash);
    }

    async openOfferPage(offerHash: string): Promise<void> {
        await browser.get(browser.params.baseUrl + "/offer/" + offerHash);
        await this.checkIfSpecificOfferIsOpened(offerHash);
    }

    async checkIfSpecificOfferIsOpened(offerHash: string): Promise<void> {
        expect(await browser.getCurrentUrl()).toContain(
            browser.params.baseUrl + "/offer/" + offerHash,
        );
    }

    async checkPageLoaded(): Promise<void> {
        await browser.wait(
            EC.visibilityOf(this.elements.startTradeButton),
            5000,
            "View offer page should be opened",
        );
    }

    async chooseLastOptionInFixedAmountList() {
        await $(".qa-predefined-amount-dropdown").click();
        await browser.sleep(100);
        await $$(".qa-amount-selector .qa-custom-select-option")
            .last()
            .click();
    }

    async sellNow() {
        await this.chooseLastOptionInFixedAmountList();
        await this.elements.startTradeButton.click();
        await tradePage.checkPageLoaded();
    }

    async sellNowNewTradePage() {
        await this.chooseLastOptionInFixedAmountList();
        await this.elements.startTradeButton.click();
        await tradePageReact.checkPageLoaded();
    }

    async sellNowAmount(amount) {
        const elements = this.elements;

        await elements.amountFiatField.click();
        await elements.amountFiatField.sendKeys(amount);
        await this.elements.startTradeButton.click();
        await tradePage.checkPageLoaded();
    }

    async sellNowAmountNewTradePage(amount) {
        const elements = this.elements;

        await elements.amountFiatField.click();
        await elements.amountFiatField.sendKeys(amount);
        await this.startTradeNewTradePage();
    }

    async buyNowAmount(amount) {
        const elements = this.elements;

        await elements.amountFiatField.click();
        await elements.amountFiatField.sendKeys(amount);
        await this.startTrade();
    }

    async buyNowAmountNewTradePage(amount) {
        const elements = this.elements;

        await elements.amountFiatField.click();
        await elements.amountFiatField.sendKeys(amount);
        await this.startTradeNewTradePage();
    }

    async buyNow() {
        await this.chooseLastOptionInFixedAmountList();
        await this.startTrade();
    }

    async buyNowNewTradePage() {
        await this.chooseLastOptionInFixedAmountList();
        await this.startTradeNewTradePage();
    }

    async startTrade() {
        await this.elements.startTradeButton.click();
        await tradePage.checkPageLoaded();
    }

    async startTradeNewTradePage() {
        await this.elements.startTradeButton.click();
        await tradePageReact.checkPageLoaded();
    }

    async enterAmountFiat(amount) {
        await this.elements.amountFiatField.sendKeys(amount);
    }

    async getBtcAmount(): Promise<number> {
        return parseFloat(await this.elements.amountBtc.getAttribute("value"));
    }

    async getFeePercentageForBuyOffer(percentage) {
        const fee = this.elements.feePercentageBuyOffer;
        expect(await fee.getText()).toBe(percentage);
    }

    async checkOfferNotPubliclyVisibleMsg() {
        const offerNotPubliclyVisible = EC.visibilityOf(this.elements.offerNotPubliclyVisible);
        await browser.wait(
            offerNotPubliclyVisible,
            10000,
            "error message not visible in 10 seconds",
        );
        // browser.wait(EC.visibilityOf(offerviewpage.offerNotPubliclyVisible, 5000, 'Offer not publicly visible msg did not appear'));
    }

    async checkOfferNotPubliclyVisibleMsgIsNotDisplayed() {
        throw new Error("uncomment the code below and fix incompatible types");
        // const titleIsNotFoo = EC.not(EC.titleIs(this.elements.offerNotPubliclyVisible));
        // await browser.wait(titleIsNotFoo, 5000, 'looks for message about offer public visibility 5 seconds');
    }

    async goCheckOtherOffers() {
        await this.elements.linkCheckOtherOffers.click();
        await browser.sleep(1000);
    }

    async checkVendorDoesNotHaveBTCDisplayed() {
        await browser.wait(
            EC.visibilityOf(this.elements.vendorDoesNotHaveBitcoinMsg),
            5000,
            "Vendor does not have BTC msg did not appear",
        );
    }

    async checkAmountFieldDisabled() {
        await browser.wait(
            EC.visibilityOf(this.elements.amountFieldDisabled),
            5000,
            "amount field was not disabled or was not located",
        );
    }

    async clickStartTradeButton() {
        await browser.wait(
            EC.elementToBeClickable(this.elements.startTradeButton),
            5000,
            "start Trade Button was not clickable",
        );
        await qaHelper.scrollToElement(this.elements.startTradeButton);
        await this.elements.startTradeButton.click();
    }
}

export default new OfferViewPage();
