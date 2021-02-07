import {by, element} from "protractor";

class NotificationPage {
    elements = {
        viewAllNotificationContent: element(by.linkText('The escrow fee for Amazon Gift Card had been changed from 1% to 33.33%'))
    };

    async findViewAllNotification(message) {
        const notification = this.elements.viewAllNotificationContent;
        expect(await notification.getText()).toBe(message);
    }
}

export default new NotificationPage();