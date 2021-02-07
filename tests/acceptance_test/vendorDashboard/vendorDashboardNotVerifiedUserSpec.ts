import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import dashboardPage from "../../../pages/dashboardPO";

let notVerifiedUser;

describe("Vendor dashboard of a not verified user", () => {
    beforeAll(async () => {
        notVerifiedUser = await qaHelper.createRandomUser(true);
        await qaHelper.toggleKycVerification(notVerifiedUser.id);
        await qaHelper.createSpecificOffer({
            user_id: notVerifiedUser.id,
            type: "buy",
            range_min: 10,
            range_max: 100,
        });
        await qaHelper.toggleKycVerification(notVerifiedUser.id); // unverify
        await loginPage.logInAccount(notVerifiedUser.email);
    });

    it('should show the "you need to verify your ID" warning message under BUY offers id5379', async () => {
        await dashboardPage.switchToBuyOffersTab();
        expect(await dashboardPage.elements.verifyYourIDWarning.getText()).toEqual("Offer is not visible because you need to verify your ID. Click here to start the verification process. It will only take a few moments!");
    });
});
