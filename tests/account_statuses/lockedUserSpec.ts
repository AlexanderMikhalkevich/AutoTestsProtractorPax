import qaHelper from '../../utils/qaHelper';
import loginPage from '../../pages/loginPO';
import lockedPage from '../../pages/lockedPO';

describe('Locked status -', () => {
    let notVerifiedLockedUser, verifiedLockedUser;

    beforeAll(async () => {
        notVerifiedLockedUser = await qaHelper.createRandomUser();
        await qaHelper.updateUserstatus(notVerifiedLockedUser.id, 'locked');

        verifiedLockedUser = await qaHelper.createRandomUser();
        await qaHelper.activateEmail(verifiedLockedUser.id);
        await qaHelper.updateUserstatus(verifiedLockedUser.id, 'locked');
    });

    describe('locked user with verified email', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(verifiedLockedUser.email, null, true);
        });

        it('should not allow to login and show error message (email is sent) when user is locked and email is verified id6610', async () => {
            expect(lockedPage.isNotLoggedIn()).toBeTruthy();
            expect(await lockedPage.elements.unlockInstructions.getText()).toBe(lockedPage.text.unlockInstructionsVerifiedText);
            expect(await lockedPage.elements.accountLockedMsg.getText()).toBe(lockedPage.text.accountLockedMsgText);

        });
    });

    describe('locked user with unverified email', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(notVerifiedLockedUser.email, null, true);
        });

        it('should not allow to login and show error message (contact support) when user is locked and email is not verified id5137', async () => {
            expect(await lockedPage.isNotLoggedIn()).toBeTruthy();
            expect(await lockedPage.elements.unlockInstructions.getText()).toBe(lockedPage.text.unlockInstructionsNotVerifiedText);
            expect(await lockedPage.elements.accountLockedMsg.getText()).toBe(lockedPage.text.accountLockedMsgText);
            expect(await lockedPage.elements.emailNotVerifiedText.isPresent()).toBeTruthy();
        });
    });
});
