import User from "../../../../utils/IUser";
import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import dashboardPage from "../../../../pages/dashboardPO";
import createOfferPage from "../../../../pages/createOfferPO";
import {browser} from "protractor";

let notVerifiedUser, idVerifiedUser;

describe('Edit offer', () => {
    beforeAll(async () => {
        await Promise.all([
            (async () => {
                notVerifiedUser = await qaHelper.createRandomUser();
                await qaHelper.toggleKycVerification(notVerifiedUser.id);
                await qaHelper.createSpecificOffer({
                    user_id: notVerifiedUser.id,
                    type: 'buy'
                });
                await qaHelper.toggleKycVerification(notVerifiedUser.id); // unverify
            })(),
            (async () => {
                idVerifiedUser = await qaHelper.createRandomUser();
                await qaHelper.toggleKycVerification(idVerifiedUser.id, {id: true, document: false});
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedUser.id,
                    type: 'buy'
                });
            })()
        ]);
    });

    it('should be impossible to start editing BUY offers for a not verified user id5360', async () => {
        await loginPage.logInAccount(notVerifiedUser.email);
        try {
            await dashboardPage.openEditFormForNthOfferFromList(1);
        } catch (e) {}
        expect(await browser.getCurrentUrl()).toEqual(browser.params.baseUrl + "/dashboard"); // expect user to still be on the same page because edit offer page should not be opened
    });

    it('should be possible to edit BUY offers for an ID verified user id5362', async () => {
        await loginPage.logInAccount(idVerifiedUser.email);
        await dashboardPage.switchToBuyOffersTab();
        await dashboardPage.openEditFormForNthOfferFromList(1);
        await createOfferPage.clickNextStepButton();
        await createOfferPage.clickNextStepButton();
        await createOfferPage.clickNextStepButton();
        expect(await browser.getCurrentUrl()).toEqual(browser.params.baseUrl + "/vendor/dashboard?action=update");
    });
});
