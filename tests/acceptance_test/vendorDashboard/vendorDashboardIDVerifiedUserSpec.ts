import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import dashboardPage from "../../../pages/dashboardPO";

let idVerifiedUser;

describe("Vendor dashboard of an ID verified user", () => {
    beforeAll(async () => {
        idVerifiedUser = await qaHelper.createRandomUser(true);
        await qaHelper.toggleKycVerification(idVerifiedUser.id);
        await qaHelper.createSpecificOffer({
            user_id: idVerifiedUser.id,
            type: "buy",
            range_min: 10,
            range_max: 100,
        });
        await loginPage.logInAccount(idVerifiedUser.email);
        await dashboardPage.goVendorDashboardLoggedIn();
    });

    it('should NOT show the "you need to verify your ID" warning message under BUY offers id5381', async () => {
        await qaHelper.scrollToElement(dashboardPage.elements.vendorDashboardPage.myOffers);
        expect(await dashboardPage.elements.verifyYourIDWarning.isPresent()).toBeFalsy();
    });
});
