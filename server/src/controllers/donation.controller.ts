import type { NextFunction, Request, Response } from "express";
import * as donationService from "../services/donation.service.js";
import { created, ok } from "../utils/response.js";
type AdminRequest = Request & { user: { userId: number; role: "admin" } };

export async function getPlaces(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await donationService.getDonationPlaces(typeof req.query.category === "string" ? req.query.category : undefined));
  } catch (err) { next(err); }
}

export async function getLog(req: Request, res: Response, next: NextFunction) {
  try {
    ok(res, await donationService.getDonationLog(typeof req.query.category === "string" ? req.query.category : undefined));
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await donationService.createDonation(req.body), "অনুদানটি সফলভাবে নথিভুক্ত হয়েছে");
  } catch (err) { next(err); }
}

export async function getPending(_req: AdminRequest, res: Response, next: NextFunction) {
  try { ok(res, await donationService.getPendingDonations()); } catch (err) { next(err); }
}

export async function confirm(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const adminUserId = req.user.userId;
    ok(res, await donationService.confirmDonation(Number(req.params.id), adminUserId), "অনুদানটি নিশ্চিত হয়েছে");
  } catch (err) { next(err); }
}
