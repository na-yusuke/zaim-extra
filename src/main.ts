function main(): void {
  try {
    const authResult = authZaimApplication();
    if (!authResult) {
      console.error('Application initialization failed, canceling subsequent processing');
      return;
    }
    processRakutenPayEmails();
  } catch (error) {
    console.error('Application execution error:', error);
    throw error;
  }
}

function authZaimApplication(): boolean {
  try {
    registerZaimApiKey();
    const zaimApi = new ZaimApi();
    const authResult = zaimApi.doZaimAuth();

    if (!authResult.success) {
      console.error('Zaim authentication failed:', authResult.error);
      return false;
    }

    if (authResult.authUrl) {
      console.log('Please authenticate using the provided URL and run the script again');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Application initialization error:', error);
    return false;
  }
}

function processRakutenPayEmails(): void {
  const purchaseRecords = getPurchaseRecords();
  if (purchaseRecords.length === 0) return;

  const zaimContext = setupZaimContext();
  if (!zaimContext) return;

  registerPayments(purchaseRecords, zaimContext);
}

function getPurchaseRecords(): PurchaseRecord[] {
  const rakutenPayEmailProcessor = new RakutenPayEmailProcessor();
  const purchaseRecords = rakutenPayEmailProcessor.getPurchaseRecords();
  
  if (purchaseRecords.length === 0) {
    console.log('Cannot find new purchase records.');
  }
  
  return purchaseRecords;
}

interface ZaimContext {
  api: ZaimApi;
  categoryList: CategoryListResponse;
  genreList: GenreListResponse;
  rakutenPayId: string;
}

function setupZaimContext(): ZaimContext | null {
  const zaimApi = new ZaimApi();
  const categoryList = zaimApi.getCategoryList();
  const genreList = zaimApi.getGenreList();
  const accountList = zaimApi.getAccountList();

  if (!categoryList || !genreList || !accountList) {
    console.error('Failed to retrieve Zaim data lists, canceling email processing');
    return null;
  }

  const rakutenPayId = getAccountId(accountList, ACCOUNT_NAMES.RAKUTEN_PAY);
  if (!rakutenPayId) {
    console.error('Rakuten Pay account not found, canceling email processing');
    return null;
  }

  return { api: zaimApi, categoryList, genreList, rakutenPayId };
}

function registerPayments(purchaseRecords: PurchaseRecord[], context: ZaimContext): void {
  for (const purchaseRecord of purchaseRecords) {
    registerSinglePayment(purchaseRecord, context);
  }
}

function registerSinglePayment(record: PurchaseRecord, context: ZaimContext): void {
  try {
    const [categoryId, genreId] = getCategoryAndGenre(record.shopName, context.categoryList, context.genreList);
    const result = context.api.postPayment(
      categoryId,
      genreId,
      record.amount,
      record.date,
      context.rakutenPayId,
      record.shopName
    );

    if (result) {
      console.log('Payment registration completed:', result);
    } else {
      console.warn('Payment registration failed for:', record.shopName);
    }
  } catch (error) {
    console.error('Email processing error:', error);
  }
}
