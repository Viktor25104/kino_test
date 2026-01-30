const { PrismaClient } = require('@prisma/client-tickets');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Event...');
    try {
        const event = await prisma.event.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                title: 'Concert',
                date: new Date(),
            }
        });
        console.log('Event seeded:', event);
    } catch (e) {
        console.error('Seed failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
