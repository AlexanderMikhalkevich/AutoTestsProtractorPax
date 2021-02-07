import qaHelper from '../../../utils/qaHelper';
import kioskSkinsPage from '../../../pages/kiosk/kioskSkinsPO';
import loginPage from '../../../pages/loginPO';


describe('Kiosk skins page', function () {
    beforeAll(async function () {
        this.user = await qaHelper.createRandomUser();
        await loginPage.logInAccount(this.user.email);
    });

    it('should save kiosk color id145', async function () {
        await kioskSkinsPage.go();
        await kioskSkinsPage.elements.darkColor.click();
        await kioskSkinsPage.elements.saveButton.click();
        expect(await kioskSkinsPage.elements.saveSuccessMessage.getText()).toBe('Theme changed!');
    });
});
