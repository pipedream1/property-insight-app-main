---
description: Repository Information Overview
alwaysApply: true
---

# Property Insight App Information

## Summary
The Property Insight App is a property management dashboard for Belvidere Management. It's a web application built with modern frontend technologies that provides property management features including water readings tracking, maintenance task management, property component tracking, report generation, and AI-powered insights. The application integrates with Supabase for backend services and database functionality.

## Structure
- **src/**: Main application source code
  - **api/**: API integration modules
  - **components/**: React components organized by feature
  - **contexts/**: React context providers
  - **hooks/**: Custom React hooks
  - **pages/**: Page components for routing
  - **services/**: Service modules for business logic
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions
- **public/**: Static assets and files
- **supabase/**: Supabase configuration, functions, and migrations

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.5.3
**Build System**: Vite 5.4.1
**Package Manager**: npm/bun

## Dependencies
**Main Dependencies**:
- React 18.3.1 with React DOM and React Router
- Supabase JS Client 2.49.4
- TanStack React Query 5.56.2
- shadcn/ui components (via Radix UI primitives)
- Tailwind CSS 3.4.11
- Zod 3.23.8 for schema validation
- Recharts 2.12.7 for data visualization
- React Hook Form 7.53.0 for form handling

**Development Dependencies**:
- Vite 5.4.1 with React SWC plugin
- ESLint 9.9.0
- TypeScript 5.5.3
- Tailwind CSS 3.4.11 with PostCSS
- Lovable Tagger 1.1.7

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Supabase Integration
**Project ID**: ytqenpdwynascsmfolbj
**Functions**:
- resident-chatbot: Serverless function for resident communication
- anomaly-detection: AI-powered anomaly detection
- predictive-analytics: Data analysis and prediction

## Main Entry Points
**Application Entry**: src/main.tsx
**Routing Configuration**: src/App.tsx and src/nav-items.tsx
**Key Pages**:
- Dashboard: src/pages/Index.tsx
- Water Readings: src/pages/WaterReadings.tsx
- Maintenance: src/pages/Maintenance.tsx
- Property Components: src/pages/PropertyComponents.tsx
- Reports: src/pages/Reports.tsx
- AI Insights: src/pages/AIInsights.tsx

## Features
- Water readings tracking and calculations
- Maintenance task management
- Property component inventory
- Report generation and export
- WhatsApp integration
- Offline synchronization
- AI-powered insights and analytics
- User authentication and role-based access