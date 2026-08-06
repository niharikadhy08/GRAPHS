export interface BarChartData {
  readonly id: string;
  readonly title: string;
  readonly categories: readonly string[];
  readonly values: readonly number[];
  readonly descriptions: readonly string[];
  readonly details: readonly BarDetailRow[];
  readonly unit: string;
  readonly color: string;
}

export interface BarDetailRow {
  readonly month: string;
  readonly revenue: string;
  readonly orders: number;
  readonly growth: string;
}

export interface DoughnutChartData {
  readonly id: string;
  readonly title: string;
  readonly labels: readonly string[];
  readonly values: readonly number[];
  readonly descriptions: readonly string[];
  readonly details: readonly DoughnutDetailRow[];
  readonly unit: string;
  readonly colors: readonly string[];
}

export interface DoughnutDetailRow {
  readonly channel: string;
  readonly customers: number;
  readonly revenue: string;
}

export interface PieChartData {
  readonly id: string;
  readonly title: string;
  readonly labels: readonly string[];
  readonly values: readonly number[];
  readonly descriptions: readonly string[];
  readonly details: readonly PieDetailRow[];
  readonly unit: string;
  readonly colors: readonly string[];
}

export interface PieDetailRow {
  readonly category: string;
  readonly share: string;
  readonly dailyServices: number;
  readonly passengerVolume: string;
  readonly description: string;
}

export interface StackedBarSeries {
  readonly name: string;
  readonly color: string;
  readonly values: readonly number[];
}

export interface StackedBarDetailRow {
  readonly source: string;
  readonly segment: string;
  readonly revenue: string;
  readonly deals: number;
  readonly conversion: string;
}

export interface StackedBarDetailGroup {
  readonly month: string;
  readonly total: string;
  readonly rows: readonly StackedBarDetailRow[];
}

export interface StackedBarChartData {
  readonly id: string;
  readonly title: string;
  readonly categories: readonly string[];
  readonly series: readonly StackedBarSeries[];
  readonly details: readonly StackedBarDetailGroup[];
  readonly unit: string;
}

export interface CityMarker {
  readonly city: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly region: string;
  readonly zone: string;
  readonly division: string;
  readonly stations: number;
  readonly dailyTrains: number;
  readonly annualFootfall: string;
}

export interface CityMapData {
  readonly id: string;
  readonly title: string;
  readonly markers: readonly CityMarker[];
}

export interface DashboardRow {
  readonly id: string;
  readonly barChart: BarChartData;
  readonly doughnutChart: DoughnutChartData;
  readonly pieChart: PieChartData;
  readonly stackedBarChart: StackedBarChartData;
  readonly cityMap: CityMapData;
}

export interface DashboardSnapshot {
  readonly rows: readonly DashboardRow[];
  readonly refreshedAt: Date;
  readonly refreshSequence: number;
}

export interface DetailMetric {
  readonly label: string;
  readonly value: string;
}

export interface DetailTableColumn {
  readonly key: string;
  readonly label: string;
  readonly align?: 'start' | 'end';
}

export type DetailTableRow = Record<string, string | number>;

export interface SelectedChartDetail {
  readonly kind: 'bar' | 'doughnut' | 'pie' | 'stacked' | 'city';
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly metrics: readonly DetailMetric[];
  readonly columns: readonly DetailTableColumn[];
  readonly rows: readonly DetailTableRow[];
}
