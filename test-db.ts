import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.surveyResponse.count();
        console.log(`Successfully connected to database. Current response count: ${count}`);
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
