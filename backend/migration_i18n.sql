ALTER TABLE "public"."tours" ADD COLUMN IF NOT EXISTS "title_en" TEXT;
ALTER TABLE "public"."tours" ADD COLUMN IF NOT EXISTS "province_en" TEXT;
ALTER TABLE "public"."tours" ADD COLUMN IF NOT EXISTS "description_en" TEXT;
ALTER TABLE "public"."tour_categories" ADD COLUMN IF NOT EXISTS "name_en" TEXT;

CREATE TABLE IF NOT EXISTS "public"."user_activities" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "tour_id" UUID NOT NULL,
  "action" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "user_activities_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
