
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  countryCode: string; // For flag emojis
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate against USD
}

export const languages: Language[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', countryCode: 'US' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', countryCode: 'ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', countryCode: 'FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', countryCode: 'DE' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', countryCode: 'IT' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', countryCode: 'PT' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', countryCode: 'RU' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', countryCode: 'JP' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', countryCode: 'CN' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', countryCode: 'SA' },
];

export const currencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 157.0 },
  { code: "GBP", name: "British Pound Sterling", symbol: "£", rate: 0.79 },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", rate: 605.0 },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", rate: 605.0 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 1480.0 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", rate: 130.0 },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", rate: 14.5 },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.5 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", rate: 47.0 },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", rate: 134.0 },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", rate: 830.0 },
  { code: "BWP", name: "Botswana Pula", symbol: "P", rate: 13.6 },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu", rate: 2850.0 },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc", rate: 102.0 },
  { code: "KMF", name: "Comorian Franc", symbol: "CF", rate: 455.0 },
  { code: "CDF", name: "Congolese Franc", symbol: "FC", rate: 2800.0 },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj", rate: 177.0 },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", rate: 15.0 },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L", rate: 18.5 },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", rate: 57.0 },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D", rate: 65.0 },
  { code: "GNF", name: "Guinean Franc", symbol: "FG", rate: 8580.0 },
  { code: "LSL", name: "Lesotho Loti", symbol: "L", rate: 18.5 },
  { code: "LRD", name: "Liberian Dollar", symbol: "$", rate: 194.0 },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د", rate: 4.8 },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", rate: 4350.0 },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", rate: 1730.0 },
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM", rate: 39.6 },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", rate: 46.5 },
  { code: "MAD", name: Moroccan Dirham", symbol: "د.م.", rate: 9.9 },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", rate: 63.8 },
  { code: "NAD", name: "Namibian Dollar", symbol: "$", rate: 18.5 },
  { code: "RWF", name: "Rwandan Franc", symbol: "R₣", rate: 1300.0 },
  { code: "STN", name: "São Tomé & Príncipe Dobra", symbol: "Db", rate: 22.5 },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨", rate: 13.5 },
  { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le", rate: 22500.0 },
  { code: "SOS", name: "Somali Shilling", symbol: "S", rate: 570.0 },
  { code: "SSP", name: "South Sudanese Pound", symbol: "£", rate: 1580.0 },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س.", rate: 595.0 },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", rate: 2580.0 },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", rate: 3.1 },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", rate: 3750.0 },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", rate: 25.0 },
  { code: "ZWL", name: "Zimbabwe Dollar", symbol: "$", rate: 13.6 },
];
