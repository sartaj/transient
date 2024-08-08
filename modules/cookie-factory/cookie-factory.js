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
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1); // Trim leading spaces
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Return the cookie value
    }
    return null; // Return null if the cookie is not found
  };

  // Return all functions
  return { set, get };
};
