import mongoose, { ClientSession } from 'mongoose';

export function slitIdToNumbers(id: string): number[] {
  const numbers = id.match(/\d+/g).map(Number);
  return numbers;
}

export async function mongoDbSessionWrap<T>(
  fn: (session: ClientSession) => Promise<T>,
) {
  const session = await mongoose.startSession();
  let rs: T;
  return session
    .withTransaction(async () => {
      rs = await fn(session);
    })
    .then(() => rs);
}
