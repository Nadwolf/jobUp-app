import Observable from './observer';

class App {
  constructor() {
    this.#load();
    this.observer = new Observable();
  }

  getTask(id) {
    const task = this.tasks.filter((item) => item.id === id);
    return task[0] ?? null;
  }

  addTask({ service, job, description, location, time, features }) {
    const newTask = this.#createTask(
      service,
      job,
      description,
      location,
      time,
      features
    );
    this.tasks.push(newTask);
    this.#addStorage();
    return this;
  }

  deleteTask(id) {
    const deletedTask = this.tasks.find((task) => task.id === id);
    if (!deletedTask) {
      return null;
    }
    deletedTask.isArchive = true;
    this.#addStorage();
    return this;
  }

  editeTask({ service, job, description, location, time, id, features }) {
    const editabledTaskPosition = this.tasks.findIndex(
      (task) => task.id === id
    );
    if (
      editabledTaskPosition === -1 ||
      this.tasks[editabledTaskPosition].isArchive
    ) {
      return null;
    }
    const newTask = this.#createTask(
      service,
      job,
      description,
      location,
      time,
      features,
      id
    );
    this.tasks[editabledTaskPosition] = newTask;
    this.#addStorage();
    return this;
  }

  #load() {
    this.tasks = this.#getStorage();
  }

  #addStorage() {
    localStorage.removeItem('storage');
    const str = JSON.stringify(this.tasks);
    localStorage.setItem('storage', str);
    this.observer.notify(this.tasks);
  }

  #getStorage() {
    const str = localStorage.getItem('storage');
    return JSON.parse(str) ?? [];
  }

  #createTask(service, job, description, location, time, features, id) {
    const newTask = {
      id: id ?? this.#generateId(),
      service,
      job,
      description,
      location,
      time,
      isArchive: false,
      features,
    };
    return newTask;
  }

  #generateId() {
    return this.tasks.length;
  }
}

export default new App();
