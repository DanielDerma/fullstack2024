import SocketCtx from '@/components/SocketCtx';
import { auth, signOut } from 'app/auth';
import { getMessages } from '../db';

export default async function ProtectedPage() {
  let session = await auth();
  let initialMessages = await getMessages(1)

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 mt-10 justify-center items-center text-black dark:text-white">
        You are logged in as {session?.user?.email}
        <SocketCtx email={session?.user?.email ?? ""} messages={initialMessages} />
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit" className='text-red-600'>Sign out</button>
    </form>
  );
}
