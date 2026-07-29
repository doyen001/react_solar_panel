# Mock Data API Inventory

This inventory maps frontend mock/static data to its API ownership target.

## Backend Existing Entities

- Customer, installer, and admin users: `User`
- Customer profile and CRM customers: `User` records with `role = CUSTOMER`
- Leads, lead marketplace, customer timeline source data: `Lead`
- Customer and installer designs: `Design` and `DesignProduct`
- Product cards and equipment catalog: `Product`
- Chat/messages demo data: `Conversation` and `Message`
- Schedules and appointments: `Appointment`
- Notifications and dashboard activity: `NotificationItem` and `ActivityEvent`

## New Backend Entities

- Marketing/page content from `src/utils/constant.tsx`: `ContentPage`
- Blog listing and detail data: `BlogPost`
- FAQ page items and FAQ search data: `FaqItem`
- Master invoices: `Invoice`
- Master product special pricing: `ProductSpecialPrice`
- Installer pricing tiers: `InstallerTier`

## Derived API Data

- Installer pipeline dashboard mock data from `pipelineDashboardMock.ts`: derive from `Lead`, `Design`, and `User`
- Master dashboard KPIs and charts: derive from `Lead`, `User`, `Product`, and `Invoice`
- Customer dashboard KPIs, selected design products, and timeline: derive from `Design`, `DesignProduct`, `Lead`, and `Appointment`
- Installer home CRM panels: derive from selected `Lead`, linked `Design`, linked customer `User`, and `DesignProduct`

## Frontend-Only UI Config

- Navigation, footer links, route labels, tabs, filters, table column definitions, icon mappings, map settings, import column schemas, form labels, and layout constants remain in the frontend.
- Calculation assumptions that are not persisted business data, such as proposal financial defaults, remain in frontend utilities until a separate calculation API is introduced.
