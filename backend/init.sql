-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "auth"."aal_level" AS ENUM ('aal1', 'aal2', 'aal3');

-- CreateEnum
CREATE TYPE "auth"."code_challenge_method" AS ENUM ('s256', 'plain');

-- CreateEnum
CREATE TYPE "auth"."factor_status" AS ENUM ('unverified', 'verified');

-- CreateEnum
CREATE TYPE "auth"."factor_type" AS ENUM ('totp', 'webauthn', 'phone');

-- CreateEnum
CREATE TYPE "auth"."oauth_authorization_status" AS ENUM ('pending', 'approved', 'denied', 'expired');

-- CreateEnum
CREATE TYPE "auth"."oauth_client_type" AS ENUM ('public', 'confidential');

-- CreateEnum
CREATE TYPE "auth"."oauth_registration_type" AS ENUM ('dynamic', 'manual');

-- CreateEnum
CREATE TYPE "auth"."oauth_response_type" AS ENUM ('code');

-- CreateEnum
CREATE TYPE "auth"."one_time_token_type" AS ENUM ('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');

-- CreateTable
CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" UUID,
    "id" UUID NOT NULL,
    "payload" JSON,
    "created_at" TIMESTAMPTZ(6),
    "ip_address" VARCHAR(64) NOT NULL DEFAULT '',

    CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."custom_oauth_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider_type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "acceptable_client_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pkce_enabled" BOOLEAN NOT NULL DEFAULT true,
    "attribute_mapping" JSONB NOT NULL DEFAULT '{}',
    "authorization_params" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_optional" BOOLEAN NOT NULL DEFAULT false,
    "issuer" TEXT,
    "discovery_url" TEXT,
    "skip_nonce_check" BOOLEAN NOT NULL DEFAULT false,
    "cached_discovery" JSONB,
    "discovery_cached_at" TIMESTAMPTZ(6),
    "authorization_url" TEXT,
    "token_url" TEXT,
    "userinfo_url" TEXT,
    "jwks_uri" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_oauth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."flow_state" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "auth_code" TEXT,
    "code_challenge_method" "auth"."code_challenge_method",
    "code_challenge" TEXT,
    "provider_type" TEXT NOT NULL,
    "provider_access_token" TEXT,
    "provider_refresh_token" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "authentication_method" TEXT NOT NULL,
    "auth_code_issued_at" TIMESTAMPTZ(6),
    "invite_token" TEXT,
    "referrer" TEXT,
    "oauth_client_state_id" UUID,
    "linking_target_id" UUID,
    "email_optional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."identities" (
    "provider_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "identity_data" JSONB NOT NULL,
    "provider" TEXT NOT NULL,
    "last_sign_in_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "email" TEXT,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."instances" (
    "id" UUID NOT NULL,
    "uuid" UUID,
    "raw_base_config" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "authentication_method" TEXT NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "amr_id_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_challenges" (
    "id" UUID NOT NULL,
    "factor_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "ip_address" INET NOT NULL,
    "otp_code" TEXT,
    "web_authn_session_data" JSONB,

    CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_factors" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "friendly_name" TEXT,
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "secret" TEXT,
    "phone" TEXT,
    "last_challenged_at" TIMESTAMPTZ(6),
    "web_authn_credential" JSONB,
    "web_authn_aaguid" UUID,
    "last_webauthn_challenge_data" JSONB,

    CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."oauth_authorizations" (
    "id" UUID NOT NULL,
    "authorization_id" TEXT NOT NULL,
    "client_id" UUID NOT NULL,
    "user_id" UUID,
    "redirect_uri" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "state" TEXT,
    "resource" TEXT,
    "code_challenge" TEXT,
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" NOT NULL DEFAULT 'code',
    "status" "auth"."oauth_authorization_status" NOT NULL DEFAULT 'pending',
    "authorization_code" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() + '00:03:00'::interval),
    "approved_at" TIMESTAMPTZ(6),
    "nonce" TEXT,

    CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."oauth_client_states" (
    "id" UUID NOT NULL,
    "provider_type" TEXT NOT NULL,
    "code_verifier" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "oauth_client_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."oauth_clients" (
    "id" UUID NOT NULL,
    "client_secret_hash" TEXT,
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" TEXT NOT NULL,
    "grant_types" TEXT NOT NULL,
    "client_name" TEXT,
    "client_uri" TEXT,
    "logo_uri" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "client_type" "auth"."oauth_client_type" NOT NULL DEFAULT 'confidential',
    "token_endpoint_auth_method" TEXT NOT NULL,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."oauth_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "scopes" TEXT NOT NULL,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."one_time_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "relates_to" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" UUID,
    "id" BIGSERIAL NOT NULL,
    "token" VARCHAR(255),
    "user_id" VARCHAR(255),
    "revoked" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "parent" VARCHAR(255),
    "session_id" UUID,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."saml_providers" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata_xml" TEXT NOT NULL,
    "metadata_url" TEXT,
    "attribute_mapping" JSONB,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name_id_format" TEXT,

    CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."saml_relay_states" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "request_id" TEXT NOT NULL,
    "for_email" TEXT,
    "redirect_to" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "flow_state_id" UUID,

    CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."schema_migrations" (
    "version" VARCHAR(255) NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "auth"."sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "factor_id" UUID,
    "aal" "auth"."aal_level",
    "not_after" TIMESTAMPTZ(6),
    "refreshed_at" TIMESTAMP(6),
    "user_agent" TEXT,
    "ip" INET,
    "tag" TEXT,
    "oauth_client_id" UUID,
    "refresh_token_hmac_key" TEXT,
    "refresh_token_counter" BIGINT,
    "scopes" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."sso_domains" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."sso_providers" (
    "id" UUID NOT NULL,
    "resource_id" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "disabled" BOOLEAN,

    CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "instance_id" UUID,
    "id" UUID NOT NULL,
    "aud" VARCHAR(255),
    "role" VARCHAR(255),
    "email" VARCHAR(255),
    "encrypted_password" VARCHAR(255),
    "email_confirmed_at" TIMESTAMPTZ(6),
    "invited_at" TIMESTAMPTZ(6),
    "confirmation_token" VARCHAR(255),
    "confirmation_sent_at" TIMESTAMPTZ(6),
    "recovery_token" VARCHAR(255),
    "recovery_sent_at" TIMESTAMPTZ(6),
    "email_change_token_new" VARCHAR(255),
    "email_change" VARCHAR(255),
    "email_change_sent_at" TIMESTAMPTZ(6),
    "last_sign_in_at" TIMESTAMPTZ(6),
    "raw_app_meta_data" JSONB,
    "raw_user_meta_data" JSONB,
    "is_super_admin" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "phone" TEXT,
    "phone_confirmed_at" TIMESTAMPTZ(6),
    "phone_change" TEXT DEFAULT '',
    "phone_change_token" VARCHAR(255) DEFAULT '',
    "phone_change_sent_at" TIMESTAMPTZ(6),
    "confirmed_at" TIMESTAMPTZ(6),
    "email_change_token_current" VARCHAR(255) DEFAULT '',
    "email_change_confirm_status" SMALLINT DEFAULT 0,
    "banned_until" TIMESTAMPTZ(6),
    "reauthentication_token" VARCHAR(255) DEFAULT '',
    "reauthentication_sent_at" TIMESTAMPTZ(6),
    "is_sso_user" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."webauthn_challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "challenge_type" TEXT NOT NULL,
    "session_data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "webauthn_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."webauthn_credentials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "credential_id" BYTEA NOT NULL,
    "public_key" BYTEA NOT NULL,
    "attestation_type" TEXT NOT NULL DEFAULT '',
    "aaguid" UUID,
    "sign_count" BIGINT NOT NULL DEFAULT 0,
    "transports" JSONB NOT NULL DEFAULT '[]',
    "backup_eligible" BOOLEAN NOT NULL DEFAULT false,
    "backed_up" BOOLEAN NOT NULL DEFAULT false,
    "friendly_name" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6),

    CONSTRAINT "webauthn_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "actor_role_code" TEXT,
    "module_name" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_pk" TEXT,
    "action_type" TEXT NOT NULL,
    "reason" TEXT,
    "old_data" JSONB NOT NULL DEFAULT '{}',
    "new_data" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ip_address" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "model_name" TEXT,
    "token_usage" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "context" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_interaction_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companion_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "estimated_cost" DECIMAL(12,2),
    "currency_code" CHAR(3) NOT NULL DEFAULT 'VND',
    "expected_members" INTEGER NOT NULL,
    "description" TEXT,
    "requirements" TEXT,
    "business_status" TEXT NOT NULL DEFAULT 'open',
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "images" JSONB DEFAULT '[]',

    CONSTRAINT "companion_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companion_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "message" TEXT,
    "response_note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "processed_by_user_id" UUID,
    "cancelled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ(6),
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "last_read_at" TIMESTAMPTZ(6),

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id","user_id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_type" TEXT NOT NULL,
    "title" TEXT,
    "created_by_user_id" UUID,
    "related_tour_id" UUID,
    "related_companion_post_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_guides" (
    "user_id" UUID NOT NULL,
    "guide_profile_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_guides_pkey" PRIMARY KEY ("user_id","guide_profile_id")
);

-- CreateTable
CREATE TABLE "favorite_tours" (
    "user_id" UUID NOT NULL,
    "tour_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_tours_pkey" PRIMARY KEY ("user_id","tour_id")
);

-- CreateTable
CREATE TABLE "guide_availabilities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_profile_id" UUID NOT NULL,
    "available_date" DATE NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_languages" (
    "guide_profile_id" UUID NOT NULL,
    "language_id" BIGINT NOT NULL,

    CONSTRAINT "guide_languages_pkey" PRIMARY KEY ("guide_profile_id","language_id")
);

-- CreateTable
CREATE TABLE "guide_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "bio" TEXT,
    "years_of_experience" INTEGER,
    "working_area" TEXT,
    "avatar_url" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'not_submitted',
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "reputation_score" INTEGER NOT NULL DEFAULT 100,
    "is_accepting_tours" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "other_languages" TEXT,
    "other_skills" TEXT,
    "home_province_id" BIGINT,
    "familiar_provinces" TEXT,
    "region" TEXT,
    "cover_url" TEXT,

    CONSTRAINT "guide_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_profile_id" UUID NOT NULL,
    "tour_id" UUID NOT NULL,
    "tour_request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_skills" (
    "guide_profile_id" UUID NOT NULL,
    "skill_id" BIGINT NOT NULL,

    CONSTRAINT "guide_skills_pkey" PRIMARY KEY ("guide_profile_id","skill_id")
);

-- CreateTable
CREATE TABLE "guide_verification_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "verification_request_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "note" TEXT,

    CONSTRAINT "guide_verification_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_verification_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_profile_id" UUID NOT NULL,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submission_note" TEXT,
    "processed_by_user_id" UUID,
    "processed_at" TIMESTAMPTZ(6),
    "result_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "merged_from" TEXT,
    "headquarters" TEXT,
    "region" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" TEXT NOT NULL DEFAULT 'text',
    "attachment_url" TEXT,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "notification_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_accommodations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "accommodation_type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "contact_phone" TEXT,
    "website_url" TEXT,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'VND',
    "payment_method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transaction_code" TEXT NOT NULL,
    "provider_transaction_code" TEXT,
    "gateway_response" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "guide_settled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_processing_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID NOT NULL,
    "action_by_user_id" UUID,
    "action_type" TEXT NOT NULL,
    "old_status" TEXT,
    "new_status" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_processing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reporter_user_id" UUID NOT NULL,
    "target_type" TEXT NOT NULL,
    "tour_id" UUID,
    "companion_post_id" UUID,
    "reported_user_id" UUID,
    "guide_profile_id" UUID,
    "tour_review_id" UUID,
    "guide_review_id" UUID,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "assigned_to_user_id" UUID,
    "processed_by_user_id" UUID,
    "processed_at" TIMESTAMPTZ(6),
    "resolution_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_code")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_accommodations" (
    "tour_id" UUID NOT NULL,
    "accommodation_id" UUID NOT NULL,
    "check_in_date" DATE,
    "check_out_date" DATE,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_accommodations_pkey" PRIMARY KEY ("tour_id","accommodation_id")
);

-- CreateTable
CREATE TABLE "tour_categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "sequence_no" INTEGER NOT NULL,
    "location_name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "visit_time" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "has_breakfast" BOOLEAN DEFAULT false,
    "has_lunch" BOOLEAN DEFAULT false,
    "has_dinner" BOOLEAN DEFAULT false,
    "accommodation_info" TEXT,
    "highlight_note" TEXT,

    CONSTRAINT "tour_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "participant_count" INTEGER NOT NULL,
    "note" TEXT,
    "response_note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "processed_by_user_id" UUID,
    "cancelled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancellation_note" TEXT,
    "price_at_booking" DECIMAL(12,2),
    "schedule_id" UUID,

    CONSTRAINT "tour_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "tour_request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guide_profile_id" UUID NOT NULL,
    "category_id" BIGINT,
    "title" TEXT NOT NULL,
    "title_en" TEXT,
    "province" TEXT NOT NULL,
    "province_en" TEXT,
    "district" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "price" DECIMAL(12,2) NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'VND',
    "max_participants" INTEGER NOT NULL,
    "meet_point" TEXT,
    "meet_latitude" DECIMAL(9,6),
    "meet_longitude" DECIMAL(9,6),
    "description" TEXT,
    "description_en" TEXT,
    "participant_requirements" TEXT,
    "business_status" TEXT NOT NULL DEFAULT 'draft',
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "duration" TEXT,
    "meet_address" TEXT,
    "meet_time" TEXT,
    "google_maps_link" TEXT,
    "num_days" INTEGER,
    "num_nights" INTEGER,
    "route_map_link" TEXT,
    "other_provinces" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "activity_type" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "budget_min" DECIMAL(12,2),
    "budget_max" DECIMAL(12,2),
    "preferred_trip_style" TEXT,
    "preferred_language_id" BIGINT,
    "extra_preferences" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "other_languages" TEXT,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_preferred_categories" (
    "user_id" UUID NOT NULL,
    "category_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_preferred_categories_pkey" PRIMARY KEY ("user_id","category_id")
);

-- CreateTable
CREATE TABLE "user_role_change_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "target_user_id" UUID NOT NULL,
    "changed_role_code" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "changed_by_user_id" UUID,
    "old_snapshot" JSONB NOT NULL DEFAULT '{}',
    "new_snapshot" JSONB NOT NULL DEFAULT '{}',
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_code" TEXT NOT NULL,
    "assigned_by" UUID,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_code")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "date_of_birth" DATE,
    "gender" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6),
    "cover_url" TEXT,
    "region" TEXT,
    "home_province_id" BIGINT,
    "facebook_url" TEXT,
    "bank_id" TEXT,
    "account_no" TEXT,
    "account_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_covers" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "default_covers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_destinations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "sequence_no" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "google_maps_link" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_routes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_id" UUID NOT NULL,
    "start_province" TEXT NOT NULL,
    "end_province" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_expenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'VND',
    "paid_by_user_id" UUID NOT NULL,
    "created_by_user_id" UUID NOT NULL,
    "expense_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_expense_splits" (
    "expense_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "settled_at" TIMESTAMPTZ(6),

    CONSTRAINT "trip_expense_splits_pkey" PRIMARY KEY ("expense_id","user_id")
);

-- CreateTable
CREATE TABLE "companion_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "host_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "visibility_status" TEXT NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companion_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "sos_alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tour_id" UUID,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "note" TEXT,
    "resolved_by_user_id" UUID,
    "resolved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sos_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reporter_user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assigned_to_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_disputes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tour_request_id" UUID NOT NULL,
    "raised_by_user_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolved_by_user_id" UUID,
    "resolution_note" TEXT,
    "refund_amount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "tour_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_transaction_id" UUID NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "tax_code" TEXT,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "pdf_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tour_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries"("instance_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_oauth_providers_identifier_key" ON "auth"."custom_oauth_providers"("identifier");

-- CreateIndex
CREATE INDEX "custom_oauth_providers_created_at_idx" ON "auth"."custom_oauth_providers"("created_at");

-- CreateIndex
CREATE INDEX "custom_oauth_providers_enabled_idx" ON "auth"."custom_oauth_providers"("enabled");

-- CreateIndex
CREATE INDEX "custom_oauth_providers_identifier_idx" ON "auth"."custom_oauth_providers"("identifier");

-- CreateIndex
CREATE INDEX "custom_oauth_providers_provider_type_idx" ON "auth"."custom_oauth_providers"("provider_type");

-- CreateIndex
CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_auth_code" ON "auth"."flow_state"("auth_code");

-- CreateIndex
CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state"("user_id", "authentication_method");

-- CreateIndex
CREATE INDEX "identities_email_idx" ON "auth"."identities"("email");

-- CreateIndex
CREATE INDEX "identities_user_id_idx" ON "auth"."identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_provider_id_provider_unique" ON "auth"."identities"("provider_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_amr_claims_session_id_authentication_method_pkey" ON "auth"."mfa_amr_claims"("session_id", "authentication_method");

-- CreateIndex
CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "mfa_factors_last_challenged_at_key" ON "auth"."mfa_factors"("last_challenged_at");

-- CreateIndex
CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors"("friendly_name", "user_id") WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);

-- CreateIndex
CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors"("user_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorizations_authorization_id_key" ON "auth"."oauth_authorizations"("authorization_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorizations_authorization_code_key" ON "auth"."oauth_authorizations"("authorization_code");

-- CreateIndex
CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations"("expires_at") WHERE (status = 'pending'::auth.oauth_authorization_status);

-- CreateIndex
CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states"("created_at");

-- CreateIndex
CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients"("deleted_at");

-- CreateIndex
CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents"("client_id") WHERE (revoked_at IS NULL);

-- CreateIndex
CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents"("user_id", "client_id") WHERE (revoked_at IS NULL);

-- CreateIndex
CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents"("user_id", "granted_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_consents_user_client_unique" ON "auth"."oauth_consents"("user_id", "client_id");

-- CreateIndex
CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING HASH ("relates_to");

-- CreateIndex
CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING HASH ("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens"("user_id", "token_type");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_unique" ON "auth"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens"("instance_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens"("instance_id", "user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens"("parent");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens"("session_id", "revoked");

-- CreateIndex
CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens"("updated_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "saml_providers_entity_id_key" ON "auth"."saml_providers"("entity_id");

-- CreateIndex
CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers"("sso_provider_id");

-- CreateIndex
CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states"("created_at" DESC);

-- CreateIndex
CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states"("for_email");

-- CreateIndex
CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states"("sso_provider_id");

-- CreateIndex
CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions"("not_after" DESC);

-- CreateIndex
CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions"("oauth_client_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains"("sso_provider_id");

-- CreateIndex
CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users"("email") WHERE (is_sso_user = false);

-- CreateIndex
CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users"("confirmation_token") WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);

-- CreateIndex
CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users"("recovery_token") WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);

-- CreateIndex
CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users"("email_change_token_new") WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "auth"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users"("email_change_token_current") WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);

-- CreateIndex
CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users"("reauthentication_token") WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);

-- CreateIndex
CREATE INDEX "idx_users_created_at_desc" ON "auth"."users"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_users_email" ON "auth"."users"("email");

-- CreateIndex
CREATE INDEX "idx_users_last_sign_in_at_desc" ON "auth"."users"("last_sign_in_at" DESC);

-- CreateIndex
CREATE INDEX "users_instance_id_idx" ON "auth"."users"("instance_id");

-- CreateIndex
CREATE INDEX "users_is_anonymous_idx" ON "auth"."users"("is_anonymous");

-- CreateIndex
CREATE INDEX "webauthn_challenges_expires_at_idx" ON "auth"."webauthn_challenges"("expires_at");

-- CreateIndex
CREATE INDEX "webauthn_challenges_user_id_idx" ON "auth"."webauthn_challenges"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "webauthn_credentials_credential_id_key" ON "auth"."webauthn_credentials"("credential_id");

-- CreateIndex
CREATE INDEX "webauthn_credentials_user_id_idx" ON "auth"."webauthn_credentials"("user_id");

-- CreateIndex
CREATE INDEX "idx_admin_activity_logs_actor_created" ON "admin_activity_logs"("actor_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_admin_activity_logs_entity" ON "admin_activity_logs"("entity_type", "entity_pk", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_admin_activity_logs_module_created" ON "admin_activity_logs"("module_name", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_admin_activity_logs_actor_module_created" ON "admin_activity_logs"("actor_user_id", "module_name", "created_at");

-- CreateIndex
CREATE INDEX "idx_admin_logs_action_type" ON "admin_activity_logs"("action_type");

-- CreateIndex
CREATE INDEX "idx_admin_logs_actor_user_id" ON "admin_activity_logs"("actor_user_id");

-- CreateIndex
CREATE INDEX "idx_admin_logs_created_at" ON "admin_activity_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_ai_chat_messages_session" ON "ai_chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_ai_chat_sessions_user" ON "ai_chat_sessions"("user_id", "last_interaction_at" DESC);

-- CreateIndex
CREATE INDEX "idx_companion_posts_destination_trgm" ON "companion_posts" USING GIN ("destination" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_companion_posts_public_search" ON "companion_posts"("destination", "start_date", "estimated_cost", "business_status", "visibility_status");

-- CreateIndex
CREATE INDEX "idx_companion_posts_title_trgm" ON "companion_posts" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_companion_posts_dates" ON "companion_posts"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_companion_posts_status_visibility" ON "companion_posts"("business_status", "visibility_status");

-- CreateIndex
CREATE INDEX "idx_companion_posts_user_id" ON "companion_posts"("user_id");

-- CreateIndex
CREATE INDEX "idx_companion_posts_visibility_destination_start" ON "companion_posts"("visibility_status", "destination", "start_date");

-- CreateIndex
CREATE INDEX "idx_companion_requests_post_status" ON "companion_requests"("post_id", "status", "requested_at" DESC);

-- CreateIndex
CREATE INDEX "idx_companion_requests_user_status" ON "companion_requests"("user_id", "status", "requested_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_active_companion_request_per_user" ON "companion_requests"("post_id", "user_id") WHERE (status = ANY (ARRAY['pending'::text, 'approved'::text]));

-- CreateIndex
CREATE INDEX "idx_conversation_participants_user" ON "conversation_participants"("user_id", "joined_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_conversation_per_post" ON "conversations"("related_companion_post_id") WHERE (conversation_type = 'group_companion'::text);

-- CreateIndex
CREATE INDEX "idx_guide_availabilities_guide_date" ON "guide_availabilities"("guide_profile_id", "available_date");

-- CreateIndex
CREATE UNIQUE INDEX "guide_availabilities_guide_profile_id_available_date_start__key" ON "guide_availabilities"("guide_profile_id", "available_date", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "guide_profiles_user_id_key" ON "guide_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_guide_profiles_user_id" ON "guide_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_guide_profiles_visibility" ON "guide_profiles"("visibility_status", "verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "guide_reviews_tour_request_id_key" ON "guide_reviews"("tour_request_id");

-- CreateIndex
CREATE INDEX "idx_guide_reviews_guide" ON "guide_reviews"("guide_profile_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_guide_verification_documents_request" ON "guide_verification_documents"("verification_request_id");

-- CreateIndex
CREATE INDEX "idx_guide_verification_requests_guide" ON "guide_verification_requests"("guide_profile_id", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "idx_guide_verification_requests_status_submitted" ON "guide_verification_requests"("status", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_name_key" ON "provinces"("name");

-- CreateIndex
CREATE INDEX "idx_messages_conversation_sent" ON "messages"("conversation_id", "sent_at" DESC);

-- CreateIndex
CREATE INDEX "idx_notifications_user_read" ON "notifications"("user_id", "is_read", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_partner_accommodations_status" ON "partner_accommodations"("status", "province");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_transaction_code_key" ON "payment_transactions"("transaction_code");

-- CreateIndex
CREATE INDEX "idx_payment_transactions_request_status" ON "payment_transactions"("tour_request_id", "status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_payment_transactions_user_status" ON "payment_transactions"("user_id", "status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_payment_transactions_status_created" ON "payment_transactions"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_report_history_report" ON "report_processing_history"("report_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_reports_assigned_to" ON "reports"("assigned_to_user_id", "status");

-- CreateIndex
CREATE INDEX "idx_reports_status_created" ON "reports"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_reports_status_assigned_created" ON "reports"("status", "assigned_to_user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE INDEX "idx_tour_accommodations_tour" ON "tour_accommodations"("tour_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "tour_categories_name_key" ON "tour_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_tour_cover_image" ON "tour_images"("tour_id") WHERE (is_cover = true);

-- CreateIndex
CREATE INDEX "idx_tour_images_tour_id" ON "tour_images"("tour_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_tour_locations_tour_id" ON "tour_locations"("tour_id", "sequence_no");

-- CreateIndex
CREATE UNIQUE INDEX "tour_locations_tour_id_sequence_no_key" ON "tour_locations"("tour_id", "sequence_no");

-- CreateIndex
CREATE INDEX "idx_tour_requests_tour_status" ON "tour_requests"("tour_id", "status", "requested_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tour_requests_user_status" ON "tour_requests"("user_id", "status", "requested_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tour_requests_status_requested" ON "tour_requests"("status", "requested_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "tour_reviews_tour_request_id_key" ON "tour_reviews"("tour_request_id");

-- CreateIndex
CREATE INDEX "idx_tour_reviews_tour" ON "tour_reviews"("tour_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tours_category" ON "tours"("category_id");

-- CreateIndex
CREATE INDEX "idx_tours_created_at" ON "tours"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tours_guide" ON "tours"("guide_profile_id");

-- CreateIndex
CREATE INDEX "idx_tours_province_trgm" ON "tours" USING GIN ("province" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_tours_public_search" ON "tours"("province", "start_date", "price", "business_status", "visibility_status");

-- CreateIndex
CREATE INDEX "idx_tours_title_trgm" ON "tours" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_tours_guide_profile_id" ON "tours"("guide_profile_id");

-- CreateIndex
CREATE INDEX "idx_tours_visibility_business_created" ON "tours"("visibility_status", "business_status", "created_at");

-- CreateIndex
CREATE INDEX "tour_schedules_tour_id_idx" ON "tour_schedules"("tour_id");

-- CreateIndex
CREATE INDEX "tour_schedules_start_date_idx" ON "tour_schedules"("start_date");

-- CreateIndex
CREATE INDEX "idx_user_activity_logs_user_created" ON "user_activity_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_user_role_change_logs_actor_created" ON "user_role_change_logs"("changed_by_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_user_role_change_logs_role_created" ON "user_role_change_logs"("changed_role_code", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_user_role_change_logs_target_created" ON "user_role_change_logs"("target_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_user_roles_role_code" ON "user_roles"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_phone_not_null" ON "users"("phone") WHERE (phone IS NOT NULL);

-- CreateIndex
CREATE INDEX "idx_public_users_status_created" ON "users"("status", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "default_covers_url_key" ON "default_covers"("url");

-- CreateIndex
CREATE UNIQUE INDEX "tour_destinations_tour_id_sequence_no_key" ON "tour_destinations"("tour_id", "sequence_no");

-- CreateIndex
CREATE UNIQUE INDEX "tour_routes_tour_id_key" ON "tour_routes"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "companion_reviews_request_id_key" ON "companion_reviews"("request_id");

-- CreateIndex
CREATE INDEX "companion_reviews_host_id_idx" ON "companion_reviews"("host_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_disputes_tour_request_id_key" ON "tour_disputes"("tour_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_payment_transaction_id_key" ON "invoices"("payment_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- AddForeignKey
ALTER TABLE "auth"."identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_amr_claims" ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_challenges" ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_factors" ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_providers" ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."sso_domains" ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."webauthn_challenges" ADD CONSTRAINT "webauthn_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."webauthn_credentials" ADD CONSTRAINT "webauthn_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_actor_role_code_fkey" FOREIGN KEY ("actor_role_code") REFERENCES "roles"("role_code") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ai_chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_chat_sessions" ADD CONSTRAINT "ai_chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_posts" ADD CONSTRAINT "companion_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_requests" ADD CONSTRAINT "companion_requests_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "companion_posts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_requests" ADD CONSTRAINT "companion_requests_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_requests" ADD CONSTRAINT "companion_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_related_companion_post_id_fkey" FOREIGN KEY ("related_companion_post_id") REFERENCES "companion_posts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_related_tour_id_fkey" FOREIGN KEY ("related_tour_id") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_guides" ADD CONSTRAINT "favorite_guides_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_guides" ADD CONSTRAINT "favorite_guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_tours" ADD CONSTRAINT "favorite_tours_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_tours" ADD CONSTRAINT "favorite_tours_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_availabilities" ADD CONSTRAINT "guide_availabilities_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_languages" ADD CONSTRAINT "guide_languages_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_languages" ADD CONSTRAINT "guide_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_profiles" ADD CONSTRAINT "guide_profiles_home_province_id_fkey" FOREIGN KEY ("home_province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_profiles" ADD CONSTRAINT "guide_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_tour_request_id_fkey" FOREIGN KEY ("tour_request_id") REFERENCES "tour_requests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_skills" ADD CONSTRAINT "guide_skills_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_skills" ADD CONSTRAINT "guide_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_verification_documents" ADD CONSTRAINT "guide_verification_documents_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "guide_verification_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_verification_requests" ADD CONSTRAINT "guide_verification_requests_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guide_verification_requests" ADD CONSTRAINT "guide_verification_requests_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_tour_request_id_fkey" FOREIGN KEY ("tour_request_id") REFERENCES "tour_requests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report_processing_history" ADD CONSTRAINT "report_processing_history_action_by_user_id_fkey" FOREIGN KEY ("action_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report_processing_history" ADD CONSTRAINT "report_processing_history_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_companion_post_id_fkey" FOREIGN KEY ("companion_post_id") REFERENCES "companion_posts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_guide_review_id_fkey" FOREIGN KEY ("guide_review_id") REFERENCES "guide_reviews"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_tour_review_id_fkey" FOREIGN KEY ("tour_review_id") REFERENCES "tour_reviews"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_accommodations" ADD CONSTRAINT "tour_accommodations_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "partner_accommodations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_accommodations" ADD CONSTRAINT "tour_accommodations_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_images" ADD CONSTRAINT "tour_images_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_locations" ADD CONSTRAINT "tour_locations_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_requests" ADD CONSTRAINT "tour_requests_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_requests" ADD CONSTRAINT "tour_requests_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_requests" ADD CONSTRAINT "tour_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_requests" ADD CONSTRAINT "tour_requests_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "tour_schedules"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_reviews" ADD CONSTRAINT "tour_reviews_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_reviews" ADD CONSTRAINT "tour_reviews_tour_request_id_fkey" FOREIGN KEY ("tour_request_id") REFERENCES "tour_requests"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_reviews" ADD CONSTRAINT "tour_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_guide_profile_id_fkey" FOREIGN KEY ("guide_profile_id") REFERENCES "guide_profiles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_schedules" ADD CONSTRAINT "tour_schedules_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_preferred_language_id_fkey" FOREIGN KEY ("preferred_language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferred_categories" ADD CONSTRAINT "user_preferred_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferred_categories" ADD CONSTRAINT "user_preferred_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_change_logs" ADD CONSTRAINT "user_role_change_logs_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_change_logs" ADD CONSTRAINT "user_role_change_logs_changed_role_code_fkey" FOREIGN KEY ("changed_role_code") REFERENCES "roles"("role_code") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_change_logs" ADD CONSTRAINT "user_role_change_logs_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "roles"("role_code") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_home_province" FOREIGN KEY ("home_province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_routes" ADD CONSTRAINT "tour_routes_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "companion_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_paid_by_user_id_fkey" FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_expense_splits" ADD CONSTRAINT "trip_expense_splits_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "trip_expenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_expense_splits" ADD CONSTRAINT "trip_expense_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_reviews" ADD CONSTRAINT "companion_reviews_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "companion_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_reviews" ADD CONSTRAINT "companion_reviews_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "companion_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_reviews" ADD CONSTRAINT "companion_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companion_reviews" ADD CONSTRAINT "companion_reviews_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sos_alerts" ADD CONSTRAINT "sos_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sos_alerts" ADD CONSTRAINT "sos_alerts_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sos_alerts" ADD CONSTRAINT "sos_alerts_resolved_by_user_id_fkey" FOREIGN KEY ("resolved_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_disputes" ADD CONSTRAINT "tour_disputes_tour_request_id_fkey" FOREIGN KEY ("tour_request_id") REFERENCES "tour_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_disputes" ADD CONSTRAINT "tour_disputes_raised_by_user_id_fkey" FOREIGN KEY ("raised_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tour_disputes" ADD CONSTRAINT "tour_disputes_resolved_by_user_id_fkey" FOREIGN KEY ("resolved_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_payment_transaction_id_fkey" FOREIGN KEY ("payment_transaction_id") REFERENCES "payment_transactions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

