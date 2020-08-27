
export const getTopKTags = (tags = [], n = 1) => {
  if (!Array.isArray(tags)) {
    tags = Object.entries(tags).map(([tag, score]) => ({ tag, score }));
  }

  tags.sort((a, b) => a.score < b.score ? 1 : -1);
  return tags.slice(0, n);
};
