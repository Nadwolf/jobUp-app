import './tasks.css';
import '../buttons/buttons.css';
import date from 'date-and-time';
import button from '../buttons/buttons';

const tasksSection = document.querySelector('.tasks');

const getDueDate = (dueTime) => {
  const dueDate = new Date(dueTime);
  const now = new Date();

  const dateAfter = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );
  const dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDif = (dateAfter - dateNow) / 1000 / 60 / 60 / 24;

  let massage = '';
  switch (dayDif) {
    case 0:
      massage = '[Today]';
      break;
    case 1:
      massage = '[Tomorrow]';
      break;
    default:
      massage = 'dddd';
      break;
  }
  return date.format(dueDate, `${massage}, MMM DD, HH:mm`);
};

const renderTask = (task, div) => {
  const description = task.description ? `, ${task.description}.` : '.';
  const li = document.createElement('li');
  li.classList.add('card', 'tasks-card');
  li.setAttribute('data-id', `${task.id}`);
  li.innerHTML = `
        <p class="card-time">
          <time class="time" datetime="${task.time}"
            >${getDueDate(task.time)}</time
          >
        </p>
        <p class="card-description">I need a ${
          task.service
        } to ${task.job?.toLowerCase()}${description}</p>
      `;
  li.insertAdjacentElement('beforeend', div);
  return li;
};

// const render = (data, buttons) => {
//   tasksSection.innerHTML = '';
//   data.forEach((task) => {
//     const li = renderTask(task, buttons);
//     tasksSection.insertAdjacentElement('beforeend', li);
//   });
// };

// const renderDashboard = (data) => {
//   const activeTasks = data.filter((task) => !task.isArchive);
//   const htmlButton = `
//       <button class="button card-button button-accent" type="button" data-type="edit">Edit</button>
//       <button class="button card-button" type="button" data-type="delete">Delete</button>`;
//   render(activeTasks, htmlButton);
// };

const renderDashboard = (data) => {
  tasksSection.innerHTML = '';
  data.forEach((task) => {
    if (task.isArchive) {
      return null;
    }
    const div = document.createElement('div');
    div.classList.add('card-buttons');
    const editButton = button.constructButton('edit');
    const deleteButton = button.constructButton('delete');
    div.insertAdjacentElement('beforeend', editButton);
    div.insertAdjacentElement('beforeend', deleteButton);
    const li = renderTask(task, div);
    tasksSection.insertAdjacentElement('beforeend', li);
  });
};

// const renderArchive = (data) => {
//   const archiveTasks = data.filter((task) => task.isArchive);
//   const htmlButton = `
//       <button class="button card-button button-accent" type="button" data-type="view">View</button>`;
//   render(archiveTasks, htmlButton);
// };

const renderArchive = (data) => {
  tasksSection.innerHTML = '';
  data.forEach((task) => {
    if (!task.isArchive) {
      return null;
    }
    const div = document.createElement('div');
    div.classList.add('card-buttons');
    const viewButton = button.constructButton('view');
    div.insertAdjacentElement('beforeend', viewButton);
    const li = renderTask(task, div);
    tasksSection.insertAdjacentElement('beforeend', li);
  });
};

export default { renderDashboard, renderArchive };
