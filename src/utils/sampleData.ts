export const generateSampleData = () => {
  const productSales = {
    id: 'sample-product-sales',
    name: 'Product Sales',
    columns: [
      { field: 'product', type: 'string', displayName: 'Product' },
      { field: 'category', type: 'string', displayName: 'Category' },
      { field: 'region', type: 'string', displayName: 'Region' },
      { field: 'sales', type: 'number', displayName: 'Sales Amount' },
      { field: 'quantity', type: 'number', displayName: 'Quantity' },
      { field: 'month', type: 'string', displayName: 'Month' },
      { field: 'year', type: 'number', displayName: 'Year' },
    ],
    data: [
      { product: 'Laptop', category: 'Electronics', region: 'North', sales: 45000, quantity: 30, month: 'January', year: 2023 },
      { product: 'Smartphone', category: 'Electronics', region: 'North', sales: 35000, quantity: 50, month: 'January', year: 2023 },
      { product: 'Headphones', category: 'Electronics', region: 'East', sales: 15000, quantity: 100, month: 'January', year: 2023 },
      { product: 'Chair', category: 'Furniture', region: 'South', sales: 12000, quantity: 20, month: 'January', year: 2023 },
      { product: 'Desk', category: 'Furniture', region: 'West', sales: 20000, quantity: 15, month: 'January', year: 2023 },
      { product: 'Lamp', category: 'Furniture', region: 'North', sales: 5000, quantity: 40, month: 'January', year: 2023 },
      { product: 'Tablet', category: 'Electronics', region: 'East', sales: 22000, quantity: 25, month: 'February', year: 2023 },
      { product: 'Smartphone', category: 'Electronics', region: 'South', sales: 40000, quantity: 60, month: 'February', year: 2023 },
      { product: 'Monitor', category: 'Electronics', region: 'West', sales: 30000, quantity: 35, month: 'February', year: 2023 },
      { product: 'Sofa', category: 'Furniture', region: 'North', sales: 35000, quantity: 10, month: 'February', year: 2023 },
      { product: 'Bookshelf', category: 'Furniture', region: 'East', sales: 15000, quantity: 25, month: 'February', year: 2023 },
      { product: 'Chair', category: 'Furniture', region: 'South', sales: 10000, quantity: 30, month: 'February', year: 2023 },
      { product: 'Laptop', category: 'Electronics', region: 'West', sales: 55000, quantity: 40, month: 'March', year: 2023 },
      { product: 'Smartphone', category: 'Electronics', region: 'North', sales: 50000, quantity: 75, month: 'March', year: 2023 },
      { product: 'Headphones', category: 'Electronics', region: 'East', sales: 18000, quantity: 120, month: 'March', year: 2023 },
      { product: 'Desk', category: 'Furniture', region: 'South', sales: 25000, quantity: 20, month: 'March', year: 2023 },
      { product: 'Lamp', category: 'Furniture', region: 'West', sales: 8000, quantity: 50, month: 'March', year: 2023 },
      { product: 'Chair', category: 'Furniture', region: 'North', sales: 14000, quantity: 35, month: 'March', year: 2023 },
      { product: 'Tablet', category: 'Electronics', region: 'East', sales: 28000, quantity: 30, month: 'April', year: 2023 },
      { product: 'Monitor', category: 'Electronics', region: 'South', sales: 32000, quantity: 40, month: 'April', year: 2023 },
      { product: 'Smartphone', category: 'Electronics', region: 'West', sales: 48000, quantity: 70, month: 'April', year: 2023 },
      { product: 'Sofa', category: 'Furniture', region: 'North', sales: 40000, quantity: 12, month: 'April', year: 2023 },
      { product: 'Bookshelf', category: 'Furniture', region: 'East', sales: 18000, quantity: 30, month: 'April', year: 2023 },
      { product: 'Desk', category: 'Furniture', region: 'South', sales: 27000, quantity: 22, month: 'April', year: 2023 },
    ]
  };

  return [productSales];
};