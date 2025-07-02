
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const languages: Language[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
];

export const currencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "BWP", name: "Botswana Pula", symbol: "P" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
  { code: "KMF", name: "Comorian Franc", symbol: "CF" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk" },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "GNF", name: "Guinean Franc", symbol: "FG" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L" },
  { code: "LRD", name: "Liberian Dollar", symbol: "$" },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK" },
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
  { code: "NAD", name: "Namibian Dollar", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "RWF", name: "Rwandan Franc", symbol: "R₣" },
  { code: "STN", name: "São Tomé & Príncipe Dobra", symbol: "Db" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨" },
  { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le" },
  { code: "SOS", name: "Somali Shilling", symbol: "S" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "£" },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س." },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
  { code: "ZWL", "name": "Zimbabwe Dollar", "symbol": "$" },
];
