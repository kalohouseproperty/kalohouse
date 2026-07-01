export type UserRole = "admin" | "agent" | "owner" | "client";

export type UserStatus = "active" | "suspended";

export type District = "Gasabo" | "Kicukiro" | "Nyarugenge";

export type Sector = {
  district: District;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  mapAccessPaid: boolean;
  assignedDistrict?: District;
  assignedSector?: string;
  saved_property_ids: string[];
  createdAt: string;
};

export type AgentInvite = {
  id: string;
  code: string;
  sector: string;
  district: District;
  createdAt: string;
  usedByUserId?: string;
};

export type PropertyPurpose = "Rent" | "Sale";

export type PropertyStatus = "Pending Verification" | "Agent Assigned" | "Verified" | "Published" | "Rejected";

export type PropertyImage = {
  url: string;
  label?: string;
};

export type PropertyMedia = {
  images: PropertyImage[];
  video?: string;
};

export type Property = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  district: District;
  sector: string;
  city: string;
  cell?: string;
  village?: string;
  street?: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  livingRooms: number;
  sizeSqM?: number;
  parkingCapacity: number;

  // Security
  hasFence: boolean;
  hasCctv: boolean;
  hasSecurityGuard: boolean;
  isGatedCommunity: boolean;

  // Internet
  hasFiber: boolean;
  hasCanalbox: boolean;
  otherInternet?: string;

  // Owner Trust Info
  ownerFullName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  ownerEmail?: string;
  ownerAltPhone?: string;
  ownerIdUrl?: string;
  isOwnerVerified: boolean;

  ownerPrice: number;
  commissionAmount: number;
  finalDisplayPrice: number;
  contactInfo: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  media: PropertyMedia;
  status: PropertyStatus;
  assignedAgentId?: string;
  rejectionReason?: string;
  createdAt: string;
  publishedAt?: string;
};

export type Verification = {
  id: string;
  propertyId: string;
  agentId: string;
  images: string[];
  video: string;
  notes: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
};

export type PaymentStatus = "Paid" | "Refund Requested" | "Refunded" | "Completed";

export type Payment = {
  id: string;
  propertyId: string;
  clientId: string;
  ownerId: string;
  ownerPrice: number;
  commissionAmount: number;
  finalDisplayPrice: number;
  status: PaymentStatus;
  createdAt: string;
};

export type RefundStatus = "Pending" | "Approved" | "Rejected" | "Completed";

export type Refund = {
  id: string;
  paymentId: string;
  propertyId: string;
  clientId: string;
  amount: number;
  commissionKept: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
};

export type PayoutStatus = "Pending" | "Paid" | "Completed";

export type Payout = {
  id: string;
  paymentId: string;
  propertyId: string;
  ownerId: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
};

export type VisitRequestStatus = "Scheduled" | "Accepted" | "Refund Requested";

export type VisitRequest = {
  id: string;
  propertyId: string;
  clientId: string;
  paymentId: string;
  status: VisitRequestStatus;
  createdAt: string;
};

export type CommissionSettings = {
  rate: number;
};

export type KalohouseState = {
  users: User[];
  agentInvites: AgentInvite[];
  properties: Property[];
  verifications: Verification[];
  payments: Payment[];
  refunds: Refund[];
  payouts: Payout[];
  visitRequests: VisitRequest[];
  commissionSettings: CommissionSettings;
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  agent: "Agent",
  owner: "Landlord/Seller",
  client: "Tenant/Buyer"
};
