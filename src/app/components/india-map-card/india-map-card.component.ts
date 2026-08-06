import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import * as L from 'leaflet';

import { CityMapData, CityMarker } from '../../models/chart-data.model';

@Component({
  selector: 'app-india-map-card',
  standalone: true,
  templateUrl: './india-map-card.component.html',
  styleUrl: './india-map-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndiaMapCardComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);

  @ViewChild('mapContainer', { static: true }) private readonly mapContainer!: ElementRef<HTMLDivElement>;

  readonly data = input.required<CityMapData>();
  readonly title = input.required<string>();
  readonly citySelected = output<CityMarker>();

  private readonly viewReady = signal(false);
  private map?: L.Map;
  private markerLayer?: L.LayerGroup;
  private readonly indiaBounds = L.latLngBounds([6.4, 67.4], [36.7, 97.7]);

  constructor() {
    effect(() => {
      const data = this.data();

      if (this.viewReady()) {
        this.renderMarkers(data.markers);
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      attributionControl: true,
      doubleClickZoom: true,
      maxBounds: this.indiaBounds.pad(0.12),
      maxBoundsViscosity: 0.8,
      minZoom: 4,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.map.fitBounds(this.indiaBounds, { animate: false, padding: [12, 12] });
    this.viewReady.set(true);

    window.setTimeout(() => this.map?.invalidateSize(), 80);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderMarkers(markers: readonly CityMarker[]): void {
    if (!this.map || !this.markerLayer) {
      return;
    }

    const markerLayer = this.markerLayer;
    markerLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    markers.forEach((city: CityMarker) => {
      const latLng = L.latLng(city.latitude, city.longitude);
      const marker = L.marker(latLng, {
        icon: L.divIcon({
          className: `city-pin-marker city-pin-marker--${this.markerTone(city.region)}`,
          html: '<span></span>',
          iconAnchor: [13, 30],
          iconSize: [26, 32]
        })
      }).bindTooltip(this.tooltipContent(city), {
        className: 'city-tooltip',
        direction: 'top',
        offset: [0, -10],
        opacity: 1,
        sticky: true
      });

      marker.on('click', () => this.ngZone.run(() => this.citySelected.emit(city)));
      markerLayer.addLayer(marker);
      bounds.extend(latLng);
    });

    if (bounds.isValid()) {
      this.map.fitBounds(bounds.pad(0.22), {
        animate: true,
        maxZoom: 5
      });
    }
  }

  private markerTone(region: string): 'blue' | 'red' {
    return region === 'North' || region === 'East' ? 'red' : 'blue';
  }

  private tooltipContent(city: CityMarker): string {
    return `
      <div class="city-tooltip__content">
        <div><span>City:</span><strong>${city.city}</strong></div>
        <div><span>Latitude:</span><strong>${city.latitude.toFixed(4)}</strong></div>
        <div><span>Longitude:</span><strong>${city.longitude.toFixed(4)}</strong></div>
      </div>
    `;
  }
}
