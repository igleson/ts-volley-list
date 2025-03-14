"use server";

import { type ListingRequest } from "~/models/ListingRequest";

import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { listingEvents, listings } from "~/server/db/schema";
import { type ListingEvent } from "~/models/ListingEvent";
import { ComputedListing } from "~/models/ComputedListing";
import { asc, eq } from "drizzle-orm";

export async function CreateListing(request: ListingRequest) {
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

export async function AddListingEvent(event: ListingEvent) {
  console.log(event);
  const { userId } = await auth();

  if (!userId) throw Error("Unauthorized");

  return db.insert(listingEvents).values(event).returning();
}

export async function GetComputedListing(
  listingId: number,
): Promise<ComputedListing> {
  const listingPromise = await db.query.listings.findFirst({
    // columns: {
    //   Id: true,
    //   Name: true,
    //   MaxSize: true,
    //   LimitDate: true,
    //   OwnerId: true,
    // },
    where: eq(listingEvents.listingId, listingId),
  });

  const eventsPromise = await db.query.listingEvents.findMany({
    where: eq(listingEvents.listingId, listingId),
    orderBy: [asc(listingEvents.date)],
  });

  const [listing, events] = await Promise.all([listingPromise, eventsPromise]);

  if (!listing) {
    throw new Error("listing not found");
  }

  const computed: ComputedListing = {
    id: listingId,
    ownerId: listing.OwnerId,
    name: listing.Name,
    maxSize: listing.MaxSize,
    limitDate: listing.LimitDate,
    invitees: [],
    participants: [],
    payers: [],
  };

  return {
    id: listingId,
    ownerId: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
    name: "Mockada",
    maxSize: 10,
    limitDate: new Date(2025, 4, 1),
    participants: [
      {
        id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
      },
      // {
      //   id: "user_2u0MORnMtLfZTfro1nBm63iBG1K",
      // },
    ],
    invitees: [
      {
        inviter_id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
        name: "biel",
      },
      {
        inviter_id: "user_2u0MORnMtLfZTfro1nBm63iBG1K",
        name: "adriano",
      },
    ],
    payers: [
      {
        id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
      },
      {
        inviter_id: "user_2tx5G1uTk3dqfeCmEuMzP5nw7v7",
        name: "biel",
      },
    ],
  };
}
