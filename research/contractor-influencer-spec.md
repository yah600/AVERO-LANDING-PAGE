# Contractor & Influencer Management — Feature Specification

**Document version:** 1.0
**Date:** February 13, 2026
**Status:** Draft
**Platform:** Avero (app.averocloud.com)
**Authors:** Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [Contractor Profiles and Directory](#3-contractor-profiles-and-directory)
4. [Contract Lifecycle Management](#4-contract-lifecycle-management)
5. [Influencer Campaign Tracking](#5-influencer-campaign-tracking)
6. [Payments and Commissions](#6-payments-and-commissions)
7. [Backend Architecture](#7-backend-architecture)
8. [Database Schema](#8-database-schema)
9. [API Endpoints](#9-api-endpoints)
10. [Frontend Pages and Components](#10-frontend-pages-and-components)
11. [Integration Points](#11-integration-points)
12. [Implementation Phases](#12-implementation-phases)
13. [Security Considerations](#13-security-considerations)
14. [Open Questions](#14-open-questions)

---

## 1. Executive Summary

Avero's core value proposition is an all-in-one marketing command center. Campaigns depend on external talent — videographers, designers, copywriters, influencers — but today there is no structured way to manage those relationships, track deliverables, or process payments from within the platform. Users resort to spreadsheets, disconnected invoicing tools, and manual UTM tracking.

This specification defines two tightly integrated feature sets:

- **Contractor Management** — a directory of external talent with searchable profiles, a full contract lifecycle (drafting through completion), milestone tracking, document management, and payment processing via Stripe Connect.
- **Influencer Campaign Tracking** — the ability to attach influencer placements to existing Avero campaigns, track per-placement deliverables across social platforms, auto-generate UTM-tagged tracking links, and aggregate performance metrics (impressions, engagements, clicks, conversions) back into the campaign analytics module.

Together these features close the loop between campaign planning and campaign execution, keeping all external-talent workflows inside Avero.

---

## 2. Goals and Non-Goals

### Goals

| ID | Goal |
|----|------|
| G1 | Provide a searchable, filterable contractor directory so teams can find and vet external talent without leaving Avero. |
| G2 | Formalize contractor relationships through structured contracts with milestone-based tracking. |
| G3 | Enable end-to-end influencer campaign management tied to the existing campaigns module. |
| G4 | Automate UTM generation and consolidate influencer performance data alongside owned-media metrics. |
| G5 | Process contractor and influencer payments through Stripe Connect, including commission logic and tax document collection. |
| G6 | Maintain Avero's microservice boundary discipline — new features ship as two new crates (`contractors`, `contracts`) with clear API boundaries. |

### Non-Goals

| ID | Non-Goal |
|----|----------|
| NG1 | Building a public-facing marketplace where contractors self-register (contractor profiles are created by org admins). |
| NG2 | Real-time chat or messaging between org members and contractors (use existing communication channels). |
| NG3 | Automated influencer discovery or scraping social APIs for follower counts (manual entry for v1). |
| NG4 | Full accounting / general-ledger integration beyond Stripe payment records. |
| NG5 | Mobile-native screens (responsive web is sufficient for v1). |

---

## 3. Contractor Profiles and Directory

### 3.1 Contractor Profile Data Model

Each contractor profile represents an external individual or company that an Avero organization works with.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning organization. |
| `display_name` | string(200) | yes | Public-facing name. |
| `email` | string(255) | yes | Primary contact email. Unique within org. |
| `phone` | string(30) | no | Contact phone number. |
| `company_name` | string(200) | no | Company or agency name, if applicable. |
| `bio` | text | no | Free-text description, max 2000 chars. |
| `avatar_url` | string(500) | no | Profile image URL (S3 or external). |
| `specialties` | enum[] | yes | One or more from the specialty enum (see below). |
| `hourly_rate_cents` | int | no | Default hourly rate in cents (USD). |
| `day_rate_cents` | int | no | Default day rate in cents (USD). |
| `currency` | string(3) | yes | ISO 4217, default `USD`. |
| `availability` | enum | yes | `available`, `busy`, `unavailable`, `on_leave`. |
| `portfolio_links` | jsonb | no | Array of `{ label, url }` objects, max 10. |
| `social_links` | jsonb | no | `{ instagram?, twitter?, linkedin?, website? }` |
| `rating` | decimal(3,2) | auto | Computed average from completed contracts. |
| `total_projects` | int | auto | Count of completed contracts. |
| `tags` | string[] | no | Freeform tags for internal categorization. |
| `notes` | text | no | Internal-only notes (not visible to contractor). |
| `tax_status` | enum | no | `w9_pending`, `w9_received`, `w8ben_pending`, `w8ben_received`, `exempt`. |
| `stripe_connect_id` | string(100) | no | Stripe Connect account ID for payouts. |
| `is_active` | bool | yes | Soft-delete flag. Default `true`. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

### 3.2 Specialty Enum

```
videography
photography
editing
design
copywriting
social_media
influencer_marketing
seo
paid_ads
```

A contractor may hold multiple specialties. Stored as a Postgres `text[]` column with a check constraint limiting values to the enum set.

### 3.3 Directory Search and Filtering

The contractor directory is a paginated, server-side filtered list.

**Supported filters:**

| Filter | Type | Behavior |
|--------|------|----------|
| `q` | string | Full-text search across `display_name`, `company_name`, `bio`, `tags`. Uses `tsvector` index. |
| `specialties` | string[] | AND/OR toggle. Default OR — contractor matches if they have any of the listed specialties. |
| `availability` | enum[] | Include only contractors with these availability statuses. |
| `min_rating` | decimal | Minimum average rating (0.00 - 5.00). |
| `max_hourly_rate` | int | Maximum hourly rate in cents. |
| `tags` | string[] | Overlap match against contractor tags. |
| `sort_by` | enum | `rating_desc`, `rate_asc`, `rate_desc`, `name_asc`, `recent`. Default `rating_desc`. |
| `page` | int | 1-indexed. Default 1. |
| `per_page` | int | 10-50. Default 20. |

**Response envelope:**

```json
{
  "contractors": [ ... ],
  "total": 142,
  "page": 1,
  "per_page": 20,
  "total_pages": 8
}
```

### 3.4 Rating System

After a contract reaches `Completed` status, the org member who managed the contract is prompted to leave a rating.

| Field | Type | Description |
|-------|------|-------------|
| `contract_id` | UUID | The completed contract. |
| `contractor_id` | UUID | The rated contractor. |
| `rated_by` | UUID | The org user who submitted the rating. |
| `score` | int | 1-5 integer scale. |
| `comment` | text | Optional comment, max 500 chars. |
| `created_at` | timestamptz | |

The contractor's `rating` field is recomputed as a simple average of all ratings on each insert/update.

### 3.5 Project History

The contractor profile page displays a timeline of all contracts associated with that contractor within the org, showing:

- Contract title and status
- Date range (start to end or current)
- Total value paid
- Linked campaign (if any)
- Rating given (if completed)

---

## 4. Contract Lifecycle Management

### 4.1 Contract Types

| Type | Description | Billing Model |
|------|-------------|---------------|
| `fixed` | Flat fee for a defined scope of work. | Single payment or milestone-based splits. |
| `hourly` | Billed per hour with optional cap. | Periodic invoicing against logged hours. |
| `milestone` | Payment tied to specific deliverable milestones. | Each milestone has its own amount and due date. |

### 4.2 Contract Data Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning organization. |
| `contractor_id` | UUID | yes | FK to contractor profile. |
| `campaign_id` | UUID | no | FK to campaigns service — links contract to a campaign. |
| `title` | string(300) | yes | Human-readable title. |
| `description` | text | no | Scope summary. |
| `contract_type` | enum | yes | `fixed`, `hourly`, `milestone`. |
| `status` | enum | yes | See status flow below. |
| `total_value_cents` | bigint | yes | Total contract value in cents. |
| `currency` | string(3) | yes | ISO 4217. |
| `hourly_rate_cents` | int | no | Rate for hourly contracts. |
| `hourly_cap_hours` | decimal | no | Max billable hours (hourly contracts). |
| `start_date` | date | no | Contract start date. |
| `end_date` | date | no | Contract end date. |
| `sow_document_id` | UUID | no | FK to uploaded SOW document. |
| `nda_document_id` | UUID | no | FK to uploaded NDA document. |
| `terms_text` | text | no | Inline contract terms (alternative to uploaded doc). |
| `created_by` | UUID | yes | Org user who created the contract. |
| `approved_by` | UUID | no | Org user who approved/activated. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

### 4.3 Status Flow

```
                    ┌──────────────┐
                    │    Draft     │
                    └──────┬───────┘
                           │ submit
                           v
                    ┌──────────────┐
            ┌───── │   Pending    │ ─────┐
            │      └──────┬───────┘      │
            │ reject      │ approve      │ cancel
            v             v              v
     ┌──────────┐  ┌──────────────┐  ┌───────────┐
     │  Draft   │  │    Active    │  │ Cancelled │
     └──────────┘  └──────┬───────┘  └───────────┘
                          │
                 complete │ cancel
                    ┌─────┴─────┐
                    v           v
             ┌───────────┐ ┌───────────┐
             │ Completed │ │ Cancelled │
             └───────────┘ └───────────┘
```

**Status definitions:**

| Status | Description |
|--------|-------------|
| `draft` | Contract is being authored. Editable. Not visible to contractor. |
| `pending` | Submitted for internal approval. Read-only to author. |
| `active` | Approved and in progress. Milestones can be marked complete. Payments can be issued. |
| `completed` | All milestones delivered, final payment issued. Triggers rating prompt. |
| `cancelled` | Terminated before completion. Records reason for cancellation. |

**Transition rules:**

- Only users with `contracts:approve` permission can move `pending` to `active`.
- Moving to `cancelled` requires a `cancellation_reason` (text, required).
- Moving to `completed` requires all milestones to be in `approved` status (for milestone contracts) or explicit confirmation (for fixed/hourly).

### 4.4 Milestones

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `contract_id` | UUID | yes | Parent contract. |
| `title` | string(300) | yes | Milestone name. |
| `description` | text | no | What constitutes completion. |
| `amount_cents` | bigint | yes | Payment amount for this milestone. |
| `due_date` | date | no | Expected completion date. |
| `status` | enum | yes | `pending`, `in_progress`, `submitted`, `approved`, `rejected`, `paid`. |
| `submitted_at` | timestamptz | no | When contractor marked as submitted. |
| `approved_at` | timestamptz | no | When org approved the deliverable. |
| `paid_at` | timestamptz | no | When payment was issued. |
| `sort_order` | int | yes | Display ordering. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

**Milestone status flow:**

```
pending → in_progress → submitted → approved → paid
                                  ↘ rejected → in_progress (resubmit)
```

**Validation:** The sum of all milestone `amount_cents` must equal the contract `total_value_cents`. The API enforces this on create and update.

### 4.5 Document Management

Contracts support file attachments for SOWs, NDAs, deliverables, and other supporting documents.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning org. |
| `contract_id` | UUID | yes | Parent contract. |
| `uploaded_by` | UUID | yes | User who uploaded. |
| `file_name` | string(500) | yes | Original file name. |
| `file_type` | string(100) | yes | MIME type. |
| `file_size_bytes` | bigint | yes | Size in bytes. |
| `s3_key` | string(1000) | yes | S3 object key. |
| `document_category` | enum | yes | `sow`, `nda`, `deliverable`, `invoice`, `tax_form`, `other`. |
| `created_at` | timestamptz | auto | |

**Upload flow:**

1. Client requests a presigned S3 upload URL from the API.
2. Client uploads directly to S3.
3. Client confirms upload by POSTing the document metadata to the API.
4. API verifies the S3 object exists and records the metadata.

**Constraints:**

- Max file size: 50 MB.
- Allowed MIME types: `application/pdf`, `image/png`, `image/jpeg`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`.
- Max 20 documents per contract.

### 4.6 SOW and NDA Templates

Organizations can maintain reusable templates for statements of work and non-disclosure agreements.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning org. |
| `name` | string(200) | yes | Template name. |
| `template_type` | enum | yes | `sow`, `nda`. |
| `content` | text | yes | Template body with placeholder variables. |
| `variables` | jsonb | yes | Array of `{ key, label, default_value? }` placeholder definitions. |
| `is_default` | bool | yes | Whether this is the org default for its type. |
| `created_by` | UUID | yes | |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

**Placeholder variables** use `{{variable_name}}` syntax. Standard variables include:

- `{{contractor_name}}` — contractor display name
- `{{contractor_company}}` — contractor company name
- `{{org_name}}` — organization name
- `{{contract_title}}` — contract title
- `{{start_date}}` — formatted start date
- `{{end_date}}` — formatted end date
- `{{total_value}}` — formatted total value
- `{{effective_date}}` — date the contract becomes active

When a contract is created from a template, the API hydrates the template with the contract's actual values and stores the rendered output as a document attachment.

---

## 5. Influencer Campaign Tracking

### 5.1 Overview

Influencer campaigns are a specialized extension of the existing campaigns module. An influencer campaign links one or more influencer-contractor placements to a parent campaign, tracking per-placement deliverables, performance metrics, and costs.

### 5.2 Influencer Placement Data Model

A placement represents a single influencer's participation in a campaign on a specific platform.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning org. |
| `campaign_id` | UUID | yes | FK to campaigns service. |
| `contract_id` | UUID | no | FK to contract (if a formal contract exists). |
| `contractor_id` | UUID | yes | The influencer (must have `influencer_marketing` specialty). |
| `platform` | enum | yes | `instagram`, `tiktok`, `youtube`, `linkedin`, `twitter`. |
| `handle` | string(200) | yes | The influencer's handle/username on the platform. |
| `follower_count` | int | no | Approximate follower count at time of placement. |
| `placement_fee_cents` | bigint | yes | Total fee for this placement. |
| `currency` | string(3) | yes | ISO 4217. |
| `status` | enum | yes | `planned`, `briefed`, `content_review`, `approved`, `published`, `completed`. |
| `brief_notes` | text | no | Creative brief or guidelines for the influencer. |
| `publish_date` | date | no | Scheduled or actual publish date. |
| `tracking_url` | string(2000) | auto | Generated UTM-tagged tracking URL. |
| `utm_params` | jsonb | auto | `{ source, medium, campaign, content, term }`. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

### 5.3 Deliverables

Each placement can require one or more deliverables.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `placement_id` | UUID | yes | Parent placement. |
| `deliverable_type` | enum | yes | `post`, `story`, `reel`, `video`, `thread`. |
| `title` | string(300) | yes | Deliverable name (e.g., "Product unboxing reel"). |
| `description` | text | no | Detailed requirements. |
| `status` | enum | yes | `pending`, `in_progress`, `submitted`, `revision_requested`, `approved`, `published`. |
| `content_url` | string(2000) | no | URL to the published content (set after publishing). |
| `due_date` | date | no | |
| `submitted_at` | timestamptz | no | |
| `approved_at` | timestamptz | no | |
| `published_at` | timestamptz | no | |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

### 5.4 Performance Metrics

Metrics are recorded per-placement at regular intervals (daily or on-demand).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `placement_id` | UUID | yes | Parent placement. |
| `recorded_at` | timestamptz | yes | When this snapshot was taken. |
| `impressions` | bigint | no | Total impressions. |
| `reach` | bigint | no | Unique accounts reached. |
| `engagements` | bigint | no | Total engagements (likes + comments + shares + saves). |
| `likes` | bigint | no | |
| `comments` | bigint | no | |
| `shares` | bigint | no | |
| `saves` | bigint | no | |
| `clicks` | bigint | no | Link clicks from tracking URL. |
| `conversions` | bigint | no | Tracked conversions (requires integration). |
| `conversion_value_cents` | bigint | no | Total conversion value in cents. |
| `video_views` | bigint | no | Video view count (video content only). |
| `avg_watch_time_seconds` | decimal | no | Average watch duration. |
| `engagement_rate` | decimal(7,4) | auto | Computed: `engagements / impressions * 100`. |
| `cpm_cents` | bigint | auto | Computed: `placement_fee / impressions * 1000`. |
| `cpc_cents` | bigint | auto | Computed: `placement_fee / clicks`. |
| `source` | enum | yes | `manual`, `api_sync`, `utm_tracked`. |
| `created_at` | timestamptz | auto | |

Computed fields (`engagement_rate`, `cpm_cents`, `cpc_cents`) are calculated on write by the API and stored for query performance.

### 5.5 UTM Parameter Generation

When a placement is created, the system auto-generates UTM parameters:

| Parameter | Value | Example |
|-----------|-------|---------|
| `utm_source` | Platform name | `instagram` |
| `utm_medium` | Fixed: `influencer` | `influencer` |
| `utm_campaign` | Campaign slug (lowercase, hyphenated) | `summer-launch-2026` |
| `utm_content` | `{contractor_handle}_{deliverable_type}` | `jane_doe_reel` |
| `utm_term` | Placement ID (for deduplication) | `a1b2c3d4` |

The tracking URL is constructed as:

```
{campaign_base_url}?utm_source={source}&utm_medium=influencer&utm_campaign={slug}&utm_content={content}&utm_term={term}
```

Users can override any parameter before the placement is published. Once published, UTM parameters are locked.

### 5.6 Placement Status Flow

```
planned → briefed → content_review → approved → published → completed
                                   ↘ revision_requested → content_review
```

| Status | Description |
|--------|-------------|
| `planned` | Placement negotiated but not yet briefed. |
| `briefed` | Creative brief sent to influencer. |
| `content_review` | Influencer submitted draft content for review. |
| `approved` | Content approved, ready to publish. |
| `revision_requested` | Content needs changes before approval. |
| `published` | Content is live. Tracking begins. |
| `completed` | Campaign period ended. Final metrics recorded. |

### 5.7 Campaign-Level Aggregation

The campaigns service exposes an endpoint that aggregates influencer metrics across all placements for a campaign:

- Total spend across all placements
- Combined impressions, engagements, clicks, conversions
- Blended engagement rate, CPM, CPC
- Per-platform breakdown
- Top-performing placements (by engagement rate)
- ROI calculation: `(conversion_value - total_spend) / total_spend * 100`

---

## 6. Payments and Commissions

### 6.1 Payment Processing Overview

Payments flow through Stripe Connect in "destination charges" mode:

1. The Avero organization is the platform account.
2. Each contractor onboards via Stripe Connect Express to create a connected account.
3. When a milestone is approved, a payment is initiated from the org's Stripe account to the contractor's connected account.
4. Avero takes a platform fee (configurable per org, default 0%).

### 6.2 Stripe Connect Onboarding Flow

1. Org admin invites contractor to onboard.
2. API creates a Stripe Connect account and generates an onboarding link.
3. Contractor completes Stripe's hosted onboarding (identity verification, bank account).
4. Stripe webhook `account.updated` fires; API updates `stripe_connect_id` and `tax_status`.
5. Contractor is now eligible for payouts.

### 6.3 Payment Data Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning org. |
| `contract_id` | UUID | yes | Parent contract. |
| `milestone_id` | UUID | no | Linked milestone (null for non-milestone payments). |
| `contractor_id` | UUID | yes | Recipient. |
| `amount_cents` | bigint | yes | Gross payment amount. |
| `platform_fee_cents` | bigint | yes | Avero platform fee. |
| `net_amount_cents` | bigint | yes | Amount received by contractor. |
| `currency` | string(3) | yes | ISO 4217. |
| `status` | enum | yes | `pending`, `processing`, `succeeded`, `failed`, `refunded`. |
| `stripe_payment_intent_id` | string(100) | no | Stripe PaymentIntent ID. |
| `stripe_transfer_id` | string(100) | no | Stripe Transfer ID. |
| `failure_reason` | text | no | Stripe failure message, if applicable. |
| `paid_at` | timestamptz | no | When payment succeeded. |
| `created_by` | UUID | yes | Org user who initiated the payment. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

### 6.4 Batch Payment Processing

Org admins can select multiple approved milestones across contracts and process them as a batch:

1. User selects milestones from the payments dashboard.
2. API validates all milestones are in `approved` status and all contractors have active Stripe Connect accounts.
3. API creates a batch record and initiates individual Stripe transfers.
4. Each transfer is processed independently — partial batch success is allowed.
5. Batch status is `completed` when all transfers resolve (success or failure).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Batch ID. |
| `org_id` | UUID | yes | |
| `total_amount_cents` | bigint | yes | Sum of all payments in batch. |
| `payment_count` | int | yes | Number of payments in batch. |
| `succeeded_count` | int | auto | Payments that succeeded. |
| `failed_count` | int | auto | Payments that failed. |
| `status` | enum | yes | `pending`, `processing`, `completed`, `partially_failed`. |
| `created_by` | UUID | yes | |
| `created_at` | timestamptz | auto | |
| `completed_at` | timestamptz | no | |

### 6.5 Commission Rules

Commission rules define how contractor compensation is calculated, primarily for influencer placements.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | auto | Primary key. |
| `org_id` | UUID | yes | Owning org. |
| `name` | string(200) | yes | Rule name. |
| `commission_type` | enum | yes | `percentage`, `fixed`, `per_deliverable`. |
| `rate_percentage` | decimal(5,2) | no | For percentage type: e.g., 15.00 = 15%. |
| `fixed_amount_cents` | bigint | no | For fixed type: flat amount per contract. |
| `per_deliverable_cents` | bigint | no | For per_deliverable type: amount per completed deliverable. |
| `applies_to_specialties` | text[] | no | Limit rule to specific specialties. Null = all. |
| `min_contract_value_cents` | bigint | no | Minimum contract value for rule to apply. |
| `max_contract_value_cents` | bigint | no | Maximum contract value for rule to apply. |
| `is_active` | bool | yes | Default `true`. |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

When a contract is created, the system evaluates applicable commission rules (most specific match wins) and attaches the computed commission to the contract record.

### 6.6 Tax Document Collection

Before a contractor can receive payments exceeding $600 USD in a calendar year, they must have a valid tax document on file:

- **US-based contractors:** W-9 form.
- **International contractors:** W-8BEN or W-8BEN-E form.

The system tracks tax document status on the contractor profile (`tax_status` field) and blocks payment processing if the threshold is met without a valid document. Tax documents are uploaded via the standard document management system with `document_category = 'tax_form'`.

---

## 7. Backend Architecture

### 7.1 Service Topology

The Avero backend currently runs 6 microservices. This specification adds 2 new Rust crates to the workspace:

```
avero-backend/
├── crates/
│   ├── gateway/          # API gateway, routing, auth middleware
│   ├── auth/             # Authentication, sessions, permissions
│   ├── campaigns/        # Campaign CRUD, analytics
│   ├── customers/        # Customer/contact management
│   ├── content/          # Content library, assets
│   ├── integrations/     # Third-party integrations
│   ├── contractors/      # NEW — Contractor profiles, directory, ratings
│   └── contracts/        # NEW — Contracts, milestones, payments, influencer placements
```

### 7.2 Crate: `contractors`

**Responsibilities:**

- Contractor profile CRUD
- Directory search with full-text search and filtering
- Rating submission and aggregation
- Stripe Connect onboarding flow
- Tax status tracking

**Dependencies:**

- `auth` — permission checks
- `contracts` — project history aggregation
- Stripe SDK (via `integrations` crate or direct)

### 7.3 Crate: `contracts`

**Responsibilities:**

- Contract CRUD and status transitions
- Milestone management
- Document upload and management (presigned URLs)
- Template CRUD and hydration
- Influencer placement CRUD and status management
- Deliverable tracking
- Performance metric recording and aggregation
- UTM generation
- Payment initiation and batch processing
- Commission rule engine

**Dependencies:**

- `auth` — permission checks
- `contractors` — contractor validation
- `campaigns` — campaign linkage and metric aggregation
- `integrations` — Stripe payment processing
- S3 SDK — document storage

### 7.4 Gateway Routing

The gateway crate mounts the new crates under these prefixes:

```rust
// In gateway/src/routes.rs
let app = Router::new()
    // ... existing routes ...
    .nest("/api/v1/contractors", contractors::routes())
    .nest("/api/v1/contracts", contracts::routes())
    .nest("/api/v1/placements", contracts::placement_routes())
    .nest("/api/v1/payments", contracts::payment_routes());
```

### 7.5 Permission Model

New permissions to add to the RBAC system:

| Permission | Description |
|------------|-------------|
| `contractors:read` | View contractor profiles and directory. |
| `contractors:write` | Create and edit contractor profiles. |
| `contractors:delete` | Deactivate contractor profiles. |
| `contracts:read` | View contracts and milestones. |
| `contracts:write` | Create and edit contracts. |
| `contracts:approve` | Approve contracts (pending to active). |
| `contracts:delete` | Cancel contracts. |
| `placements:read` | View influencer placements and metrics. |
| `placements:write` | Create and manage placements. |
| `payments:read` | View payment records. |
| `payments:write` | Initiate and process payments. |
| `payments:batch` | Process batch payments. |

---

## 8. Database Schema

All tables are created in the `public` schema. UUIDs use `gen_random_uuid()`. Timestamps default to `now()`.

### 8.1 Table: `contractors`

```sql
CREATE TABLE contractors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    display_name    VARCHAR(200) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    company_name    VARCHAR(200),
    bio             TEXT CHECK (char_length(bio) <= 2000),
    avatar_url      VARCHAR(500),
    specialties     TEXT[] NOT NULL DEFAULT '{}',
    hourly_rate_cents INTEGER CHECK (hourly_rate_cents >= 0),
    day_rate_cents  INTEGER CHECK (day_rate_cents >= 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    availability    VARCHAR(20) NOT NULL DEFAULT 'available'
                    CHECK (availability IN ('available', 'busy', 'unavailable', 'on_leave')),
    portfolio_links JSONB DEFAULT '[]'::jsonb,
    social_links    JSONB DEFAULT '{}'::jsonb,
    rating          NUMERIC(3,2) DEFAULT 0.00,
    total_projects  INTEGER NOT NULL DEFAULT 0,
    tags            TEXT[] DEFAULT '{}',
    notes           TEXT,
    tax_status      VARCHAR(30) DEFAULT 'w9_pending'
                    CHECK (tax_status IN ('w9_pending', 'w9_received', 'w8ben_pending', 'w8ben_received', 'exempt')),
    stripe_connect_id VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_contractor_email_per_org UNIQUE (org_id, email)
);

CREATE INDEX idx_contractors_org_id ON contractors(org_id) WHERE is_active = TRUE;
CREATE INDEX idx_contractors_specialties ON contractors USING GIN (specialties);
CREATE INDEX idx_contractors_availability ON contractors(org_id, availability) WHERE is_active = TRUE;
CREATE INDEX idx_contractors_rating ON contractors(org_id, rating DESC) WHERE is_active = TRUE;

-- Full-text search index
ALTER TABLE contractors ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(display_name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(company_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(bio, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
    ) STORED;

CREATE INDEX idx_contractors_search ON contractors USING GIN (search_vector);
```

### 8.2 Table: `contractor_ratings`

```sql
CREATE TABLE contractor_ratings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    contractor_id   UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    rated_by        UUID NOT NULL REFERENCES users(id),
    score           INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment         TEXT CHECK (char_length(comment) <= 500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_one_rating_per_contract UNIQUE (contract_id)
);

CREATE INDEX idx_ratings_contractor ON contractor_ratings(contractor_id);
```

### 8.3 Table: `contracts`

```sql
CREATE TABLE contracts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contractor_id       UUID NOT NULL REFERENCES contractors(id),
    campaign_id         UUID,  -- FK enforced at application level (cross-service)
    title               VARCHAR(300) NOT NULL,
    description         TEXT,
    contract_type       VARCHAR(20) NOT NULL
                        CHECK (contract_type IN ('fixed', 'hourly', 'milestone')),
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'pending', 'active', 'completed', 'cancelled')),
    total_value_cents   BIGINT NOT NULL CHECK (total_value_cents >= 0),
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
    hourly_rate_cents   INTEGER CHECK (hourly_rate_cents >= 0),
    hourly_cap_hours    NUMERIC(10,2),
    start_date          DATE,
    end_date            DATE,
    sow_document_id     UUID,
    nda_document_id     UUID,
    terms_text          TEXT,
    cancellation_reason TEXT,
    commission_amount_cents BIGINT DEFAULT 0,
    commission_rule_id  UUID,
    created_by          UUID NOT NULL REFERENCES users(id),
    approved_by         UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_hourly_fields CHECK (
        (contract_type != 'hourly') OR (hourly_rate_cents IS NOT NULL)
    ),
    CONSTRAINT chk_date_range CHECK (
        (start_date IS NULL) OR (end_date IS NULL) OR (end_date >= start_date)
    )
);

CREATE INDEX idx_contracts_org_id ON contracts(org_id);
CREATE INDEX idx_contracts_contractor ON contracts(contractor_id);
CREATE INDEX idx_contracts_campaign ON contracts(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_contracts_status ON contracts(org_id, status);
```

### 8.4 Table: `contract_milestones`

```sql
CREATE TABLE contract_milestones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    amount_cents    BIGINT NOT NULL CHECK (amount_cents >= 0),
    due_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid')),
    submitted_at    TIMESTAMPTZ,
    approved_at     TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_milestones_contract ON contract_milestones(contract_id);
CREATE INDEX idx_milestones_status ON contract_milestones(contract_id, status);
```

### 8.5 Table: `contract_documents`

```sql
CREATE TABLE contract_documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contract_id         UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    uploaded_by         UUID NOT NULL REFERENCES users(id),
    file_name           VARCHAR(500) NOT NULL,
    file_type           VARCHAR(100) NOT NULL,
    file_size_bytes     BIGINT NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 52428800),
    s3_key              VARCHAR(1000) NOT NULL,
    document_category   VARCHAR(20) NOT NULL
                        CHECK (document_category IN ('sow', 'nda', 'deliverable', 'invoice', 'tax_form', 'other')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_contract ON contract_documents(contract_id);
```

### 8.6 Table: `contract_templates`

```sql
CREATE TABLE contract_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    template_type   VARCHAR(10) NOT NULL CHECK (template_type IN ('sow', 'nda')),
    content         TEXT NOT NULL,
    variables       JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_templates_org ON contract_templates(org_id);
-- Ensure at most one default per type per org
CREATE UNIQUE INDEX idx_templates_default ON contract_templates(org_id, template_type) WHERE is_default = TRUE;
```

### 8.7 Table: `influencer_placements`

```sql
CREATE TABLE influencer_placements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id         UUID NOT NULL,  -- FK enforced at application level
    contract_id         UUID REFERENCES contracts(id),
    contractor_id       UUID NOT NULL REFERENCES contractors(id),
    platform            VARCHAR(20) NOT NULL
                        CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'linkedin', 'twitter')),
    handle              VARCHAR(200) NOT NULL,
    follower_count      INTEGER CHECK (follower_count >= 0),
    placement_fee_cents BIGINT NOT NULL CHECK (placement_fee_cents >= 0),
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
    status              VARCHAR(30) NOT NULL DEFAULT 'planned'
                        CHECK (status IN ('planned', 'briefed', 'content_review', 'approved',
                                          'revision_requested', 'published', 'completed')),
    brief_notes         TEXT,
    publish_date        DATE,
    tracking_url        VARCHAR(2000),
    utm_params          JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_placements_campaign ON influencer_placements(campaign_id);
CREATE INDEX idx_placements_contractor ON influencer_placements(contractor_id);
CREATE INDEX idx_placements_org_status ON influencer_placements(org_id, status);
```

### 8.8 Table: `placement_deliverables`

```sql
CREATE TABLE placement_deliverables (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement_id        UUID NOT NULL REFERENCES influencer_placements(id) ON DELETE CASCADE,
    deliverable_type    VARCHAR(20) NOT NULL
                        CHECK (deliverable_type IN ('post', 'story', 'reel', 'video', 'thread')),
    title               VARCHAR(300) NOT NULL,
    description         TEXT,
    status              VARCHAR(30) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'in_progress', 'submitted',
                                          'revision_requested', 'approved', 'published')),
    content_url         VARCHAR(2000),
    due_date            DATE,
    submitted_at        TIMESTAMPTZ,
    approved_at         TIMESTAMPTZ,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deliverables_placement ON placement_deliverables(placement_id);
```

### 8.9 Table: `placement_metrics`

```sql
CREATE TABLE placement_metrics (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement_id            UUID NOT NULL REFERENCES influencer_placements(id) ON DELETE CASCADE,
    recorded_at             TIMESTAMPTZ NOT NULL,
    impressions             BIGINT DEFAULT 0,
    reach                   BIGINT DEFAULT 0,
    engagements             BIGINT DEFAULT 0,
    likes                   BIGINT DEFAULT 0,
    comments                BIGINT DEFAULT 0,
    shares                  BIGINT DEFAULT 0,
    saves                   BIGINT DEFAULT 0,
    clicks                  BIGINT DEFAULT 0,
    conversions             BIGINT DEFAULT 0,
    conversion_value_cents  BIGINT DEFAULT 0,
    video_views             BIGINT DEFAULT 0,
    avg_watch_time_seconds  NUMERIC(10,2),
    engagement_rate         NUMERIC(7,4) DEFAULT 0.0,
    cpm_cents               BIGINT DEFAULT 0,
    cpc_cents               BIGINT DEFAULT 0,
    source                  VARCHAR(20) NOT NULL DEFAULT 'manual'
                            CHECK (source IN ('manual', 'api_sync', 'utm_tracked')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_metrics_placement ON placement_metrics(placement_id, recorded_at DESC);
```

### 8.10 Table: `contractor_payments`

```sql
CREATE TABLE contractor_payments (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id                      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contract_id                 UUID NOT NULL REFERENCES contracts(id),
    milestone_id                UUID REFERENCES contract_milestones(id),
    contractor_id               UUID NOT NULL REFERENCES contractors(id),
    batch_id                    UUID REFERENCES payment_batches(id),
    amount_cents                BIGINT NOT NULL CHECK (amount_cents > 0),
    platform_fee_cents          BIGINT NOT NULL DEFAULT 0,
    net_amount_cents            BIGINT NOT NULL CHECK (net_amount_cents > 0),
    currency                    VARCHAR(3) NOT NULL DEFAULT 'USD',
    status                      VARCHAR(20) NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    stripe_payment_intent_id    VARCHAR(100),
    stripe_transfer_id          VARCHAR(100),
    failure_reason              TEXT,
    paid_at                     TIMESTAMPTZ,
    created_by                  UUID NOT NULL REFERENCES users(id),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_contract ON contractor_payments(contract_id);
CREATE INDEX idx_payments_contractor ON contractor_payments(contractor_id);
CREATE INDEX idx_payments_batch ON contractor_payments(batch_id) WHERE batch_id IS NOT NULL;
CREATE INDEX idx_payments_status ON contractor_payments(org_id, status);
```

### 8.11 Table: `payment_batches`

```sql
CREATE TABLE payment_batches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    total_amount_cents  BIGINT NOT NULL,
    payment_count       INTEGER NOT NULL,
    succeeded_count     INTEGER NOT NULL DEFAULT 0,
    failed_count        INTEGER NOT NULL DEFAULT 0,
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'processing', 'completed', 'partially_failed')),
    created_by          UUID NOT NULL REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at        TIMESTAMPTZ
);

CREATE INDEX idx_batches_org ON payment_batches(org_id);
```

### 8.12 Table: `commission_rules`

```sql
CREATE TABLE commission_rules (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id                      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                        VARCHAR(200) NOT NULL,
    commission_type             VARCHAR(20) NOT NULL
                                CHECK (commission_type IN ('percentage', 'fixed', 'per_deliverable')),
    rate_percentage             NUMERIC(5,2) CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
    fixed_amount_cents          BIGINT CHECK (fixed_amount_cents >= 0),
    per_deliverable_cents       BIGINT CHECK (per_deliverable_cents >= 0),
    applies_to_specialties      TEXT[],
    min_contract_value_cents    BIGINT,
    max_contract_value_cents    BIGINT,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_commission_value CHECK (
        (commission_type = 'percentage' AND rate_percentage IS NOT NULL) OR
        (commission_type = 'fixed' AND fixed_amount_cents IS NOT NULL) OR
        (commission_type = 'per_deliverable' AND per_deliverable_cents IS NOT NULL)
    )
);

CREATE INDEX idx_commission_rules_org ON commission_rules(org_id) WHERE is_active = TRUE;
```

---

## 9. API Endpoints

### 9.1 Contractor Endpoints (8 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 1 | `GET` | `/api/v1/contractors` | List/search contractors with filters and pagination. | `contractors:read` |
| 2 | `POST` | `/api/v1/contractors` | Create a new contractor profile. | `contractors:write` |
| 3 | `GET` | `/api/v1/contractors/:id` | Get contractor profile with computed stats. | `contractors:read` |
| 4 | `PUT` | `/api/v1/contractors/:id` | Update contractor profile fields. | `contractors:write` |
| 5 | `DELETE` | `/api/v1/contractors/:id` | Soft-delete (set `is_active = false`). | `contractors:delete` |
| 6 | `POST` | `/api/v1/contractors/:id/ratings` | Submit a rating for a contractor (requires completed contract). | `contracts:write` |
| 7 | `POST` | `/api/v1/contractors/:id/stripe-onboard` | Generate Stripe Connect onboarding link. | `payments:write` |
| 8 | `GET` | `/api/v1/contractors/:id/history` | Get contractor's project history within org. | `contractors:read` |

### 9.2 Contract Endpoints (10 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 9 | `GET` | `/api/v1/contracts` | List contracts with filters (status, contractor, campaign). | `contracts:read` |
| 10 | `POST` | `/api/v1/contracts` | Create a new contract (starts in `draft`). | `contracts:write` |
| 11 | `GET` | `/api/v1/contracts/:id` | Get contract with milestones, documents, payment summary. | `contracts:read` |
| 12 | `PUT` | `/api/v1/contracts/:id` | Update contract (only in `draft` status). | `contracts:write` |
| 13 | `POST` | `/api/v1/contracts/:id/submit` | Transition from `draft` to `pending`. | `contracts:write` |
| 14 | `POST` | `/api/v1/contracts/:id/approve` | Transition from `pending` to `active`. | `contracts:approve` |
| 15 | `POST` | `/api/v1/contracts/:id/reject` | Transition from `pending` back to `draft`. | `contracts:approve` |
| 16 | `POST` | `/api/v1/contracts/:id/complete` | Transition from `active` to `completed`. | `contracts:approve` |
| 17 | `POST` | `/api/v1/contracts/:id/cancel` | Transition to `cancelled` (requires reason). | `contracts:delete` |
| 18 | `GET` | `/api/v1/contracts/:id/documents` | List documents for a contract. | `contracts:read` |

### 9.3 Milestone Endpoints (4 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 19 | `POST` | `/api/v1/contracts/:id/milestones` | Add milestone(s) to a contract. | `contracts:write` |
| 20 | `PUT` | `/api/v1/contracts/:contract_id/milestones/:milestone_id` | Update milestone details. | `contracts:write` |
| 21 | `POST` | `/api/v1/contracts/:contract_id/milestones/:milestone_id/transition` | Transition milestone status. Body: `{ "status": "..." }`. | `contracts:write` / `contracts:approve` |
| 22 | `DELETE` | `/api/v1/contracts/:contract_id/milestones/:milestone_id` | Remove milestone (only on `draft` contracts). | `contracts:write` |

### 9.4 Document and Template Endpoints (5 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 23 | `POST` | `/api/v1/contracts/:id/documents/presign` | Generate presigned S3 upload URL. | `contracts:write` |
| 24 | `POST` | `/api/v1/contracts/:id/documents` | Confirm upload and save document metadata. | `contracts:write` |
| 25 | `GET` | `/api/v1/templates` | List org's contract templates. | `contracts:read` |
| 26 | `POST` | `/api/v1/templates` | Create a new SOW/NDA template. | `contracts:write` |
| 27 | `PUT` | `/api/v1/templates/:id` | Update template. | `contracts:write` |

### 9.5 Influencer Placement Endpoints (7 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 28 | `GET` | `/api/v1/placements` | List placements with filters (campaign, contractor, platform, status). | `placements:read` |
| 29 | `POST` | `/api/v1/placements` | Create placement (auto-generates UTM params and tracking URL). | `placements:write` |
| 30 | `GET` | `/api/v1/placements/:id` | Get placement with deliverables and latest metrics. | `placements:read` |
| 31 | `PUT` | `/api/v1/placements/:id` | Update placement details. | `placements:write` |
| 32 | `POST` | `/api/v1/placements/:id/transition` | Transition placement status. | `placements:write` |
| 33 | `POST` | `/api/v1/placements/:id/deliverables` | Add deliverable to placement. | `placements:write` |
| 34 | `PUT` | `/api/v1/placements/:placement_id/deliverables/:deliverable_id` | Update deliverable (status, content URL). | `placements:write` |

### 9.6 Metrics Endpoints (3 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 35 | `POST` | `/api/v1/placements/:id/metrics` | Record a metrics snapshot for a placement. | `placements:write` |
| 36 | `GET` | `/api/v1/placements/:id/metrics` | Get metrics history for a placement. | `placements:read` |
| 37 | `GET` | `/api/v1/campaigns/:id/influencer-summary` | Aggregate influencer metrics for a campaign. | `placements:read` |

### 9.7 Payment Endpoints (5 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 38 | `GET` | `/api/v1/payments` | List payments with filters (contract, contractor, status, date range). | `payments:read` |
| 39 | `POST` | `/api/v1/payments` | Initiate a single payment for a milestone. | `payments:write` |
| 40 | `POST` | `/api/v1/payments/batch` | Process a batch of milestone payments. | `payments:batch` |
| 41 | `GET` | `/api/v1/payments/batches/:id` | Get batch status and individual payment statuses. | `payments:read` |
| 42 | `POST` | `/api/v1/payments/webhooks/stripe` | Stripe webhook receiver (payment status updates). | Public (Stripe signature verification) |

### 9.8 Commission Endpoints (3 endpoints)

| # | Method | Path | Description | Auth |
|---|--------|------|-------------|------|
| 43 | `GET` | `/api/v1/commission-rules` | List org's commission rules. | `payments:read` |
| 44 | `POST` | `/api/v1/commission-rules` | Create a commission rule. | `payments:write` |
| 45 | `PUT` | `/api/v1/commission-rules/:id` | Update or deactivate a commission rule. | `payments:write` |

**Total: 45 endpoints** across contractors, contracts, milestones, documents, templates, placements, deliverables, metrics, payments, and commissions.

---

## 10. Frontend Pages and Components

### 10.1 New Pages (8 pages)

| # | Route | Page | Description |
|---|-------|------|-------------|
| 1 | `/contractors` | **Contractor Directory** | Searchable, filterable grid/list of all active contractors. Includes search bar, filter sidebar (specialty chips, availability toggle, rating slider, rate range), sort dropdown, and pagination. Each card shows avatar, name, specialties, rating stars, hourly rate, availability badge. Click navigates to profile. |
| 2 | `/contractors/:id` | **Contractor Profile** | Full profile view with bio, portfolio links, social links, specialties, rates, availability. Tabbed sections for: Overview, Project History (list of contracts with status and value), Ratings (score breakdown and comments), Documents (tax forms). Action buttons: Edit, Create Contract, Invite to Stripe. |
| 3 | `/contractors/new` | **Create/Edit Contractor** | Form page for creating or editing a contractor profile. Specialty multi-select, rate inputs, portfolio link builder, avatar upload, tag input. Validates email uniqueness within org. |
| 4 | `/contracts` | **Contracts List** | Table view of all contracts with columns: title, contractor name, type, status badge, value, start/end dates, campaign link. Filters: status, type, contractor, campaign, date range. Bulk actions: export CSV. |
| 5 | `/contracts/:id` | **Contract Detail** | Full contract view with header (title, status badge, value, dates), contractor card, and tabbed content: Milestones (Kanban or list with status transitions), Documents (upload area and file list), Payments (payment history table), Activity Log (status changes and events). Action bar adapts to current status (Submit, Approve, Complete, Cancel). |
| 6 | `/contracts/new` | **Create Contract** | Multi-step form: (1) Select contractor or create inline, (2) Contract details — type, value, dates, campaign link, (3) Milestones — add/reorder/set amounts with running total validation, (4) Documents — upload SOW/NDA or select from template, (5) Review and save as draft. |
| 7 | `/campaigns/:id/influencers` | **Campaign Influencer Tab** | New tab within the existing campaign detail page. Shows all influencer placements for the campaign in a card grid. Each card: influencer avatar, handle, platform icon, placement fee, status, deliverable count, key metrics (impressions, engagement rate). Add Placement button opens a slide-over form. Campaign-level aggregate metrics displayed at the top. |
| 8 | `/payments` | **Payments Dashboard** | Overview of all contractor payments. Summary cards: total paid this month, pending payments, overdue milestones. Table of recent payments with status. Batch payment workflow: select milestones from across contracts, review total, confirm and process. |

### 10.2 Shared Components

| Component | Usage |
|-----------|-------|
| `ContractorCard` | Used in directory grid and placement cards. Shows avatar, name, specialties, rating, rate. |
| `StatusBadge` | Colored badge for contract/milestone/placement/payment statuses. Uses consistent color mapping across all entities. |
| `MilestoneTimeline` | Vertical timeline of milestones with status indicators, amounts, and due dates. Supports inline status transitions. |
| `MetricsGrid` | 2x4 grid of metric cards (impressions, engagements, clicks, conversions, engagement rate, CPM, CPC, ROI). Used on placement detail and campaign influencer summary. |
| `UTMPreview` | Read-only display of generated UTM parameters with copy-to-clipboard button for the full tracking URL. |
| `DocumentUploader` | Drag-and-drop file upload component with progress bar. Handles presigned URL flow. Validates file type and size. |
| `TemplateSelector` | Dropdown that loads org templates, shows preview, and allows variable substitution before attaching to contract. |
| `RatingStars` | Interactive 1-5 star rating input with optional comment textarea. Also used in read-only mode for display. |
| `PaymentStatusIndicator` | Payment-specific status with Stripe icon, amount, and timestamp. Shows failure reason on hover for failed payments. |
| `FilterSidebar` | Reusable sidebar for multi-faceted filtering. Supports chip multi-select, range sliders, toggles, and date pickers. |

### 10.3 State Management

State management follows the existing Avero frontend patterns:

- **Server state:** React Query (TanStack Query) for all API data. Each entity type gets its own query key namespace (`['contractors']`, `['contracts']`, `['placements']`, `['payments']`).
- **Mutations:** React Query mutations with optimistic updates for status transitions and inline edits.
- **URL state:** Filter and pagination state is synced to URL search params using a custom `useQueryParams` hook, enabling shareable/bookmarkable filtered views.
- **Form state:** React Hook Form for all create/edit forms with Zod schema validation.
- **Local UI state:** `useState` / `useReducer` for component-level state (modals, tabs, expanded rows).

### 10.4 Key Frontend Data Types

```typescript
// Contractor
interface Contractor {
  id: string;
  orgId: string;
  displayName: string;
  email: string;
  phone?: string;
  companyName?: string;
  bio?: string;
  avatarUrl?: string;
  specialties: ContractorSpecialty[];
  hourlyRateCents?: number;
  dayRateCents?: number;
  currency: string;
  availability: 'available' | 'busy' | 'unavailable' | 'on_leave';
  portfolioLinks: { label: string; url: string }[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  rating: number;
  totalProjects: number;
  tags: string[];
  taxStatus?: TaxStatus;
  stripeConnectId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type ContractorSpecialty =
  | 'videography'
  | 'photography'
  | 'editing'
  | 'design'
  | 'copywriting'
  | 'social_media'
  | 'influencer_marketing'
  | 'seo'
  | 'paid_ads';

// Contract
interface Contract {
  id: string;
  orgId: string;
  contractorId: string;
  contractor?: Contractor; // Populated on detail views
  campaignId?: string;
  title: string;
  description?: string;
  contractType: 'fixed' | 'hourly' | 'milestone';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  totalValueCents: number;
  currency: string;
  hourlyRateCents?: number;
  hourlyCapHours?: number;
  startDate?: string;
  endDate?: string;
  milestones?: Milestone[];
  documents?: ContractDocument[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Influencer Placement
interface InfluencerPlacement {
  id: string;
  orgId: string;
  campaignId: string;
  contractId?: string;
  contractorId: string;
  contractor?: Contractor;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter';
  handle: string;
  followerCount?: number;
  placementFeeCents: number;
  currency: string;
  status: PlacementStatus;
  briefNotes?: string;
  publishDate?: string;
  trackingUrl?: string;
  utmParams?: UTMParams;
  deliverables?: Deliverable[];
  latestMetrics?: PlacementMetrics;
  createdAt: string;
  updatedAt: string;
}

interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

interface PlacementMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  conversions: number;
  conversionValueCents: number;
  engagementRate: number;
  cpmCents: number;
  cpcCents: number;
  recordedAt: string;
}
```

---

## 11. Integration Points

### 11.1 Campaigns Service

The contracts and influencer placements modules integrate with the existing campaigns service:

| Integration | Direction | Mechanism |
|-------------|-----------|-----------|
| Link contract to campaign | Contracts -> Campaigns | `campaign_id` FK on contracts table. Validated via internal HTTP call to campaigns service. |
| Link placement to campaign | Contracts -> Campaigns | `campaign_id` FK on placements table. |
| Campaign influencer summary | Campaigns <- Contracts | New endpoint on contracts crate, mounted at `/api/v1/campaigns/:id/influencer-summary`. |
| Campaign cost rollup | Campaigns <- Contracts | Campaigns service calls contracts service to get total contractor spend for a campaign. |

### 11.2 Payments / Integrations Service

| Integration | Direction | Mechanism |
|-------------|-----------|-----------|
| Stripe Connect account creation | Contracts -> Integrations | Internal call to integrations crate which wraps the Stripe API. |
| Payment processing | Contracts -> Integrations | Internal call to create PaymentIntent + Transfer via integrations crate. |
| Webhook handling | Stripe -> Gateway -> Contracts | Gateway routes `/api/v1/payments/webhooks/stripe` to contracts crate. Signature verified in handler. |

### 11.3 Auth Service

| Integration | Direction | Mechanism |
|-------------|-----------|-----------|
| Permission checks | Contractors/Contracts -> Auth | Middleware extracts JWT, validates permissions against new permission set. |
| User resolution | Contractors/Contracts -> Auth | `created_by`, `approved_by`, `rated_by` fields reference user IDs from auth service. |

### 11.4 Content Service

| Integration | Direction | Mechanism |
|-------------|-----------|-----------|
| Document storage | Contracts -> Content (S3) | Presigned URL generation for document uploads. Documents stored in org-scoped S3 prefix: `orgs/{org_id}/contracts/{contract_id}/`. |

---

## 12. Implementation Phases

### Phase 1: Contractor Profiles and Directory (Weeks 1-2)

**Backend:**
- Create `contractors` crate with module structure.
- Implement `contractors` table migration.
- Implement `contractor_ratings` table migration.
- Build contractor CRUD endpoints (1-5).
- Build full-text search with `tsvector` indexing.
- Build rating endpoint (6) and aggregation trigger.
- Build history endpoint (8).

**Frontend:**
- Contractor Directory page with search and filters.
- Contractor Profile page with tabs.
- Create/Edit Contractor form.
- `ContractorCard`, `RatingStars`, `FilterSidebar` components.

**Deliverables:**
- Searchable contractor directory with all filter options.
- Full CRUD for contractor profiles.
- Rating submission after contract completion.

**Exit criteria:**
- All 8 contractor endpoints pass integration tests.
- Directory loads in under 200ms for 500+ contractors.
- Full-text search returns relevant results with weighted ranking.

---

### Phase 2: Contract Creation, Milestones, and Documents (Weeks 3-4)

**Backend:**
- Create `contracts` crate with module structure.
- Implement `contracts`, `contract_milestones`, `contract_documents`, `contract_templates` table migrations.
- Build contract CRUD endpoints (9-18).
- Build milestone endpoints (19-22) with sum validation.
- Build document presigned URL and confirmation endpoints (23-24).
- Build template CRUD and hydration endpoints (25-27).
- Implement contract status state machine with transition validation.
- Implement milestone status state machine.

**Frontend:**
- Contracts List page with filters and sorting.
- Contract Detail page with milestone timeline, document list, activity log.
- Multi-step Create Contract form with milestone builder.
- `MilestoneTimeline`, `DocumentUploader`, `TemplateSelector` components.

**Deliverables:**
- End-to-end contract lifecycle from draft to completion.
- Milestone tracking with amount validation.
- Document upload to S3 with presigned URLs.
- SOW/NDA template system with variable substitution.

**Exit criteria:**
- Contract status transitions enforce all business rules.
- Milestone amounts always sum to contract total value.
- Document upload handles files up to 50MB reliably.
- Template hydration correctly replaces all placeholder variables.

---

### Phase 3: Influencer Campaigns, Placements, and Metrics (Weeks 5-6)

**Backend:**
- Implement `influencer_placements`, `placement_deliverables`, `placement_metrics` table migrations.
- Build placement CRUD endpoints (28-34).
- Build metrics recording and retrieval endpoints (35-36).
- Build campaign influencer summary aggregation endpoint (37).
- Implement UTM parameter auto-generation.
- Implement placement and deliverable status state machines.
- Implement computed metric fields (engagement rate, CPM, CPC).

**Frontend:**
- Campaign Influencer Tab (new tab on existing campaign detail page).
- Placement detail slide-over with deliverable list and metrics.
- Add Placement form with UTM preview.
- `MetricsGrid`, `UTMPreview`, `StatusBadge` components.
- Campaign-level aggregate metrics display.

**Deliverables:**
- Influencer placements tied to campaigns with full status tracking.
- Deliverable tracking per placement.
- Automated UTM generation and tracking URL creation.
- Performance metric recording and campaign-level aggregation.

**Exit criteria:**
- Placements correctly link to both campaigns and contractors.
- UTM parameters generate correctly and are locked after publishing.
- Metric aggregation returns accurate campaign-level totals.
- Engagement rate, CPM, and CPC compute correctly from raw metrics.

---

### Phase 4: Payments, Stripe Connect, and Commissions (Weeks 7-8)

**Backend:**
- Implement `contractor_payments`, `payment_batches`, `commission_rules` table migrations.
- Build payment endpoints (38-41).
- Build Stripe webhook handler (42).
- Build commission rule endpoints (43-45).
- Implement Stripe Connect onboarding flow (endpoint 7).
- Implement batch payment processing with partial-success handling.
- Implement commission rule evaluation engine.
- Implement tax document threshold tracking.
- Wire up Stripe webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `account.updated`, `transfer.created`, `transfer.failed`.

**Frontend:**
- Payments Dashboard page with summary cards and payment table.
- Batch payment workflow (multi-select milestones, review, confirm).
- Stripe Connect onboarding button on contractor profile.
- Commission rules management page (likely a section within org settings).
- `PaymentStatusIndicator` component.

**Deliverables:**
- Milestone-based payments via Stripe Connect.
- Batch payment processing across multiple contracts.
- Configurable commission rules.
- Tax document collection gating.
- Real-time payment status updates via Stripe webhooks.

**Exit criteria:**
- Single and batch payments process successfully through Stripe.
- Failed payments surface clear error messages.
- Commission rules apply correctly based on specialty and value thresholds.
- Payments are blocked when tax documents are missing above the $600 threshold.
- Stripe webhooks update payment status within 5 seconds.

---

## 13. Security Considerations

### 13.1 Data Access Control

- All queries are scoped by `org_id`. There is no cross-org data access.
- Contractor profiles are org-private. A contractor working with multiple orgs has separate profiles in each.
- Document S3 keys include the org ID to prevent path traversal: `orgs/{org_id}/contracts/{contract_id}/{document_id}/{filename}`.
- Presigned upload URLs expire after 15 minutes and are single-use.

### 13.2 Financial Security

- All monetary amounts are stored as integer cents to avoid floating-point errors.
- Payment initiation requires `payments:write` permission. Batch processing requires elevated `payments:batch` permission.
- Stripe webhook endpoints verify the `Stripe-Signature` header against the configured webhook secret.
- Stripe Connect connected account IDs are stored but the full account details are never cached locally.
- Payment records are append-only. Status changes are tracked but records are never deleted.

### 13.3 Document Security

- Uploaded documents are stored in a private S3 bucket. Access is only through time-limited presigned download URLs generated by the API.
- Tax documents (W-9, W-8BEN) are encrypted at rest using S3 SSE-KMS with an org-specific key.
- Document download URLs expire after 5 minutes.

### 13.4 PII Handling

- Contractor email and phone are PII. These fields are excluded from full-text search results in list views (only shown on profile detail).
- Stripe Connect account details (bank account numbers, SSN) are never stored in Avero's database; they exist only in Stripe's vault.
- Tax documents contain sensitive PII. Access is logged and restricted to users with `payments:write` permission.

---

## 14. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should contractors have their own login to view contracts and submit deliverables, or is all interaction mediated by org users? | Product | Open |
| 2 | Do we need automated metric collection via social platform APIs (Instagram Graph API, TikTok API) in v1, or is manual entry sufficient? | Engineering | Deferred to v2 |
| 3 | What is the Avero platform fee percentage for Stripe Connect transfers? Is it configurable per org or global? | Business | Open |
| 4 | Should the commission rule engine support stacking (multiple rules applied to one contract) or winner-takes-all (most specific match)? | Product | Open — spec assumes winner-takes-all. |
| 5 | Is there a requirement for contractor-facing email notifications (contract created, milestone approved, payment sent)? | Product | Open |
| 6 | Do we need approval workflows for commission rules (e.g., finance team must approve rules above a threshold)? | Business | Open |
| 7 | Should the campaign influencer summary feed into the SYN Engine analytics pipeline for AI-driven insights? | Product | Deferred to v2 |
| 8 | What S3 bucket and KMS key will be used for document storage in production? Existing content bucket or dedicated? | Infrastructure | Open |

---

*End of specification.*
