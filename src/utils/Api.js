class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "ce6accd1-54f9-4a7f-9008-5e7fc57d42dd",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}
export default Api;
