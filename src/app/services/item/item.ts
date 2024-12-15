export interface Item {
  id: string;
  name: string;
  description?: string;
  photo?: string;
  defaultRentRate?: number;
  defaultSalePrice?: number;
  isSet: boolean;
  itemLines?: ItemLine[];
}

export interface ItemLine {
  id: string;
  item: Item;
  quantity: number;
}