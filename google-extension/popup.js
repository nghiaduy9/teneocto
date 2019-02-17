const listAccount = document.getElementById("listAccount")

function list() {
  chrome.storage.sync.get(null, (items) => {
    let keys = Object.keys(items)
    while (listAccount.hasChildNodes()) {
      listAccount.removeChild(listAccount.firstChild);
    }
    for (key of keys) {
      let div = document.createElement("div")
      let btnLogin = document.createElement("button")
      btnLogin.classList.add("login")
      let user = document.createTextNode(key)
      btnLogin.appendChild(user)
      btnLogin.value = key
      btnLogin.onclick = (event) => {
        chrome.storage.sync.get(event.target.value, (cookies) => {
          let currentCookies = Object.values(cookies)
          console.log(currentCookies)
          for (cookie of currentCookies[0]) {
            let detail = {
              'url': 'https://www.facebook.com',
              'name': cookie.name,
              'value': cookie.value,
              'domain': cookie.domain
            }
            chrome.cookies.set(detail)
          }
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function (arrayOfTabs) {
            var code = 'window.location.reload()'
            chrome.tabs.executeScript(arrayOfTabs[0].id, {
              code: code
            })
          })
        })
      }
      let btnDelete = document.createElement("button")
      btnDelete.classList.add("delete")
      let del = document.createTextNode("Delete")
      btnDelete.appendChild(del)
      btnDelete.value = key
      btnDelete.onclick = (event) => {
        chrome.storage.sync.remove(event.target.value, () => {
          list()
        })
      }
      div.appendChild(btnLogin)
      div.appendChild(btnDelete)
      listAccount.appendChild(div)
    }
  })
}
list()

const getCookies = document.getElementById("getCookies")
getCookies.onclick = () => {
  chrome.cookies.getAll({
    domain: ".facebook.com"
  }, (cookies) => {
    let id = ''
    for (const {
        name,
        value
      } of cookies) {
      if (name === 'c_user') id = value
    }
    chrome.storage.sync.set({
      [id]: cookies
    }, () => {
      list()
    })
  })
}