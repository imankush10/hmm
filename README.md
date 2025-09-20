# LCA Platform - Lifecycle & Circularity Assessment

A comprehensive Next.js 14 web application implementing a Lifecycle & Circularity Assessment (LCA) Platform with AI-powered optimization, material traceability, and environmental reporting.

## 🚀 Features

### 1. Material Inventory & Traceability (`/inventory`)

- **Material Database**: Comprehensive inventory tracking with detailed material information
- **Full Traceability**: Origin tracking, supplier information, batch details, and transportation data
- **Interactive Modal**: Detailed traceability views with certifications and quality test results
- **Search & Filter**: Advanced filtering by material type, status, and source
- **Export Functionality**: CSV export for inventory data

### 2. Product Requirements & Material Specification (`/bom`)

- **BOM Management**: Create, edit, and manage Bill of Materials
- **Component Specification**: Detailed material requirements and properties
- **Criticality Levels**: High, Medium, Low priority classification
- **Local Storage**: Persistent data storage for BOMs
- **Export/Import**: JSON export and import functionality

### 3. AI-Powered Optimization & Prediction (`/optimize`)

- **Smart Allocation**: AI-driven material allocation recommendations
- **Logistics Optimization**: Route optimization with CO₂ and cost calculations
- **Preference-Based**: Configurable optimization parameters
- **Real-time Processing**: Live optimization with confidence scoring
- **Environmental Impact**: Sustainability metrics and improvements

### 4. Dashboard & Lifecycle Visualization (`/dashboard`)

- **KPI Cards**: Real-time metrics for inventory, recycling, CO₂ savings, and circularity
- **Material Flow Visualization**: Sankey-style diagrams and trend charts
- **Scenario Comparison**: Compare different material sourcing strategies
- **Circular Progress Indicators**: Visual representation of sustainability metrics
- **System Health**: Status monitoring and recent activity tracking

### 5. Environmental Impact & Circularity Assessment (`/reports`)

- **Comprehensive Reporting**: Carbon footprint, water usage, energy consumption
- **Circularity Metrics**: Detailed circular economy assessment
- **Industry Benchmarking**: Compare performance against industry standards
- **PDF Export**: Professional report generation with jsPDF
- **Improvement Recommendations**: AI-generated sustainability suggestions
- **Compliance Tracking**: ISO standards and certification monitoring

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React
- **State Management**: React useState/useEffect
- **API**: Next.js API Routes
- **Data Storage**: Local Storage + JSON files

## 📁 Project Structure

```
sihh/
├── app/
│   ├── api/optimize/          # AI optimization API endpoint
│   ├── components/            # Shared components
│   │   └── Navigation.js      # Main navigation component
│   ├── bom/                   # Bill of Materials management
│   ├── dashboard/             # Main dashboard with KPIs
│   ├── inventory/             # Material inventory and traceability
│   ├── optimize/              # AI optimization interface
│   ├── reports/               # Environmental reporting
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout with navigation
│   └── page.js                # Home page (redirects to dashboard)
├── data/                      # Dummy data files
│   ├── materials.js           # Material inventory data
│   ├── bom.js                 # Bill of Materials templates
│   ├── dashboard.js           # Dashboard KPIs and flow data
│   └── reports.js             # Environmental report data
├── lib/
│   └── utils.js               # Utility functions
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start development server**

   ```bash
   pnpm dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Layer

### Dummy Data Sources

All data is currently mocked for demonstration purposes:

- **Materials**: 5 sample materials with full traceability data
- **BOMs**: 3 sample product BOMs with components and specifications
- **Dashboard**: KPIs, flow data, and scenario comparisons
- **Reports**: Environmental metrics, benchmarks, and recommendations

### Data Abstraction

All dummy data is centralized in the `/data` folder, making it easy to replace with real API integrations later.

## 🤖 AI Optimization API

### Endpoint: `POST /api/optimize`

**Request Format:**

```json
{
  "bom": {
    "id": "BOM-001",
    "productName": "Car Door Frame",
    "components": [...]
  },
  "inventory": [...],
  "preferences": {
    "prioritize_recycled": true,
    "cost_weight": 0.3,
    "environmental_weight": 0.7
  }
}
```

**Response Format:**

```json
{
  "optimization_id": "OPT-...",
  "recommendations": [...],
  "logistics": {
    "optimal_routes": [...],
    "estimated_total_co2_saving": "15%",
    "estimated_cost_saving": "7%"
  },
  "environmental_impact": {...},
  "confidence_score": 87
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with TailwindCSS
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: Graceful error handling with user feedback
- **Accessibility**: Semantic HTML and keyboard navigation

## 📈 Key Metrics Tracked

- **Inventory Levels**: Total, available, low stock, out of stock
- **Recycled Content**: Current percentage vs targets
- **CO₂ Savings**: Environmental impact reductions
- **Circularity Rate**: Overall circular economy performance
- **Energy Consumption**: Total usage and renewable percentage
- **Water Usage**: Consumption and recycling rates

## 📱 Pages Overview

1. **Dashboard** (`/dashboard`): Central hub with KPIs and visualizations
2. **Inventory** (`/inventory`): Material tracking with traceability modals
3. **BOM** (`/bom`): Product requirements and material specifications
4. **Optimize** (`/optimize`): AI-powered optimization interface
5. **Reports** (`/reports`): Environmental impact and compliance reporting

---

**Built with ❤️ using Next.js 14, TailwindCSS, and modern web technologies**
