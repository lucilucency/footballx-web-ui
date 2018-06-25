export const parseMatchInMatchDetail = (resp) => {
  const el = resp.match;
  const clubs = el.cache_clubs ? el.cache_clubs.split(',') : [];
  const goals = el.cache_goals ? el.cache_goals.split(',') : [];
  return {
    ...el,
    home: Number(clubs[0]),
    away: Number(clubs[1]),
    homeGoal: Number(goals[0]),
    awayGoal: Number(goals[1]),
  };
};

export const parseMatches = (resp) => {
  const { matches } = resp;
  if (matches && matches.length) {
    return matches && matches.map((el) => {
      const clubs = el.cache_clubs ? el.cache_clubs.split(',') : [];
      const goals = el.cache_goals ? el.cache_goals.split(',') : [];
      return {
        ...el,
        home: Number(clubs[0]),
        homeGoal: Number(goals[0]),
        away: Number(clubs[1]),
        awayGoal: Number(goals[1]),
      };
    });
  }
  return [];
};
