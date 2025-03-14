'use server'

import {clerkClient} from "@clerk/nextjs/server";

export async function GetUserInfo(userId: string) {
    'use cache';
    const client = await clerkClient();
    const user = await client.users.getUser(userId)

    return [user.fullName, user.imageUrl];
}