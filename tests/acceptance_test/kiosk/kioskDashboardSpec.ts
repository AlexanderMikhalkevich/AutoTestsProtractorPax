import qaHelper from '../../../utils/qaHelper';
import kioskDashboardPage from '../../../pages/kiosk/kioskDashboardPO';
import loginPage from '../../../pages/loginPO';


describe('Kiosk dashboard', function(){
    beforeAll(async function(){
        this.user = await qaHelper.createRandomUser();
        await loginPage.logInAccount(this.user.email);
    });

    it('should go to kiosk dashboard page id146', async function(){
        await kioskDashboardPage.go();
        await kioskDashboardPage.checkPageLoaded();
    });
});