import { ChangeDetectionStrategy, Component, NgZone, computed, inject, input, output } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

import { DoughnutChartData, DoughnutDetailRow } from '../../models/chart-data.model';

type DoughnutChartOptions = {
  readonly series: ApexNonAxisChartSeries;
  readonly chart: ApexChart;
  readonly colors: string[];
  readonly dataLabels: ApexDataLabels;
  readonly fill: ApexFill;
  readonly labels: string[];
  readonly legend: ApexLegend;
  readonly plotOptions: ApexPlotOptions;
  readonly responsive: ApexResponsive[];
  readonly tooltip: ApexTooltip;
};

interface TooltipSeriesContext {
  readonly seriesIndex: number;
}

interface ChartSelectionContext {
  readonly dataPointIndex?: number;
  readonly seriesIndex?: number;
}

@Component({
  selector: 'app-doughnut-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './doughnut-card.component.html',
  styleUrl: './doughnut-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoughnutCardComponent {
  private readonly ngZone = inject(NgZone);

  readonly data = input.required<DoughnutChartData>();
  readonly title = input.required<string>();
  readonly segmentSelected = output<DoughnutDetailRow>();
  readonly chartOptions = computed<DoughnutChartOptions>(() => this.createChartOptions(this.data()));

  private createChartOptions(chartData: DoughnutChartData): DoughnutChartOptions {
    return {
      series: [...chartData.values],
      chart: {
        type: 'donut',
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
            this.selectSegment(config.dataPointIndex ?? config.seriesIndex);
          },
          dataPointSelection: (_event: unknown, _chartContext: unknown, config: ChartSelectionContext): void => {
            this.selectSegment(config.dataPointIndex ?? config.seriesIndex);
          }
        },
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      colors: [...chartData.colors],
      dataLabels: {
        enabled: true,
        formatter: (percent: number): string => `${percent.toFixed(1)}%`,
        style: {
          fontSize: '12px',
          fontWeight: 700
        }
      },
      fill: {
        opacity: 0.94
      },
      labels: [...chartData.labels],
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: 600,
        offsetY: 8,
        itemMargin: {
          horizontal: 12,
          vertical: 8
        },
        labels: {
          colors: '#172033'
        },
        markers: {
          size: 6,
          strokeWidth: 0
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              name: {
                show: true,
                color: '#637083',
                fontSize: '13px',
                fontWeight: 700
              },
              value: {
                show: true,
                color: '#172033',
                fontSize: '24px',
                fontWeight: 800,
                formatter: (value: string): string => this.formatValue(Number(value), chartData.unit)
              },
              total: {
                show: true,
                label: 'Total',
                color: '#637083',
                fontSize: '13px',
                fontWeight: 700,
                formatter: (): string => this.formatValue(this.total(chartData.values), chartData.unit)
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 330
            },
            legend: {
              fontSize: '12px',
              itemMargin: {
                horizontal: 8,
                vertical: 4
              }
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    value: {
                      fontSize: '20px'
                    }
                  }
                }
              }
            }
          }
        }
      ],
      tooltip: {
        enabled: true,
        custom: ({ seriesIndex }: TooltipSeriesContext): string => {
          const category = chartData.labels[seriesIndex] ?? 'Unknown';
          const value = chartData.values[seriesIndex] ?? 0;
          const description = chartData.descriptions[seriesIndex] ?? 'No description available.';

          return this.buildTooltip(category, value, description, chartData.unit, seriesIndex);
        }
      }
    };
  }

  private selectSegment(index: number | undefined): void {
    if (index === undefined || index < 0) {
      return;
    }

    const detail = this.data().details[index];

    if (detail) {
      this.ngZone.run(() => this.segmentSelected.emit(detail));
    }
  }

  private total(values: readonly number[]): number {
    return values.reduce((sum: number, value: number) => sum + value, 0);
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
