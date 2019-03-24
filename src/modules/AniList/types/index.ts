/**
 * @enum AniListScoreFormat contains the scoring systems of AniList
 */
export enum AniListScoreFormat {
  POINT_100 = 'POINT_100',
  POINT_10_DECIMAL = 'POINT_10_DECIMAL',
  POINT_10 = 'POINT_10',
  POINT_5 = 'POINT_5',
  POINT_3 = 'POINT_3',
}

/**
 * @interface IAniListStreamingEpisode
 * @description Contains data for streaming services
 */
export interface IAniListStreamingEpisode {
  /**
   * @var {string} title contains the title of the episode
   */
  title: string;
  /**
   * @var {string} thumbnail contains the URL of the episode thumbnail
   */
  thumbnail: string;
  /**
   * @var {string} url contains the URL to the episode of the streaming site
   */
  url: string;
  /**
   * @var {string} site contains the name of the streaming service
   */
  site: string;
}

/**
 * @interface IAniListNextAiringEpisode
 * @description contains data for the next airing episode of an anime
 */
export interface IAniListNextAiringEpisode {
  /**
   * @var {number} airingAt contains the timestamp the episode airs at.
   */
  airingAt: number;
  /**
   * @var {number} timeUntilAiring contains the amount of seconds until airing
   */
  timeUntilAiring: number;
  /**
   * @var {number} episode contains the episode number that airs
   */
  episode: any;
  /**
   * @var {number} mediaId contains the associated mediaId
   */
  mediaId: number;
}

/**
 * @interface IAniListCoverImage
 * @description contains the media's cover image in a specific size
 */
export interface IAniListCoverImage {
  /**
   * @var {string} medium contains the medium size thumbnail link
   */
  medium: string;
}

/**
 * @interface IAniListMediaDate
 * @description contains the date of a specific media date
 */
export interface IAniListMediaDate {
  /**
   * @var {number} year contains the date's year
   */
  year: number;
  /**
   * @var {number} month contains the date's month
   */
  month: number;
  /**
   * @var {number} day contains the date's day
   */
  day: number;
}

/**
 * @interface IAniListMediaTitle
 * @description contains the different titles of a media
 */
export interface IAniListMediaTitle {
  /**
   * @var {string} romaji contains the original title in latin characters (rōmaji)
   */
  romaji: string;
  /**
   * @var {string} english contains the English-translated title of the media
   */
  english: string;
  /**
   * @var {string} native contains the original title written in its native language
   */
  native: string;
  /**
   * @var {string} userPreferred contains the title using the user's preference
   */
  userPreferred: string;
}

/**
 * @enum AniListSeason contains the anime seasons
 */
export enum AniListSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

/**
 * @enum AniListMediaStatus contains the media status
 */
export enum AniListMediaStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
}

/**
 * @enum AniListListStatus contains the list status
 */
export enum AniListListStatus {
  CURRENT = 'CURRENT',
  PLANNING = 'PLANNING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PAUSED = 'PAUSED',
  REPEATING = 'REPEATING',
}

/**
 * @enum AniListFormat contains the media format
 */
export enum AniListFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT',
}

/**
 * @enum AniListType contains the media's type
 */
export enum AniListType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
}

/**
 * @interface IAniListMedia
 * @description contains the media's complete information
 */
export interface IAniListMedia {
  /**
   * @var {number} id contains the media's ID
   */
  id: number;
  /**
   * @var {IAniListMediaTitle} title contains the different media's title
   */
  title: IAniListMediaTitle;
  /**
   * @var {string} description contains the description of the media
   */
  description: string;
  /**
   * @var {IAniListMediaDate} startDate contains the start date of the media's first release
   */
  startDate: IAniListMediaDate;
  /**
   * @var {IAniListMediaDate} endDate contains the last official release date of the media
   */
  endDate: IAniListMediaDate;
  /**
   * @var {AniListSeason} season contains the media's season
   */
  season: AniListSeason;
  /**
   * @var {AniListMediaStatus} status contains the media's status
   */
  status: AniListMediaStatus;
  /**
   * @var {AniListFormat} format contains the media's release format
   */
  format: AniListFormat;
  /**
   * @var {AniListType} type contains the media's type
   */
  type: AniListType;
  /**
   * @var {number} episodes contains the amount of episodes
   */
  episodes: number;
  /**
   * @var {boolean} isLicensed indicates if the media is licensed (in America)
   */
  isLicensed: boolean;
  /**
   * @var {number} updatedAt contains the timestamp of the last update
   */
  updatedAt: number;
  /**
   * @var {IAniListCoverImage} coverImage contains the urls of the media's cover image
   */
  coverImage: IAniListCoverImage;
  /**
   * @var {string[]} synonyms contains all the synonyms of the media's title
   */
  synonyms: string[];
  /**
   * @var {number} averageScore contains the media's average score
   */
  averageScore: number;
  /**
   * @var {number} favourites contains the number of people that marked the media as favourite
   */
  favourites: number;
  /**
   * @var {boolean} isAdult indicates if the media is only suited for adults (18+)
   */
  isAdult: boolean;
  /**
   * @var {IAniListNextAiringEpisode} nextAiringEpisode contains information about the next airing episode
   */
  nextAiringEpisode: IAniListNextAiringEpisode;
  /**
   * @var {IAniListStreamingEpisode[]} streamingEpisodes contains information about all streaming episodes
   */
  streamingEpisodes: IAniListStreamingEpisode[];
}

/**
 * @interface IAniListEntry
 * @description contains information about the user's progress of a certain media
 */
export interface IAniListEntry {
  /**
   * @var {number} id contains the ID of the list entry
   */
  id: number;
  /**
   * @var {number} progress contains the amount of progress (episodes/chapters) consumed
   */
  progress: number;
  /**
   * @var {number} score contains the user's given score
   */
  score: number;
  /**
   * @var {AniListListStatus} status contains the list entry's status
   */
  status: AniListListStatus;
  /**
   * @var {number} updatedAt contains the timestamp of the last update
   */
  updatedAt: number;
  /**
   * @var {IAniListMedia} media contains the list entry's media information
   */
  media: IAniListMedia;
}

/**
 * @interface IAniListList
 * @description contains information of a user's list
 */
export interface IAniListList {
  /**
   * @var {IAniListEntry[]} entries contains the list's user entries
   */
  entries: IAniListEntry[];
  /**
   * @var {AniListListStatus} status contains the list's status
   */
  status: AniListListStatus;
}

/**
 * @interface IAniListMediaListCollection
 * @description contains the user's lists
 */
export interface IAniListMediaListCollection {
  /**
   * @var {IAniListList[]} lists contains the user's lists
   */
  lists: IAniListList[];
}

/**
 * @interface IAniListUserAvatar
 * @description contains the user's avatar
 */
export interface IAniListUserAvatar {
  /**
   * @var {string} medium contains the URL to the user's avatar (medium-size)
   */
  medium: string;
}

/**
 * @interface IAniListUserStats
 * @description contains the user's stats
 */
export interface IAniListUserStats {
  /**
   * @var {number} watchedTime contains the amount of minutes the user has watched anime
   */
  watchedTime: number;
}

/**
 * @interface IAniListUserMediaListOptions
 * @description contains the user's preferences for their lists
 */
export interface IAniListUserMediaListOptions {
  /**
   * @var {string} scoreFormat contains the user's preferred scoring system format
   */
  scoreFormat: string;
}

/**
 * @interface IAniListUserOptions
 * @description contains the user's general AniList options
 */
export interface IAniListUserOptions {
  displayAdultContent: boolean;
}

/**
 * @interface IAniListUser
 * @description contains information about the user
 */
export interface IAniListUser {
  /**
   * @var {number} id contains the ID of the user
   */
  id: number;
  /**
   * @var {string} name contains the user's name
   */
  name: string;
  /**
   * @var {IAniListUserAvatar} avatar contains the user's avatar information
   */
  avatar: IAniListUserAvatar;
  /**
   * @var {string} bannerImage contains the URL to the user's banner image
   */
  bannerImage: string;
  /**
   * @var {IAniListUserMediaListOptions} mediaListOptions contains the user's media list options
   */
  mediaListOptions: IAniListUserMediaListOptions;
  /**
   * @var {IAniListUserOptions} options contains the user's general settings
   */
  options: IAniListUserOptions;
  /**
   * @var {IAniListUserStats} stats contains the user's stats information
   */
  stats: IAniListUserStats;
}

/**
 * @interface IAniListSession
 * @description contains the user's log in session information
 */
export interface IAniListSession {
  /**
   * @var {string} accessToken contains the access token of the current session
   */
  accessToken: string;
  /**
   * @var {IAniListUser} user contains the data of the currently logged in user
   */
  user: IAniListUser;
}
