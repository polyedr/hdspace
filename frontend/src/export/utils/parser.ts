import axios from 'axios';
import JSZip from 'jszip';

const assetAttributes = ['src', 'href'];

// eslint-disable-next-line import/prefer-default-export
export const parseHTML = async (html: string, assetsFolder: JSZip | null) => {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const allNodes = dom.getElementsByTagName('*');
  for (let i = 0; i < allNodes.length; i++) {
    const element = allNodes.item(i) as HTMLElement;
    for (let j = 0; j < assetAttributes.length; j++) {
      const attr = assetAttributes[j];
      if (element.hasAttribute(attr)) {
        const url = element.getAttribute(attr) as string;
        if (url.match('^(?:[a-z]+:)?//i')) {
          element.setAttribute(
            attr,
            `${document.location}${element.getAttribute(attr)}`,
          );
        } else if (attr === 'src') {
          element.setAttribute(attr, `assets${url}`);
          // eslint-disable-next-line no-await-in-loop
          await axios.get(url).then((response) => {
            if (response.headers['content-type'].indexOf('image') !== -1) {
              assetsFolder?.file(
                url.substring(url.lastIndexOf('/')),
                response.data,
              );
            }
          });
        }
      }
    }
  }
  return dom.body.innerHTML;
};
