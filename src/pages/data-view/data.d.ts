export type Option = Record<string, string | number>;

export type OptionResult = Record<string, Option[]>;

export type DataModelBucket = {
  name: string;
  value: string | number;
  count: string | number;
};
export type DataModel = {
  name: string;
  value: string | number;
  count: string | number;
  buckets?: DataModelBucket[];
}[];

export type RiskParams = {
  search?: string;
  time_range: {
    begin: string;
    end: string;
  };
  keywords?: Record<string, string[]>;
};
