import qaHelper from '../../utils/qaHelper';
import {$, browser, by, element} from "protractor";

class KioskSkinsPage {
    elements = {
        darkColor: $('#skin-list > div:nth-child(3)'),
        activeColor: $('#skin-list > div.item.active'),
        saveButton: $('#save-btn > span.ladda-label'),
        saveSuccessMessage: $('#skin-list > div.style-msg.successmsg')
    };

    async go() {
        await browser.get(browser.params.baseUrl + '/kiosk/skins'); //overrides baseURL
    }

    async checkPageLoaded() {
        await qaHelper.toBeVisible(this.elements.darkColor, 15000, `Can't open the Kiosk skins page`);
    }
}
export default new KioskSkinsPage();