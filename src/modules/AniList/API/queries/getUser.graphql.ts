export default `
query {
  user: Viewer {
    name
    id
    avatar {
      medium
      large
    }
    bannerImage
    mediaListOptions {
      scoreFormat
    }
    stats {
      watchedTime
    }
    options {
      displayAdultContent
    }
  }
}
`;
