const GMAIL_SEARCH_CRITERIA = "from:no-reply@pay.rakuten.co.jp subject:楽天ペイアプリご利用内容確認メール is:unread ";

const API_ENDPOINTS = {
  ACCESS_TOKEN: 'https://api.zaim.net/v2/auth/access',
  ACCOUNT: 'https://api.zaim.net/v2/home/account',
  AUTHORIZATION: 'https://auth.zaim.net/users/auth',
  CATEGORY: 'https://api.zaim.net/v2/home/category',
  GENRE: 'https://api.zaim.net/v2/home/genre',
  PAYMENT: 'https://api.zaim.net/v2/home/money/payment',
  REQUEST_TOKEN: 'https://api.zaim.net/v2/auth/request',
};

const SHOP_CATEGORIES = {
  foodLunch: ['ソニーシティ大崎　食堂'],
  entertainmentMusic: ['山野楽器　ロックイン川崎', 'サウンドスタジオ八泉'],
  groceries: ['自販機サントリービバレッジ'],
  convenienceStore: ['ファミリーマート', 'セブン-イレブン', 'デイリーヤマザキ', 'ローソン', 'ＮｅｗＤａｙｓ']
};

const DEFAULT_CATEGORIES = {
  FOOD_LUNCH: { categoryId: '101', genreId: '10104' },
  ENTERTAINMENT_MUSIC: { categoryId: '108', genreId: '10804' },
  GROCERIES: { categoryId: '101', genreId: '10101' }
};

const ACCOUNT_NAMES = {
  RAKUTEN_PAY: '楽天Pay'
};
