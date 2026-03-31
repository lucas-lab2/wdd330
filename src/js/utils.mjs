export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector('main');
  if (!main) return;

  const existing = main.querySelector('.alert');
  if (existing) {
    existing.remove();
  }

  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<p>${message}</p><span class="close-alert" aria-label="Close alert">X</span>`;

  alert.addEventListener('click', function (e) {
    if (
      e.target.classList.contains('close-alert') ||
      e.target.innerText === 'X'
    ) {
      main.removeChild(this);
    }
  });

  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}

export function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  return Object.fromEntries(formData.entries());
}
