import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

const breedContainer = document.querySelector('.breed-select');
const textLoader = document.querySelector('.loader');
const textError = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

textLoader.style.display = 'none';
textError.style.display = 'none';

const onShowDisplay = (value1, value2, value3) => {
  textLoader.style.display = value1;
  breedContainer.style.display = value2;
  textError.style.display = value3;
};

const breedSelected = async () => {
  textLoader.style.display = 'block';
  try {
    const breeds = await fetchBreeds();
    createOptionsMarkup(breeds);
  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    textLoader.style.display = 'none';
  }
};

breedSelected();

const createOptionsMarkup = (breeds) => {
  const breedOptions = breeds.map(breed => {
    const breedOption = document.createElement('option');
    breedOption.value = breed.id;
    breedOption.text = breed.name;
    return breedOption;
  });
  breedContainer.append(...breedOptions);
};

const breedSelectedById = async (breedId) => {
  onShowDisplay('block', 'none');
  catInfo.style.display = 'none';

  try {
    const data = await fetchCatByBreed(breedId);
    const [breed] = data;
    createMarkup(breed);
    catInfo.style.display = 'block';
  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    catInfo.style.display = 'none';
  } finally {
    onShowDisplay('none', 'block', 'none');
  }
};

const createMarkup = (breed) => {
  const catsDescr = breed.breeds[0];

  catInfo.innerHTML = `
    <img src="${breed.url}" alt="${catsDescr.name}"/>
    <h2>${catsDescr.name}</h2>
    <p>${catsDescr.description}</p>
    <p><strong>Tempetament: </strong>${catsDescr.temperament}</p>
  `;
};

breedContainer.addEventListener('change', () => {
  const breedId = breedContainer.value;
  breedSelectedById(breedId);
});