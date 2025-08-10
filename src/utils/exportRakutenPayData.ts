function exportRakutenPayDataToSheet() {
  console.log('=== Export Rakuten Pay payment data to spreadsheet ===');

  const zaimApi = new ZaimApi();

  // Authentication check
  const authResult = zaimApi.doZaimAuth();
  if (!authResult.success) {
    console.error('Authentication failed:', authResult.error);
    return;
  }

  if (authResult.authUrl) {
    console.log('Authentication required. Please complete authentication at the following URL and run again:');
    console.log(authResult.authUrl);
    return;
  }

  // Get account information and identify Rakuten Pay ID
  console.log('Retrieving account information...');
  const accountList = zaimApi.getAccountList();
  if (!accountList) {
    console.error('Failed to retrieve account list');
    return;
  }

  const rakutenPayId = getAccountId(accountList, ACCOUNT_NAMES.RAKUTEN_PAY);
  if (!rakutenPayId) {
    console.error('Rakuten Pay account not found');
    return;
  }

  console.log('Rakuten Pay Account ID:', rakutenPayId);

  // Get all payment data
  console.log('Retrieving payment data...');
  const allPayments = zaimApi.getAllPayments();

  // Filter only Rakuten Pay payments
  const rakutenPayPayments = [];
  for (let i = 0; i < allPayments.length; i++) {
    const payment = allPayments[i];
    if (payment.from_account_id && payment.from_account_id.toString() === rakutenPayId) {
      rakutenPayPayments.push(payment);
    }
  }

  console.log('Rakuten Pay payment count:', rakutenPayPayments.length);

  if (rakutenPayPayments.length === 0) {
    console.log('No Rakuten Pay payment data found');
    return;
  }

  // Create or get spreadsheet
  let spreadsheet;
  try {
    // Specify folder name (change as needed)
    const folderName = 'zaim_支払いデータ';
    let folder;

    // Check if folder exists
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      folder = folders.next();
      console.log('Using existing folder:', folder.getName());
    } else {
      // Create folder if it doesn't exist
      folder = DriveApp.createFolder(folderName);
      console.log('Created new folder:', folder.getName());
    }

    // Create spreadsheet in specified folder
    const fileName = '楽天Pay支払いデータ_' + new Date().toISOString().split('T')[0];
    spreadsheet = SpreadsheetApp.create(fileName);

    // Move spreadsheet to specified folder
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);

    console.log('Spreadsheet created:', spreadsheet.getUrl());
    console.log('Save location:', folder.getName() + ' folder');
  } catch (error) {
    console.error('Failed to create spreadsheet:', error);
    return;
  }

  const sheet = spreadsheet.getActiveSheet();

  // Set header row
  const headers = [
    '日付',
    '金額',
    'カテゴリID',
    'ジャンルID',
    '場所',
    'コメント',
    '作成日時'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Add data rows
  const data = [];
  for (let i = 0; i < rakutenPayPayments.length; i++) {
    const payment = rakutenPayPayments[i];
    data.push([
      payment.date || '',
      payment.amount || 0,
      payment.category_id || '',
      payment.genre_id || '',
      payment.place || '',
      payment.comment || '',
      payment.created || ''
    ]);
  }

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);

    // Auto-resize columns
    for (let col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }

  console.log('Data output completed');
  console.log('Output count:', data.length);
  console.log('Spreadsheet URL:', spreadsheet.getUrl());
}