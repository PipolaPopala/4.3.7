'use ctrict'

const searchInput = document.getElementById('searchInput')
const dropdownList = document.getElementById('dropdownList')
const formResponse = document.getElementById('formResponse')

const debounce = (callback, delay) => {
  let timer
  return function() {
    clearTimeout(timer)
    timer = setTimeout(callback, delay)
  }
}

const debounceSearch = debounce(() => {
  const search = searchInput.value
  if (search.length > 0) {
    fetch(`https://api.github.com/search/repositories?q=${search}&per_page=5`)
      .then(response => response.json())
      .then(data => {
        dropdownList.innerHTML = ''
        const repositories = data.items
        repositories.forEach(repository => {
          const listItem = document.createElement('li')
          listItem.classList.add('form__item')
          listItem.textContent = repository.name
          listItem.addEventListener('click', () => {
            addRepository(repository);
            searchInput.value = ''
            dropdownList.innerHTML = ''
          });
          dropdownList.appendChild(listItem)
        })
      })
  } else {
    dropdownList.innerHTML = ''
  }
}, 400)

searchInput.addEventListener('input', debounceSearch)

function addRepository(repository) {
  const repositoryItem = document.createElement("div")
  repositoryItem.classList.add('response-exemplar')
  repositoryItem.innerHTML = `
  <div class="response-exemplar__info">
    <p class="response-exemplar__text">Name: ${repository.name}</p>
    <p class="response-exemplar__text">Owner: ${repository.owner.login}</p>
    <p class="response-exemplar__text">Stars: ${repository.stargazers_count}</p>
  </div>
  <div class="response-exemplar__delete">
    <button class="response-exemplar__btn" type="button"><img class="response-exemplar__X" src="delete.svg" alt=""></button>
  </div>`
  formResponse.appendChild(repositoryItem)
}

formResponse.addEventListener('click', (event) => {
  const target = event.target
  if (target.classList.contains('response-exemplar__X')) {
    target.parentElement.parentElement.parentElement.remove()
  } else if (target.classList.contains('response-exemplar__btn')) {
    target.parentElement.parentElement.remove()
  }
})

