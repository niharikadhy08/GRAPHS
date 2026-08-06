import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

import { SelectedChartDetail } from '../../models/chart-data.model';
import { DetailTableComponent } from '../detail-table/detail-table.component';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [DetailTableComponent],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailModalComponent {
  readonly detail = input.required<SelectedChartDetail>();
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closed.emit();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
