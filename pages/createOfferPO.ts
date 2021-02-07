import qaHelper from "../utils/qaHelper";
import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";

class CreateOfferPage {
    elements = {
        firstSection: $("#create-ad-heading"),
        paymentMethodsShowAllButton: $(".qa-groups-payment-methods-toggle"),
        paymentMethodsBackButton: $(".qa-payment-methods-back"),
        paymentMethodInputField: $(".qa-payment-methods-input > input"),
        giftCards: $(".qa-group-item-gift-cards"),
        cashDeposits: $(".qa-group-item-cash-deposits"),
        onlineWallets: $(".qa-group-item-online-transfers"),
        bankTransfers: $(".qa-group-item-bank-transfers"),
        debitCreditCards: $(".qa-group-item-debitcredit-cards"),
        digitalCurrencies: $(".qa-group-item-digital-currencies"),
        idverification: $('[ng-click="switchIDVerification()"]'),
        trustedList: $('[ng-click="switchOnlyTrustedUsers()"]'),
        willPayText: $("div.selected-values > ul > li:nth-child(1)"),
        trustedAndMinTradesText: $("#fb_offer_visibility"),
        verificationText: element(
            by.xpath(
                '//div[@class="selected-values"]/ul/li[contains(text(), "You have required")]',
            ),
        ),
        denyTermsMessage: $(".qa-offer-agreement-msg"),
        createOfferHeader: $(".qa-create-offer-header"),
        buyBitcoinOffer: $("#buy-bitcoin-btn"),
        sellBitcoinOffer: $("#sell-bitcoin-btn"),
        margin: $(".margin-percent .number-input input:first-of-type"),
        marginText: $('div.selected-values .qa-create-offer-margin-text'),
        rangeMin: $('[ng-model="formData.range_min"]'),
        rangeMax: $('[ng-model="formData.range_max"]'),
        amountText: element(
            by.xpath(
                '//div[@class="selected-values"]/ul/li[not(contains(@class, "ng-hide")) and contains(text(), "You accept trades between")]',
            ),
        ),
        offerNotShown: $(".qa-offer-currently-not-shown"),
        maxAmountError: $(".qa-create-offer-range-max"),
        minAmountError: $(".qa-create-offer-range-min"),
        minBtcRequired: $(".qa-offer-deposit-minimum-required"),
        bondRequired: $(".qa-security-deposit-required-message"),
        paymentWindow: $("#payment_window"),
        offerTerms: $('[ng-model="formData.offer_terms"]'),
        tradeInstructions: $('[ng-model="formData.trade_details"]'),
        saveButton: $("#save-btn"),
        minTradeRequired: $('[ng-model="formData.require_min_past_trades"]'),
        visibilityRequirementMessage: $(".helper-row > div > div:nth-child(2)"),
        bondRequirementMessage: $(".helper-row > div > div:nth-child(4)"),
        nextStep: $(".qa-btn-continue-create-offer"),
        allowedCountries: $$(".country-limitation")
            .first()
            .$(".qa-allowed-countries"),
        disallowedCountries: $("div:nth-child(5) > label"),
        countryLImitations: element(
            by.xpath(
                '//div[@class="selected-values"]/ul/li[contains(text(), "You have set country limitations")]',
            ),
        ),
        denyVendorTerms: $(".qa-vendor-deny-terms"),
        agreeVendorTerms: $(".qa-vendor-accept-terms"),
        vendorTermsModal: $(".qa-vendor-terms"),
        buttonClose: element(by.xpath(".//button/span[text()='Close']")),
        balanceRequiredMsg: element(
            by.xpath(".//div[contains(text(),'Deposit at least 0.02 BTC.')]"),
        ),
        extremeMarginWarning: element(
            by.xpath(
                ".//p[contains(text(), 'Failure to honor your price or to get more from traders is against ToS and will result in account suspension.')]",
            ),
        ),
        bondRequiredMsg: element(
            by.cssContainingText(
                ".qa-security-deposit-required-message",
                "A security deposit of 0.1 BTC is required to make this offer visible.",
            ),
        ),
        successModal: element(
            by.cssContainingText(
                ".qa-offer-share-content",
                "You have successfully created an offer!",
            ),
        ),
        paymentMethodLabel: $('[ng-model="formData.payment_method_label"]'),
        currency: $("#select2-offer_currency-container"),
        switchToBuyOfferLink: $(".qa-buy-bitcoin label"),
        switchToSellOfferLink: $(".qa-sell-bitcoin label"),
        serverErrorsBlock: $(".server-errors.error"),
        topAlert: $(".qa-alert"),
        overlay: $(".overlay"),
        depositAtLeast002BTCAlert: element(
            by.cssContainingText(
                '.qa-offer-deposit-minimum-required',
                "Deposit at least 0.02 BTC.",
            ),
        ),
        advancedMode: $(".qa-toggle-mode"),
        priceEquationsSourceName: $("#margin > div:nth-child(3) > p:nth-child(2) > b:nth-child(2)"),
        sourcePriceDropdown: $("#select2-price_source-container"),
        sourcePriceSelect: $("#select2-price_source-results"),
        sourceSearch: $(
            "body > span > span > span.select2-search.select2-search--dropdown > input",
        ),
        paymentMethodsList: $$("#trade-payments > div > div > div.CustomDropdownMenu__dropdownMenu > div > button"),
        pricePointDropdown: $("#select2-price_point-container"),
        pricePointSelect: $("#select2-price_point-results"),
    };

    constants = {
        offerTermsText: "this is offer terms test",
        tradeDetailsText: "this is trade details test",
        sourcePriceText: "Kraken",
        pricePointText: "Last",
    };

    async checkPageLoadedNotLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.createOfferHeader,
            15000,
            `Can't open the Create Offer page`,
        );
    }

    async checkPageLoadedLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.createOfferHeader,
            15000,
            `Can't open the Create Offer page`,
        );
        await browser.wait(EC.visibilityOf(this.elements.currency), 30000);
    }

    async navigateToCreateOfferPage() {
        await browser.get(browser.params.baseUrl + "/list-bitcoin-buy-sell-ad"); //overrides baseURL
        await browser.wait(EC.visibilityOf(this.elements.currency), 30000);
        expect(await browser.getCurrentUrl()).toEqual(
            browser.params.baseUrl + "/list-bitcoin-buy-sell-ad",
        );
    }

    async switchToBuyOffer(): Promise<void> {
        await this.elements.switchToBuyOfferLink.click();
    }

    async switchToSellOffer(): Promise<void> {
        await this.elements.switchToSellOfferLink.click();
    }

    //TODO looks like there is a copypaste below
    async createBuyBitcoinOffer() {
        await this.selectPaymentMethod("Amazon Gift Card");
        await this.elements.switchToBuyOfferLink.click();

        await this.selectCurrency('Euro (EUR)')

        await qaHelper.scrollToTop();

        await this.navigateToStep2();
        await qaHelper.scrollToTop();

        await this.elements.margin.clear();
        await this.elements.margin.sendKeys("10");
        await this.elements.rangeMin.clear();
        await this.elements.rangeMin.sendKeys("30");
        await this.elements.rangeMax.sendKeys("300");
        await this.elements.paymentWindow.sendKeys("33");
        await this.navigateToStep3();
        await this.elements.paymentMethodLabel.sendKeys("test min");
        await this.elements.offerTerms.sendKeys("300 qew");
        await this.elements.tradeInstructions.sendKeys("300 ewq");
        await this.clickNextStepButton();

        await qaHelper.toBeVisible(
            this.elements.successModal,
            30000,
            "successfully created an offer modal did not appear in 20 seconds",
        );
        let success = element(
            by.cssContainingText(
                ".qa-offer-share-content",
                "You have successfully created an offer!",
            ),
        );
        expect(await success.getText()).toBe(
            "You have successfully created an offer!\n" +
                "Now that your offer has been created, go ahead share it with anybody who would be interested buying from you!\n" +
                "or copy this link and share directly:\n" +
                "Copy",
        );
    }

    async comleteBuyOfferStep1() {
        await this.elements.switchToBuyOfferLink.click();
        await this.selectPaymentMethod("Amazon Gift Card");

        await this.selectCurrency('Euro (EUR)')

        await qaHelper.scrollToTop();

        await this.clickNextStepButton();
        await qaHelper.scrollToTop();
    }

    async createSellBitcoinOffer() {
        await this.selectPaymentMethod("Amazon Gift Card");

        await this.selectCurrency('Euro (EUR)')

        await qaHelper.scrollToTop();

        await this.navigateToStep2();
        await this.elements.margin.clear();
        await this.elements.margin.sendKeys("10");
        await this.elements.rangeMin.clear();
        await this.elements.rangeMin.sendKeys("30");
        await this.elements.rangeMax.sendKeys("300");
        await this.elements.paymentWindow.sendKeys("33");
        await this.navigateToStep3();
        await this.elements.paymentMethodLabel.sendKeys("test min");
        await this.elements.offerTerms.sendKeys("300 qew");
        await this.elements.tradeInstructions.sendKeys("300 ewq");
        await this.clickNextStepButton();
        await qaHelper.toBeVisible(
            this.elements.successModal,
            30000,
            "successfully created an offer modal did not appear in 30 seconds",
        );

        let success = element(
            by.cssContainingText(
                ".qa-offer-share-content",
                "You have successfully created an offer!",
            ),
        );
        expect(await success.getText()).toBe(
            "You have successfully created an offer!\n" +
                "Now that your offer has been created, go ahead share it with anybody who would be interested buying from you!\n" +
                "or copy this link and share directly:\n" +
                "Copy",
        );
    }

    async completeSellOfferStep1(group, method) {
        await element(by.xpath(".//a[contains(text(),'" + group + "')]")).click();
        await element(by.xpath(".//span[contains(text(),'" + method + "')]")).click();

        await this.selectCurrency('Euro (EUR)');

        await qaHelper.scrollToTop();

        await this.clickNextStepButton();
        await qaHelper.scrollToTop();

        await browser.wait(EC.visibilityOf($(".col-md-8.col-md-height.create-offer-main")), 10000);
    }

    async setMarginValue(margin) {
        await browser.wait(
            EC.visibilityOf(this.elements.margin),
            15000,
            "looking for margin field for 15 sec max",
        );
        await this.elements.margin.clear();
        await this.elements.margin.sendKeys(margin);
    }

    async completeOfferLastSteps(label) {
        await this.elements.rangeMin.sendKeys("30");
        await this.elements.rangeMax.sendKeys("300");

        await this.elements.paymentWindow.clear();
        await this.elements.paymentWindow.sendKeys("33");
        await qaHelper.scrollToTop();

        await this.clickNextStepButton();
        await browser.wait(EC.visibilityOf(this.elements.paymentMethodLabel), 10000);

        await this.elements.paymentMethodLabel.sendKeys(label);
        await this.elements.offerTerms.sendKeys("300 qew");
        await this.elements.tradeInstructions.sendKeys("300 ewq");
        await this.clickNextStepButton();
        let success = element(
            by.cssContainingText(
                ".qa-offer-share-content",
                "You have successfully created an offer!",
            ),
        );
        expect(await success.getText()).toBe(
            "You have successfully created an offer!\n" +
                "Now that your offer has been created, go ahead share it with anybody who would be interested buying from you!\n" +
                "or copy this link and share directly:\n" +
                "Copy",
        );
        await this.elements.buttonClose.click();
    }

    async checkBalanceRequirementMsg() {
        let message = this.elements.visibilityRequirementMessage;
        await browser.wait(
            EC.visibilityOf(message),
            10000,
            "balance requirement 0.02BTC should load within 10 seconds",
        );
        expect(await message.getText()).toBe("• Deposit at least 0.02 BTC.");
    }

    async checkBondRequirementMsg() {
        let message = this.elements.bondRequirementMessage;
        await browser.wait(EC.visibilityOf(message), 5000, "element for bond msg did not appear");
        await browser.wait(
            EC.textToBePresentInElement(
                message,
                "A security deposit of 0.1 BTC is required to make this offer visible.",
            ),
            5000,
            "bond required message text did not match",
        );
    }

    async checkExtremeMarginWarningIsDisplayed() {
        await browser.wait(
            EC.visibilityOf(this.elements.extremeMarginWarning),
            10000,
            "requirement should load within 10 seconds",
        );
    }

    async clickNextStepButton() {
        await qaHelper.scrollToElement(this.elements.nextStep);
        await this.elements.nextStep.click();
        await this.waitForOverlayToDisappear();
    }

    async waitForOverlayToDisappear(): Promise<void> {
        await browser.sleep(50);
        // await browser.wait(EC.visibilityOf(this.elements.overlay), 1000);
        await browser.wait(EC.invisibilityOf(this.elements.overlay), 15000);
    }
    async selectCustomPriceSource(source: string, point: string) {
        await this.elements.sourcePriceDropdown.click();
        await this.elements.sourceSearch.click();
        await this.elements.sourceSearch.sendKeys(source);
        await this.elements.sourcePriceSelect.click();
        await this.elements.pricePointDropdown.click();
        await this.elements.sourceSearch.sendKeys(point);
        await this.elements.pricePointSelect.click();
        // priceEquationsSourceName: $('#margin > div:nth-child(3) > p:nth-child(2) > b:nth-child(2)'),
        //     sourcePriceDropdown: $('#select2-price_source-container'),
        //     sourcePriceSelect: $('.select2-results__option select2-results__option--highlighted'),
        //     sourceSearch: $('body > span > span > span.select2-search.select2-search--dropdown > input')
    }
    async selectPaymentMethod(methodName) {
        await this.elements.paymentMethodsList
            .filter(async (el) => (await el.getText()) === methodName)
            .first()
            .click();
    }

    async selectCurrency(currencyName) {
        await qaHelper.scrollToElement(this.elements.currency);
        await browser.sleep(1000); // Wait for currencies to load
        await this.elements.currency.click();
        await element(by.cssContainingText(".select2-results__option", currencyName)).click();
    }

    async navigateToStep2() {
        await this.clickNextStepButton();
        await browser.wait(
            EC.visibilityOf(this.elements.margin),
            15000,
            "looking for margin field for 15 sec max",
        );
    }

    async navigateToStep3() {
        const elements = this.elements;

        await elements.nextStep.click();
        await browser.wait(
            EC.visibilityOf(elements.offerTerms),
            15000,
            "looking for offer terms for 15 sec max",
        );
    }

    async switchToAdvancedMode() {
        await qaHelper.toBeVisible(
            this.elements.advancedMode,
            2000,
            "Advanced mode link is not visible",
        );
        await this.elements.advancedMode.click();
        await this.selectCustomPriceSource(this.constants.sourcePriceText, this.constants.pricePointText);
    }
}

export default new CreateOfferPage();
