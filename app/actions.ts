"use server"

import { createMessage, getUser } from "./db";

export async function createMessageAction(content: string, role: string) {
  let user = await getUser(role);
  if (user.length === 0) return null;
  await createMessage(user[0].id, 1, content, role);
}