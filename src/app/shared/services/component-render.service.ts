import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ComponentRenderService {

  // eslint-disable-next-line
  private components: ComponentRef<any>[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly resolver: ComponentFactoryResolver,
    private readonly application: ApplicationRef,
  ) { }

  public injectComponent<T>(
    component: Type<T>,
    propertySetter?: (type: T) => void,
  ): HTMLElement {
    const factory = this.resolver.resolveComponentFactory(component);
    const createdComponent = factory.create(this.injector);
    this.components.push(createdComponent);

    if (propertySetter) {
      propertySetter(createdComponent.instance);
    }

    this.application.attachView(createdComponent.hostView);

    // eslint-disable-next-line
    return createdComponent.location.nativeElement;
  }

  public destroyRenderedComponents(): void {
    this.components.forEach(c => c.destroy());
    this.components = [];
  }
}
