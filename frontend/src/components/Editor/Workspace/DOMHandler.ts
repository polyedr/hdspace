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
    console.log('RESET!!');
    this._observer.disconnect();
    this._mutationObserver.disconnect();
    this._observableNode = null;
    this._elementsDom = {};
    this._visibleElementsIds = [];
  }

  public watch(dom: HTMLElement) {
    console.log('WATCH!!', dom);
    if (!dom || this._observableNode === dom) {
      return;
    }
    this._observableNode = dom;
    this._mutationObserver.observe(dom, {
      subtree: true,
      childList: true,
    });
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

    this._mutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((record: MutationRecord) => {
          if (record.removedNodes.length) {
            record.removedNodes.forEach((node: Node) => {
              const { id } = node as HTMLElement;
              if (!id) {
                return;
              }
              this.removeElementDom(id);
            });
          }
        });
      },
    );
  }

  private _elementsDom: ElementsDom = {};
  private _visibleElementsIds: string[] = [];
  private _observer: IntersectionObserver;
  private _mutationObserver: MutationObserver;
  private _observableNode: Node | null = null;
}
