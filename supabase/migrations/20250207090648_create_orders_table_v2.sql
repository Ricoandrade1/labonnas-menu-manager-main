CREATE TABLE orders (
  tableId TEXT NOT NULL,
  products TEXT NOT NULL,
  total NUMERIC NOT NULL,
  paymentMethod TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  responsibleName TEXT NOT NULL,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  includes TEXT[],
  daysAvailable TEXT[],
  reportEnabled BOOLEAN,
  editablePrice BOOLEAN,
  quantity INTEGER NOT NULL
);
