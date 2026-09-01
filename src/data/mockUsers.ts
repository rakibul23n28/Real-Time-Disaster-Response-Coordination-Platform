export type UserRole = "citizen" | "volunteer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  avatar?: string;
  district?: string;
  skills?: string[];
}

export const mockUsers: User[] = [
  { id: "USR-001", name: "রাকিবুল হাসান", email: "rakibul@demo.com", mobile: "01711-234567", role: "citizen", district: "সুনামগঞ্জ" },
  { id: "USR-002", name: "তানজিলা খানম", email: "tanzila@demo.com", mobile: "01812-345678", role: "volunteer", district: "সিলেট", skills: ["উদ্ধার", "প্রাথমিক চিকিৎসা"] },
  { id: "USR-003", name: "ডাঃ শামীম রেজা", email: "admin@demo.com", mobile: "01611-456789", role: "admin", district: "ঢাকা" },
];

export const demoCredentials = {
  citizen: { email: "rakibul@demo.com", password: "demo1234", userId: "USR-001" },
  volunteer: { email: "tanzila@demo.com", password: "demo1234", userId: "USR-002" },
  admin: { email: "admin@demo.com", password: "demo1234", userId: "USR-003" },
};
