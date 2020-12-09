export type ElementsDom = {
  [id: string]: HTMLElement;
};

export class DOMHandler {
  public static readonly INSTANCE = new DOMHandler();

  public get elementsDom() {
    return this._elementsDom;
  }

  public addElementDom(id: string, element: HTMLElement) {
    if (!this._elementsDom[id]) {
      this._elementsDom[id] = element;
    }
  }

  public getDomById(id: string | null) {
    return id ? this._elementsDom[id] : null;
  }

  public reset() {
    this._elementsDom = {};
  }

  // private constructor() {}

  private _elementsDom: ElementsDom = {};
}
