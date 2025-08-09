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
  const rakutenPayEmailProcessor = new RakutenPayEmailProcessor();
  const purchaseRecords: PurchaseRecord[] = rakutenPayEmailProcessor.getPurchaseRecords();

  if (purchaseRecords.length == 0) {
    return;
  }

  const zaimApi = new ZaimApi();
  const categoryList = zaimApi.getCategoryList();
  const genreList = zaimApi.getGenreList();
  const accountList = zaimApi.getAccountList();
  const rakutenPayId = getAccountId(accountList, ACCOUNT_NAMES.RAKUTEN_PAY);
  if (!rakutenPayId) {
    throw new Error('Rakuten Pay account not found');
  }

  for (const purchaseRecord of purchaseRecords) {
    try {
      const [categoryId, genreId] = getCategoryAndGenre(purchaseRecord.shopName, categoryList, genreList);

      const result = zaimApi.postPayment(
        categoryId,
        genreId,
        purchaseRecord.amount,
        purchaseRecord.date,
        rakutenPayId,
        purchaseRecord.shopName
      );

      console.log('Payment registration completed:', result);
    } catch (error) {
      console.error('Email processing error:', error);
    }
  }
}
