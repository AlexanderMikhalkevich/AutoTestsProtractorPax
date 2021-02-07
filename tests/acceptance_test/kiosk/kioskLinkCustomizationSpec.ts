import qaHelper from "../../../utils/qaHelper";
import kioskLandingPage from "../../../pages/kiosk/kioskLandingPO";
import loginPage from "../../../pages/loginPO";
import { by, element } from "protractor";

describe("Kiosk link customization", function() {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await loginPage.logInAccount(user.email);
        await kioskLandingPage.goToAdvancedCustomization();
    });

    it("should navigate to advanced customization id148", async function() {
        expect(await kioskLandingPage.elements.customizeYourKioskLink.getText()).toBe(
            "Customize your kiosk",
        );
    });

    it("should add fiat amount to kiosk link", async function() {
        await kioskLandingPage.elements.amountInFiatField.sendKeys("10");
        expect(await kioskLandingPage.elements.amountInFiatField.getAttribute("value")).toBe("10");
    });

    it("should add payment type to kiosk link id150", async function() {
        await kioskLandingPage.elements.paymentTypeFieldSelect.click();
        await kioskLandingPage.elements.paymentTypeFieldSearch.sendKeys("Gift");
        await kioskLandingPage.elements.paymentTypeFieldResults.first().click();
        expect(await kioskLandingPage.elements.paymentTypeField.getAttribute("value")).toBe(
            "gift-cards",
        );
    });

    it("should add currency to kiosk link id149", async function() {
        await kioskLandingPage.elements.selectACurrencyFieldSelect.click();
        await element(by.cssContainingText(".select2-results__option", "US")).click();
        expect(await kioskLandingPage.elements.selectACurrencyField.getAttribute("value")).toBe(
            "USD",
        );
    });

    it("should add payment method to kiosk link id151", async function() {
        await kioskLandingPage.elements.paymentMethodFieldSelect.click();
        await kioskLandingPage.elements.paymentMethodFieldSearch.sendKeys("Amazon");
        await kioskLandingPage.elements.paymentMethodFieldResults.first().click();
        expect(await kioskLandingPage.elements.paymentMethodField.getAttribute("value")).toBe(
            "amazon-gift-card",
        );
    });

    it("should add offer id to kiosk link id152", async function() {
        await kioskLandingPage.elements.offerField.sendKeys("offerHash");
        expect(await kioskLandingPage.elements.offerField.getAttribute("value")).toBe("offerHash");
    });
});
