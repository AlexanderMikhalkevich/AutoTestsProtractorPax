import { $, $$, browser, by, element, ElementFinder, ExpectedConditions as EC } from "protractor";

class TradeChatComponent {
    elements = {
        messageInput: $(".qa-message-input"),
        sendMessageButton: $(".qa-message-submit"),
        chatIsLoadingLabel: $('.qa-chat-skeleton'),
        messages: $$(".qa-messages-list"),
    };

    async waitForChatToBeLoaded(): Promise<void> {
        await browser.wait(EC.invisibilityOf(this.elements.chatIsLoadingLabel), 5000, 'chat loading element should not be shown');
        await browser.wait(EC.visibilityOf(this.getNthMessage("last")), 5000, 'can not get the last message');
    }

    async sendMessage(message: string): Promise<void> {
        await this.elements.messageInput.clear();
        await this.elements.messageInput.sendKeys(message);
        await this.elements.sendMessageButton.click();
        // await browser.wait(EC.elementToBeClickable(this.elements.sendMessageButton));
    }

    async getMessagesCount(): Promise<number> {
        return await this.elements.messages.count();
    }

    getNthMessage(n: number | "last"): ElementFinder {
        return element(
            by.xpath(
                `//div[contains(@class, "qa-messages-list")]/div[${
                    n === "last" ? "last()" : n
                }]//*[contains(@class, "qa-chat-message")]`,
            )
        );
    }

    async getNthMessageText(n: number | "last"): Promise<string> {
        await this.waitForChatToBeLoaded();
        return await this.getNthMessage(n).getText();
    }

    async getLastMessageText(): Promise<string> {
        return await this.getNthMessageText("last");
    }

    async getFirstMessageText(): Promise<string> {
        return await this.getNthMessageText(1);
    }
}

export default new TradeChatComponent();
