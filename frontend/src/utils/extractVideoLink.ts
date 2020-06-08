import * as R from 'ramda';

import { VideoSettings } from '$redux/project/types';
import { PLAYERS } from '$constants/players';

type LinkInfo = {
  player: keyof typeof PLAYERS | 'none',
  link: string,
};

export function getPlayerLink(params: VideoSettings['videoSettings'], isPreviewMode: boolean) {
  const { link, autoplay, start, end, loop, rel } = params;

  const linkInfo = extractPlayerLinkInfo(link);

  switch (linkInfo.player) {
    case 'kickstarter': {
      return `${linkInfo.link}/widget/video.html`;
    }

    case 'wistia': {
      return `${PLAYERS.wistia.playerLink}${link.split('videoid=')[1]}`;
    }

    case 'twitch': {
      return `${PLAYERS.twitch.playerLink}${link.split('https://www.twitch.tv/')[1]}&parent=www.example.com`;
    }

    case 'youtube': {
      const attributes = {
        start: {
          attribute: start,
          value: start,
        },
        end: {
          attribute: end,
          value: end,
        },
        loop: {
          attribute: 1,
          value: loop,
        },
        rel: {
          attribute: 0,
          value: rel,
        },
        autoplay: {
          attribute: 1,
          value: autoplay && isPreviewMode,
        },
      };
    
      const linkAttributes = Object.entries(attributes)
        .filter(([key, { value }]) => !!value)
        .map(([key, { attribute }]) => `${key}=${attribute}`)
        .join("&");
    
      const fullLink = `${linkInfo.link}?${linkAttributes}`;
    
      return fullLink;
    }

    default: {
      return linkInfo.link;
    }
  }
}

export function extractPlayerLinkInfo(link: string): LinkInfo {
  const currentVideoLink = R.toPairs(PLAYERS)
    .filter(([name, parameters]) => parameters.aliases.some((alias) => link.startsWith(alias)))
    ?.map(([name, parameters]) => {
      const alias = parameters.aliases.find((alias) => link.startsWith(alias))!;
      const linkWithID = link.replace(alias, parameters.playerLink);
      const linkWithoutAttributes = R.head(linkWithID.split('?')) || linkWithID;

      return { player: name as keyof typeof PLAYERS, link: linkWithoutAttributes };
    });

  return R.head(currentVideoLink) || { player: 'none', link: '' };
}