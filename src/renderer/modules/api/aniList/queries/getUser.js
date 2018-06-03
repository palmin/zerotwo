export default `query {
  user: Viewer {
    name
    id
    avatar {
      medium
    }
    mediaListOptions {
      scoreFormat
    }
  }
}`;
