# Security Specification & Threat Model

This spec details the Attribute-Based Access Control (ABAC) invariants and threat vectors for Vasanthan's portfolio data store in Google Cloud Firestore.

## 1. Data Invariants

1. **Portfolio Works (`/works/{workId}`)**:
   - Anyone (anonymous or unauthenticated) can read (`get` and `list`) the list of portfolio works.
   - Only a authenticated Admin user (`vasanthankasvk@gmail.com` with verified email) can create, update, or delete works.
   - The `id`, `title`, `category`, `type`, `videoUrl`, `thumbnailUrl`, and `duration` fields are mandatory on creation and must match standard formatting and types.
   - `createdAt` is immutable once written and must match the server timestamp (`request.time`).

2. **Portfolio Profile (`/profile/{profileId}`)**:
   - Anyone can read the custom profile elements (e.g. `main` profile avatar string).
   - Only the specific verified admin can modify or update the profile elements.
   - Any profile change must include a valid string state for the avatar image and update `updatedAt` to `request.time`.

---

## 2. The "Dirty Dozen" Payloads (Threat Vector Model)

The following 12 payloads represent malicious or invalid database operations that must be rejected with a `PERMISSION_DENIED` status:

### Payload 1: Create work item as unauthenticated user
- **Collection**: `/works/custom-test-1`
- **Identity**: Unauthenticated (`request.auth == null`)
- **Action**: Create
- **Outcome**: `PERMISSION_DENIED` (Strict admin validation fail)

### Payload 2: Create work item with a non-admin email
- **Collection**: `/works/custom-test-2`
- **Identity**: Authenticated as `attacker@malicious.xyz` (email_verified: `true`)
- **Action**: Create
- **Outcome**: `PERMISSION_DENIED` (Email mismatch restriction check)

### Payload 3: Create work item with unverified admin email (Spoof Attack)
- **Collection**: `/works/custom-test-3`
- **Identity**: Authenticated as `vasanthankasvk@gmail.com` (email_verified: `false`)
- **Action**: Create
- **Outcome**: `PERMISSION_DENIED` (Email verification requirement check fail)

### Payload 4: Invalid long string in ID (Resource Poisoning / Wallet Exhaustion)
- **Collection**: `/works/LONG_ID_EXCEEDING_LIMIT_REPEATED_A_A...`
- **Identity**: Authenticated Admin (`vasanthankasvk@gmail.com`, email_verified: `true`)
- **Action**: Create
- **Outcome**: `PERMISSION_DENIED` (ID length boundary check fail)

### Payload 5: Missing essential schema fields
- **Collection**: `/works/custom-test-5`
- **Identity**: Authenticated Admin
- **Action**: Create (Payload missing `videoUrl` or `category` fields)
- **Outcome**: `PERMISSION_DENIED` (Strict schema key size verification check)

### Payload 6: Malformed field data types
- **Collection**: `/works/custom-test-6`
- **Identity**: Authenticated Admin
- **Action**: Create (Payload has `softwareUsed` set as a string instead of a dynamic list/array)
- **Outcome**: `PERMISSION_DENIED` (Strict type safety check failure)

### Payload 7: Client-provided spoofed timestamps (Temporal Integrity)
- **Collection**: `/works/custom-test-7`
- **Identity**: Authenticated Admin
- **Action**: Create (Payload has `createdAt` set to a hardcoded client date instead of `request.time`)
- **Outcome**: `PERMISSION_DENIED` (Temporal integrity violation)

### Payload 8: Mutating immutable fields (`createdAt` modification)
- **Collection**: `/works/custom-test-8`
- **Identity**: Authenticated Admin
- **Action**: Update (Attempting to modify the original `createdAt` timestamp)
- **Outcome**: `PERMISSION_DENIED` (Immutability violation check)

### Payload 9: Shadow Field Injection (Ghost Field Hijacking)
- **Collection**: `/works/custom-test-9`
- **Identity**: Authenticated Admin
- **Action**: Update (Attempting to save `isSystemVerified: true` which is not in the schema)
- **Outcome**: `PERMISSION_DENIED` (Strictly bounded dictionary keys check)

### Payload 10: Anonymous/Unauthenticated mutating profile metadata
- **Collection**: `/profile/main`
- **Identity**: Unauthenticated
- **Action**: Update
- **Outcome**: `PERMISSION_DENIED` (Admin check failed)

### Payload 11: Attempting to list admin settings directly via blanket collection lists without checking schema ownership
- **Collection**: `/profile`
- **Identity**: Authenticated Guest
- **Action**: List querying
- **Outcome**: Protected by query boundary constraints or strict match rule conditions.

### Payload 12: Injecting non-string elements inside software lists (Total Array Guard checks)
- **Collection**: `/works/custom-test-12`
- **Identity**: Authenticated Admin
- **Action**: Create (Payload has `softwareUsed` set to `[123, true]` instead of text strings)
- **Outcome**: `PERMISSION_DENIED` (Array item schema integrity check fail)
