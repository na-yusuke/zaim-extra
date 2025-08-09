function getDate(normalizedText: string): string {
  try {
    const dateMatch = /ご利用日時.*/.exec(normalizedText);
    if (!dateMatch) {
      throw new Error('Usage date not found');
    }
    
    const value = extractValueFromHtmlText(dateMatch[0]);
    const dateParts = value.split(/[\/()]/);
    
    if (dateParts.length < 3) {
      throw new Error('Invalid date format');
    }
    
    return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  } catch (error) {
    console.error('Date extraction error:', error);
    throw error;
  }
}

function getShopName(normalizedText: string): string {
  try {
    const shopMatch = /ご利用店舗.*/.exec(normalizedText);
    if (!shopMatch) {
      throw new Error('Shop name not found');
    }
    
    return extractValueFromHtmlText(shopMatch[0]);
  } catch (error) {
    console.error('Shop name extraction error:', error);
    throw error;
  }
}

function getTotalSettlement(normalizedText: string): string {
  try {
    const amountMatch = /決済総額.*/.exec(normalizedText);
    if (!amountMatch) {
      throw new Error('Settlement amount not found');
    }
    
    let value = extractValueFromHtmlText(amountMatch[0]);
    value = value.replace(/&yen;/gi, '');
    value = value.replace(/,/gi, '');
    
    if (!value || isNaN(Number(value))) {
      throw new Error('Invalid amount format');
    }
    
    return value;
  } catch (error) {
    console.error('Amount extraction error:', error);
    throw error;
  }
}

function extractValueFromHtmlText(htmlText: string): string {
  try {
    const tableCellMatches = htmlText.match(/<td(?: .+?)?>.*?<\/td>/g);
    if (!tableCellMatches || tableCellMatches.length === 0) {
      throw new Error('HTML table cell not found');
    }
    
    let value = tableCellMatches[0].replace(/(<([^>]+)>)/gi, '');
    value = value.replace(/ /gi, '');
    
    if (!value.trim()) {
      throw new Error('Extracted value is empty');
    }
    
    return value;
  } catch (error) {
    console.error('HTML value extraction error:', error);
    throw error;
  }
}
