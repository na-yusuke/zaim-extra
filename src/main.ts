function main(): void {
  try {
    initializeApplication();
    processRakutenPayEmails();
  } catch (error) {
    console.error('Application execution error:', error);
    throw error;
  }
}

function initializeApplication(): void {
  registerZaimApiKey();
  doZaimAuth();
}

function processRakutenPayEmails(): void {
  const categoryList = getCategoryList();
  const genreList = getGenreList();
  const accountList = getAccountList();
  const rakutenPayId = getRakutenPayId(accountList);

  if (!rakutenPayId) {
    throw new Error('Rakuten Pay account not found');
  }

  eachMessage("from:no-reply@pay.rakuten.co.jp subject:楽天ペイアプリご利用内容確認メール is:unread ", (message: GoogleAppsScript.Gmail.GmailMessage) => {
    processEmailMessage(message, categoryList, genreList, rakutenPayId);
  });
}

function processEmailMessage(
  message: GoogleAppsScript.Gmail.GmailMessage,
  categoryList: any,
  genreList: any,
  rakutenPayId: string
): void {
  try {
    const emailData = parseEmailContent(message);
    const [categoryId, genreId] = getCategoryAndGenre(emailData.shopName, categoryList, genreList);

    const result = callPostPaymentApi(
      categoryId,
      genreId,
      emailData.amount,
      emailData.date,
      rakutenPayId,
      emailData.shopName
    );

    console.log('Payment registration completed:', result);
  } catch (error) {
    console.error('Email processing error:', error);
  }
}

function parseEmailContent(message: GoogleAppsScript.Gmail.GmailMessage): any {
  const body = message.getBody();
  const normalizedText = body.replace(/\r\n|\r|\n/g, ' ');

  return {
    date: getDate(normalizedText),
    shopName: getShopName(normalizedText),
    amount: getTotalSettlement(normalizedText)
  };
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
