import type { LandConversionResult, UnitSystem, AmortizationItem, BankOffer } from '../types';

/**
 * UP Land Unit Conversions
 * Standard UP Pucca Bigha = 27,225 sq. ft. (3,025 sq. yards / gaj)
 * 1 Pucca Bigha = 20 Biswa
 * 1 Gaj (Sq. Yard) = 9 sq. ft.
 */
export const convertLandArea = (value: number, fromUnit: UnitSystem | 'Biswa' | 'Acre' | 'Hectare'): LandConversionResult => {
  let sqFt = 0;

  switch (fromUnit) {
    case 'Sq.Ft':
      sqFt = value;
      break;
    case 'Gaj':
      sqFt = value * 9;
      break;
    case 'Bigha':
      sqFt = value * 27225; // Pucca UP Bigha
      break;
    case 'Biswa':
      sqFt = value * 1361.25; // 27225 / 20
      break;
    case 'Acre':
      sqFt = value * 43560;
      break;
    case 'Hectare':
      sqFt = value * 107639;
      break;
    default:
      sqFt = value;
  }

  return {
    sqFt: Math.round(sqFt * 100) / 100,
    gaj: Math.round((sqFt / 9) * 100) / 100,
    bighaPucca: Math.round((sqFt / 27225) * 1000) / 1000,
    biswaPucca: Math.round((sqFt / 1361.25) * 100) / 100,
    bighaKutcha: Math.round((sqFt / 6806.25) * 100) / 100,
    acre: Math.round((sqFt / 43560) * 1000) / 1000,
    hectare: Math.round((sqFt / 107639) * 1000) / 1000,
  };
};

/**
 * Format area according to selected UP Unit System
 */
export const formatArea = (sqFt: number, unitSystem: UnitSystem): string => {
  if (unitSystem === 'Gaj') {
    const gaj = Math.round(sqFt / 9);
    return `${gaj.toLocaleString('en-IN')} Gaj`;
  }
  if (unitSystem === 'Bigha') {
    const bigha = (sqFt / 27225).toFixed(2);
    return `${bigha} Bigha`;
  }
  return `${sqFt.toLocaleString('en-IN')} Sq.Ft`;
};

/**
 * Format Currency in Indian Numbering Format (₹ Lakhs / ₹ Crores)
 */
export const formatPriceINR = (price: number): string => {
  if (price >= 10000000) {
    const crores = (price / 10000000).toFixed(2);
    return `₹${crores.replace(/\.00$/, '')} Cr`;
  }
  if (price >= 100000) {
    const lakhs = (price / 100000).toFixed(2);
    return `₹${lakhs.replace(/\.00$/, '')} Lacs`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Calculate Home Loan EMI
 */
export const calculateEMI = (principal: number, annualRatePercent: number, tenureYears: number) => {
  if (principal <= 0 || annualRatePercent <= 0 || tenureYears <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 };
  }
  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
};

/**
 * Generate Monthly Amortization Schedule (First 12 months preview)
 */
export const generateAmortizationSchedule = (
  principal: number,
  annualRatePercent: number,
  tenureYears: number
): AmortizationItem[] => {
  if (principal <= 0 || annualRatePercent <= 0 || tenureYears <= 0) return [];
  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let balance = principal;
  const schedule: AmortizationItem[] = [];

  for (let m = 1; m <= Math.min(12, totalMonths); m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month: m,
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      remainingBalance: Math.max(0, Math.round(balance)),
    });
  }

  return schedule;
};

/**
 * UP Government Stamp Duty & Property Registration Fee Calculator
 */
export const calculateUPStampDuty = (propertyValue: number, ownerGender: 'Male' | 'Female' | 'Joint') => {
  let stampDutyRate = 0.07;
  if (ownerGender === 'Female') stampDutyRate = 0.06;
  if (ownerGender === 'Joint') stampDutyRate = 0.065;

  const stampDutyAmount = Math.round(propertyValue * stampDutyRate);
  const registrationFee = Math.round(propertyValue * 0.01);
  const totalGovtCharges = stampDutyAmount + registrationFee;
  const totalEffectiveCost = propertyValue + totalGovtCharges;

  return {
    stampDutyRate: stampDutyRate * 100,
    stampDutyAmount,
    registrationFee,
    totalGovtCharges,
    totalEffectiveCost,
  };
};

/**
 * Top Indian Bank Partners for UP Real Estate Home Loans
 */
export const UP_BANK_PARTNERS: BankOffer[] = [
  {
    bankName: 'State Bank of India (SBI)',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=120&q=80',
    interestRate: 8.4,
    maxTenureYears: 30,
    processingFee: '0.35% (Max ₹10,000)',
    specialFeature: 'Special Concession for Female Buyers & UP Govt Employees',
  },
  {
    bankName: 'HDFC Bank',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 8.5,
    maxTenureYears: 30,
    processingFee: '0.50% + GST',
    specialFeature: 'Instant Digital Sanction in 24 Hours',
  },
  {
    bankName: 'ICICI Bank',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
    interestRate: 8.6,
    maxTenureYears: 30,
    processingFee: '0.50% (Max ₹15,000)',
    specialFeature: '100% Pre-approved Home Loans for NCR & UP Cities',
  },
  {
    bankName: 'Punjab National Bank (PNB)',
    logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=120&q=80',
    interestRate: 8.45,
    maxTenureYears: 30,
    processingFee: 'Nil for Green Housing Projects',
    specialFeature: 'Zero Hidden Charges for UP Plot & Villa Loans',
  },
];
