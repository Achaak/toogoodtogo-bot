export interface ItemFavorite {
  item: Item;
  store: Store;
  display_name: string;
  pickup_interval: PickupInterval;
  pickup_location: Location;
  purchase_end: string;
  items_available: number;
  distance: number;
  favorite: boolean;
  in_sales_window: boolean;
  new_item: boolean;
}

export interface Item {
  item_id: string;
  sales_taxes: SalesTax[];
  tax_amount: PriceExcludingTaxes;
  price_excluding_taxes: PriceExcludingTaxes;
  price_including_taxes: PriceExcludingTaxes;
  value_excluding_taxes: PriceExcludingTaxes;
  value_including_taxes: PriceExcludingTaxes;
  taxation_policy: string;
  show_sales_taxes: boolean;
  cover_picture: Picture;
  logo_picture: Picture;
  name: string;
  description: string;
  can_user_supply_packaging: boolean;
  packaging_option: string;
  diet_categories: unknown[];
  item_category: string;
  badges: Badge[];
  positive_rating_reasons: string[];
  average_overall_rating: AverageOverallRating;
  favorite_count: number;
  buffet: boolean;
}

export interface AverageOverallRating {
  average_overall_rating: number;
  rating_count: number;
  month_count: number;
}

export interface Badge {
  badge_type: string;
  rating_group: string;
  percentage: number;
  user_count: number;
  month_count: number;
}

export interface Picture {
  picture_id: string;
  current_url: string;
  is_automatically_created: boolean;
}

export interface PriceExcludingTaxes {
  code: string;
  minor_units: number;
  decimals: number;
}

export interface SalesTax {
  tax_description: string;
  tax_percentage: number;
}

export interface PickupInterval {
  start: string;
  end: string;
}

export interface Location {
  address: Address;
  location: LocationClass;
}

export interface Address {
  country: Country;
  address_line: string;
  city: string;
  postal_code: string;
}

export interface Country {
  iso_code: string;
  name: string;
}

export interface LocationClass {
  longitude: number;
  latitude: number;
}

export interface Store {
  store_id: string;
  store_name: string;
  branch: string;
  description: string;
  tax_identifier: string;
  website: string;
  store_location: Location;
  logo_picture: Picture;
  store_time_zone: string;
  hidden: boolean;
  favorite_count: number;
  we_care: boolean;
  distance: number;
  cover_picture: Picture;
}
