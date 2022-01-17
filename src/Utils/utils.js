export const isEmpty = (str) => {
  str = str.replace(/\s/g, "").trim();
  return !str || /^\s*$/.test(str);
};

// function maps the response from nft details api to nft__details store
export const mapNftDetails = (data) => {
  console.log("sdsfsd",data);
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
    status: data.status,
  };
};

export const mapNftDetailsWithOwnerObject = (data) => {
  console.log("dsfsf",data);
  return {
    image: data.file_url,
    category: data.category,
    title: data.title,
    selected: false,
    id: data.nft_id,
    nftid: data.nft_id,
    description: data.description,
    attributes: data.attributes,
    owner: data.owner,
    status: data.status,
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


export const isValidateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


export const isValidPhoneNumber = (phone) => {
  return phone
    .match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    );
};



export const mapContact = (inputFields) => {
  return {
    "first_name": inputFields?.first_name ? inputFields?.first_name:"",
    "email":inputFields?.email ? [
      {
        "address": inputFields?.email,
        "type": "home"
      }
    ]:[],
    "phone": inputFields?.phone ? [{
      "number": inputFields?.phone,
      "type": "mobile"
  },]:[],
    "last_name":inputFields?.last_name? inputFields?.last_name :  "",
    "address": [],
    "job_title": "",
    "companies": [],
    "groups": [],
    "dob": "",
    "birthday": "",
    "import_source": "manual",
    "app_id": "",
    "owner_id": ""
  };
}


export const isValidName = (text) =>{
  let regularExp = /^[a-z,.'-]+$/i
  return regularExp.test(text);
}

export const isOnlyNumber = (number) =>{
  let regularExp = /^[0-9+]+$/i
  return regularExp.test(number);
}

export const isValidFullName = (text) =>{
  let regularExp = /^[a-z ,.'-]+$/i
  return regularExp.test(text);
}