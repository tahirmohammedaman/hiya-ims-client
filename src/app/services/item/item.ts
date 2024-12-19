export interface Item {
  id: string;
  name: string;
  description?: string;
  image?: string;
  defaultRentRate?: number;
  defaultSalePrice?: number;
  isSet: boolean;
  itemLines?: ItemLine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemLine {
  id: string;
  item: Item;
  quantity: number;
}