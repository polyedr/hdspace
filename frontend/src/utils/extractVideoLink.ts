import { head } from 'ramda';
import { PLAYERS } from '@Constants/players';
import { VideoSettingsType } from '../types';

interface LinkInfo {
  player: keyof typeof PLAYERS | 'none';
  link: string;
}

export function extractPlayerLinkInfo(link: string): LinkInfo {
  if (!link)
    return {
      player: 'none',
      link: '',
    };
  const currentVideoLink = Object.entries(PLAYERS)
    .filter(([, parameters]) =>
      parameters.aliases.some((alias) => link.startsWith(alias)),
    )
    ?.map(([name, parameters]) => {
      const alias =
        parameters.aliases.find((targetAlias) =>
          link.startsWith(targetAlias),
        ) ?? '';
      const linkWithID = link.replace(alias, parameters.playerLink);
      const linkWithoutAttributes = head(linkWithID.split('?')) || linkWithID;

      return {
        player: name as keyof typeof PLAYERS,
        link: linkWithoutAttributes,
      };
    });

  return head(currentVideoLink) || { player: 'none', link: '' };
}

export function getPlayerLink(
  params: VideoSettingsType,
  isPreviewMode: boolean,
) {
  const { link, autoplay, start, end, loop, rel } = params;

  const linkInfo = extractPlayerLinkInfo(link);
  const playlist = linkInfo?.link.split('/').pop();
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
          attribute: loop,
          value: loop,
        },
        rel: {
          attribute: rel,
          value: rel,
        },
        autoplay: {
          attribute: autoplay && isPreviewMode,
          value: autoplay && isPreviewMode,
        },
        playlist: {
          attribute: loop ? playlist : '',
          value: loop ? playlist : '',
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
