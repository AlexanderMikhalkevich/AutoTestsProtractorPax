import qaHelper from "../../utils/qaHelper";
import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";
import moreInfoSidePanelComponent from "./moreInfoSidePanelComponent";

class PublicReceiptPage {
    elements = {
        receiptContainer: $("div.receipt-page"),
        header: $("div.receipt-page h1"),
        bitcoinsAmountHeader: $("div.receipt-page h2"),
        tradeIdHeader: $$("div.receipt-page h3").first(),
        amountPaid: $$("div.receipt-page h4").first(),
        paymentMethod: $$("div.receipt-page h4").get(1),
        startedAtHeader: $$(".feature-box h3").first(),
        startedAt: $$(".feature-box p").first(),
        completedAtHeader: $$(".feature-box h3").last(),
        completedAt: $$(".feature-box p").last(),
        helpBlock: $(".help-block"),
        sellerLink: $$(".testimonials-grid a").first(),
        sellerLastSeen: $$(".testimonials-grid span").first(),
        buyerLink: $$(".testimonials-grid a").last(),
        buyerLastSeen: $$(".testimonials-grid span").last(),
        termsHeader: $("#content > div > div > div > div:nth-child(8) > div > h4:nth-child(1)"),
        termsText: $("#content > div > div > div > div:nth-child(8) > div > p:nth-child(2)"),
        instructionsHeader: $(
            "#content > div > div > div > div:nth-child(8) > div > h4:nth-child(3)",
        ),
        instructionsText: $("#content > div > div > div > div:nth-child(8) > div > p:nth-child(4)"),
        cryptographicHeader: $("#content > div > div > div > div:nth-child(9) > div > h4"),
        cryptographicText: $(".jumbotron"),
    };

    async openReceipt(tradeHash: string): Promise<void> {
        await browser.get(`${browser.params.baseUrl}/trade/receipt/${tradeHash}`);
        await this.checkPageLoaded();
    }

    async checkPageLoaded(): Promise<void> {
        await browser.wait(
            EC.visibilityOf(this.elements.receiptContainer),
            5000,
            "Can not load the public receipt page",
        );
    }
}

export default new PublicReceiptPage();
