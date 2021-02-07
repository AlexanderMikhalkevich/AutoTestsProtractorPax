import qaHelper from '../../../utils/qaHelper';
import loginPage from '../../../pages/loginPO';
import settingsPage from '../../../pages/settingsPO';

describe('Settings', () => {
    let user;

    beforeAll(async () => {
        user = await qaHelper.createRandomUser();
        await qaHelper.activateEmail(user.id);
        await qaHelper.togglePhoneVerification(user.id, '+3726000012');
        await loginPage.logInAccount(user.email);
    });

    beforeEach(async () => {
        await settingsPage.go();
        await settingsPage.checkPageLoadedLoggedIn();
    });

    // TODO: scrollToTop is here because the site scrolls the page down when you click on a left side menu items. It's a bug
    it('opens every settings page id118', async () => {
        await settingsPage.openProfileTab();
        await settingsPage.openSecurityTab();
        await settingsPage.openDeveloperTab();
        await settingsPage.openSecurityQuestionsTab();
        await settingsPage.openVerificationTab();
    });
});
