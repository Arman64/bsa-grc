CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"file_name" varchar(300) NOT NULL,
	"original_name" varchar(300),
	"size" integer NOT NULL,
	"type" varchar(100) NOT NULL,
	"folder" varchar(100) DEFAULT 'general',
	"alt" varchar(500),
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(300) NOT NULL,
	"description" text,
	"sections" jsonb NOT NULL,
	"seo_title" varchar(500),
	"seo_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "page_settings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb;