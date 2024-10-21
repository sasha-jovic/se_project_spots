const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];
const previewModal = document.querySelector("#preview-modal");
const profileEditButton = document.querySelector(".profile__edit-button");

const profileName = document.querySelector(".profile__name");
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
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

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal, settings);
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

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });
  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function handleCloseModalByEsc(e) {
  const openedModal = document.querySelector(".modal_is-opened");
  if (openedModal && e.key === "Escape") {
    closeModal(openedModal);
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
  disableButton(cardSubmitButton, settings);
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
  resetValidation(cardForm, [cardModalLinkInput, cardNameInput], settings);
  openModal(cardModal, settings);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal, settings);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
