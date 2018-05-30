export const parseCommentsInPost = (data) => {
  const { comments = [], xusers = [] } = data;
  const xuserIDs = xusers.map(o => Number(o.id));

  const mappingUser = (o) => {
    const index = xuserIDs.findIndex(id => id === Number(o.xuser_id));
    return {
      ...o,
      xuser: xusers[index],
      comments: o.comments && o.comments.map(el => mappingUser(el)),
    };
  };

  return comments.map(o => mappingUser(o));
};

export const parseCommentAfterCommentInPost = data => data.post;

export const parseCommentAfterCommentInMatch = data => data.comment;
