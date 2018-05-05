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
