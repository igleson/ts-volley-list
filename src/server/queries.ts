'use server'

import {type ListingRequest} from "~/models/ListingRequest";
import {db} from "~/server/db";
import {auth} from "@clerk/nextjs/server";
import {listings} from "~/server/db/schema";
import {NextResponse} from "next/server";

export async function CreateListing(request: ListingRequest) {
    const {userId} = await auth();

    if (!userId) throw Error("Unauthorized");

    return db.insert(listings).values({
        name: request.listingName,
        maxSize: request.maxSize,
        limitDate: request.limitDate,
        ownerId: userId
    }).returning();
}
