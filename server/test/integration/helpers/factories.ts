import { PrismaService } from '../../../src/prisma/prisma.service.js';

export async function seedEntryRevision(
  prisma: PrismaService,
  {
    userId,
    content = 'original',
    targetDate = '2025-01-15',
  }: { userId: string; content?: string; targetDate?: string },
) {
  await prisma.user.create({
    data: { id: userId, email: `${userId}@example.com`, password: 'hash' },
  });
  const entry = await prisma.entry.create({
    data: { userId, targetDate: new Date(targetDate).toISOString() },
  });
  const entryRevision = await prisma.entryRevision.create({
    data: { entryId: entry.id, content },
  });
  return entryRevision.id;
}
