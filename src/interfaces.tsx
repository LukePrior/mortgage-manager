interface rateData {
  rate: number;
  lendingRateType: string;
  repaymentType: string;
  period: number;
  minLVR?: number;
  maxLVR?: number;
}

interface productData {
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  description: string;
  offset: boolean;
  rate: rateData[];
  i: number;
}

export { productData, rateData };