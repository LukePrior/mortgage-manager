interface rateData {
  rate: number;
  lendingRateType: string;
  repaymentType: string;
  period: number;
}

interface productData {
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  description: string;
  rate: rateData[];
}

export { productData };
