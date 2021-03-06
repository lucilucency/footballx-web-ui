export const parsePost = ({ post = {}, vote } = {}) => {
  const v = vote;
  if (v) delete (v.id);
  return {
    ...post,
    ...vote,
  };
};


export const parsePostInMeFeeds = (data) => {
  const { posts = [], votes = [] } = data;
  return posts.map((post) => {
    const find = votes && votes.find(o => o.post_id === post.id);
    if (find) {
      delete (find.id);
      delete (find.xuser_id);
    }

    return {
      ...post,
      ...find,
    };
  });
};

export const parsePostAfterCreate = (data) => {
  const { post, community } = data;
  return {
    ...post,
    community_id: community.id,
    community_icon: community.icon,
    community_name: community.name,
    community_link: community.link,
  };
};

