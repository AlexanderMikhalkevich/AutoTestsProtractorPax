import {$} from "protractor";
import converter from "../utils/converter";

class HeaderComponent {
    elements = {
        userBalance: $('#user-btc-balance'),
    };

    async getUserBalanceInBtc() : Promise<number> {
        return parseFloat((await this.elements.userBalance.getText()).trim());
    }

    async getUserBalanceInSatoshi() : Promise<number> {
        return converter.btcToSatoshi(await this.getUserBalanceInBtc());
    }
}

export default new HeaderComponent();