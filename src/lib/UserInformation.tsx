'use server'

import {clerkClient} from "@clerk/nextjs/server";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  

export async function GetUserInfo(userId: string) {
    'use cache';
    const client = await clerkClient();
    const user = await client.users.getUser(userId)

    return [user.fullName, user.imageUrl];
}