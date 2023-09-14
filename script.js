const searchInput = document.getElementById('searchInput') // находим dom узел с полем воода для поиска
const dropdownList = document.getElementById('dropdownList') // находим dom узел с выпадающими значениями при поиске
const formResponse = document.getElementById('formResponse') // находим dom узел для добавления туда выбранных репозиториев

const delayTime = 700 // задаём в переменную значение для задержки отправки запроса на сервер

// создаём функцию-обёртку для предотвращения слишком частых запросов на сервер, в параметры передаём функцию, которую хотим "задержать" и время задержки
const debounce = (callback, delay) => {
  let timer
  return function() {
    clearTimeout(timer)
    timer = setTimeout(callback, delay)
  }
}

// создаём функцию, которая отправляет запрос на сервер, отражает полученные с сервера значения в выпадающем списке, а так же на каждый элемент вешаем обработчик, реагируюзий на клик и выполняющий очистки поля ввода и выпадающего списка, а так же запускающий функцию addRepository
function search() {
  const search = searchInput.value
  if (search.length > 0) {
    fetch(`https://api.github.com/search/repositories?q=${search}&per_page=5`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error: ' + response.status)
        }
        return response.json()
      })
      .then(data => {
        dropdownList.innerHTML = ''
        const repositories = data.items
        repositories.forEach(repository => {
          const listItem = document.createElement('li')
          listItem.classList.add('form__item')
          listItem.textContent = repository.name
          dropdownList.appendChild(listItem)
          listItem.addEventListener('click', () => {
            addRepository(repository)
            searchInput.value = ''
            dropdownList.innerHTML = ''
          });
        })
      })
      .catch(error => console.error(error))
  } else {
    dropdownList.innerHTML = ''
  }
}

// создаём функцию, которая получает объект репозиторий, и на основе данных из него создаёт элемент в списке выбранных репозиториев
function addRepository(repository) {
  const repositoryItem = document.createElement("div")
  repositoryItem.classList.add('response-exemplar')
  repositoryItem.innerHTML = `
  <div class="response-exemplar__info">
    <p class="response-exemplar__text">Name: ${repository.name}</p>
    <p class="response-exemplar__text">Owner: ${repository.owner ? repository.owner.login : 'noname'}</p>
    <p class="response-exemplar__text">Stars: ${repository.stargazers_count || 0}</p>
  </div>
  <div class="response-exemplar__delete">
    <button class="response-exemplar__btn" type="button"><img class="response-exemplar__X" src="delete.svg" alt=""></button>
  </div>`
  formResponse.appendChild(repositoryItem)
}

// создаём переменную, которая является функцией search обёрнутой в функцию debounce с заданным временным показателем через переменную delayTime
const debounceSearch = debounce(search, delayTime)

// создаём обработчик событий, реагирующий на ввод данных в поисковую строку, и запускающий функцию debounceSearch
searchInput.addEventListener('input', debounceSearch)

// создаём обработчик событий, удаляющий элемент из списка выбранных репозиториев при нажатии на красный крест или область рядом с ним
formResponse.addEventListener('click', (event) => {
  const target = event.target
  if (target.classList.contains('response-exemplar__X')) {
    target.parentElement.parentElement.parentElement.remove()
  } else if (target.classList.contains('response-exemplar__btn')) {
    target.parentElement.parentElement.remove()
  }
})

