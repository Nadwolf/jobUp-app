import '../sidebar.css';
import sidebar from '../sidebar';
import button from '../../buttons/buttons';

const taskFeeld = document.getElementById('task-massage');
const taskButtons = document.getElementById('task-buttons');
const address = document.querySelector('.form-view-address');

// создаем кнопки в зависимости от состояния сайдбара (создать задачу / редактирование задачи / просмотр задачи)
const getButtons = (data) => {
  const buttons = [];
  if (data.isArchive) {
    return buttons;
  }
  if (data.id !== null) {
    const saveButton = button.constructButton('save');
    const deleteButton = button.constructButton('delete');
    buttons.push(saveButton, deleteButton);
    return buttons;
  }
  const createButton = button.constructButton('create');
  buttons.push(createButton);
  return buttons;
};

// рисуем контент карточки
const renderTask = (data) => {
  const description = data.description ? `, ${data.description}.` : '.';
  taskFeeld.innerText = `I need a ${data.service} to ${data.job}${description}`;
  address.textContent = data.location
    ? `My address is ${data.location}`
    : 'My address is';
  const buttons = getButtons(data);
  taskButtons.innerHTML = '';
  buttons.forEach((button) =>
    taskButtons.insertAdjacentElement('beforeend', button)
  );
};

// подписываемся на изменения данных в форме
sidebar.observer.subscribe(renderTask);

export default { renderTask };
