const lengthUnits = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  inch: 0.0254,
  feet: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

const weightUnits = {
  gram: 1,
  kilogram: 1000,
  miligram: 0.001,
  pound: 453.592,
  ounce: 28.3495,
  ton: 1e6,
};

function fillSelect(select, units) {
  for (let u in units) {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    select.appendChild(opt);
  }
}

function setupSection(id, unitMap) {
  fillSelect(document.getElementById(id + "FromUnit"), unitMap);
  fillSelect(document.getElementById(id + "ToUnit"), unitMap);
  document.getElementById(id + "FromUnit").value = Object.keys(unitMap)[0];
  document.getElementById(id + "ToUnit").value = Object.keys(unitMap)[1];

  ["FromVal", "FromUnit", "ToUnit"].forEach((field) => {
    document
      .getElementById(id + field)
      .addEventListener("input", () => convert(id, unitMap));
  });
}

function convert(id, unitMap) {
  const val = parseFloat(document.getElementById(id + "FromVal").value);
  const from = document.getElementById(id + "FromUnit").value;
  const to = document.getElementById(id + "ToUnit").value;
  if (isNaN(val)) return;
  const result = (val * unitMap[from]) / unitMap[to];
  document.getElementById(id + "ToVal").value = result.toFixed(6);
}

function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("active"));
  document
    .querySelectorAll(".tabs button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.getElementById("btn-" + id).classList.add("active");
}

let currencyRates = {};
let currencySource = "USD";

async function setupCurrency() {
  const ACCESS_KEY = "e2c01398d5b77557c732380b8faca726";
  const res = await fetch(
    `https://api.currencylayer.com/live?access_key=${ACCESS_KEY}`
  );
  const data = await res.json();

  if (!data.success) {
    document.getElementById("currencyToVal").value = "API Error";
    return;
  }

  currencyRates = data.quotes;
  currencySource = data.source;

  const codes = Object.keys(currencyRates).map((k) =>
    k.replace(currencySource, "")
  );
  const fromSel = document.getElementById("currencyFromUnit");
  const toSel = document.getElementById("currencyToUnit");
  codes.forEach((code) => {
    const label = currencyNames[code]
      ? `${currencyNames[code]} (${code})`
      : code;
    fromSel.add(new Option(label, code));
    toSel.add(new Option(label, code));
  });
  fromSel.value = "USD";
  toSel.value = "EUR";

  ["FromVal", "FromUnit", "ToUnit"].forEach((field) => {
    document
      .getElementById("currency" + field)
      .addEventListener("input", convertCurrency);
  });
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById("currencyFromVal").value);
  const from = document.getElementById("currencyFromUnit").value;
  const to = document.getElementById("currencyToUnit").value;
  if (isNaN(amount) || !currencyRates) return;

  const rateFrom =
    from === currencySource ? 1 : currencyRates[currencySource + from];
  const rateTo = to === currencySource ? 1 : currencyRates[currencySource + to];

  if (!rateFrom || !rateTo) {
    document.getElementById("currencyToVal").value = "Error";
    return;
  }

  const usdAmount = amount / rateFrom;
  const result = usdAmount * rateTo;
  document.getElementById("currencyToVal").value = result.toFixed(2);
}

const currencyNames = {
  AED: "UAE Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswana Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  FOK: "Faroese Króna",
  GBP: "British Pound",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  IMP: "Isle of Man Pound",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Krona",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgystani Som",
  KHR: "Cambodian Riel",
  KID: "Kiribati Dollar",
  KMF: "Comorian Franc",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Lao Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanmar Kyat",
  MNT: "Mongolian Tögrög",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  PYG: "Paraguayan Guaraní",
  QAR: "Qatari Riyal",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLE: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  SSP: "South Sudanese Pound",
  STN: "São Tomé and Príncipe Dobra",
  SYP: "Syrian Pound",
  SZL: "Swazi Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistan Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Paʻanga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TVD: "Tuvaluan Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "US Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistani Soʻm",
  VES: "Venezuelan Bolívar Soberano",
  VND: "Vietnamese Đồng",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tālā",
  XAF: "Central African CFA Franc",
  XCD: "East Caribbean Dollar",
  XDR: "Special Drawing Rights",
  XOF: "West African CFA franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar",
};

setupSection("length", lengthUnits);
setupSection("weight", weightUnits);
setupCurrency();
