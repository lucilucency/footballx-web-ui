export const parseCommentsInPost = (data) => {
  const { comments = [], xusers = [] } = data;
  const xuserIDs = xusers.map(o => Number(o.id));

  return comments.map((o) => {
    const index = xuserIDs.findIndex(id => id === Number(o.xuser_id));

    return {
      ...o,
      xuser: xusers[index],
    };
  });
};

export const parseCommentAfterCommentInPost = data => data.post;

export const parseCommentAfterCommentInMatch = data => data.comment;
