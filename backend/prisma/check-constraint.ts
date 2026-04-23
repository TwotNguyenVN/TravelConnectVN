import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Twot2k5TravelConnectVN.%2A%23@db.zkeymmxuncvlrlezrbye.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.$queryRaw`
    SELECT conname, pg_get_constraintdef(oid) 
    FROM pg_constraint 
    WHERE conname = 'notifications_notification_type_check'
  `;
  console.log(JSON.stringify(result, null, 2));
}

main().finally(() => pool.end());
