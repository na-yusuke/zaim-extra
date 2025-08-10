/**
 * Determines category and genre for a shop based on historical data from spreadsheet.
 * This improved version learns from existing payment records to provide accurate categorization.
 * 
 * @param shopName - The name of the shop/place to categorize
 * @param placeCategoryDict - Dictionary mapping place names to category/genre IDs
 * @returns A tuple containing [categoryId, genreId] as strings
 */
function getCategoryAndGenre(
  shopName: string,
  placeCategoryDict: PlaceCategoryMapping): [string, string] {
  try {
    if (placeCategoryDict[shopName]) {
      const categoryGenre = placeCategoryDict[shopName];
      console.log('Found match from history:', shopName, '→', categoryGenre);
      return [categoryGenre.categoryId, categoryGenre.genreId];
    }
    return ['199', '19999'];
  } catch (error) {
    console.error('Category/genre determination error:', error);
    return ['199', '19999'];
  }
}

/**
 * Builds a place-based category dictionary from the latest spreadsheet in the specified folder.
 * Reads historical payment data and creates a mapping of place names to category/genre IDs,
 * removing duplicates by keeping the last occurrence of each place.
 * 
 * @returns A dictionary object mapping place names to category and genre ID pairs
 * @returns Empty object if no valid spreadsheet is found or errors occur
 * 
 * @example
 * const dictionary = buildPlaceCategoryDictionary();
 * // Returns: { "Starbucks": { categoryId: "101", genreId: "10105" }, ... }
 */
function buildPlaceCategoryDictionary(): PlaceCategoryMapping {
  try {
    const folderName = 'zaim_record';
    const latestSpreadsheet = getLatestSpreadsheetFromFolder(folderName);
    if (!latestSpreadsheet) {
      console.log('Historical spreadsheet not found. Using existing logic.');
      return {};
    }

    console.log('Building dictionary from historical data:', latestSpreadsheet.getName());

    const sheet = latestSpreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log('Historical data is empty.');
      return {};
    }

    // Get column indices from header row
    const headers = data[0];
    if (!headers) {
      console.error('Header row not found');
      return {};
    }

    const placeIndex = headers.indexOf('場所');
    const categoryIndex = headers.indexOf('カテゴリID');
    const genreIndex = headers.indexOf('ジャンルID');
    if (placeIndex === -1 || categoryIndex === -1 || genreIndex === -1) {
      console.error('Required columns not found:', headers);
      return {};
    }

    // Build dictionary while removing duplicates
    const placeCategoryDict: PlaceCategoryMapping = {};
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;

      const place = row[placeIndex];
      const categoryId = row[categoryIndex];
      const genreId = row[genreIndex];

      // Add only valid data (duplicates are overwritten with later values)
      if (place && categoryId && genreId) {
        placeCategoryDict[place.toString().trim()] = {
          categoryId: categoryId.toString(),
          genreId: genreId.toString()
        };
      }
    }

    console.log('Dictionary construction completed. Registered stores count:', Object.keys(placeCategoryDict).length);
    return placeCategoryDict;

  } catch (error) {
    console.error('Dictionary construction error:', error);
    return {};
  }
}

/**
 * Retrieves the latest spreadsheet from a specified Google Drive folder based on date in filename.
 * Searches through all spreadsheet files in the folder and identifies the most recent one
 * by parsing date patterns in the filename.
 * 
 * @param folderName - The name of the Google Drive folder to search in
 * @returns The latest spreadsheet object or null if none found
 * 
 * @remarks
 * - Expected filename format: "RakutenPayRecord_YYYY-MM-DD"
 * - Only processes Google Sheets files (ignores other file types)
 * - Returns null if folder doesn't exist or contains no valid spreadsheets
 * - Uses string comparison for date sorting (YYYY-MM-DD format ensures correct ordering)
 */
function getLatestSpreadsheetFromFolder(folderName: string): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    if (!folders.hasNext()) {
      console.log('Folder not found:', folderName);
      return null;
    }

    const folder = folders.next();
    const files = folder.getFiles();

    let latestFile = null;
    let latestDate = '';

    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName();

      // Process spreadsheets only
      if (file.getMimeType() !== 'application/vnd.google-apps.spreadsheet') {
        continue;
      }

      // Extract date from filename (expected format: RakutenPayRecord_YYYY-MM-DD)
      const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch && dateMatch[1]) {
        const fileDate = dateMatch[1];
        if (fileDate > latestDate) {
          latestDate = fileDate;
          latestFile = file;
        }
      }
    }

    if (latestFile) {
      console.log('Latest spreadsheet identified:', latestFile.getName());
      return SpreadsheetApp.openById(latestFile.getId());
    }

    console.log('No dated spreadsheet found');
    return null;
  } catch (error) {
    console.error('Error retrieving latest spreadsheet:', error);
    return null;
  }
}

/**
 * Retrieves the account ID for a specified account name from the Zaim account list.
 * Searches through all available accounts and returns the ID of the matching account.
 * 
 * @param accountList - The response object containing all account information from Zaim API
 * @param targetName - The name of the account to search for (e.g., "楽天Pay")
 * @returns The account ID as a string, or null if not found
 * 
 * @throws {Error} When accountList is invalid or malformed
 */
function getAccountId(accountList: AccountListResponse, targetName: string): string | null {
  try {
    if (!accountList || !accountList.accounts) {
      throw new Error('Account list is invalid');
    }

    for (let i = 0; i < accountList.accounts.length; i++) {
      const account = accountList.accounts[i];
      if (account && account.name === targetName) {
        return account.id.toString();
      }
    }

    console.warn(`${targetName} is not found`);
    return null;
  } catch (error) {
    console.error('Rakuten Pay ID fetch error:', error);
    throw error;
  }
}
