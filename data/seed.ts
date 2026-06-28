import type { KalohouseState } from "@/types/models";

export const demoCredentials = [
  "admin@kalohouse.rw",
];

export const seedState: KalohouseState = {
  users: [
    {
      id: "user-admin",
      name: "Kalohouse Admin",
      email: "admin@kalohouse.rw",
      role: "admin",
      status: "active",
      isVerified: true,
      mapAccessPaid: true,
      saved_property_ids: [],
      createdAt: "2026-04-01"
    }
  ],
  agentInvites: [],
  properties: [],
  verifications: [],
  payments: [],
  refunds: [],
  payouts: [],
  visitRequests: [],
  commissionSettings: {
    rate: 10
  }
};
