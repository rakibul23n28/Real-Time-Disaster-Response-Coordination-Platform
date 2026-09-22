import { z } from "zod";

export const createDonationSchema = z.object({
  donation_type: z.enum(["money", "item"]),
  category: z.enum(["food", "water", "medical", "other"]),
  donor_name: z.string().max(120).optional(),
  donor_contact: z.string().max(120).optional(),
  is_anonymous: z.boolean().default(false),
  amount: z.number().positive().max(100000000).optional(),
  item_name: z.string().max(120).optional(),
  quantity: z.number().int().positive().max(100000000).optional(),
  unit: z.string().max(40).optional(),
  place_id: z.number().int().positive(),
  note: z.string().max(500).optional(),
}).superRefine((value, context) => {
  if (value.donation_type === "money" && (!value.amount || value.amount <= 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["amount"], message: "অর্থের পরিমাণ দিতে হবে" });
  }
  if (value.donation_type === "item" && (!value.item_name || !value.quantity || !value.unit)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["item_name"], message: "সামগ্রীর নাম, পরিমাণ ও একক দিতে হবে" });
  }
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
