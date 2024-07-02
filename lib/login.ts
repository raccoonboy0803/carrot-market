import getSession from './session';

export async function sessionLogin(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
