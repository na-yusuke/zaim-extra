class ZaimApi {
  serviceOauth: any;
  constructor() {
    this.serviceOauth = getServiceOauth1_();
  }

  /**
   * attempt to access the api.
   * if the authentication does not go through, access the url displayed in the console and perform the authentication process.
   * after clicking the authentication button, access the callback url directly from the <div class="callback"> element in the page source as the screen does not transition.
   * if you try to access the url by copying it, it will be rejected, so “access the url directly from the developer tools” is recommended.
   */
  doZaimAuth(): { success: boolean; authUrl?: string; error?: string } {
    try {
      if (!this.serviceOauth.hasAccess()) {
        const authorizationUrl = this.serviceOauth.authorize();
        console.log('Open the following URL, authenticate with Zaim, and then run the script again:\n%s', authorizationUrl);
        return { success: true, authUrl: authorizationUrl };
      } else {
        console.log('Already authenticated');
        return { success: true };
      }
    } catch (error) {
      console.error('Zaim authentication error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown authentication error' };
    }
  }

  getCategoryList(): CategoryListResponse | null {
    const response = this.callApi(API_ENDPOINTS.CATEGORY, 'get');
    if (!response.success) {
      console.warn('Failed to get category list:', response.error);
      return null;
    }
    return response.data;
  }

  getGenreList(): GenreListResponse | null {
    const response = this.callApi(API_ENDPOINTS.GENRE, 'get');
    if (!response.success) {
      console.warn('Failed to get genre list:', response.error);
      return null;
    }
    return response.data;
  }

  getAccountList(): AccountListResponse | null {
    const response = this.callApi(API_ENDPOINTS.ACCOUNT, 'get');
    if (!response.success) {
      console.warn('Failed to get account list:', response.error);
      return null;
    }
    return response.data;
  }

  postPayment(
    categoryId: string,
    genreId: string,
    amount: string,
    date: string,
    fromAccountId?: string,
    place?: string,
    comment?: string,
    name?: string,
  ): PaymentApiResponse | null {
    const parameters: PaymentApiParams = {
      mapping: 1,
      category_id: categoryId,
      genre_id: genreId,
      amount: amount,
      date: date,
      from_account_id: fromAccountId,
      place: place,
      comment: comment || '',
      name: name,
    };

    const response = this.callApi(API_ENDPOINTS.PAYMENT, 'post', parameters);
    if (!response.success) {
      console.warn('Failed to post payment:', response.error);
      return null;
    }
    return response.data;
  }

  getMoneyList(parameters?: any): any | null {
    const params: any = { mapping: 1 };
    if (parameters) {
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          params[key] = parameters[key];
        }
      }
    }

    const queryParts: string[] = [];
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(params[key])));
      }
    }

    const url = API_ENDPOINTS.MONEY + '?' + queryParts.join('&');
    const response = this.callApi(url, 'get');
    if (!response.success) {
      console.warn('Failed to get money list:', response.error);
      return null;
    }
    return response.data;
  }

  getAllPayments(): any[] {
    const allPayments: any[] = [];
    let page = 1;
    const limit = 100;

    while (true) {
      console.log('Fetching page ' + page + '...');
      const data = this.getMoneyList({
        mode: 'payment',
        limit: limit,
        page: page,
        order: 'date'
      });

      if (!data || !data.money || data.money.length === 0) {
        break;
      }

      for (let i = 0; i < data.money.length; i++) {
        allPayments.push(data.money[i]);
      }

      if (data.money.length < limit) {
        break;
      }

      page++;
    }

    console.log('Total payments fetched: ' + allPayments.length);
    return allPayments;
  }

  private callApi(endPoint: string, method: string, parameters?: any): { success: boolean; data?: any; error?: string; statusCode?: number } {
    try {
      const response = this.serviceOauth.fetch(endPoint, { method: method, payload: parameters });
      const statusCode = response.getResponseCode();

      if (statusCode !== 200) {
        const errorMessage = `API error: ${statusCode}`;
        console.error(`API call failed for ${endPoint}: ${errorMessage}`);
        return { success: false, error: errorMessage, statusCode };
      }

      const data = JSON.parse(response.getContentText());
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown API error';
      console.error(`API call failed for ${endPoint}:`, error);
      return { success: false, error: errorMessage };
    }
  }
}







