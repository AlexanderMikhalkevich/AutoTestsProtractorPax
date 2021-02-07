import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import dashboardPage from "../../../pages/dashboardPO";

let notVerifiedUser;

describe("Classic dashboard of a not verified user", () => {
    beforeAll(async () => {
        notVerifiedUser = await qaHelper.createRandomUser();
        await qaHelper.toggleKycVerification(notVerifiedUser.id, {id: true, document: false});
        await qaHelper.createSpecificOffer({
            user_id: notVerifiedUser.id,
            type: "buy",
            range_min: 10,
            range_max: 100,
        });
        await qaHelper.toggleKycVerification(notVerifiedUser.id, {id: true, document: false}); // unverify
        await loginPage.logInAccount(notVerifiedUser.email);
        await dashboardPage.goClassicDashboardLoggedIn();
        await dashboardPage.switchToBuyOffersTab();
    });

    it('should show the "you need to verify your ID" warning message under BUY offers id5372', async () => {
        expect(await dashboardPage.elements.verifyYourIDWarning.isDisplayed()).toBeTruthy();
    });

    it('should show the "your BUY offers are invisible" if balance < 0.02 id5375', async () => {
        await dashboardPage.checkBalanceRequiredAndMinAmountCoveredMsg(10);
    });

    it('should NOT show the "your BUY offers are invisible" if balance >= 0.02 id5378', async () => {
        await qaHelper.addBalance(notVerifiedUser.id, 2000000);
        await dashboardPage.goClassicDashboardLoggedIn();
        await dashboardPage.switchToBuyOffersTab();
        await dashboardPage.checkBalanceRequiredAndMinAmountCoveredMsg(10, false);
    });
});
