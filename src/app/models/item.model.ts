export interface Item {
  id?: number;
  name: string;
  quantity: number;
  minStockLevel: number;
  supplierId: number;
  supplierName?: string;
}
