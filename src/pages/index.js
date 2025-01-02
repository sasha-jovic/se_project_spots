import {
  enableValidation,
  validationConfig,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";
import "./index.css";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "8e00a2bb-0ffc-4c2d-9743-2c9af69ab681",
    // new one might need to change
    "Content-Type": "application/json",
  },
});
const previewModal = document.querySelector("#preview-modal");
const profileEditButton = document.querySelector(".profile__edit-button");

const profileName = document.querySelector(".profile__name");
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.querySelector("#profile-form");
const editModalCloseButton = editModal.querySelector(".modal__close");
const editModalSubmitButton = editModal.querySelector(".modal__submit-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const profileDescription = document.querySelector(".profile__description");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close");
const cardModalButton = document.querySelector(".profile__new-post-button");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardModalLinkInput = document.querySelector("#add-card-link-input");
const cardModalCaptionInput = document.querySelector("#add-card-name-input");
const cardForm = cardModal.querySelector(".modal__form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const previewModalCloseButton = document.querySelector(
  ".modal__close_type_preview"
);
const modalSubmitButton = cardModal.querySelector(
  ".modal__submit-button_disabled"
);
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const previewModalImageEl = document.querySelector(".modal__image");
const previewModalCaptionEl = document.querySelector("#add-modal-caption");

const profileAvatar = document.querySelector(".profile__avatar");

//avatar form element
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
//delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseButton = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
  const editModal = document.querySelector(".modal_is-opened");
});

function getCardElement(data) {
  let isLiked = data.isLiked;
  const _id = data._id;
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");

  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  function handleLike(evt) {
    //remove evt.target.classList.toggle("card__like-button-active");
    api
      .changeLikeStatus(_id, isLiked)
      .then((data) => {
        if (!isLiked) {
          cardLikeButton.classList.add("card__like-button_liked");
        } else {
          cardLikeButton.classList.remove("card__like-button_liked");
        }
        isLiked = !isLiked;
      })
      .catch((err) => {
        alert("Could not like/unlike card");
        console.error(err);
      });
  }
  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", (evt) => {
    handleImageClick(data);
  });

  deleteModalCloseButton.addEventListener("click", () => {
    closeModal(deleteModal);
  });

  return cardElement;
}

function handleImageClick(data) {
  previewModalImageEl.src = data.link;
  previewModalCaptionEl.textContent = data.name;
  previewModalImageEl.alt = data.name;
  openModal(previewModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "save";
    });
}

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {})
    .catch(console.error);
  const button = evt.target.querySelector(".modal__submit-button");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      console.log("Delete");
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleDeleteCard(element, cardId) {
  console.log(cardId);
  selectedCard = element;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleCloseModalByEsc(e) {
  if (editModal && e.key === "Escape") {
    const editModal = document.querySelector(".modal_is-opened");
    closeModal(editModal);
  }
}
function openModal(modal) {
  modal.classList.add("modal_is-opened");

  document.addEventListener("keydown", handleCloseModalByEsc);
  modal.addEventListener("mousedown", handleCloseModalOverlayClick);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleCloseModalByEsc);
  modal.removeEventListener("mousedown", handleCloseModalOverlayClick);
}

function handleEditFormSubmit(evt) {
  // const formData = get;

  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "save";
    });
}

function handleCloseModalOverlayClick(e) {
  if (e.target.classList.contains("modal")) closeModal(e.target);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  const nameInputValue = cardNameInput.value;
  console.log(nameInputValue);

  const linkInputValue = cardModalLinkInput.value;
  console.log(linkInputValue);

  const data = {
    name: cardNameInput.value,
    link: cardModalLinkInput.value,
  };

  api
    .addCard(data)
    .then((res) => {
      const cardEl = getCardElement(res);
      cardsList.prepend(cardEl);
    })
    // .catch((error) => {
    // console.error("error adding card:", error);
    // });
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "save";
    });

  closeModal(cardModal);

  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  cardForm.reset();
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,

    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal, settings);
});
editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal, settings);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

cardModalButton.addEventListener("click", () => {
  openModal(cardModal, settings);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal, settings);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal, settings);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal, settings);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

api.getInitialCards().then((cards) => {
  cards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement);
  });
});

api
  .getUserInfo()
  .then((data) => {
    profileName.textContent = data.name;
    profileDescription.textContent = data.about;
    profileAvatar.src = data.avatar;
  })
  .catch((err) => {
    console.error(err);
    alert("Could not retrieve user info.");
  });

api.getAppInfo().then((info) => {
  console.log(info);
});

enableValidation(validationConfig);
