CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(500) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"author" varchar(200) DEFAULT 'Tim BSA GRC' NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"seo_title" varchar(500),
	"seo_description" text,
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"is_published" boolean DEFAULT true NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"reading_time" integer DEFAULT 5,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" varchar(500) NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100) DEFAULT 'Umum' NOT NULL,
	"service_slug" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"service" varchar(200) NOT NULL,
	"location" varchar(300) NOT NULL,
	"size" varchar(100),
	"message" text NOT NULL,
	"source" varchar(300),
	"whatsapp_link" text,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500),
	"category" varchar(100) NOT NULL,
	"location" varchar(200) NOT NULL,
	"year" varchar(20) NOT NULL,
	"image" text NOT NULL,
	"diameter" varchar(100),
	"height" varchar(100),
	"material" varchar(200),
	"client" varchar(200),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(300) NOT NULL,
	"short_title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"long_description" text NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb,
	"image" text NOT NULL,
	"original_image" text NOT NULL,
	"icon" varchar(50) NOT NULL,
	"price_range" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"landing_page" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" jsonb NOT NULL,
	"hero" jsonb NOT NULL,
	"usp" jsonb,
	"seo" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"location" varchar(300) NOT NULL,
	"role" varchar(200) DEFAULT 'Panitia Masjid' NOT NULL,
	"text" text NOT NULL,
	"result" varchar(300),
	"photo" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"category" varchar(100) DEFAULT 'Kubah GRC',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
