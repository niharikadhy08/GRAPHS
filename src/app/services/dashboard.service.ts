import { Injectable } from '@angular/core';
import { Observable, interval, map, merge, of, shareReplay } from 'rxjs';

import {
  BarChartData,
  CityMapData,
  DashboardRow,
  DashboardSnapshot,
  DoughnutChartData,
  PieChartData,
  StackedBarChartData,
  StackedBarDetailGroup,
  StackedBarDetailRow,
  StackedBarSeries
} from '../models/chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly stackedMonths: readonly string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  private readonly stackedSeries: readonly StackedBarSeries[] = [
    {
      name: 'New business',
      color: '#2f80ed',
      values: [42, 48, 55, 52, 61, 68, 72, 70, 76, 82, 88, 94]
    },
    {
      name: 'Expansion',
      color: '#27ae60',
      values: [28, 32, 36, 34, 39, 44, 47, 49, 52, 57, 60, 64]
    },
    {
      name: 'Renewals',
      color: '#f2994a',
      values: [36, 38, 42, 45, 47, 51, 55, 58, 61, 65, 68, 72]
    }
  ];

  private readonly baseRows: readonly DashboardRow[] = [
    {
      id: 'revenue-and-channel',
      barChart: {
        id: 'monthly-revenue',
        title: 'Monthly Revenue',
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
        values: [120, 138, 156, 149, 172, 188],
        descriptions: [
          'Revenue generated during January from new subscription invoices.',
          'Revenue generated during February after a regional campaign launch.',
          'Revenue generated during March with annual renewals included.',
          'Revenue generated during April while promotional pricing was active.',
          'Revenue generated during May from enterprise account expansions.',
          'Revenue generated during June after channel partner contributions.'
        ],
        details: [
          { month: 'January', revenue: '120', orders: 520, growth: '+12%' },
          { month: 'February', revenue: '138', orders: 584, growth: '+15%' },
          { month: 'March', revenue: '156', orders: 642, growth: '+18%' },
          { month: 'April', revenue: '149', orders: 611, growth: '+10%' },
          { month: 'May', revenue: '172', orders: 704, growth: '+21%' },
          { month: 'June', revenue: '188', orders: 748, growth: '+24%' }
        ],
        unit: '',
        color: '#2f80ed'
      },
      doughnutChart: {
        id: 'sales-channels',
        title: 'Sales Channels',
        labels: ['Direct', 'Partner', 'Marketplace', 'Referral'],
        values: [44, 26, 18, 12],
        descriptions: [
          'Direct sales sourced through the owned website and internal team.',
          'Partner-led opportunities closed through certified resellers.',
          'Marketplace transactions completed through cloud vendor listings.',
          'Customer referrals converted from advocate introductions.'
        ],
        details: [
          { channel: 'Direct', customers: 1200, revenue: '420' },
          { channel: 'Partner', customers: 860, revenue: '285' },
          { channel: 'Marketplace', customers: 540, revenue: '190' },
          { channel: 'Referral', customers: 320, revenue: '115' }
        ],
        unit: '%',
        colors: ['#2f80ed', '#27ae60', '#f2c94c', '#eb5757']
      },
      pieChart: {
        id: 'train-category-share',
        title: 'Train Category Share',
        labels: ['Express Trains', 'Superfast Trains', 'Passenger Trains', 'Suburban Services', 'Premium Trains'],
        values: [42, 24, 16, 11, 7],
        descriptions: [
          'Percentage of passengers travelling by Express trains across intercity corridors.',
          'Share of riders choosing Superfast trains for faster regional and long-distance trips.',
          'Passengers travelling on Passenger trains that connect smaller towns and local stops.',
          'Urban and near-urban passengers using high-frequency Suburban services.',
          'Passengers using Premium train services such as Rajdhani, Shatabdi, Vande Bharat, and Duronto.'
        ],
        details: [
          {
            category: 'Express Trains',
            share: '42%',
            dailyServices: 2140,
            passengerVolume: '10.8 lakh',
            description: 'Intercity express services carrying the largest passenger share across major Indian Railway routes.'
          },
          {
            category: 'Superfast Trains',
            share: '24%',
            dailyServices: 920,
            passengerVolume: '6.2 lakh',
            description: 'Higher-speed scheduled services connecting metros, state capitals, and important junctions.'
          },
          {
            category: 'Passenger Trains',
            share: '16%',
            dailyServices: 1860,
            passengerVolume: '4.1 lakh',
            description: 'Stopping services that support short-distance travel between district and rural stations.'
          },
          {
            category: 'Suburban Services',
            share: '11%',
            dailyServices: 3420,
            passengerVolume: '2.8 lakh',
            description: 'Dense commuter networks around large cities, including Mumbai, Chennai, Kolkata, and Hyderabad.'
          },
          {
            category: 'Premium Trains',
            share: '7%',
            dailyServices: 310,
            passengerVolume: '1.8 lakh',
            description: 'Reserved premium services with faster schedules, higher amenities, and limited stops.'
          }
        ],
        unit: '%',
        colors: ['#2f80ed', '#27ae60', '#f2994a', '#9b51e0', '#eb5757']
      },
      stackedBarChart: {
        id: 'monthly-pipeline',
        title: 'Monthly Pipeline Mix',
        categories: this.stackedMonths,
        series: this.stackedSeries,
        details: this.createStackedDetails(this.stackedMonths, this.stackedSeries),
        unit: ''
      },
      cityMap: {
        id: 'india-city-coverage',
        title: 'India City Coverage',
        markers: [
          {
            city: 'Delhi',
            latitude: 28.6139,
            longitude: 77.209,
            region: 'North',
            zone: 'Northern Railway',
            division: 'Delhi Division',
            stations: 46,
            dailyTrains: 620,
            annualFootfall: '18.4 crore'
          },
          {
            city: 'Mumbai',
            latitude: 19.076,
            longitude: 72.8777,
            region: 'West',
            zone: 'Central Railway / Western Railway',
            division: 'Mumbai Division',
            stations: 112,
            dailyTrains: 2980,
            annualFootfall: '78.0 crore'
          },
          {
            city: 'Kolkata',
            latitude: 22.5726,
            longitude: 88.3639,
            region: 'East',
            zone: 'Eastern Railway / South Eastern Railway',
            division: 'Sealdah / Howrah Division',
            stations: 86,
            dailyTrains: 1460,
            annualFootfall: '42.6 crore'
          },
          {
            city: 'Chennai',
            latitude: 13.0827,
            longitude: 80.2707,
            region: 'South',
            zone: 'Southern Railway',
            division: 'Chennai Division',
            stations: 74,
            dailyTrains: 1210,
            annualFootfall: '31.2 crore'
          },
          {
            city: 'Bengaluru',
            latitude: 12.9716,
            longitude: 77.5946,
            region: 'South',
            zone: 'South Western Railway',
            division: 'Bengaluru Division',
            stations: 58,
            dailyTrains: 540,
            annualFootfall: '14.7 crore'
          },
          {
            city: 'Hyderabad',
            latitude: 17.385,
            longitude: 78.4867,
            region: 'South',
            zone: 'South Central Railway',
            division: 'Hyderabad Division',
            stations: 52,
            dailyTrains: 690,
            annualFootfall: '16.3 crore'
          },
          {
            city: 'Ahmedabad',
            latitude: 23.0225,
            longitude: 72.5714,
            region: 'West',
            zone: 'Western Railway',
            division: 'Ahmedabad Division',
            stations: 39,
            dailyTrains: 430,
            annualFootfall: '9.8 crore'
          },
          {
            city: 'Pune',
            latitude: 18.5204,
            longitude: 73.8567,
            region: 'West',
            zone: 'Central Railway',
            division: 'Pune Division',
            stations: 42,
            dailyTrains: 510,
            annualFootfall: '11.2 crore'
          },
          {
            city: 'Jaipur',
            latitude: 26.9124,
            longitude: 75.7873,
            region: 'North',
            zone: 'North Western Railway',
            division: 'Jaipur Division',
            stations: 31,
            dailyTrains: 260,
            annualFootfall: '6.4 crore'
          },
          {
            city: 'Lucknow',
            latitude: 26.8467,
            longitude: 80.9462,
            region: 'North',
            zone: 'Northern Railway / North Eastern Railway',
            division: 'Lucknow Division',
            stations: 44,
            dailyTrains: 520,
            annualFootfall: '12.1 crore'
          },
          {
            city: 'Bhopal',
            latitude: 23.2599,
            longitude: 77.4126,
            region: 'Central',
            zone: 'West Central Railway',
            division: 'Bhopal Division',
            stations: 35,
            dailyTrains: 360,
            annualFootfall: '8.3 crore'
          },
          {
            city: 'Patna',
            latitude: 25.5941,
            longitude: 85.1376,
            region: 'East',
            zone: 'East Central Railway',
            division: 'Danapur Division',
            stations: 29,
            dailyTrains: 390,
            annualFootfall: '9.1 crore'
          },
          {
            city: 'Bhubaneswar',
            latitude: 20.2961,
            longitude: 85.8245,
            region: 'East',
            zone: 'East Coast Railway',
            division: 'Khurda Road Division',
            stations: 24,
            dailyTrains: 250,
            annualFootfall: '5.2 crore'
          },
          {
            city: 'Guwahati',
            latitude: 26.1445,
            longitude: 91.7362,
            region: 'North East',
            zone: 'Northeast Frontier Railway',
            division: 'Lumding Division',
            stations: 22,
            dailyTrains: 210,
            annualFootfall: '4.6 crore'
          },
          {
            city: 'Srinagar',
            latitude: 34.0837,
            longitude: 74.7973,
            region: 'North',
            zone: 'Northern Railway',
            division: 'Firozpur Division',
            stations: 12,
            dailyTrains: 42,
            annualFootfall: '0.8 crore'
          },
          {
            city: 'Jammu',
            latitude: 32.7266,
            longitude: 74.857,
            region: 'North',
            zone: 'Northern Railway',
            division: 'Firozpur Division',
            stations: 18,
            dailyTrains: 138,
            annualFootfall: '3.2 crore'
          },
          {
            city: 'Chandigarh',
            latitude: 30.7333,
            longitude: 76.7794,
            region: 'North',
            zone: 'Northern Railway',
            division: 'Ambala Division',
            stations: 16,
            dailyTrains: 170,
            annualFootfall: '3.7 crore'
          },
          {
            city: 'Nagpur',
            latitude: 21.1458,
            longitude: 79.0882,
            region: 'Central',
            zone: 'Central Railway / South East Central Railway',
            division: 'Nagpur Division',
            stations: 32,
            dailyTrains: 330,
            annualFootfall: '7.4 crore'
          },
          {
            city: 'Kochi',
            latitude: 9.9312,
            longitude: 76.2673,
            region: 'South',
            zone: 'Southern Railway',
            division: 'Thiruvananthapuram Division',
            stations: 21,
            dailyTrains: 230,
            annualFootfall: '4.9 crore'
          },
          {
            city: 'Thiruvananthapuram',
            latitude: 8.5241,
            longitude: 76.9366,
            region: 'South',
            zone: 'Southern Railway',
            division: 'Thiruvananthapuram Division',
            stations: 19,
            dailyTrains: 190,
            annualFootfall: '4.2 crore'
          }
        ]
      }
    }
  ];

  readonly dashboardData$: Observable<DashboardSnapshot> = merge(of(0), interval(30000)).pipe(
    map((sequence: number) => this.createSnapshot(sequence)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private createSnapshot(refreshSequence: number): DashboardSnapshot {
    return {
      rows: this.baseRows.map((row: DashboardRow) => this.cloneRow(row, refreshSequence)),
      refreshedAt: new Date(),
      refreshSequence
    };
  }

  private cloneRow(row: DashboardRow, refreshSequence: number): DashboardRow {
    return {
      id: `${row.id}-${refreshSequence}`,
      barChart: this.cloneBarChart(row.barChart, refreshSequence),
      doughnutChart: this.cloneDoughnutChart(row.doughnutChart, refreshSequence),
      pieChart: this.clonePieChart(row.pieChart, refreshSequence),
      stackedBarChart: this.cloneStackedBarChart(row.stackedBarChart, refreshSequence),
      cityMap: this.cloneCityMap(row.cityMap, refreshSequence)
    };
  }

  private cloneBarChart(chart: BarChartData, refreshSequence: number): BarChartData {
    const values = this.refreshValues(chart.values, refreshSequence, 4);

    return {
      id: `${chart.id}-${refreshSequence}`,
      title: chart.title,
      categories: [...chart.categories],
      values,
      descriptions: [...chart.descriptions],
      details: chart.details.map((detail, index) => ({
        ...detail,
        revenue: this.formatCurrencyValue(values[index] ?? 0, chart.unit)
      })),
      unit: chart.unit,
      color: chart.color
    };
  }

  private cloneDoughnutChart(chart: DoughnutChartData, refreshSequence: number): DoughnutChartData {
    return {
      id: `${chart.id}-${refreshSequence}`,
      title: chart.title,
      labels: [...chart.labels],
      values: this.refreshValues(chart.values, refreshSequence, 2),
      descriptions: [...chart.descriptions],
      details: chart.details.map((detail) => ({ ...detail })),
      unit: chart.unit,
      colors: [...chart.colors]
    };
  }

  private clonePieChart(chart: PieChartData, refreshSequence: number): PieChartData {
    const values = this.refreshShareValues(chart.values, refreshSequence);

    return {
      id: `${chart.id}-${refreshSequence}`,
      title: chart.title,
      labels: [...chart.labels],
      values,
      descriptions: [...chart.descriptions],
      details: chart.details.map((detail, index) => ({
        ...detail,
        share: this.formatCurrencyValue(values[index] ?? 0, chart.unit)
      })),
      unit: chart.unit,
      colors: [...chart.colors]
    };
  }

  private cloneStackedBarChart(chart: StackedBarChartData, refreshSequence: number): StackedBarChartData {
    const series = chart.series.map((stack: StackedBarSeries, seriesIndex: number) => ({
      ...stack,
      values: this.refreshValues(stack.values, refreshSequence + seriesIndex, 3)
    }));

    return {
      id: `${chart.id}-${refreshSequence}`,
      title: chart.title,
      categories: [...chart.categories],
      series,
      details: this.createStackedDetails(chart.categories, series),
      unit: chart.unit
    };
  }

  private cloneCityMap(chart: CityMapData, refreshSequence: number): CityMapData {
    return {
      id: `${chart.id}-${refreshSequence}`,
      title: chart.title,
      markers: chart.markers.map((marker) => ({ ...marker }))
    };
  }

  private refreshValues(values: readonly number[], refreshSequence: number, amplitude: number): number[] {
    return values.map((value: number, index: number) => {
      const cycle = ((refreshSequence + index) % 3) - 1;
      return Math.max(1, value + cycle * amplitude);
    });
  }

  private refreshShareValues(values: readonly number[], refreshSequence: number): number[] {
    if (refreshSequence === 0) {
      return [...values];
    }

    const adjusted = values.map((value: number, index: number) => {
      const cycle = ((refreshSequence + index) % 3) - 1;
      return Math.max(1, value + cycle);
    });
    const total = adjusted.reduce((sum: number, value: number) => sum + value, 0);
    const scaled = adjusted.map((value: number) => Math.max(1, Math.round((value / total) * 100)));
    const drift = 100 - scaled.reduce((sum: number, value: number) => sum + value, 0);
    const largestIndex = scaled.reduce(
      (winner: number, value: number, index: number) => (value > scaled[winner] ? index : winner),
      0
    );

    scaled[largestIndex] += drift;
    return scaled;
  }

  private formatCurrencyValue(value: number, unit: string): string {
    if (!unit) {
      return value.toString();
    }

    return `${value} ${unit}`;
  }

  private createStackedDetails(
    months: readonly string[],
    series: readonly StackedBarSeries[]
  ): readonly StackedBarDetailGroup[] {
    return months.map((month: string, monthIndex: number) => {
      const rows = series.map((stack: StackedBarSeries, seriesIndex: number): StackedBarDetailRow => {
        const value = stack.values[monthIndex] ?? 0;

        return {
          source: stack.name,
          segment: this.segmentForIndex(seriesIndex),
          revenue: this.formatCurrencyValue(value, ''),
          deals: Math.round(value * 3.8 + monthIndex * 4 + seriesIndex * 9),
          conversion: `${Math.round(18 + value / 8 + seriesIndex * 2)}%`
        };
      });
      const total = series.reduce((sum: number, stack: StackedBarSeries) => sum + (stack.values[monthIndex] ?? 0), 0);

      return {
        month,
        total: this.formatCurrencyValue(total, ''),
        rows
      };
    });
  }

  private segmentForIndex(index: number): string {
    const segments = ['Enterprise', 'Mid-market', 'Commercial'];
    return segments[index] ?? 'Core';
  }
}
