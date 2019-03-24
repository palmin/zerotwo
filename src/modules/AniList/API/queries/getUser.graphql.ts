export default `
query {
  user: Viewer {
    name
    id
    avatar {
      medium
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
