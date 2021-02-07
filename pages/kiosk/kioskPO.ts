import qaHelper from '../../utils/qaHelper';
import {$, browser, by, element} from "protractor";

class KioskPage {
    elements = {
        loginEmail: $('#login_email'),
        loginPassword: $('#login_password'),
        logInSubmit: element(by.buttonText('Log in')),
        registerKiosk: $('#header-cta'),
        nextStep: $('#next_step'),
        markPaidButton: $('#mark_paid_btn'),
    };

    async go() {
        await browser.get(browser.params.baseUrl + '/buy-bitcoin-kiosk'); //overrides baseURL
    }

    async checkPageLoaded() {
        await qaHelper.toBeVisible(this.elements.registerKiosk, 15000, `Can't open the Kiosk page`);
    }

    async createKioskLink(affiliate: string, amount: number, offerHash: string){
        return `${browser.params.baseUrl}/roots/buy-bitcoin/index?affiliate=${affiliate}&fiat_amount=${amount}&offer=${offerHash}`;
    }
}

export default new KioskPage();
