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
  doZaimAuth(): void {
    try {
      if (!this.serviceOauth.hasAccess()) {
        const authorizationUrl = this.serviceOauth.authorize();
        console.log('Open the following URL, authenticate with Zaim, and then run the script again:\n%s', authorizationUrl);
      } else {
        console.log('Already authenticated');
      }
    } catch (error) {
      console.error('Zaim authentication error:', error);
      throw error;
    }
  }

  getCategoryList(): CategoryListResponse {
    const response = this._callApi(API_ENDPOINTS.CATEGORY, 'get');
    return response;
  }

  getGenreList(): GenreListResponse {
    const response = this._callApi(API_ENDPOINTS.GENRE, 'get');
    return response;
  }

  getAccountList(): AccountListResponse {
    const response = this._callApi(API_ENDPOINTS.ACCOUNT, 'get');
    return response;
  }

  postPayment(
    categoryId: string,
    genreId: string,
    amount: string,
    date: string,
    fromAccountId?: string,
    name?: string,
    comment?: string,
    place?: string,
  ): PaymentApiResponse {
    const parameters: PaymentApiParams = {
      mapping: 1,
      category_id: categoryId,
      genre_id: genreId,
      amount: amount,
      date: date,
      from_account_id: fromAccountId,
      comment: comment,
      name: name,
      place: place
    };

    const response = this._callApi(API_ENDPOINTS.PAYMENT, 'post', parameters);
    return response;
  }

  _callApi(endPoint: string, method: string, parameters?: any): any {
    try {
      const response = this.serviceOauth.fetch(endPoint, { method: method, payload: parameters });
      if (response.getResponseCode() !== 200) {
        throw new Error(`API error: ${response.getResponseCode()}`);
      }
      return JSON.parse(response.getContentText());
    } catch (error) {
      console.error(`API call failed for ${endPoint}:`, error);
      throw error;
    }
  }
}







