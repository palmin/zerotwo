export default `
query GetActivities($page: Int!, $perPage: Int!, $userId: Int!) {
  page: Page(page: $page, perPage: $perPage) {
    activities(userId: $userId, sort: ID_DESC) {
      ... on ListActivity {
        id
        media {
          id
          title {
            userPreferred
          }
        }
        progress
        status
        type
        createdAt
      }
    }
  }
}
`;
