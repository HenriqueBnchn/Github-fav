// class that will contain the data logic
// how the data will be structured

export class Favorites{  
  constructor(root){
    this.root = document.querySelector(root)
  }
}




// class that will create the visualization and html events

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
  }
}