export const isEmpty = (str) => {
  str = str.replace(/\s/g, "").trim();
  return !str || /^\s*$/.test(str);
};

// function maps the response from nft details api to nft__details store
export const mapNftDetails = (data) => {
  return {
    image: data.file_url,
    category: data.category,
    title: data.title,
    selected: false,
    id: data.nft_id,
    nftid: data.nft_id,
    description: data.description,
    attributes: data.attributes,
    owner: data.owner?.wallet_id,
  };
};

export const mapUserSession = (data) => ({
  user: data["user_info"],
  jwt: {
    jwt_access_token: data["jwt_access_token"],
    jwt_id_token: data["jwt_id_token"],
    jwt_refresh_token: data["jwt_refresh_token"],
  },
});
