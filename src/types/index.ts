// ─── Shared Utility Types ────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

export interface ApiMessage {
  message: string;
}

export type Paginated<T> = {
  count: number;
  rows: T[];
};

// ─── Shared Route Params ─────────────────────────────────────────────────────

export interface IdParams {
  id: string;
}

export interface UserIdParams {
  userId: string;
}

export interface AddressParams {
  addressId: string;
}

export interface CardIdParams {
  cardId: string;
}

// ─── Permission ──────────────────────────────────────────────────────────────

export interface PermissionResponse {
  permissionId?: string;
  name: string;
  description?: string | null;
}

export interface PermissionBody {
  name: string;
  description?: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  userId?: string;
  name: string;
  email: string;
  secretkeysite?: string | null;
  permissions?: Pick<PermissionResponse, "permissionId" | "name">[];
}

export interface RegisterUserBody {
  name: string;
  email: string;
  permissionId: string;
  password: string;
}

export interface LoginUserBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  username: string;
  email: string;
  accessToken: string;
}

export interface UpdateUserBody {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  permissionId?: string;
  secretkeysite?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface ComponentResponse {
  componentId?: string;
  name: string;
  description?: string | null;
}

export interface ComponentAccessItem {
  componentId?: string;
  name: string;
}

export interface CreateComponentBody {
  name: string;
  description?: string;
  selectPermissions?: string[];
}

export interface UpdateComponentBody {
  name: string;
  selectPermissions: string[];
}

export interface CheckPermissionBody {
  componentNames: string[];
}

// ─── Customer ────────────────────────────────────────────────────────────────

export interface CustomerResponse {
  customerId?: string;
  userId: string;
  name: string;
  email: string;
  contact: string;
  photo?: string | null;
}

export interface CustomerLoginResponse {
  customerId?: string;
  name: string;
  contact: string;
  email: string;
  photo?: string | null;
  token?: string;
}

export interface LoginBody {
  provider: "google" | "credentials";
  idToken?: string;
  email?: string;
  password?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  contact: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface SubcategoryResponse {
  subcategoryId?: string;
  name: string;
  categoryId: string;
}

export interface CategoryResponse {
  categoryId?: string;
  name: string;
  userId: string;
  subcategories?: SubcategoryResponse[];
}

export interface CategoryBody {
  name: string;
}

export interface SubcategoryBody {
  name: string;
  categoryId: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductResponse {
  productId?: string;
  name: string;
  reference: string;
  stock?: number;
  price: number;
  description?: string | null;
  photos?: string[] | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  userId: string;
}

export interface ProductBody {
  name?: string;
  reference?: string;
  stock?: number;
  price?: number;
  description?: string;
  categoryId?: string;
  subcategoryId?: string | null;
  photosToRemove?: string | string[];
  [key: string]: unknown;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderResponse {
  orderId?: string;
  userId: string;
  customerId: string;
  price?: number;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderBody {
  customerId?: string;
  price?: number;
  [key: string]: unknown;
}

export interface CreateOrderBody {
  shippingAddress: string;
  billingAddress: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface AddressResponse {
  addressId?: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  nif: string;
  addTaxpayer: boolean;
  defaultAdress: boolean;
  defaultAdressFaturation: boolean;
  customerId?: string;
}

export interface AddressBody {
  address: string;
  defaultAdressFaturation?: boolean;
  defaultAdress?: boolean;
  postalCode: string;
  city: string;
  phoneNumber: string;
  nif?: string;
  addTaxpayer?: boolean;
}

// ─── BankCard ────────────────────────────────────────────────────────────────

export interface BankCardResponse {
  cardId?: string;
  lastFourDigits: string;
  expirationDate: string;
  customerId: string;
}

export interface BankCardBody {
  cardNumber: string;
  expirationDate: string;
  customerId?: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartProductItem {
  productId: string;
  name: string;
  price: number;
  photos: string[];
  quantity: number;
}

export interface CartResponse {
  cartId?: string;
  customerId?: string;
  products: CartProductItem[];
  shipPrice: number;
}

export interface CartBody {
  productId: string;
  quantity: number;
}
