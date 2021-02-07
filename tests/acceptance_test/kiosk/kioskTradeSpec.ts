import qaHelper from "../../../utils/qaHelper";
import kioskLandingPage from "../../../pages/kiosk/kioskLandingPO";
import kioskPage from "../../../pages/kiosk/kioskPO";
import verificationStepPage from "../../../pages/kiosk/kioskVerificationStepPO";
import loginPage from "../../../pages/loginPO";
import dashboardPO from "../../../pages/dashboardPO";
import tradePO from "../../../pages/trade/tradePO";

describe("Kiosk trade", () => {
    let kioskOwner, buyer;
    let kioskLink;

    beforeAll(async () => {
        kioskOwner = await qaHelper.createRandomUser(true);
        await qaHelper.addBalance(kioskOwner.id, 100000000);
        await qaHelper.toggleKycVerification(kioskOwner.id, { id: true, document: false });
        await qaHelper.depositBond(kioskOwner.id);
        await qaHelper.updateUserStats(kioskOwner.id, 1, 20, 2, 3);
        await qaHelper.createOffer(kioskOwner.id, "usd", 10, 4, "sell");
        buyer = await qaHelper.createRandomUser();

        await loginPage.logInAccount(kioskOwner.email);
        await kioskLandingPage.goToAdvancedCustomization();
        await kioskLandingPage.elements.amountInFiatField.sendKeys("10");

        await kioskLandingPage.elements.selectACurrencyFieldSelect.click();
        await kioskLandingPage.elements.selectACurrencyFieldSearch.sendKeys("USD");
        await kioskLandingPage.elements.selectACurrencyFieldResults.first().click();

        await kioskLandingPage.elements.specificOfferField.click();
        await kioskLandingPage.elements.specificOfferFieldSearch.sendKeys("sell");
        await kioskLandingPage.elements.specificOfferFieldResults.first().click();

        kioskLink = await kioskLandingPage.elements.kioskLink.getAttribute("value");
        await loginPage.logInAccount(buyer.email);
    });

    it("should complete a trade id2535", async () => {
        await qaHelper.navigateToRawUrl(kioskLink);
        await kioskPage.elements.nextStep.click();
        await qaHelper.waitForPageToBeLoaded();

        // email verification step
        await verificationStepPage.pressVerifyButton();
        await verificationStepPage.fillInVerificationCode();
        await verificationStepPage.clickNextStepButton();

        // phone verification step
        //TODO need to make it use fake numbers
        await verificationStepPage.fillInPhoneNumber(37253754904);
        await verificationStepPage.pressVerifyByPhoneButton();
        await verificationStepPage.fillInVerificationCode();
        await verificationStepPage.clickStartTradeButton();
        await loginPage.logoutUser();
        await loginPage.logInAccount(kioskOwner.email);
        await dashboardPO.goClassicDashboardLoggedIn();
        await qaHelper.toBeVisible(
            dashboardPO.elements.activeTrades.activeTradesTable,
            15000,
            "No active trades",
        );
        await dashboardPO.closeLanguageModalIfOpened();
        await dashboardPO.openActiveTrade();
        await tradePO.releaseBitcoinsWithout2fa(true);
        expect(await tradePO.elements.successAlert.getText()).toContain(
            `Success! You’ve released Bitcoin to ${buyer.nick}. Don’t forget to leave your feedback.`,
        );
    });
});
