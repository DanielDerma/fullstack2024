import { drizzle } from 'drizzle-orm/postgres-js';
import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

let users = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 64 }),
  password: varchar('password', { length: 64 }),
});

let chatrooms = pgTable('Chatroom', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 }),
  slug: varchar('slug', { length: 64 }),
});

let messages = pgTable('Message', {
  id: serial('id').primaryKey(),
  content: text('content'),
  role: varchar('role', { length: 64 }),
  userId: integer('user_id').references(() => users.id),
  chatroomId: integer('chatroom_id').references(() => chatrooms.id),
  timestamp: timestamp('timestamp').default(new Date()),
});

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}

export async function getChatrooms() {
  return await db.select().from(chatrooms);
}

export async function getMessages(chatroomId: number) {
  return await db.select().from(messages).where(eq(messages.chatroomId, chatroomId));
}

export async function createMessage(userId: number, chatroomId: number, content: string, role: string) {
  return await db.insert(messages).values({ userId, chatroomId, content, role });
}