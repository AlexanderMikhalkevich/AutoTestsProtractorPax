import { $, browser } from "protractor";

import tradeChatHeaderComponent from "./tradeChatHeaderComponent";

class MoreInfoSidePanelComponent {
    elements = {
        closeButton: $(".qa-user-info-header button"),
        userNick: $(".qa-counterpart-username"),
        positiveFeedback: $(".qa-user-reputation-positive"),
        negativeFeedback: $(".qa-user-reputation-negative"),
        lastSeen: $(".qa-trade-sidebar-user-last-seen"),
        emailVerified: $(".qa-trade-sidebar-email_verification-verified"),
        phoneVerified: $(".qa-trade-sidebar-phone_verification-verified"),
        idVerified: $(".qa-trade-sidebar-id_verification-verified"),
        name: $(".qa-trade-sidebar-user-name"),
        joined: $(".qa-trade-sidebar-trade-info span:nth-child(1)"),
        partners: $(".qa-trade-sidebar-trade-info span:nth-child(3)"),
        trades: $(".qa-trade-sidebar-trade-info span:nth-child(4)"),
        btcTraded: $(".qa-trade-sidebar-trade-info span:nth-child(5)"),
        trustedBy: $(".qa-trade-sidebar-trade-info span:nth-child(6)"),
        blockedBy: $(".qa-trade-sidebar-trade-info span:nth-child(7)"),
        location: $(".qa-trade-sidebar-user-detected-location"),
        ipLocation: $(".qa-trade-sidebar-user-ip-location"),
        tabs: {
            about: $(".qa-collapse-about > button"),
            tradingInfo: $(".qa-collapse-trade-info > button"),
            sharedFiles: $(".qa-collapse-attachments > button"),
        },
    };

    async open(): Promise<void> {
        await tradeChatHeaderComponent.elements.moreInfo.click();
        await browser.sleep(500);
    }

    async close(): Promise<void> {
        await this.elements.closeButton.click();
        await browser.sleep(500);
    }

    async toggleAboutTab() {
        await this.elements.tabs.about.click();
        await browser.sleep(500);
    }

    async toggleTradingInfoTab() {
        await this.elements.tabs.tradingInfo.click();
        await browser.sleep(500);
    }

    async toggleSharedFilesTab() {
        await this.elements.tabs.sharedFiles.click();
        await browser.sleep(500);
    }
}

export default new MoreInfoSidePanelComponent();
