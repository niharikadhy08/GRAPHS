import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BarDetailRow,
  CityMarker,
  DashboardSnapshot,
  DoughnutDetailRow,
  PieDetailRow,
  SelectedChartDetail,
  StackedBarDetailGroup
} from '../../models/chart-data.model';
import { DashboardService } from '../../services/dashboard.service';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { DoughnutCardComponent } from '../doughnut-card/doughnut-card.component';
import { HorizontalBarCardComponent } from '../horizontal-bar-card/horizontal-bar-card.component';
import { IndiaMapCardComponent } from '../india-map-card/india-map-card.component';
import { PieChartCardComponent } from '../pie-chart-card/pie-chart-card.component';
import { StackedBarCardComponent } from '../stacked-bar-card/stacked-bar-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    DetailModalComponent,
    DoughnutCardComponent,
    HorizontalBarCardComponent,
    IndiaMapCardComponent,
    PieChartCardComponent,
    StackedBarCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly dashboardData$: Observable<DashboardSnapshot> = this.dashboardService.dashboardData$;
  selectedDetail: SelectedChartDetail | null = null;

  showBarDetail(row: BarDetailRow): void {
    this.selectedDetail = {
      kind: 'bar',
      title: `${row.month} Revenue Detail`,
      eyebrow: 'Monthly revenue',
      description: 'Source data for the selected monthly bar, including the refreshed revenue total, order volume, and month-over-month growth.',
      metrics: [
        { label: 'Revenue', value: row.revenue },
        { label: 'Orders', value: row.orders.toLocaleString('en-US') },
        { label: 'Growth', value: row.growth }
      ],
      columns: [
        { key: 'month', label: 'Month' },
        { key: 'revenue', label: 'Revenue', align: 'end' },
        { key: 'orders', label: 'Orders', align: 'end' },
        { key: 'growth', label: 'Growth', align: 'end' }
      ],
      rows: [
        {
          month: row.month,
          revenue: row.revenue,
          orders: row.orders,
          growth: row.growth
        }
      ]
    };
  }

  showDoughnutDetail(row: DoughnutDetailRow): void {
    this.selectedDetail = {
      kind: 'doughnut',
      title: `${row.channel} Channel Detail`,
      eyebrow: 'Sales channel',
      description: 'Source data for the selected doughnut segment, showing customer count and attributed revenue for the channel.',
      metrics: [
        { label: 'Channel', value: row.channel },
        { label: 'Customers', value: row.customers.toLocaleString('en-US') },
        { label: 'Revenue', value: row.revenue }
      ],
      columns: [
        { key: 'channel', label: 'Channel' },
        { key: 'customers', label: 'Customers', align: 'end' },
        { key: 'revenue', label: 'Revenue', align: 'end' }
      ],
      rows: [
        {
          channel: row.channel,
          customers: row.customers,
          revenue: row.revenue
        }
      ]
    };
  }

  showPieDetail(row: PieDetailRow): void {
    this.selectedDetail = {
      kind: 'pie',
      title: `${row.category} Detail`,
      eyebrow: 'Train category',
      description: row.description,
      metrics: [
        { label: 'Share', value: row.share },
        { label: 'Daily services', value: row.dailyServices.toLocaleString('en-IN') },
        { label: 'Passenger volume', value: row.passengerVolume }
      ],
      columns: [
        { key: 'category', label: 'Category' },
        { key: 'share', label: 'Share', align: 'end' },
        { key: 'dailyServices', label: 'Daily Services', align: 'end' },
        { key: 'passengerVolume', label: 'Passenger Volume', align: 'end' },
        { key: 'description', label: 'Description' }
      ],
      rows: [
        {
          category: row.category,
          share: row.share,
          dailyServices: row.dailyServices,
          passengerVolume: row.passengerVolume,
          description: row.description
        }
      ]
    };
  }

  showStackedDetail(group: StackedBarDetailGroup): void {
    this.selectedDetail = {
      kind: 'stacked',
      title: `${group.month} Pipeline Detail`,
      eyebrow: 'Stacked pipeline',
      description: 'Breakdown behind the selected stacked monthly bar, grouped by source and commercial segment.',
      metrics: [
        { label: 'Month', value: group.month },
        { label: 'Total pipeline', value: group.total },
        { label: 'Sources', value: group.rows.length.toLocaleString('en-US') }
      ],
      columns: [
        { key: 'source', label: 'Source' },
        { key: 'segment', label: 'Segment' },
        { key: 'revenue', label: 'Revenue', align: 'end' },
        { key: 'deals', label: 'Deals', align: 'end' },
        { key: 'conversion', label: 'Conversion', align: 'end' }
      ],
      rows: group.rows.map((detail) => ({
        source: detail.source,
        segment: detail.segment,
        revenue: detail.revenue,
        deals: detail.deals,
        conversion: detail.conversion
      }))
    };
  }

  showCityDetail(city: CityMarker): void {
    this.selectedDetail = {
      kind: 'city',
      title: `${city.city} Railway Detail`,
      eyebrow: 'India city marker',
      description: 'Railway operations sample data for the selected Indian city marker, including zone, division, station coverage, and traffic indicators.',
      metrics: [
        { label: 'Zone', value: city.zone },
        { label: 'Division', value: city.division },
        { label: 'Stations', value: city.stations.toLocaleString('en-IN') }
      ],
      columns: [
        { key: 'field', label: 'Field' },
        { key: 'value', label: 'Value' }
      ],
      rows: [
        { field: 'City', value: city.city },
        { field: 'Latitude', value: city.latitude.toFixed(4) },
        { field: 'Longitude', value: city.longitude.toFixed(4) },
        { field: 'Region', value: city.region },
        { field: 'Zone', value: city.zone },
        { field: 'Division', value: city.division },
        { field: 'No. of Stations', value: city.stations },
        { field: 'Daily Trains', value: city.dailyTrains },
        { field: 'Annual Footfall', value: city.annualFootfall }
      ]
    };
  }

  clearDetail(): void {
    this.selectedDetail = null;
  }
}
