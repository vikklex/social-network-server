const setUserBody = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    job: user.job,
    email: user.email,
    birthday: user.birthday,
    avatar: user.avatar,
    album: user.album,
    followers: user.followers,
    followings: user.followings,
    is_admin: user.is_admin,
    desc: user.desc,
    city: user.city,
    from: user.from,
    status: user.status,
    relationships: user.relationships,
    gender: user.gender,
  };
};
