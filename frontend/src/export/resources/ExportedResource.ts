export interface Params {}
export type MapParams = Params & {
  API_KEY: string;
};

export type ResourceType = 'css' | 'script';

export class ExportedResource<T extends Params> {
  get type() {
    return this._type;
  }

  get link() {
    return this._link;
  }

  get params() {
    return this._params;
  }

  equals(resource: ExportedResource<Params>) {
    if (this.type !== resource.type || this._link !== resource.link) {
      return false;
    }
    const paramKeys = Object.keys(this._params);
    for (let i = 0; i < paramKeys.length; i++) {
      const key = paramKeys[i];
      if (this._params[key] !== resource.params[key]) {
        return false;
      }
    }
    return true;
  }

  render() {
    return this._type === 'css'
      ? `<link rel="stylesheet" type="text/css" href="${this.linkWithParams()}">`
      : `<script type="text/javascript" src="${this.linkWithParams()}"></script>`;
  }

  private linkWithParams() {
    const paramsString = Object.keys(this._params)
      .map((paramName: string) => `${paramName}=${this._params[paramName]}`)
      .join('&');
    return `${this._link}${paramsString}`;
  }

  constructor(type: ResourceType, link: string, params: T) {
    this._type = type;
    this._link = link;
    this._params = params;
  }

  private readonly _type: ResourceType;

  private readonly _link: string;

  private readonly _params: T;
}
