export const getAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  // const accessTokenResponse = await (await fetch(accessTokenURL)).json()
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  return accessTokenResponse;
};

export const getUserProfile = async (access_token: string) => {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // 캐싱 ❌
  });
  // 기본적으로 GET request들은 Next.js에의해 캐싱됨
  return userProfileResponse;
};

export const getUserEmail = async (access_token: string) => {
  const userProfileEmailResponse = await fetch(
    'https://api.github.com/user/emails',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache', // 캐싱 ❌
    }
  );
  return userProfileEmailResponse;
};
