const FOOD_LUNCH_SHOPS = ['ソニーシティ大崎　食堂'];
const ENTERTAINMENT_MUSIC_SHOPS = ['山野楽器　ロックイン川崎', 'サウンドスタジオ八泉'];
const GROCERIES_SHOPS = ['自販機サントリービバレッジ'];
const CONVENIENCE_STORES = ['ファミリーマート', 'セブン-イレブン', 'デイリーヤマザキ', 'ローソン', 'ＮｅｗＤａｙｓ'];

function getCategoryAndGenre(shopName: string, categoryList: any, genreList: any): [string, string] {
  try {
    // 特定店舗を振り分ける
    if (FOOD_LUNCH_SHOPS.indexOf(shopName) !== -1) {
      return ['101', '10104'];
    } else if (ENTERTAINMENT_MUSIC_SHOPS.indexOf(shopName) !== -1) {
      return ['108', '10804'];
    } else if (GROCERIES_SHOPS.indexOf(shopName) !== -1) {
      return ['101', '10101'];
    } else {
      // コンビニを食料品に振り分ける
      for (let i = 0; i < CONVENIENCE_STORES.length; i++) {
        const store = CONVENIENCE_STORES[i];
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
    
    return [otherCategory.id, otherGenre.id];
  } catch (error) {
    console.error('Category/genre determination error:', error);
    throw error;
  }
}

function getRakutenPayId(accountList: any): string | null {
  try {
    if (!accountList || !accountList.accounts) {
      throw new Error('Account list is invalid');
    }
    
    for (let i = 0; i < accountList.accounts.length; i++) {
      const account = accountList.accounts[i];
      if (account.name === '楽天Pay') {
        return account.id;
      }
    }
    
    console.warn('Rakuten Pay account not found');
    return null;
  } catch (error) {
    console.error('Rakuten Pay ID fetch error:', error);
    throw error;
  }
}
