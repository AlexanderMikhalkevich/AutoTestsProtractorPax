import { $, $$, browser, by, element } from 'protractor';

class TradeChatHeaderComponent {
    elements = {
        userNick: $(".qa-trade-messaging-header .qa-username"),
        positiveFeedback: $(".qa-trade-messaging-header .qa-user-feedback-positive"),
        negativeFeedback: $(".qa-trade-messaging-header .qa-user-feedback-negative"),
        location: $(".qa-trade-messaging-header .qa-user-location"),
        tooltipLocation: $(".qa-trade-messaging-header .qa-user-country-tooltip"),
        // last seen text doesn't have its own element and protractor can't work with text nodes, so the only way is to take its wrapper
        lastSeenWrapper: $(".qa-trade-messaging-header .qa-user-last-seen"),
        phoneVerified: $(".qa-trade-messaging-header #phone_verification"),
        idVerified: $(".qa-trade-messaging-header #id_verification"),
        moreInfo: $$(".qa-drawer-show-more")
            .filter((el) => el.isDisplayed())
            .first(),
    };

    async getLocation(): Promise<string> {
        return await this.elements.location.getAttribute("data-qa-value");
    }
}

export default new TradeChatHeaderComponent();
