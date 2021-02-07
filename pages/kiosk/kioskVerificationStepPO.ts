import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";

class KioskVerificationStepPage {
    elements = {
        phoneNumberInput: $(".qa-phone-input"),
        verifyButton: $(".qa-verify-button"),
        verifyPhoneBySmsButton: $(".qa-verify-by-sms-button"),
        verificationCodeInput: $$(".qa-verification-code-input")
            .filter((el) => el.isDisplayed())
            .first(),
        acceptTermsCheckBox: $(".qa-terms-checkbox"),
        nextStepButton: $(".qa-next-button"),
    };

    async fillInPhoneNumber(phone: string | number) {
        const input = this.elements.phoneNumberInput;
        await browser.wait(EC.elementToBeClickable(input), 5000);
        await browser.sleep(300);
        await input.clear();
        await input.sendKeys(+phone);
    }

    async pressVerifyButton() {
        const button = this.elements.verifyButton;
        await browser.wait(EC.elementToBeClickable(button), 5000);
        await button.click();
        await browser.wait(EC.elementToBeClickable(button), 5000);
    }

    async pressVerifyByPhoneButton() {
        const button = this.elements.verifyPhoneBySmsButton;
        await browser.wait(EC.elementToBeClickable(button), 5000);
        await button.click();
        await browser.wait(EC.elementToBeClickable(button), 5000);
    }

    async fillInVerificationCode() {
        const input = this.elements.verificationCodeInput;
        await browser.wait(EC.elementToBeClickable(input), 5000);
        await input.sendKeys("0000");
    }

    async clickNextStepButton() {
        await this.elements.nextStepButton.click();
    }

    async clickStartTradeButton() {
        await this.clickNextStepButton();
    }
}

export default new KioskVerificationStepPage();
