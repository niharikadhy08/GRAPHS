import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DetailTableColumn, DetailTableRow } from '../../models/chart-data.model';

@Component({
  selector: 'app-detail-table',
  standalone: true,
  templateUrl: './detail-table.component.html',
  styleUrl: './detail-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailTableComponent {
  readonly columns = input.required<readonly DetailTableColumn[]>();
  readonly rows = input.required<readonly DetailTableRow[]>();

  cell(row: DetailTableRow, key: string): string | number {
    return row[key] ?? '';
  }
}
