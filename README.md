# Mortgage Manager

NOTE: This is nolonger being maintained and the data is now out of date.

## Overview

Mortgage Manager is an open-source online home-loan comparison tool using product data from the Consumer Data Standards Banking APIs. Authorised deposit-taking institutions are obligated to provide information on the products that they offer via a set of APIs defined by a standardised set of specifications allowing for machine processing. 

The individual institutions are responsible for hosting and mainting their respective APIs so to get an overview of all products offered in Australia I expanded my Open Banking Tracker which downloads all product information daily and publishes it to GitHub to also include an overview file for home-loans specififcally which is used to generate the main table in Mortgage Manager. 

This data from GitHub is used to power the Mortgage Manager website which allows users to quickly and easily compare over 1000 mortgage products from 100+ brands. The website is written in React & TypeScript and includes features to filter and sort the returned matches along with viewing additional information such as eligability requirements and fees.



| Light Mode  | Dark Mode |
| ----------- | --------- |
| ![Light Mode](https://user-images.githubusercontent.com/22492406/176590347-3abd461d-29fb-495c-bcd5-d585defc7a65.png) | ![Dark Mode](https://user-images.githubusercontent.com/22492406/176590374-309650a2-a4fd-47d2-8177-f1406d90d860.png) |
| Fee Info | Rate Info |
| ![image](https://user-images.githubusercontent.com/22492406/176590617-2e916e7e-732e-4c3a-8965-eea9a92fe909.png) | ![image](https://user-images.githubusercontent.com/22492406/176590726-1e984f70-8d21-4a1a-9cd3-5a3ccd203cf5.png) |


## Collecting the Data

The [Open Banking Tracker](https://github.com/LukePrior/open-banking-tracker) was started to simplify the process of accessing Austrlian banking product information by aggregating the data products from over 110 institutions. The Australian Competition & Consumer Commission maintains a register of all brands obligated under the Consumer Data Right to offer publicly available Banking APIs.

```
https://api.cdr.gov.au/cdr-register/v1/banking/register
```

```json
{
    "legalEntityId": "988846E1-DF94-EA11-A831-000D3A8842E1",
    "legalEntityRef": "DHBNK000001",
    "legalEntityName": "Westpac Banking Corporation",
    "industry": "banking",
    "emailAddress": "OpenBankingWBC@westpac.com.au",
    "serviceAddressStreetAddress1": "The Proper Officer, Legal & Secretariat, Level 18",
    "serviceAddressStreetAddress2": "275 Kent Street",
    "serviceAddresSuburb": "Sydney",
    "serviceAddresState": "NSW",
    "serviceAddressPostcode": "2000",
    "website": "https://www.westpac.com.au/",
    "cdrPolicyUrl": "https://www.westpac.com.au/consumer-data-right-policy",
    "abn": "33007457141",
    "accreditationDate": "2020-07-31T14:00:00Z",
    "logoUrl": "https://banking.westpac.com.au/wbc/banking/Themes/Default/Desktop/WBC/Core/Images/logo_white_bg.png.ce5c4c19ec61b56796f0e218fc8329c558421fd8.png",
    "brands": [
    {
        "brandRef": "000142",
        "brandName": "Bank of Melbourne",
        "brandDescription": "You have the will. We have the way.",
        "industry": "banking",
        "website": "https://www.bankofmelbourne.com.au",
        "cdrPolicyUrl": "https://www.bankofmelbourne.com.au/content/dam/bom/downloads/bom_cdr.pdf",
        "logoUrl": "https://www.bankofmelbourne.com.au/content/dam/bom/images/home/BOM-logo_1200x1200.jpg",
        "productReferenceDataApi": "https://digital-api.bankofmelbourne.com.au/cds-au/v1/banking/products",
        "softwareProducts": [],
        "status": "ACTIVE",
        "participantType": "Data Holder"
    },
    {
        "brandRef": "000141",
        "brandName": "BankSA",
        "brandDescription": "Backing the growth of South Australia. ",
        "industry": "banking",
        "website": "https://www.banksa.com.au",
        "cdrPolicyUrl": "https://www.banksa.com.au/content/dam/bsa/downloads/bsa_cdr_policy.pdf",
        "logoUrl": "https://www.banksa.com.au/content/dam/bsa/images/home/BSA-logo_1200x1200.jpg",
        "productReferenceDataApi": "https://digital-api.banksa.com.au/cds-au/v1/banking/products",
        "softwareProducts": [],
        "status": "ACTIVE",
        "participantType": "Data Holder"
    },
    {
        "brandRef": "000002",
        "brandName": "Westpac",
        "industry": "banking",
        "website": "https://www.westpac.com.au/",
        "cdrPolicyUrl": "https://www.westpac.com.au/consumer-data-right-policy",
        "logoUrl": "https://banking.westpac.com.au/wbc/banking/Themes/Default/Desktop/WBC/Core/Images/logo_white_bg.png.ce5c4c19ec61b56796f0e218fc8329c558421fd8.png",
        "productReferenceDataApi": "https://digital-api.westpac.com.au/cds-au/v1/banking/products",
        "softwareProducts": [],
        "status": "ACTIVE",
        "participantType": "Data Holder"
    }
    ],
    "legalEntityAssociations": [],
    "status": "ACTIVE",
    "lastUpdated": "2022-06-10T04:25:53Z",
    "participantType": "Data Holder"
}
```

This register is provided in a machine readable format which can easily be processed using a simple Python script to extract the `productReferenceDataApi` and other information for each brand. This script saves the processed data as a JSON file that can be used to download the individual product data from each brand.

```python
r = requests.get('https://api.cdr.gov.au/cdr-register/v1/banking/register')
available_brands = r.json()
available_brands = available_brands['registerDetails']

for entity in available_brands:
    for brand in entity['brands']:
        if 'productReferenceDataApi' in brand:
            brands[brand['brandRef']]['productReferenceDataApi'] = brand['productReferenceDataApi']

brands_file = open("brands/brands.json", "w")
json.dump(brands, brands_file, indent = 4)
brands_file.close()
```

```json
{
    "000142": {
        "legalEntityId": "988846E1-DF94-EA11-A831-000D3A8842E1",
        "legalEntityName": "Westpac Banking Corporation",
        "accreditationDate": "2020-07-31T14:00:00Z",
        "brandRef": "000142",
        "brandName": "Bank of Melbourne",
        "productReferenceDataApi": "https://digital-api.bankofmelbourne.com.au/cds-au/v1/banking/products",
        "logoUrl": "https://www.bankofmelbourne.com.au/content/dam/bom/images/home/BOM-logo_1200x1200.jpg",
        "cdrPolicyUrl": "https://www.bankofmelbourne.com.au/content/dam/bom/downloads/bom_cdr.pdf",
        "website": "https://www.bankofmelbourne.com.au",
        "brandDescription": "You have the will. We have the way."
    },
    "000141": {
        "legalEntityId": "988846E1-DF94-EA11-A831-000D3A8842E1",
        "legalEntityName": "Westpac Banking Corporation",
        "accreditationDate": "2020-07-31T14:00:00Z",
        "brandRef": "000141",
        "brandName": "BankSA",
        "productReferenceDataApi": "https://digital-api.banksa.com.au/cds-au/v1/banking/products",
        "logoUrl": "https://www.banksa.com.au/content/dam/bsa/images/home/BSA-logo_1200x1200.jpg",
        "cdrPolicyUrl": "https://www.banksa.com.au/content/dam/bsa/downloads/bsa_cdr_policy.pdf",
        "website": "https://www.banksa.com.au",
        "brandDescription": "Backing the growth of South Australia. "
    },
    "000002": {
        "legalEntityId": "988846E1-DF94-EA11-A831-000D3A8842E1",
        "legalEntityName": "Westpac Banking Corporation",
        "accreditationDate": "2020-07-31T14:00:00Z",
        "brandRef": "000002",
        "brandName": "Westpac",
        "productReferenceDataApi": "https://digital-api.westpac.com.au/cds-au/v1/banking/products",
        "logoUrl": "https://banking.westpac.com.au/wbc/banking/Themes/Default/Desktop/WBC/Core/Images/logo_white_bg.png.ce5c4c19ec61b56796f0e218fc8329c558421fd8.png",
        "cdrPolicyUrl": "https://www.westpac.com.au/consumer-data-right-policy",
        "website": "https://www.westpac.com.au/"
    }
}
```

The next step in the process is to download the list of all offered products from each brand by reffering to the provided `productReferenceDataApi` in the processed file. These endpoints must return data according the the `GET /banking/products` API documented [here](https://consumerdatastandardsaustralia.github.io/standards/#get-products). The data is downloaded and saved for each brand using another Python script.

```python
raw_file = open("brands/brands.json", "r")
brands = json.load(raw_file)
raw_file.close()

for brand in brands:
    try:
        response = get_data(brands[brand]['productReferenceDataApi'])
        path = 'brands/products/' + brand + ".json"

        raw_file = open(path, "w")
        json.dump(response, raw_file, indent = 4)
        raw_file.close()
```

```json
{
  "data": {
    "products": [
      {
        "productId": "string",
        "effectiveFrom": "string",
        "effectiveTo": "string",
        "lastUpdated": "string",
        "productCategory": "BUSINESS_LOANS",
        "name": "string",
        "description": "string",
        "brand": "string",
        "brandName": "string",
        "applicationUri": "string",
        "isTailored": true,
        "additionalInformation": {
          "overviewUri": "string",
          "termsUri": "string",
          "eligibilityUri": "string",
          "feesAndPricingUri": "string",
          "bundleUri": "string",
          "additionalOverviewUris": [
            {
              "description": "string",
              "additionalInfoUri": "string"
            }
          ],
          "additionalTermsUris": [
            {
              "description": "string",
              "additionalInfoUri": "string"
            }
          ],
          "additionalEligibilityUris": [
            {
              "description": "string",
              "additionalInfoUri": "string"
            }
          ]
        },
        "cardArt": [
          {
            "title": "string",
            "imageUri": "string"
          }
        ]
      }
    ]
  },
  "links": {
    "self": "string",
    "first": "string",
    "prev": "string",
    "next": "string",
    "last": "string"
  },
  "meta": {
    "totalRecords": 0,
    "totalPages": 0
  }
}
```

This response will contain a list containing an overview of the products offered by the brand with each product featuring a unique ID which can be used to download more specific details. This specific product data can be downloaded using the `GET /banking/products/{productId}` API documented [here](https://consumerdatastandardsaustralia.github.io/standards/#get-product-detail). These detailed product information documents are once again downloaded by another Python script which works through all the product overview documents previously downloaded.

```python
for file in os.listdir('brands/products/'):
    raw_file = open("brands/products/"+file, "r")
    brand = json.load(raw_file)
    raw_file.close()

    try:
        for product in brand['data']['products']:
            try:
                url = (brands[id]['productReferenceDataApi'] + "/" + product['productId'])
                path = 'brands/product/' + id + "/" + product['productId'] + ".json"

                raw_file = open(path, "w")
                json.dump(response, raw_file, indent = 4)
                raw_file.close()
```

```json
{
  "data": {
    "productId": "string",
    "effectiveFrom": "string",
    "effectiveTo": "string",
    "lastUpdated": "string",
    "productCategory": "BUSINESS_LOANS",
    "name": "string",
    "description": "string",
    "brand": "string",
    "brandName": "string",
    "applicationUri": "string",
    "isTailored": true,
    "additionalInformation": {
      "overviewUri": "string",
      "termsUri": "string",
      "eligibilityUri": "string",
      "feesAndPricingUri": "string",
      "bundleUri": "string",
      "additionalOverviewUris": [
        {
          "description": "string",
          "additionalInfoUri": "string"
        }
      ],
      "additionalTermsUris": [
        {
          "description": "string",
          "additionalInfoUri": "string"
        }
      ],
      "additionalEligibilityUris": [
        {
          "description": "string",
          "additionalInfoUri": "string"
        }
      ]
    },
    "cardArt": [
      {
        "title": "string",
        "imageUri": "string"
      }
    ],
    "features": [
      {
        "featureType": "ADDITIONAL_CARDS",
        "additionalValue": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string"
      }
    ],
    "constraints": [
      {
        "constraintType": "MAX_BALANCE",
        "additionalValue": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string"
      }
    ],
    "eligibility": [
      {
        "eligibilityType": "BUSINESS",
        "additionalValue": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string"
      }
    ],
    "fees": [
      {
        "name": "string",
        "feeType": "DEPOSIT",
        "amount": "string",
        "balanceRate": "string",
        "transactionRate": "string",
        "accruedRate": "string",
        "accrualFrequency": "string",
        "currency": "string",
        "additionalValue": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string",
        "discounts": [
          {
            "description": "string",
            "discountType": "BALANCE",
            "amount": "string",
            "balanceRate": "string",
            "transactionRate": "string",
            "accruedRate": "string",
            "feeRate": "string",
            "additionalValue": "string",
            "additionalInfo": "string",
            "additionalInfoUri": "string",
            "eligibility": [
              {
                "discountEligibilityType": "BUSINESS",
                "additionalValue": "string",
                "additionalInfo": "string",
                "additionalInfoUri": "string"
              }
            ]
          }
        ]
      }
    ],
    "lendingRates": [
      {
        "lendingRateType": "BUNDLE_DISCOUNT_FIXED",
        "rate": "string",
        "comparisonRate": "string",
        "calculationFrequency": "string",
        "applicationFrequency": "string",
        "interestPaymentDue": "IN_ADVANCE",
        "repaymentType": "INTEREST_ONLY",
        "loanPurpose": "INVESTMENT",
        "tiers": [
          {
            "name": "string",
            "unitOfMeasure": "DAY",
            "minimumValue": 0,
            "maximumValue": 0,
            "rateApplicationMethod": "PER_TIER",
            "applicabilityConditions": {
              "additionalInfo": "string",
              "additionalInfoUri": "string"
            },
            "additionalInfo": "string",
            "additionalInfoUri": "string"
          }
        ],
        "additionalValue": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string"
      }
    ]
  },
  "links": {
    "self": "string"
  },
  "meta": {}
}
```

There are over 4000 individual files from over 110 different insitutions with a total size of over 50 MB detailing the various banking products that they offer and manually downloading this information for a specific application would be practically impossible. The Open Banking Tracker respository simplififies this process by automatically collecting these files daily and uploading them to GitHub along with creating an archived ZIP files of all products each day which can be used for historical reference. 

![image](https://user-images.githubusercontent.com/22492406/176588439-5395e86c-b5c0-47e3-b221-919260a3aa93.png)

The advantage of using Git for hosting and updating these files is the ability to view the specific changes when a product is updated such as a new interest rate or fee amount. The collection of Python scripts is run daily using GitHub actions and takes approximately 2 hours to complete the entire process.

```yaml
on: 
  workflow_dispatch:
  schedule:
    - cron: "0 0 * * *"

jobs:
  update-data:
    name: Fetch data
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v3

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Download latest list
        run: python main.py

      - name: Download Product Overviews
        run: python products.py

      - name: Download Products
        run: python product.py

      - name: Commit changes
        uses: EndBug/add-and-commit@v9
        with:
          message: Updated files
          default_author: github_actions
```

## Displaying the Data

The Mortgage Manager website is created with TypeScript, React 18 along with [Material UI](https://mui.com/) and [material-table](https://material-table-core.com/). This was my first major project creating using React so many of the specific implementations may not follow best practices but where possible I did attempt to create high-quality code with type checking.

![image](https://user-images.githubusercontent.com/22492406/176588501-db82dc04-652e-4c97-8eb0-0db4a7435e28.png)

The main highlight of the site is the main table displaying all the matching home-loans along with information about them such as interest rate, period, brand, and estimated monthly repayment. This table is created using material-table a powerful library which extends the functionality of the table object from Material UI. The material-table object requires a `columns` and `data` entry to be provided to designate what data should be displayed and how. The overview data is loaded from the Open Banking Tracker on GitHub into React using `useEffect`.

```javascript
  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/LukePrior/open-banking-tracker/main/aggregate/RESIDENTIAL_MORTGAGES/data.json`
    )
      .then((response) => response.json())
      .then((data) => {
        setStore(data);
      });
  }, []);
```

The `columns` object contains various advanced features to control the rendering, search properites, sorting algoritms and over overides that are tailored specifically for mortgage product information. The following code snippet shows the section of `columns` dedicated to the monthly repayment column and how it is calculated and sorted.

```javascript
{
    title: "Amount",
    field: "amount",
    render: (rowData) => {
    let i = rowData.rate[rowData.i].rate / 12 / 100;
    let n = 300;
    let p;
    if (value === null) {
        p = 0;
    } else if (typeof value === "string") {
        p = parseFloat(value);
    } else {
        p = value;
    }
    let r = Math.round((p * (i * (1 + i) ** n)) / ((1 + i) ** n - 1));
    return <p>${r.toLocaleString()}</p>;
    },
    customSort: (a, b) => {
    return a.rate[a.i].rate - b.rate[b.i].rate;
    }
}
```

The individual products contain vastly more information that can be displayed on a single row in the table so a expanded view was implemented that allows detailed information for any product to be loaded. This data includes properties such as extended descriptions, features, eligability requirements, special rates, and fees. The data for any specific product is downloaded from GitHub when the expandedn view is opened with specific views programmed to display if the data cannot be found or the connection is lost.

```javascript
const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json();

      setDetailed(result);
    } catch (err) {
      setErr("Error loading");
    } finally {
      setIsLoading(false);
    }
};
```

The information is split across multiple selectable tabs to minimise the height of the expanded view and allow for easier navigation of the website. These tabs are another component provided by Material UI helping to ensure that a conistent design is maintained across all sections and views. 

![image](https://user-images.githubusercontent.com/22492406/176588625-942dc38b-4556-430b-b1c5-27a97cdd53bd.png)

```javascript
<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs
    value={value}
    onChange={handleChange}
    aria-label="basic tabs example"
    variant="scrollable"
    >
    <Tab label="Details" {...a11yProps(0)} sx={{ width: 150 }} />
    <Tab label="Features" {...a11yProps(1)} sx={{ width: 150 }} />
    <Tab label="Requirements" {...a11yProps(2)} sx={{ width: 150 }} />
    <Tab label="Rates" {...a11yProps(3)} sx={{ width: 150 }} />
    <Tab label="Fees" {...a11yProps(4)} sx={{ width: 150 }} />
    </Tabs>
</Box>
```

The specific tabs that can potentially contain a large amount of information such as features, requirements, rates, and fees are further organised with individual chip modules for each individual icons. These chips can be selected to display teh specific information for each item. This information is drawn on a new component to add depth to the website per Material Design guidelines.

![image](https://user-images.githubusercontent.com/22492406/176588569-c188bf5c-b2a8-49b2-b68b-d694dc4cff0b.png)

The tool needs to accept specific user parameters in order to only show relevant mortgages such as those for a specific amount, period, or repayment type. This can be achieved by created a user interface where several options can be selected to filter the available mortgages. This interface is constructed using Material UI components such as buttons and text fields that allow the user to either select a specific option or show all available products.

```javascript
<Grid item style={{ display: "flex" }}>
    <ToggleButtonGroup
    value={loanPeriod}
    exclusive
    onChange={handleLoanPeriod}
    color="primary"
    >
    <ToggleButton value="0">Variable</ToggleButton>
    <ToggleButton value="1">1 YR</ToggleButton>
    <ToggleButton value="2">2 YR</ToggleButton>
    <ToggleButton value="3">3 YR</ToggleButton>
    <ToggleButton value="4">4 YR</ToggleButton>
    <ToggleButton value="5">5 YR</ToggleButton>
    <ToggleButton value="10">10 YR</ToggleButton>
    </ToggleButtonGroup>
</Grid>
```

![image](https://user-images.githubusercontent.com/22492406/176589674-61c0914c-780f-4d0d-b7e2-7972fddda40c.png)

These buttons and fields trigger a filter of the table data when they are updated, this filter checks all the fields and only returns products that meet all of them. 

```javascript
let newData = localStore.filter((product: any) => {
    let flag = false;
    product.rate.forEach((rate: rateData, index: number) => {
    if (
        (loanPeriod === null ||
        (loanPeriod === "0" &&
            rate.lendingRateType === "VARIABLE" &&
            flag === false) ||
        ("period" in rate &&
            rate.period === parseInt(loanPeriod) * 12 &&
            flag === false)) &&
        (loanPayment === null ||
        (loanPayment === "0" &&
            rate.repaymentType === "PRINCIPAL_AND_INTEREST") ||
        (loanPayment === "1" && rate.repaymentType === "INTEREST_ONLY")) &&
        (loanBig === null ||
        (loanBig === "0" &&
            ["000002", "000004", "000006", "000008"].includes(
            product.brandId
            )))
    ) {
        product.i = index;
        flag = true;
    }
    });
    return flag;
});
```

The final major componenet I implemented was an advanced dark-mode which follows Material Design guidelines and can remember user/device preferences between sessions. The Material UI library supports the concepts of themes which dictate the style of all components on the site, this theme can easily be switched to the reccomended dark-mode design by implementing a toggle and state system. The system will first check if the user has previously selected a preference by checking local storage before falling back to system preference if no previous state could be found.

![image](https://user-images.githubusercontent.com/22492406/176589702-cb284708-d336-48b0-8e78-be644cd8099e.png)

I also implemented a few other features such as a header and footer containing more information about the site along with a simple Google Analytics tag to track visitor numbers.

## Hosting the Site

Mortgage Manager is hosted on GitHub Pages for free using the [gh-pages](https://www.npmjs.com/package/gh-pages) npm package.
