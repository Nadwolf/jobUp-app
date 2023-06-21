import './sidebar.css';
import tasksType from './tasks-type';
import map from '../map/map';
import Observable from '../../components/observer';

const layout = document.querySelector('.main');
const form = document.querySelector('#sidebar form');
const serviceType = document.querySelectorAll('.service-type-list .form-radio');
const header = document.getElementById('tasks-header');
const tasksList = document.getElementById('tasks-type-list');
const location = document.getElementById('location');
const descriptionTask = document.getElementById('description');
const date = document.getElementById('date');
const time = document.getElementById('time');
const observer = new Observable();
let id = null;
let isArchive = false;

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

// получаем время исполнения события
const getTime = () => {
  let dueDate = date.value;
  let dueTime = time.value;
  if (!dueDate) {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    dueDate = now
      .toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('-');
  }
  if (!dueTime) {
    dueTime = '12:00';
  }
  dueTime = `${dueDate}T${dueTime}`;
  return dueTime;
};

// формируем объект данных из формы
const getDataTask = () => {
  const serviceChecked = [...serviceType].filter((item) => item.checked);
  const [service] = serviceChecked;
  const tasksChecked = [...tasksList.querySelectorAll('input')].filter(
    (item) => item.checked
  );
  const [task] = tasksChecked;
  const description = descriptionTask.value;
  const dueTime = getTime();
  const address = location.value;
  const features = map.getMapData();
  return {
    service: service.value,
    job: task.value,
    description,
    time: dueTime,
    id,
    isArchive,
    location: address,
    features,
  };
};

// формируем html для вставки в секцию типов работ
const createListOfTasks = (type, task = '') => {
  tasksList.innerHTML = tasksType[type].reduce((html, item, i) => {
    const value = item.charAt(0).toUpperCase() + item.slice(1);
    return (
      html +
      `
        <li>
          <input
            class="form-radio"
            type="radio"
            name="task-type"
            value="${item}"
            id="${type + i}"
            ${i === 0 ? 'checked' : ''}
          />
          <label class="task-type-label" for="${type + i}">${value}</label>
        </li>`
    );
  }, '');
};

// получаем заголовок для типов работ
const createHeaderOfTasks = (type) => {
  header.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} tasks`;
};

// прослушиваем переключение типов тасок
const listenTaskType = () => {
  tasksList.querySelectorAll('input').forEach((input, index) => {
    if (index === 0) {
      observer.notify(getDataTask());
    }
    input.addEventListener('change', () => {
      observer.notify(getDataTask());
    });
  });
};

// рисуем на странице секцию с типами работ в зависимости от выбранного сервиса
const renderTasksList = () => {
  serviceType.forEach((item, ind) => {
    if (ind === 0) {
      item.checked = true;
      createHeaderOfTasks(item.value);
      createListOfTasks(item.value);
      listenTaskType();
    }
  });
};

// открываем сайдабар
const openSidebar = () => {
  layout.classList.add('layout');
  form.classList.add('form-visually');
};

// закрываем сайдабар
const closeSidebar = () => {
  layout.classList.remove('layout');
  form.classList.remove('form-visually');
  id = null;
};

// дизейблим инпуты и текстарии в форме
const disablid = () => {
  const input = form.querySelectorAll('input');
  const textarea = form.querySelectorAll('textarea');
  input.forEach((item) => (item.disabled = true));
  textarea.forEach((item) => (item.disabled = true));
};

// убираем дизейбл у инпутов и текстарии в форме
const enable = () => {
  const input = form.querySelectorAll('input');
  const textarea = form.querySelectorAll('textarea');
  input.forEach((item) => (item.disabled = false));
  textarea.forEach((item) => (item.disabled = false));
};

// очищаем форму сайдбара от введеных значений
const clearSidiber = () => {
  enable();
  renderTasksList();
  descriptionTask.value = '';
  location.value = '';
  date.value = '';
  time.value = '';
  id = null;
  isArchive = false;
  observer.notify(getDataTask());
};

// инициализация компонетнов сайдбара и его событий
const init = () => {
  renderTasksList();
  serviceType.forEach((item) => {
    item.addEventListener('change', (event) => {
      const type = event.target.value;
      createHeaderOfTasks(type);
      createListOfTasks(type);
      listenTaskType();
    });
  });
  descriptionTask.addEventListener('input', () => {
    observer.notify(getDataTask());
  });
  date.addEventListener('change', () => {
    observer.notify(getDataTask());
  });
  time.addEventListener('change', () => {
    observer.notify(getDataTask());
  });
};

// заполнение полей формы данными объекта таски
const restoreTask = (task) => {
  serviceType.forEach((item) => {
    if (item.value === task.service) {
      item.checked = true;
      createHeaderOfTasks(item.value);
      createListOfTasks(item.value);
      listenTaskType();
    }
  });
  tasksList.querySelectorAll('input').forEach((item) => {
    if (item.value === task.job) {
      item.checked = true;
    }
  });
  descriptionTask.value = task.description;
  [date.value, time.value] = task.time.split('T');
  id = task.id;
  isArchive = task.isArchive;
  location.value = task.location;
  observer.notify(getDataTask());
};

// слушаем ввод адреса
location.addEventListener('input', () => {
  observer.notify(getDataTask());
});

export default {
  init,
  openSidebar,
  closeSidebar,
  disablid,
  enable,
  clearSidiber,
  restoreTask,
  getDataTask,
  observer,
};
