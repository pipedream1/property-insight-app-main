
export type PlanFeature = string;

export interface PlanTemplate {
  id: number;
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  tier: "basic" | "premium" | "enterprise";
  popular?: boolean;
}

export const reportTemplates: PlanTemplate[] = [
  {
    id: 1,
    name: "Residents Access",
    description: "Access to basic property information and community notices for residents",
    price: "$5.90 / month",
    features: [
      "Community notices and updates", 
      "Basic property status reports", 
      "Personal unit inspection history",
      "Maintenance request tracking"
    ],
    tier: "basic"
  },
  {
    id: 2,
    name: "Management & Exco Access",
    description: "Enhanced reporting and management tools for property managers and executive committee members",
    price: "$89.99 / month",
    features: [
      "All Residents features",
      "Comprehensive property analytics",
      "Historical condition tracking",
      "Budget allocation insights",
      "Maintenance planning tools",
      "Community voting results"
    ],
    tier: "premium",
    popular: true
  },
  {
    id: 3,
    name: "Sub-Contractor Access",
    description: "Professional tools for maintenance contractors and service providers",
    price: "$29.99 / month",
    features: [
      "All Management features",
      "Work order management",
      "Job completion tracking",
      "Integrated invoicing system",
      "Material usage reports",
      "Maintenance history by component",
      "API access for custom integrations"
    ],
    tier: "enterprise"
  }
];

export const premiumFeatures = [
  {
    title: "Role-Based Access Control",
    description: "Tailored access levels ensure that users only see information relevant to their role in the property ecosystem.",
    icon: "🔒"
  },
  {
    title: "Interactive Property Maps",
    description: "Visual representations of the property with component locations and status indicators for intuitive navigation.",
    icon: "🗺️"
  },
  {
    title: "Maintenance Scheduling",
    description: "Plan and track maintenance activities with automated notifications and resource allocation tools.",
    icon: "🔧"
  },
  {
    title: "Financial Insights",
    description: "Track expenses, allocate budgets, and generate financial reports for transparent property management.",
    icon: "💰"
  },
  {
    title: "Community Engagement",
    description: "Tools for community notices, voting, and feedback collection to improve resident satisfaction.",
    icon: "👥"
  },
  {
    title: "Contractor Management",
    description: "Streamlined workflows for assigning tasks to contractors, tracking progress, and evaluating performance.",
    icon: "📋"
  }
];

export const exampleReports = [
  {
    name: "Quarterly Property Assessment",
    description: "Comprehensive overview with financial insights and maintenance recommendations",
    date: "May 2025",
    preview: "/placeholder.svg"
  },
  {
    name: "Contractor Performance Analysis",
    description: "Evaluation of contractor work quality, timeliness, and cost-effectiveness",
    date: "April 2025",
    preview: "/placeholder.svg"
  },
  {
    name: "Community Engagement Summary",
    description: "Analysis of resident participation and satisfaction with community initiatives",
    date: "March 2025",
    preview: "/placeholder.svg"
  }
];
