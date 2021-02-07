import qaHelper from '../../utils/qaHelper';
import {$, browser} from "protractor";

class KioskDasboardPage {
    elements = {
        kioskSkinsButton: $(".qa-kiosk-skins-btn"),
        customizeYourKioskLinkButton: $(".qa-customize-kiosk-skins-btn"),
    };

    async go() {
        await browser.get(browser.params.baseUrl + '/kiosk/dashboard'); //overrides baseURL
    }

    async checkPageLoaded() {
        await qaHelper.toBeVisible(this.elements.kioskSkinsButton, 15000, `Can't open the Kiosk dashboard page`);
    }
}
export default new KioskDasboardPage();
