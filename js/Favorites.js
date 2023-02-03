import { GithubUser } from "./GithubUser.js"

// class that will contain the data logic
// how the data will be structured

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('HenriqueBnchn')
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
      if(userExists){
        throw new Error('User already registered')
      }

      const user = await GithubUser.search(username)

      if (user.login == undefined) {
        throw new Error('User not found')
      } else {
        this.entries = [user, ...this.entries]
        this.update()
        this.save()
      }
    } catch (error) {
      alert(error.message)
    }


  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}


// class that will create the visualization and html events

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)

    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOK = confirm('Tem certeza que deseja apagar?')

        if (isOK) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    if(this.entries.length == 0){
      const main_fundo = document.querySelector('main')
      main_fundo.style.display = 'flex'
    }else{
      const main_fundo = document.querySelector('main')
      main_fundo.style.display = 'none'
    }
    
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="" alt="foto de perfil">
        <a href="" target="_blank">
          <p></p>
          <span>/</span>
        </a>
      </td>
      <td class="repositories">
        
      </td>
      <td class="followers">
        
      </td>
      <td>
        <button class="remove">Remove</button>
      </td>
    `
    return tr
  }


}