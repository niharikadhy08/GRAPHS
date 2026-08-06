import { ChangeDetectionStrategy, Component, NgZone, computed, inject, input, output } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule
} from 'ng-apexcharts';

import { BarChartData, BarDetailRow } from '../../models/chart-data.model';

type HorizontalBarChartOptions = {
  readonly series: ApexAxisChartSeries;
  readonly chart: ApexChart;
  readonly colors: string[];
  readonly dataLabels: ApexDataLabels;
  readonly grid: ApexGrid;
  readonly plotOptions: ApexPlotOptions;
  readonly responsive: ApexResponsive[];
  readonly tooltip: ApexTooltip;
  readonly xaxis: ApexXAxis;
  readonly yaxis: ApexYAxis;
};

interface TooltipSeriesContext {
  readonly dataPointIndex: number;
  readonly seriesIndex: number;
}

interface DataLabelContext {
  readonly dataPointIndex?: number;
}

interface ChartSelectionContext {
  readonly dataPointIndex?: number;
}

@Component({
  selector: 'app-horizontal-bar-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './horizontal-bar-card.component.html',
  styleUrl: './horizontal-bar-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalBarCardComponent {
  private readonly ngZone = inject(NgZone);

  readonly data = input.required<BarChartData>();
  readonly title = input.required<string>();
  readonly barSelected = output<BarDetailRow>();
  readonly chartOptions = computed<HorizontalBarChartOptions>(() => this.createChartOptions(this.data()));

  private createChartOptions(chartData: BarChartData): HorizontalBarChartOptions {
    return {
      series: [
        {
          name: chartData.title,
          data: [...chartData.values]
        }
      ],
      chart: {
        type: 'bar',
        height: 360,
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
      colors: [chartData.color],
      dataLabels: {
        enabled: true,
        formatter: (value: number, context?: DataLabelContext): string => {
          const index = context?.dataPointIndex ?? -1;
          const category = chartData.categories[index] ?? '';
          return category ? `${category} - ${this.formatValue(value, chartData.unit)}` : this.formatValue(value, chartData.unit);
        },
        offsetX: -8,
        textAnchor: 'end',
        style: {
          colors: ['#ffffff'],
          fontSize: '12px',
          fontWeight: 700
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.35
        }
      },
      grid: {
        borderColor: '#d9e2ec',
        strokeDashArray: 4,
        padding: {
          right: 22
        },
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          borderRadiusApplication: 'end',
          barHeight: '68%',
          dataLabels: {
            position: 'center'
          },
          distributed: false,
          horizontal: true
        }
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 330
            },
            dataLabels: {
              offsetX: -4,
              style: {
                fontSize: '11px'
              }
            },
            xaxis: {
              labels: {
                show: false
              }
            },
            yaxis: {
              labels: {
                maxWidth: 84
              }
            }
          }
        }
      ],
      tooltip: {
        enabled: true,
        custom: ({ dataPointIndex, seriesIndex }: TooltipSeriesContext): string => {
          const category = chartData.categories[dataPointIndex] ?? 'Unknown';
          const value = chartData.values[dataPointIndex] ?? 0;
          const description = chartData.descriptions[dataPointIndex] ?? 'No description available.';

          return this.buildTooltip(category, value, description, chartData.unit, seriesIndex);
        }
      },
      xaxis: {
        categories: [...chartData.categories],
        labels: {
          formatter: (value: string): string => this.formatValue(Number(value), chartData.unit),
          style: {
            colors: '#637083',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          maxWidth: 150,
          style: {
            colors: '#172033',
            fontSize: '12px',
            fontWeight: 600
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
    category: string,
    value: number,
    description: string,
    unit: string,
    seriesIndex: number
  ): string {
    return `
      <div class="custom-chart-tooltip" data-series-index="${seriesIndex}">
        <div><span>Category:</span><strong>${category}</strong></div>
        <div><span>Value:</span><strong>${this.formatValue(value, unit)}</strong></div>
        <div><span>Description:</span><p>${description}</p></div>
      </div>
    `;
  }
}
