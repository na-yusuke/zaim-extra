interface ZaimCategory {
  id: string;
  name: string;
  sort: number;
  active: number;
}

interface ZaimGenre {
  id: string;
  name: string;
  category_id: string;
  sort: number;
  active: number;
}

interface ZaimAccount {
  id: string;
  name: string;
  sort: number;
  active: number;
}

interface CategoryListResponse {
  categories: ZaimCategory[];
}

interface GenreListResponse {
  genres: ZaimGenre[];
}

interface AccountListResponse {
  accounts: ZaimAccount[];
}

interface PaymentApiParams {
  mapping: number;
  category_id: string;
  genre_id: string;
  amount: string;
  date: string;
  from_account_id: string;
  place: string;
}

interface PaymentApiResponse {
  money: {
    id: string;
    mode: string;
    user_id: string;
    date: string;
    category_id: string;
    genre_id: string;
    amount: string;
    comment: string;
    active: number;
    name: string;
    receipt_id: string;
    place: string;
    from_account_id: string;
    to_account_id: string;
    created: string;
    modified: string;
  }[];
}

interface ShopCategories {
  foodLunch: string[];
  entertainmentMusic: string[];
  groceries: string[];
  convenienceStore: string[];
}

interface ParsedEmailData {
  date: string;
  shopName: string;
  amount: string;
}

type MessageProcessor = (message: GoogleAppsScript.Gmail.GmailMessage) => void;