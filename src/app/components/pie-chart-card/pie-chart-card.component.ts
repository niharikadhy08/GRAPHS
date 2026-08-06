import { ChangeDetectionStrategy, Component, NgZone, computed, inject, input, output } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

import { PieChartData, PieDetailRow } from '../../models/chart-data.model';

type PieChartOptions = {
  readonly series: ApexNonAxisChartSeries;
  readonly chart: ApexChart;
  readonly colors: string[];
  readonly dataLabels: ApexDataLabels;
  readonly fill: ApexFill;
  readonly labels: string[];
  readonly legend: ApexLegend;
  readonly plotOptions: ApexPlotOptions;
  readonly responsive: ApexResponsive[];
  readonly states: ApexStates;
  readonly stroke: ApexStroke;
  readonly tooltip: ApexTooltip;
};

interface TooltipSeriesContext {
  readonly seriesIndex: number;
}

interface DataLabelContext {
  readonly seriesIndex?: number;
}

interface ChartSelectionContext {
  readonly dataPointIndex?: number;
  readonly seriesIndex?: number;
}

@Component({
  selector: 'app-pie-chart-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './pie-chart-card.component.html',
  styleUrl: './pie-chart-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartCardComponent {
  private readonly ngZone = inject(NgZone);

  readonly data = input.required<PieChartData>();
  readonly title = input.required<string>();
  readonly sliceSelected = output<PieDetailRow>();
  readonly chartOptions = computed<PieChartOptions>(() => this.createChartOptions(this.data()));

  private createChartOptions(chartData: PieChartData): PieChartOptions {
    return {
      series: [...chartData.values],
      chart: {
        type: 'pie',
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
            this.selectSlice(config.dataPointIndex ?? config.seriesIndex);
          },
          dataPointSelection: (_event: unknown, _chartContext: unknown, config: ChartSelectionContext): void => {
            this.selectSlice(config.dataPointIndex ?? config.seriesIndex);
          }
        },
        fontFamily: 'Inter, system-ui, sans-serif',
        toolbar: {
          show: false
        }
      },
      colors: [...chartData.colors],
      dataLabels: {
        enabled: true,
        formatter: (_percent: number, context?: DataLabelContext): string => {
          const index = context?.seriesIndex ?? -1;
          const value = chartData.values[index] ?? 0;
          return `${this.formatValue(value, chartData.unit)}`;
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.34
        },
        style: {
          colors: ['#ffffff'],
          fontSize: '14px',
          fontWeight: 900
        }
      },
      fill: {
        opacity: 0.95
      },
      labels: [...chartData.labels],
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: 650,
        offsetY: 8,
        itemMargin: {
          horizontal: 10,
          vertical: 7
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
          customScale: 0.9,
          dataLabels: {
            offset: -28,
            minAngleToShowLabel: 0
          },
          expandOnClick: false
        }
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 360
            },
            dataLabels: {
              style: {
                fontSize: '12px'
              }
            },
            plotOptions: {
              pie: {
                customScale: 0.82,
                dataLabels: {
                  offset: -20
                }
              }
            },
            legend: {
              fontSize: '12px',
              itemMargin: {
                horizontal: 8,
                vertical: 4
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'lighten'
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'darken'
          }
        }
      },
      stroke: {
        colors: ['#ffffff'],
        width: 4
      },
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

  private selectSlice(index: number | undefined): void {
    if (index === undefined || index < 0) {
      return;
    }

    const detail = this.data().details[index];

    if (detail) {
      this.ngZone.run(() => this.sliceSelected.emit(detail));
    }
  }

  private formatValue(value: number, unit: string): string {
    return unit ? `${value}${unit}` : value.toString();
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
