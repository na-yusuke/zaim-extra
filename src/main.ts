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
  const zaimApi = new ZaimApi();
  zaimApi.doZaimAuth();
}

function processRakutenPayEmails(): void {
  const zaimApi = new ZaimApi();
  const categoryList = zaimApi.getCategoryList();
  const genreList = zaimApi.getGenreList();
  const accountList = zaimApi.getAccountList();
  const rakutenPayId = getAccountId(accountList, ACCOUNT_NAMES.RAKUTEN_PAY);

  if (!rakutenPayId) {
    throw new Error('Rakuten Pay account not found');
  }

  eachMessage(GMAIL_SEARCH_CRITERIA, (message: GoogleAppsScript.Gmail.GmailMessage) => {
    processEmailMessage(message, categoryList, genreList, rakutenPayId, zaimApi);
  });
}

function processEmailMessage(
  message: GoogleAppsScript.Gmail.GmailMessage,
  categoryList: CategoryListResponse,
  genreList: GenreListResponse,
  rakutenPayId: string,
  zaimApi: ZaimApi
): void {
  try {
    const emailData = parseEmailContent(message);
    const [categoryId, genreId] = getCategoryAndGenre(emailData.shopName, categoryList, genreList);

    const result = zaimApi.postPayment(
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

function parseEmailContent(message: GoogleAppsScript.Gmail.GmailMessage): ParsedEmailData {
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
