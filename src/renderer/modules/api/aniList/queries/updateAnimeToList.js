export default `
mutation updateAnimeInList($id: Int!, $status: MediaListStatus!, $progress: Int!, $score: Float) {
  SaveMediaListEntry(
    id: $id,
    status: $status,
    progress: $progress,
    score: $score
  ) {
    id
  }
}
`;
