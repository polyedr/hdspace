import { IframeMessage } from './messageType';

const postMessage = (
  iframe: HTMLIFrameElement | null,
  type: IframeMessage['type'],
  payload: IframeMessage['payload'],
  host: string = '*',
) => {
  if (!iframe?.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage({ type, payload }, host);
};

export default postMessage;
