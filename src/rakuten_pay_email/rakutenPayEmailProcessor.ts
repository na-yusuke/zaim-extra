class RakutenPayEmailProcessor {
    constructor() { }

    getPurchaseRecords(): PurchaseRecord[] {
        let purchaseRecords: PurchaseRecord[] = [];
        eachMessage(GMAIL_SEARCH_CRITERIA, (message: GoogleAppsScript.Gmail.GmailMessage) => {
            try {
                const purchaseRecord = this._extractPurchaseRecord(message);
                purchaseRecords.push(purchaseRecord)
            } catch (error) {
                console.error('email processing error:', error);
            }
        });
        return purchaseRecords;
    }

    _extractPurchaseRecord(message: GoogleAppsScript.Gmail.GmailMessage): PurchaseRecord {
        const normalizedText = message.getBody().replace(/\r\n|\r|\n/g, ' ');
        return {
            date: this._getDate(normalizedText),
            shopName: this._getShopName(normalizedText),
            amount: this._getTotalSettlement(normalizedText)
        };
    }

    _getDate(normalizedText: string): string {
        try {
            const dateMatch = /ご利用日時.*/.exec(normalizedText);
            if (!dateMatch) {
                throw new Error('Usage date is not found');
            }

            const value = this._extractValueFromHtmlText(dateMatch[0]);
            const dateParts = value.split(/[\/()]/);

            if (dateParts.length < 3) {
                throw new Error('Invalid date format');
            }

            return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        } catch (error) {
            console.error('Date extraction error:', error);
            throw error;
        }
    }

    _getShopName(normalizedText: string): string {
        try {
            const shopMatch = /ご利用店舗.*/.exec(normalizedText);
            if (!shopMatch) {
                throw new Error('Shop name is not found');
            }

            return this._extractValueFromHtmlText(shopMatch[0]);
        } catch (error) {
            console.error('Shop name extraction error:', error);
            throw error;
        }
    }

    _getTotalSettlement(normalizedText: string): string {
        try {
            const amountMatch = /決済総額.*/.exec(normalizedText);
            if (!amountMatch) {
                throw new Error('Settlement amount not found');
            }

            let value = this._extractValueFromHtmlText(amountMatch[0]);
            value = value.replace(/&yen;/gi, '');
            value = value.replace(/,/gi, '');

            if (!value || isNaN(Number(value))) {
                throw new Error('Invalid amount format');
            }

            return value;
        } catch (error) {
            console.error('Amount extraction error:', error);
            throw error;
        }
    }

    _extractValueFromHtmlText(htmlText: string): string {
        try {
            const tableCellMatches = htmlText.match(/<td(?: .+?)?>.*?<\/td>/g);
            if (!tableCellMatches || tableCellMatches.length === 0) {
                throw new Error('HTML table cell not found');
            }

            let value = tableCellMatches[0].replace(/(<([^>]+)>)/gi, '');
            value = value.replace(/ /gi, '');

            if (!value.trim()) {
                throw new Error('Extracted value is empty');
            }

            return value;
        } catch (error) {
            console.error('HTML value extraction error:', error);
            throw error;
        }
    }

}

function eachMessage(criteria: string, callback: (message: GoogleAppsScript.Gmail.GmailMessage) => void): void {
    try {
        const threads = GmailApp.search(criteria);

        threads.forEach((thread: GoogleAppsScript.Gmail.GmailThread) => {
            const messages = thread.getMessages();

            messages.forEach((message: GoogleAppsScript.Gmail.GmailMessage) => {
                callback(message);
                message.markRead();
            });
        });
    } catch (error) {
        console.error('Gmail search error:', error);
        throw error;
    }
}