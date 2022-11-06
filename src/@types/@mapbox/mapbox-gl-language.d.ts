declare module '@mapbox/mapbox-gl-language' {

  import { IControl, Map } from 'mapbox-gl';

  export default class MapboxLanguage implements IControl {

    constructor(options?: {
      defaultLanguage: string;
      supportedLanguages?: string[];
    });

    public onAdd(map: Map): HTMLElement;

    public onRemove(map: Map): HTMLElement;

    public getDefaultPosition?: (() => string) | undefined;

  }

}
