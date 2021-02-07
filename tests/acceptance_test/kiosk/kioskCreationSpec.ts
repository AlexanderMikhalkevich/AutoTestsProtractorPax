import qaHelper from "../../../utils/qaHelper";
import kioskLandingPage from "../../../pages/kiosk/kioskLandingPO";
import loginPage from "../../../pages/loginPO";

describe("Kiosk", function() {
    let userData, password;

    beforeAll(async function() {
        await qaHelper.resetState();
        userData = await qaHelper.getRandomUserData();
        password = await qaHelper.getRandomFakeNumber();
    });

    it("should go to kiosk landing page", async function() {
        await kioskLandingPage.go();
        await kioskLandingPage.checkPageLoaded();
    });

    it("should create a kiosk account id144", async function() {
        await kioskLandingPage.go();
        await kioskLandingPage.elements.emailField.sendKeys(userData.email);
        await kioskLandingPage.elements.affiliateNameField.sendKeys(userData.nick);
        await kioskLandingPage.elements.passwordField.sendKeys(password);
        await kioskLandingPage.elements.createAccountButton.click();
        expect(await loginPage.elements.message.getText()).toBe(
            "Your Kiosk account has been created.\n" +
                "Next customize your Kiosk Link to begin earning now.",
        );
    });
});
