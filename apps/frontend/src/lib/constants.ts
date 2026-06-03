export const PROVINCES = [
  'Punjab',
  'Sindh',
  'KPK',
  'Balochistan',
  'AJK',
  'GB',
  'Islamabad',
];

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Sargodha',
  'Bahawalpur',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Rahim Yar Khan',
  'Jhang',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Mingora',
  'Dera Ghazi Khan',
  'Nawabshah',
  'Mirpur Khas',
  'Abbottabad',
  'Muzaffarabad',
  'Gilgit',
  'Turbat',
  'Khuzdar',
];

export const ORDER_STATUSES = [
  { value: 'placed', label: 'Placed', color: 'bg-blue-500' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-indigo-500' },
  { value: 'packed', label: 'Packed', color: 'bg-yellow-500' },
  { value: 'shipped', label: 'Shipped', color: 'bg-orange-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-600' },
  { value: 'returned', label: 'Returned', color: 'bg-gray-500' },
];

export const PRODUCT_CATEGORIES = [
  'handbag',
  'backpack',
  'laptop bag',
  'tote',
  'travel bag',
  'clutch',
  'wallet',
  'school bag',
];

export const FREE_SHIPPING_THRESHOLD =
  Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 2000;
export const SHIPPING_FEE =
  Number(process.env.NEXT_PUBLIC_SHIPPING_FEE) || 200;

export const formatCurrency = (amount: number) =>
  `Rs ${amount.toLocaleString('en-PK')}`;
