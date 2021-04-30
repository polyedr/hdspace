export type ElementsDom = {
  [id: string]: HTMLElement | null;
};

export class DOMHandler {
  public static readonly INSTANCE = new DOMHandler();

  public get elementsDom() {
    return this._elementsDom;
  }

  public addElementDom(id: string, element: HTMLElement) {
    if (!element) return;
    this._observer.observe(element);
    this._elementsDom[id] = element;
  }

  public removeElementDom(id: string) {
    if (this._elementsDom[id]) {
      this._observer.unobserve(this._elementsDom[id] as Element);
      this._elementsDom[id] = null;
    }
  }

  public getDomById(id: string | null) {
    return id ? this._elementsDom[id] : null;
  }

  public get visibleElementsIds() {
    return this._visibleElementsIds;
  }

  public reset() {
    this._observer.disconnect();
    this._elementsDom = {};
    this._visibleElementsIds = [];
  }

  constructor() {
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { id } = entry.target;
        if (!id || !id.length) {
          return;
        }
        if (entry.isIntersecting && !this._visibleElementsIds.includes(id)) {
          this._visibleElementsIds.push(id);
        }
        if (!entry.isIntersecting && this._visibleElementsIds.includes(id)) {
          this._visibleElementsIds.splice(
            this._visibleElementsIds.indexOf(id),
            1,
          );
        }
      });
    });
  }

  private _elementsDom: ElementsDom = {};
  private _visibleElementsIds: string[] = [];
  private _observer: IntersectionObserver;
}
