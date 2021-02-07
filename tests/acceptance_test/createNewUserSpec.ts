import {browser} from "protractor";
import homePage from '../../pages/homePagePO';

describe('Protractor Acceptance Tests', () => {
    it('should navigate to the paxful homepage', async () => {
        await homePage.go();
    });

    it('should open modal window with user account creation', async () => {
        await homePage.openCreateUserModal();
    });

    it('should have create user modal window open', async () => {
        await homePage.createUserModalLoaded();
    });

    it('should fill all fields for the new user', async () => {
        await homePage.fillAllFieldsForNewUser();
    });

    it('should press create new account and wallet', async () => {
        await homePage.pressCreateAccAndWallet();
        expect(await browser.getCurrentUrl()).toEqual(browser.params.baseUrl + "/dashboard");
    });
});