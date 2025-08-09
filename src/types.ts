interface ZaimCategory {
  id: number;
  name: string;
  mode: string;
  sort: number;
  parent_category_id: number;
  active: number;
  modified: string
}

interface ZaimGenre {
  id: number;
  name: string;
  sort: number;
  active: number;
  category_id: number;
  parent_genre_id: number;
  modified: string;
}

interface ZaimAccount {
  id: number;
  name: string;
  modified: string;
  sort: number;
  active: number;
  local_id: number;
  website_id: number;
  parent_account_id: number;
}

interface CategoryListResponse {
  categories: ZaimCategory[];
  requested: number;
}

interface GenreListResponse {
  genres: ZaimGenre[];
  requested: number;
}

interface AccountListResponse {
  accounts: ZaimAccount[];
  requested: number;
}

interface PaymentApiParams {
  mapping: number;
  category_id: string;
  genre_id: string;
  amount: string;
  date: string;
  from_account_id?: string | undefined;
  comment?: string | undefined;
  name?: string | undefined;
  place?: string | undefined;
}

interface PaymentApiResponse {
  money: {
    id: number;
    place_uid: string;
    modified: string;
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
  };
  place: {
    id: number;
    user_id: number;
    genre_id: number;
    category_id: number;
    account_id: number;
    transfer_account_id: number;
    mode: string;
    place_uid: string;
    service: string;
    name: string;
    original_name: string;
    tel: string;
    count: number;
    place_pattern_id: number;
    calc_flag: number;
    edit_flag: number;
    active: number;
    modified: string;
    created: string;
  };
  user: {
    input_count: number;
    repeat_count: number;
    day_count: number;
    data_modified: string;
  };
  requested: number;
};

interface ShopCategories {
  foodLunch: string[];
  entertainmentMusic: string[];
  groceries: string[];
  convenienceStore: string[];
}

interface PurchaseRecord {
  date: string;
  shopName: string;
  amount: string;
}

type MessageProcessor = (message: GoogleAppsScript.Gmail.GmailMessage) => void;