import qaHelper from "../../../utils/qaHelper";
import userProfilePage from "../../../pages/userProfilePO";
import settingsPage from "../../../pages/settingsPO";
import loginPO from "../../../pages/loginPO";
import {browser} from "protractor";
let notVerifiedUser, idVerifiedUser, partnerUser, testOffer, finishedTrade, loggedUser;

describe('User public profile', () => {
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
                await qaHelper.toggleKycVerification(idVerifiedUser.id);
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedUser.id,
                    type: 'buy'
                });
            })(),
            (async () => {
                partnerUser = await qaHelper.createRandomUser(true);
                await qaHelper.addBalance(partnerUser.id, 500000000);
                await qaHelper.toggleKycVerification(partnerUser.id, {id: true, document: false});
            })(),
            (async () => {
                loggedUser = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(loggedUser.id);
                await qaHelper.togglePhoneVerification(loggedUser.id, '+3726000007');
                await qaHelper.removeRestriction(loggedUser.id);

                await loginPO.logInAccount(loggedUser.email);
                await settingsPage.go(); //fill bio
                await settingsPage.addBioInSettings();
            })(),
        ]);
        testOffer = await qaHelper.createOffer(partnerUser.id, 'usd', 500, 1, 'sell');
        await qaHelper.startTrade({
            user_id: loggedUser.id,
            offer_hash: testOffer,
            amount_fiat: 500
        });
        finishedTrade = await qaHelper.startTrade({
            user_id: loggedUser.id,
            offer_hash: testOffer,
            amount_fiat: 500
        });
        await qaHelper.releaseInTrade(finishedTrade.id_hashed);
    });

    it('should show user\'s buy offers (Sell cryptocurrency tab) in case the user is ID verified id5366', async () => {
        await userProfilePage.go(idVerifiedUser.nick);
        await userProfilePage.switchActiveOffersToSellCryptocurrencyTab();
        expect(await userProfilePage.getActiveOffersCount()).toEqual(1);
    });

    it('should NOT show user\'s buy offers (Sell cryptocurrency tab) in case the user is NOT verified id5367', async () => {
        await userProfilePage.go(notVerifiedUser.nick);
        await userProfilePage.switchActiveOffersToSellCryptocurrencyTab();
        expect(await userProfilePage.getActiveOffersCount()).toEqual(0);
    });

    it('should show bio on profile page id6566', async () => {
        await userProfilePage.go(loggedUser.nick);
        expect(await userProfilePage.elements.bio.getText()).toContain(userProfilePage.text.bio);
    });

    it('should show active trades table when there is active trades id6564', async () => {
        await userProfilePage.go(partnerUser.nick);
        expect(await userProfilePage.elements.activeTradesTable.isPresent()).toBeTruthy();
    });

    it('should show past trade table when there was trades in the past id6565', async () => {
        await userProfilePage.go(partnerUser.nick);
        expect(await userProfilePage.elements.pastTradesTable.isPresent()).toBeTruthy();
    });

    it('should allow user to trust another one id6559', async () => {
        await userProfilePage.go(partnerUser.nick);
        await userProfilePage.pressTrustButton();
        expect(await userProfilePage.elements.flushMessage.getText()).toContain(userProfilePage.text.trustMessage);
        expect(await userProfilePage.elements.trustButton.getText()).toBe(userProfilePage.text.untrustButton);
    });

    it('should not allow unverified user to block another one id38797', async () => {
        await userProfilePage.go(notVerifiedUser.nick);
        await userProfilePage.pressBlockButton();
        expect(await userProfilePage.elements.flushMessage.getText()).toContain(userProfilePage.text.cantBlockMessage);
        expect(await userProfilePage.elements.blockButton.getText()).toBe(userProfilePage.text.blockButton);
    });

    it('should allow user to block another one id6561', async () => {
        await qaHelper.toggleKycVerification(loggedUser.id, { id: true });
        await userProfilePage.go(idVerifiedUser.nick);
        await userProfilePage.pressBlockButton();
        expect(await userProfilePage.elements.flushMessage.getText()).toContain(userProfilePage.text.blockMessage);
        expect(await userProfilePage.elements.blockButton.getText()).toBe(userProfilePage.text.unblockButton);
    });

    describe('', () => {
        let trustedUser, blockedUser;

        beforeAll(async () => {
            trustedUser = await qaHelper.createRandomUser();
            await userProfilePage.go(trustedUser.nick);
            await userProfilePage.elements.trustButton.click();

            blockedUser = await qaHelper.createRandomUser();
            await userProfilePage.go(blockedUser.nick);
            await userProfilePage.elements.blockButton.click();
        });

        it('should allow user to untrust trusted user id6560', async () => {
            await userProfilePage.go(trustedUser.nick);
            await userProfilePage.pressTrustButton();
            expect(await userProfilePage.elements.flushMessage.getText()).toContain(userProfilePage.text.untrustMessage);
            expect(await userProfilePage.elements.trustButton.getText()).toBe(userProfilePage.text.trustButton);
        });

        it('should allow user to unblock another one id6562', async () => {
            await userProfilePage.go(blockedUser.nick);
            await userProfilePage.pressBlockButton();
            expect(await userProfilePage.elements.flushMessage.getText()).toContain(userProfilePage.text.unblockMessage);
            expect(await userProfilePage.elements.blockButton.getText()).toBe(userProfilePage.text.blockButton);
        });
    });
});
