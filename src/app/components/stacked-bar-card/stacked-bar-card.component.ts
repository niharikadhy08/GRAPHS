import { ChangeDetectionStrategy, Component, NgZone, computed, inject, input, output } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule
} from 'ng-apexcharts';

import { StackedBarChartData, StackedBarDetailGroup } from '../../models/chart-data.model';

type StackedBarChartOptions = {
  readonly series: ApexAxisChartSeries;
  readonly chart: ApexChart;
  readonly colors: string[];
  readonly dataLabels: ApexDataLabels;
  readonly fill: ApexFill;
  readonly grid: ApexGrid;
  readonly legend: ApexLegend;
  readonly plotOptions: ApexPlotOptions;
  readonly responsive: ApexResponsive[];
  readonly stroke: ApexStroke;
  readonly tooltip: ApexTooltip;
  readonly xaxis: ApexXAxis;
  readonly yaxis: ApexYAxis;
};

interface TooltipSeriesContext {
  readonly dataPointIndex: number;
  readonly seriesIndex: number;
}

interface ChartSelectionContext {
  readonly dataPointIndex?: number;
}

@Component({
  selector: 'app-stacked-bar-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './stacked-bar-card.component.html',
  styleUrl: './stacked-bar-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackedBarCardComponent {
  private readonly ngZone = inject(NgZone);

  readonly data = input.required<StackedBarChartData>();
  readonly title = input.required<string>();
  readonly barSelected = output<StackedBarDetailGroup>();
  readonly chartOptions = computed<StackedBarChartOptions>(() => this.createChartOptions(this.data()));

  private createChartOptions(chartData: StackedBarChartData): StackedBarChartOptions {
    return {
      series: chartData.series.map((series) => ({
        name: series.name,
        data: [...series.values]
      })),
      chart: {
        type: 'bar',
        height: 420,
        stacked: true,
        animations: {
          enabled: true,
          speed: 700,
          dynamicAnimation: {
            enabled: true,
            speed: 500
          }
        },
        events: {
          click: (_event: unknown, _chartContext: unknown, config: ChartSelectionContext): void => {
            this.selectBar(config.dataPointIndex);
          },
          dataPointSelection: (_event: unknown, _chartContext: unknown, config: ChartSelectionContext): void => {
            this.selectBar(config.dataPointIndex);
          }
        },
        fontFamily: 'Inter, system-ui, sans-serif',
        toolbar: {
          show: false
        }
      },
      colors: chartData.series.map((series) => series.color),
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 0.94
      },
      grid: {
        borderColor: '#d9e2ec',
        strokeDashArray: 4,
        padding: {
          left: 6,
          right: 16
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '13px',
        fontWeight: 700,
        labels: {
          colors: '#172033'
        },
        itemMargin: {
          horizontal: 10,
          vertical: 6
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          borderRadiusApplication: 'end',
          columnWidth: '52%',
          horizontal: false
        }
      },
      responsive: [
        {
          breakpoint: 720,
          options: {
            chart: {
              height: 390
            },
            legend: {
              horizontalAlign: 'left',
              position: 'bottom'
            },
            plotOptions: {
              bar: {
                columnWidth: '66%'
              }
            }
          }
        }
      ],
      stroke: {
        colors: ['#ffffff'],
        width: 2
      },
      tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        custom: ({ dataPointIndex, seriesIndex }: TooltipSeriesContext): string => {
          const group = chartData.details[dataPointIndex];
          const stack = chartData.series[seriesIndex];
          const value = stack?.values[dataPointIndex] ?? 0;

          return this.buildTooltip(group, stack?.name ?? 'Source', value, chartData.unit);
        }
      },
      xaxis: {
        categories: [...chartData.categories],
        labels: {
          style: {
            colors: '#637083',
            fontSize: '12px',
            fontWeight: 700
          }
        }
      },
      yaxis: {
        title: {
          text: chartData.unit || undefined,
          style: {
            color: '#637083',
            fontSize: '12px',
            fontWeight: 700
          }
        },
        labels: {
          formatter: (value: number): string => this.formatValue(value, chartData.unit),
          style: {
            colors: '#637083',
            fontSize: '12px'
          }
        }
      }
    };
  }

  private selectBar(index: number | undefined): void {
    if (index === undefined || index < 0) {
      return;
    }

    const detail = this.data().details[index];

    if (detail) {
      this.ngZone.run(() => this.barSelected.emit(detail));
    }
  }

  private formatValue(value: number, unit: string): string {
    return unit ? `${value} ${unit}` : value.toString();
  }

  private buildTooltip(
    group: StackedBarDetailGroup | undefined,
    source: string,
    value: number,
    unit: string
  ): string {
    if (!group) {
      return '';
    }

    const rows = group.rows
      .map((row) => `<li><span>${row.source}</span><strong>${row.revenue}</strong></li>`)
      .join('');

    return `
      <div class="custom-chart-tooltip stacked-tooltip">
        <div><span>Month:</span><strong>${group.month}</strong></div>
        <div><span>Hovered source:</span><strong>${source} - ${this.formatValue(value, unit)}</strong></div>
        <div><span>Total:</span><strong>${group.total}</strong></div>
        <ul>${rows}</ul>
      </div>
    `;
  }
}
