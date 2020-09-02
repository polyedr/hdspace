import * as R from 'ramda';
import { PLAYERS } from '../constants/players';
import { VideoSettingsType } from '../api/types';

type LinkInfo = {
  player: keyof typeof PLAYERS | 'none';
  link: string;
};

export function extractPlayerLinkInfo(link: string): LinkInfo {
  const currentVideoLink = R.toPairs(PLAYERS)
    .filter(([, parameters]) =>
      parameters.aliases.some((alias) => link.startsWith(alias)),
    )
    ?.map(([name, parameters]) => {
      const alias = parameters.aliases.find((targetAlias) =>
        link.startsWith(targetAlias),
      )!;
      const linkWithID = link.replace(alias, parameters.playerLink);
      const linkWithoutAttributes = R.head(linkWithID.split('?')) || linkWithID;

      return {
        player: name as keyof typeof PLAYERS,
        link: linkWithoutAttributes,
      };
    });

  return R.head(currentVideoLink) || { player: 'none', link: '' };
}

export function getPlayerLink(
  params: VideoSettingsType,
  isPreviewMode: boolean,
) {
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
      return `${PLAYERS.twitch.playerLink}${
        link.split('https://www.twitch.tv/')[1]
      }&parent=www.example.com`;
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
        .filter(([, { value }]) => !!value)
        .map(([key, { attribute }]) => `${key}=${attribute}`)
        .join('&');

      const fullLink = `${linkInfo.link}?${linkAttributes}`;

      return fullLink;
    }

    default: {
      return linkInfo.link;
    }
  }
}
