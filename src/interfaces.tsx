interface rateData {
  rate: number;
  lendingRateType: string;
  repaymentType: string;
  period: number;
  minLVR?: number;
  maxLVR?: number;
  purpose?: string;
}

interface productData {
  brandId: string;
  brandName: string;
  productId: string;
  productName: string;
  description: string;
  offset: boolean;
  redraw: boolean;
  rate: rateData[];
  i: number;
}

interface rate {
  time: number;
  rate: number;
}

interface rates {
  rates: rate[];
  name: string;
  period?: number;
  lendingRateType?: string;
  repaymentType?: string;
  purpose?: string;
}

export { productData, rateData, rate, rates };
