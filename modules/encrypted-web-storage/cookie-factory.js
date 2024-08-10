/***
               _  _
             _/0\/ \_
    .-.   .-` \_/\0/ '-.
   /:::\ / ,_________,  \
  /\:::/ \  '. (:::/  `'-;
  \ `-'`\ '._ `"'"'\__    \
   `'-.  \   `)-=-=(  `,   |
     \  `-"`      `"-`   /
           nom nom nom
*/
export const cookieFactory = (name) => {
  // Function to set a cookie with expiration date stored in the value
  const set = (value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    // Store the expiration date along with the value
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // Function to get a cookie value and expiration details
  const get = () => {
    let cookie = {};
    document.cookie.split(";").forEach(function (el) {
      let split = el.split("=");
      cookie[split[0].trim()] = split.slice(1).join("=");
    });
    return cookie[name];
  };

  // Return all functions
  return { set, get };
};
