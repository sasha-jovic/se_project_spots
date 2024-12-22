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
    // authorization: "ce6accd1-54f9-4a7f-9008-5e7fc57d42dd",
    authorization: "b2db802e-b8de-434c-b049-524ce0a493f9",
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
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", (evt) => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  deleteModalCloseButton.addEventListener("click", () => {
    closeModal(deleteModal, settings);
  });

  return cardElement;
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
    })
    .catch(console.error);
}

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      console.log("Delete");
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleDeleteCard(element, data) {
  selectedCard = element;
  selectedCardId = data._id;
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
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {})
    .catch(console.error);
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal, settings);
}

function handleCloseModalOverlayClick(e) {
  if (e.target.classList.contains("modal")) closeModal(e.target);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const nameInputValue = cardNameInput.value;
  const linkInputValue = cardModalLinkInput.value;
  cardsList.prepend(
    getCardElement({
      name: nameInputValue,
      link: linkInputValue,
    })
  );
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
  avatarForm.addEventListener("submit", handleAvatarSubmit);
});

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

api.getAppInfo().then((info) => {
  console.log(info);
});

enableValidation(validationConfig);
