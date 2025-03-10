"use server";

import { type ListingRequest } from "~/models/ListingRequest";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { listings } from "~/server/db/schema";

export async function CreateListing(request: ListingRequest) {
  console.log(request);

  const { userId } = await auth();

  if (!userId) throw Error("Unauthorized");

  return db
    .insert(listings)
    .values({
      Name: request.listingName,
      MaxSize: request.maxSize,
      LimitDate: request.limitDate,
      OwnerId: userId,
    })
    .returning();
}
