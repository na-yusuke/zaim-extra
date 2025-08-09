/**
 * TODO: This logic is very inefficient, so improve it.
         Create a combined store, category, and genre form from existing records.
 */
function getCategoryAndGenre(shopName: string, categoryList: CategoryListResponse, genreList: GenreListResponse): [string, string] {
  try {
    if (SHOP_CATEGORIES.foodLunch.indexOf(shopName) !== -1) {
      return ['101', '10104'];
    } else if (SHOP_CATEGORIES.entertainmentMusic.indexOf(shopName) !== -1) {
      return ['108', '10804'];
    } else if (SHOP_CATEGORIES.groceries.indexOf(shopName) !== -1) {
      return ['101', '10101'];
    } else {
      for (let i = 0; i < SHOP_CATEGORIES.convenienceStore.length; i++) {
        const store = SHOP_CATEGORIES.convenienceStore[i];
        if (shopName && store && shopName.indexOf(store) === 0) {
          return ['101', '10101'];
        }
      }
    }

    // If no specific category matches, assign to 'Other' category
    if (!categoryList || !categoryList.categories || !genreList || !genreList.genres) {
      throw new Error('Category or genre list is invalid');
    }

    const otherCategory = categoryList.categories[categoryList.categories.length - 1];
    const otherGenre = genreList.genres[genreList.genres.length - 1];

    if (!otherCategory || !otherCategory.id || !otherGenre || !otherGenre.id) {
      throw new Error('Other category/genre ID not found');
    }

    return [otherCategory.id.toString(), otherGenre.id.toString()];
  } catch (error) {
    console.error('Category/genre determination error:', error);
    throw error;
  }
}

/**
 * Get Rakuten Pay ID from the list of payment types
 * @param accountList 
 * @returns Account ID
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
