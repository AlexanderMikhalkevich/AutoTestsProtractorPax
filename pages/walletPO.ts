import qaHelper from "../utils/qaHelper";
import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";

class WalletPage {
    elements = {
        sendAvailableCrypto: $("#availableBalance"),
        showWalletModal: $("#tour-send"),
        showAddressModal: $("#tour-receive"),
        sendAmountCrypto: $("#sendAmountCrypto"),
        cryptoaddr: $("#crypto_addr"),
        userPassword: $("[name='userPassword']"),
        mainSection: $("#section-1"),
        balance: $("#tour-btc-balance"),
        continueButton: $("#prepare-send-payment-btn"),
        confirmSendPaymentBtn: $("#confirm-send-payment-btn"),
        sendToBackPage: element(by.linkText("How to send to BackPage")),
        copyAddress: $(".qa-wallet-btn-clipboard"),
        btcSwitch: $(".btc-switch"),
        qrCode: $("#bitcoin_master_address_qr_code"),
        qrCodeAddress: $("#requested-crypto-address"),
        permanentBtcAdress: $("#permanent-crypto-address"),
        currencySwitch: $(".currencyDropdownBtn"),
        denomination: $(".denomination"),
        btcAmountInputError: $(".currencyDropdownContainer .form-control.form-control__invalid"),
        currencyName: $(".qa-label-currency-name"),
        alertRedInWalletModal: $(".qa-wallet-alert-error-in-modal"),
        generateAdress: $(".qa-wallet-generate-new-address"),
        newAddress: $("#qrcode-plain"),
        btcAdrInModal: $(".qa-own-address > strong"),
        Modal2faField: $("[name='twoFactorCodeG2fa']"),
        sms2faField: $(".qa-sms-2fa-field"),
        successMessage: $(".qa-session-message .alert-success"),
        bitcoinFinalMessage: $(
            "#confirm-send-form > div.form-group.attention-container > div > div > div > strong",
        ),
        externalSuccessMessage: $(".qa-session-message"),
        completeLoad: $("#confirm-send-form > div.form-group.attention-container"),
        firstLedgerEntry: $(
            "#transactions-list > li:nth-child(1) > div > div.col-xs-8.col-md-9.noleftpadding > div.col-xs-6.col-md-8.ledger-node-content.more-height.norightpadding > span.ledger-node-content-text.wrapit.hidden-xs",
        ),
        totalAmount: $(".qa-wallet-total-amount"),
        totalAmountCurrencyCode: $(".qa-wallet-total-amount [data-currencycode]"),
        adjustWarning: $("#adjust-warning > div > div > span"),
        adjustAmount: $("#adjust-warning > div > div > span > span:nth-child(3)"),
        minersFee: $(".qa-miners-fee"),
        closeModal: $(
            "#modalSendCrypto > div.modal-dialog.modal-lg > div > div.modal-header > button > span",
        ),
        transactionTabLink: $("#load-transactions > a"),
        transactionsList: $("#transactions-list"),
        usdDenomination: $(".usd-denomination"),
        transactionsListItems: $$("#transactions-list > li"),
        currencySwitchOptions: $$(
            ".select2-container--currency-dropdown .currencySelect__dropdown .select2-results .select2-results__options > li",
        ),
        ledgerEntry: $$("#transactions-list > li > div > div:nth-child(2)").filter((el) =>
            el.isDisplayed(),
        ),
        walletTabs: $$(".qa-wallet-tabs > button"),
    };

    async goNotLogged() {
        await browser.get(browser.params.baseUrl + "/bitcoin-wallet"); //overrides baseURL
    }

    async goLoggedIn() {
        await browser.get(browser.params.baseUrl + "/wallet");
        expect(await browser.getCurrentUrl()).toEqual(browser.params.baseUrl + "/wallet");
    }

    async checkPageLoadedNotLoggedIn() {
        await qaHelper.toBeVisible(this.elements.mainSection, 15000, `Can't open the Wallet page`);
    }

    async checkPageLoadedLoggedIn() {
        await qaHelper.toBeVisible(this.elements.balance, 15000, `Can't open the Wallet page`);
    }

    async pressSendButton() {
        await browser.wait(
            EC.elementToBeClickable(this.elements.showWalletModal),
            15000,
            "Send button should be visible",
        );
        await this.elements.showWalletModal.click();

        const wait = EC.visibilityOf(
            element(by.cssContainingText(".modal-title", "Send from Paxful wallet")),
        );
        await browser.wait(
            wait,
            15000,
            "modal wallet didn't load within 15 seconds or element is not present",
        );
        await browser.sleep(500);
    }

    async sendToBackPageButton() {
        await this.elements.sendToBackPage.click();
        expect(await browser.getCurrentUrl()).toEqual(
            browser.params.baseUrl + "/backpage#send-bitcoin-backpage",
        );
    }

    async copyAddressButton() {
        await this.elements.showAddressModal.click();
        await this.elements.copyAddress.click();
    }

    async clickFiatBtcSwitcher() {
        await browser.wait(
            EC.visibilityOf(this.elements.btcSwitch),
            10000,
            "fiat-btc switcher should be visible",
        );
        await this.elements.btcSwitch.click();
        // let text = element(by.css('.denomination'));
        // expect(text.getText()).toBe('BTC');
    }

    async generateNewAdress() {
        const elements = this.elements;
        await elements.generateAdress.click();
        await qaHelper.toBeVisible(elements.newAddress, 15000, "new address not visible");
    }

    async qrCodeButton() {
        const elements = this.elements;

        await this.elements.showAddressModal.click();
        await elements.qrCode.click();
        const qrInput = elements.qrCodeAddress;
        expect(await qrInput.isPresent()).toBe(true);
    }

    async incorrectPassword() {
        const elements = this.elements;
        await elements.sendAmountCrypto.sendKeys("0.001");
        await elements.cryptoaddr.sendKeys("myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc");
        await elements.continueButton.click();
        await this.confirmAndSend("");
        await qaHelper.toBeVisible(
            elements.alertRedInWalletModal,
            15000,
            "error should appear within 5 seconds",
        );
    }

    async enterAmountError() {
        const elements = this.elements;

        await elements.cryptoaddr.sendKeys("myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc");
        await elements.continueButton.click();
        await browser.sleep(500);
        const wait = EC.visibilityOf(elements.alertRedInWalletModal);
        await browser.wait(wait, 15000, "error should appear within 5 seconds");
    }

    async moreThanYourBalanceError() {
        const elements = this.elements;

        await elements.sendAmountCrypto.sendKeys("123");
        await browser.sleep(500);
        const wait = EC.visibilityOf(elements.btcAmountInputError);
        await browser.wait(wait, 15000, "error should appear within 5 seconds");
        let btcError = elements.btcAmountInputError;
        expect(await btcError.isDisplayed()).toBe(true);
    }

    async incorrect2faError() {
        const elements = this.elements;

        // await this.openModalWindow();
        await elements.sendAmountCrypto.sendKeys("0.01");
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys("myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc");
        await browser.sleep(500);
        await elements.continueButton.click();
        await qaHelper.toBeVisible(elements.Modal2faField, 10000, "GA 2fa input field is not visible");
        await browser.sleep(500);
        await elements.Modal2faField.sendKeys("333333");
        await elements.confirmSendPaymentBtn.click();
        await qaHelper.toBeVisible(elements.alertRedInWalletModal, 25000, "alert is not visible");
    }

    async canNotSendMoreThanCurrentError() {
        const elements = this.elements;

        // await this.openModalWindow();
        await elements.sendAmountCrypto.sendKeys("-1");
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys("myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc");
        await browser.sleep(500);
        await elements.continueButton.click();
        await browser.sleep(500);

        const wait = EC.visibilityOf(elements.alertRedInWalletModal);
        await browser.wait(wait, 15000, "error should appear within 5 seconds");
    }

    async btcAddressError() {
        const elements = this.elements;

        // let btcAdress = this.permanentBtcAdress.getText();
        await elements.cryptoaddr.sendKeys("testtesttest");
        await browser.sleep(500);
        await elements.continueButton.click();
        await qaHelper.toBeVisible(
            elements.alertRedInWalletModal,
            15000,
            "error should appear within 5 seconds",
        );
    }

    async sendToYourAdressError() {
        let elements = this.elements;
        let Adr = await elements.btcAdrInModal.getText();

        await elements.sendAmountCrypto.sendKeys("0.01");
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys(Adr);
        await browser.sleep(500);
        await elements.continueButton.click();
        await qaHelper.toBeVisible(elements.Modal2faField, 10000, "GA 2fa input field is not visible");
        await elements.Modal2faField.sendKeys("000000");
        await elements.confirmSendPaymentBtn.click();
        await qaHelper.toBeVisible(
            elements.alertRedInWalletModal,
            25000,
            'error "send to your own wallet" not visible',
        );
    }

    async currencySwitchInModal() {
        const elements = this.elements;

        await elements.currencySwitch.click();
        await elements.currencySwitchOptions.get(1).click();
        await qaHelper.textPresent(
            elements.currencyName,
            "USD Amount",
            5000,
            "currency name is not presented within 5 seconds",
        );
    }

    async internalPrepareSend(amount: string | number, address: string) {
        const elements = this.elements;
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 15 seconds",
        );
        await elements.sendAmountCrypto.sendKeys(amount);
        await browser.sleep(1000);
        await elements.cryptoaddr.sendKeys(address);
        await browser.sleep(500);
        await qaHelper.textPresentValue(elements.cryptoaddr, address, 5000);
        await qaHelper.toBeClickable(
            elements.continueButton,
            15000,
            "continue button should load within 15 seconds",
        );
        await elements.continueButton.click();
    }

    async internalPrepareSendWith2Fa(amount: string | number, address: string) {
        const elements = this.elements;
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 15 seconds",
        );
        await elements.sendAmountCrypto.sendKeys(amount);
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys(address);
        await browser.sleep(500);
        await qaHelper.textPresentValue(elements.cryptoaddr, address, 5000);
        await qaHelper.toBeClickable(
            elements.continueButton,
            15000,
            "continue button should load within 15 seconds",
        );
        await elements.continueButton.click();
    }

    async externalPrepareSend(amount: string | number, address: string) {
        const elements = this.elements;
        await this.pressSendButton();
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 15 seconds",
        );
        await elements.sendAmountCrypto.sendKeys(amount);
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys(address);
        await browser.sleep(500);
        await qaHelper.textPresentValue(elements.cryptoaddr, address, 5000);
        await qaHelper.toBeClickable(
            elements.continueButton,
            15000,
            "continue button should load within 15 seconds",
        );
        await elements.continueButton.click();
    }

    async externalPrepareSendWith2fa(amount: string | number, address: string) {
        const elements = this.elements;
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 15 seconds",
        );
        await elements.sendAmountCrypto.sendKeys(amount);
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys(address);
        await browser.sleep(500);
        await qaHelper.textPresentValue(elements.cryptoaddr, address, 5000);
        await await qaHelper.toBeClickable(
            elements.continueButton,
            15000,
            "continue button should load within 15 seconds",
        );
        await elements.continueButton.click();
    }

    async fillInfoForWalletSend(wallet) {
        const elements = this.elements;
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 15 seconds",
        );
        await elements.sendAmountCrypto.sendKeys("0.01");
        await browser.sleep(500);
        await elements.cryptoaddr.sendKeys(wallet);
        await browser.sleep(500);
    }

    async externalSend() {
        const elements = this.elements;
        await qaHelper.toBeClickable(
            elements.sendAvailableCrypto,
            15000,
            "send available crypto should load within 5 seconds",
        );
        await elements.sendAmountCrypto.sendKeys("0.01");
        await browser.sleep(500);
        //await browser.sleep(1000);
        await elements.cryptoaddr.sendKeys("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX");
        await browser.sleep(500);
        await elements.userPassword.sendKeys("xXxXxX1!");
    }

    async payWith2faGA() {
        const elements = this.elements;
        await qaHelper.toBeVisible(elements.Modal2faField, 10000, "GA 2fa input field is not visible");
        await elements.Modal2faField.sendKeys("000000");
        await browser.sleep(500);
        await elements.confirmSendPaymentBtn.click();
    }

    async payWith2faSMS() {
        const elements = this.elements;
        await qaHelper.toBeVisible(elements.sms2faField, 10000, "SMS 2fa input field is not visible");
        await elements.sms2faField.sendKeys("000000");
        await browser.sleep(500);
        await elements.confirmSendPaymentBtn.click();
    }

    async confirmAndSend(password = "xXxXxX1!") {
        const elements = this.elements;
        await browser.wait(
            EC.visibilityOf(this.elements.showWalletModal),
            10000,
            "confirm Send Payment Btn should be visible",
        );
        await qaHelper.toBeClickable(
            elements.confirmSendPaymentBtn,
            15000,
            "confirm modal and button should load within 15 seconds",
        );
        await elements.userPassword.sendKeys(password);
        await elements.confirmSendPaymentBtn.click();
        // $$('button.btn.btn-success.btn-lg.ladda-button').second().click();
    }

    async confirmAndSendSmoke(wallet) {
        const elements = this.elements;
        const waitForButton = EC.elementToBeClickable(element(by.id("prepare-send-payment-btn")));
        await browser.wait(waitForButton, 15000, "continue button should load within 5 seconds");
        await elements.continueButton.click();
        //await browser.sleep(3000);
        let waitForConfirmButton = EC.elementToBeClickable(
            element(by.id("confirm-send-payment-btn")),
        );
        await browser.wait(
            waitForConfirmButton,
            15000,
            "confirm modal and button should load within 5 seconds",
        );
        await browser.sleep(500);
        await elements.userPassword.sendKeys("xXxXxX1!");
        $$("button.btn.btn-primary.btn-lg.ladda-button")
            .first()
            .click();
        waitForConfirmButton = EC.elementToBeClickable(this.elements.successMessage);
        await browser.wait(
            waitForConfirmButton,
            15000,
            "confirm success message should load within 15 seconds",
        );
        expect(await this.elements.successMessage.getText()).toBe(
            "0.01 BTC has been successfully sent to " + wallet,
        );
    }

    async clickConfirmSend() {
        const elements = this.elements;
        const waitForButton = EC.elementToBeClickable(element(by.id("prepare-send-payment-btn")));
        await browser.wait(waitForButton, 15000, "continue button should load within 5 seconds");
        await elements.continueButton.click();
        await browser.sleep(3000);
    }
}

export default new WalletPage();
