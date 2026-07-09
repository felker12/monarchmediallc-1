// src/data/ProjectOptions.ts

export interface SelectOption {
    value: number;
    label: string;
}

export const PACKAGE_LEVELS: SelectOption[] = [
    { value: 0, label: 'Core' },
    { value: 1, label: 'Professional' },
    { value: 2, label: 'Premium' }
];

export const INDUSTRY_SECTORS: SelectOption[] = [
    { value: 0, label: 'General' },
    { value: 1, label: 'Construction' },
    { value: 2, label: 'Landscaping' },
    { value: 3, label: 'Restaurant' },
    { value: 4, label: 'Healthcare' },
    { value: 5, label: 'Law Firm' },
    { value: 6, label: 'Technology' }
];