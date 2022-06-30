# Mortgage Manager

## Overview

Mortgage Manager is an open-source online home-loan comparison tool using product data from the Consumer Data Standards Banking APIs. Authorised deposit-taking institutions are obligated to provide information on the products that they offer via a set of APIs defined by a standardised set of specifications allowing for machine processing. The individual institutions are responsible for hosting and mainting their respective APIs so to get an overview of all products offered in Australia I expanded my Open Banking Tracker which downloads all product information daily and publishes it to GitHub to also include an overview file for home-loans specififcally which is used to generate the main table in Mortgage Manager. This overview file is designed to be as small as possible so that it can quickly be downloaded which means that not all information for each product is included. This is resolved by manually downloading the entire product information also from my Open Banking Tracker repository when the details panel is opened 

## Aggregate Data

## Specific Data

## Automated Scripts

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
          ],
          "additionalFeesAndPricingUris": [
            {
              "description": "string",
              "additionalInfoUri": "string"
            }
          ],
          "additionalBundleUris": [
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
      ],
      "additionalFeesAndPricingUris": [
        {
          "description": "string",
          "additionalInfoUri": "string"
        }
      ],
      "additionalBundleUris": [
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
    "bundles": [
      {
        "name": "string",
        "description": "string",
        "additionalInfo": "string",
        "additionalInfoUri": "string",
        "productIds": [
          "string"
        ]
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
    "depositRates": [
      {
        "depositRateType": "BONUS",
        "rate": "string",
        "calculationFrequency": "string",
        "applicationFrequency": "string",
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

There are over 4000 individual files from over 110 different insitutions with a total size of over 50 MB detailing the various banking products that they offer and manually downloading this information for a specific application would be practically impossible. The Open Banking Tracker respository simplififies this process by automatically collecting these files daily and uploading them to GitHub along with creating an archived ZIP files of all products each day which can be used for historical reference. The advantage of using Git for hosting and updating these files is the ability to view the specific changes when a product is updated such as a new interest rate or fee amount. The collection of Python scripts is run daily using GitHub actions and takes approximately 2 hours to complete the entire process.

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

## Website Design

## Brand Imagery

## Mobile Optimised

