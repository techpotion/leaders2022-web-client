import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';


@Component({
  selector: 'button[tpRequestHeatmapToggle]',
  templateUrl: './request-heatmap-toggle.component.html',
  styleUrls: ['./request-heatmap-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestHeatmapToggleComponent {

  constructor() { }

  @Input()
  @HostBinding('class.enabled')
  public enabled = false;

  @HostListener('click')
  public onClick(): void {
    this.enabled = !this.enabled;
    this.enabledChange.emit(this.enabled);
  }

  @Output()
  public readonly enabledChange = new EventEmitter<boolean>();

}
