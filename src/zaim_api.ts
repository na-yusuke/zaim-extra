/**
 * Attempt to access the API.
 * If the authentication does not go through, access the URL displayed in the console and perform the authentication process.
 * After clicking the authentication button, access the callback URL directly from the <div class="callback"> element in the page source as the screen does not transition.
 * If you try to access the URL by copying it, it will be rejected, so “access the URL directly from the Developer Tools” is recommended.
 */
function doZaimAuth(): void {
  try {
    const service = getServiceOauth1_();
    if (!service.hasAccess()) {
      const authorizationUrl = service.authorize();
      console.log('Open the following URL, authenticate with Zaim, and then run the script again:\n%s', authorizationUrl);
    } else {
      console.log('Already authenticated');
    }
  } catch (error) {
    console.error('Zaim authentication error:', error);
    throw error;
  }
}

function getCategoryList(): any {
  try {
    const service = getServiceOauth1_();
    const response = service.fetch('https://api.zaim.net/v2/home/category', {
      method: 'get'
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`API error: ${response.getResponseCode()}`);
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Category list fetch error:', error);
    throw error;
  }
}

function getGenreList(): any {
  try {
    const service = getServiceOauth1_();
    const response = service.fetch('https://api.zaim.net/v2/home/genre', {
      method: 'get'
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`API error: ${response.getResponseCode()}`);
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Genre list fetch error:', error);
    throw error;
  }
}

function getAccountList(): any {
  try {
    const service = getServiceOauth1_();
    const response = service.fetch('https://api.zaim.net/v2/home/account', {
      method: 'get'
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`API error: ${response.getResponseCode()}`);
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Account list fetch error:', error);
    throw error;
  }
}

function callPostPaymentApi(
  categoryId: string,
  genreId: string,
  amount: string,
  date: string,
  fromAccountId: string,
  place: string
): any {
  try {
    const service = getServiceOauth1_();
    const parameters = {
      'mapping': 1,
      'category_id': categoryId,
      'genre_id': genreId,
      'amount': amount,
      'date': date,
      'from_account_id': fromAccountId,
      'place': place
    };

    const response = service.fetch('https://api.zaim.net/v2/home/money/payment', {
      method: 'post',
      payload: parameters
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`Payment registration error: ${response.getResponseCode()}`);
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Payment registration API error:', error);
    throw error;
  }
}
