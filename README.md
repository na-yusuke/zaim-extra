# zaim-extra

A Google Apps Script application that automatically extracts Rakuten Pay transaction history from Gmail and registers them as expenses in Zaim.  

## 🌍 Environment

```bash
$ node -v
v20.12.1

$ npm -v
10.5.1
```

## 🚀 Setup

### 1. Clone the repository

```bash
$ git clone https://github.com/na-yusuke/zaim-extra.git
# or
$ git clone git@github.com:na-yusuke/zaim-extra.git
```

### 2. Install dependencies

```bash
$ npm install
```

### 3. Setup clasp (Google Apps Script CLI)

```bash
$ clasp login
```

- After running the command, a URL will be displayed in the terminal
- Access the URL to authenticate and grant necessary permissions

### 4. Create a Google Apps Script project

1. Create a new Google Apps Script project for this application
2. Open your Apps Script project
3. Click **Project Settings** in the left sidebar
4. Under **IDs**, copy the **Script ID**

### 5. Link the local script to the GAS project

1. Copy the example configuration file:

    ```bash
    $ cp .clasp.example.json .clasp.json
    ```

2. Enter the **Script ID** obtained above in the `scriptId` field of `.clasp.json`

### 6. Create configuration file

```bash
$ cp src/config.template.ts_ src/config.ts
```

### 7. Setup Zaim API credentials

1. Visit [Zaim Developer Console](https://dev.zaim.net/home)
2. Register your application to obtain Client ID (Consumer ID) and Client Secret (Consumer Secret)
3. Edit `src/config.ts` and configure the obtained authentication credentials

### 8. Build and deploy

```bash
$ npm run deploy
✔ Manifest file has been updated. Do you want to push and overwrite? (Yes/No)
Yes
```

### 9. Initial setup

#### Zaim Authorization

1. Execute the `main` function in Google Apps Script editor
2. Access the OAuth authentication URL displayed in the console
3. Complete authentication with Zaim
4. Access the callback URL directly from the page source code to complete authentication

#### Export Historical Payment Data

1. Execute the `exportRakutenPayDataToSheet` function in Google Apps Script editor
2. Historical Rakuten Pay payment data will be stored in the `zaim_record` folder
3. This data is used to build the smart categorization dictionary

### 10. Setup triggers (Automation)

Create triggers based on your requirements:

- **`main` function**
  - Recommended: Once daily
  - Processes new Gmail messages and registers payments
- **`exportRakutenPayDataToSheet` function**  
  - Recommended: Once monthly
  - Updates the historical data used for categorization

## 📚 References

- [clasp でコマンドライン インターフェースを使用する](https://developers.google.com/apps-script/guides/clasp?hl=ja#create_a_new_apps_script_project)
- [Zaim Developer Documentation](https://dev.zaim.net/home)
- [GASからZaim APIを利用する](https://qiita.com/shutosg/items/6845057432bca551024b)
- [【GAS】GASでZaimAPIを操作する覚書](https://ytakeuchi.jp/?p=258)

## 💡 Motivation for it

Zaim is a very useful household accounting service.  
However, it doesn't support integration with Rakuten Pay.  
So I had to register payments by Rakuten Pay manually.  
This was a huge pain and halved the benefits of Zaim.  
That's why I developed this application that automatically registers Rakuten Pay expenses in Zaim.  
Thanks to it, I haven't had to register any payments manually.  
