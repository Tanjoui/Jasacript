class Model {


  drawTiles(){
    this.draw(this.grille, this.snake.direction, this.score, this.highscore);
  }

  constructor(size) {
    this.sizex = size;
    this.sizey = size;
    this.score = 0;
    this.highscore = 0;
    this.time = 0;
    this.grille = this.initgrille(size,size);
    this.snake = new Snake(size,size);
    this.setSnake();
    //création de la carte et d'un seprent
    this.xFruit = 0;
    this.yFruit = 0;
    this.mort=0;
    this.addFruit(); //on place un fruit

  }
  initgrille(x,y){
    var grille = new Array(x); //map full zero
    for ( var i = 0 ; i < x; i ++){
      grille[i]=new Array(y).fill(0);
    }
    return grille;
  }

  setscore(){
    if(this.score>this.highscore){
      this.highscore = this.score;
    }
  }
  resetScore(){
    this.score=0;
  }
  binddraw(callback){
    this.draw=callback;
  }

  // 0 : vide
  // 1 : head_snake
  // 2 : body_snake
  // 3 : fruit
  setTile(x,y,val){
    if (x < this.sizex && x >= 0 && y < this.sizey && y >= 0){
      if ( val <= 3){
        this.grille[x][y]=val;
        //console.log("Ecriture de "+ val + " aux coord "+x+":"+y);
      }
    }
  }

  getTile(x,y){
    //console.log("Tentative d'accee a la grille coord" +x + ":"+y);
    if (x < this.sizex && x >= 0 && y < this.sizey && y >= 0){
      //console.log("Reponse : "+this.grille[x][y]);
      return this.grille[x][y];
    }
    else {
      return -1;
    }
  }

  getgrille(){
    return this.grille;
  }

  deleteFruit(){
    this.setTile(this.xFruit, this.yFruit, 0)
  }

  addFruit(){
    do {
      var x = Math.floor(Math.random() * (this.sizex));
      var y = Math.floor(Math.random()* this.sizey);
    } while (this.getTile(x,y) != 0);
    this.xFruit = x;
    this.yFruit = y;
    this.setTile(x,y,3);
  }

  removeSnake(){
    let liste = this.snake.getListe();
    for (var i = 0; i < liste.length; i ++) {
      //console.log("Contenu de e : "+ liste[i]);
      if ( this.getTile(liste[i][0],liste[i][1])==1 || this.getTile(liste[i][0],liste[i][1])==2){
        this.setTile(liste[i][0],liste[i][1],0);
      }
    }
  }

  setSnake(){
    let liste = this.snake.liste;
    this.setTile(liste[0][0],liste[0][1],1);

    for (var i = 1; i < liste.length; i ++) {
      this.setTile(liste[i][0],liste[i][1],2);
    }
  }




  step(){

    //console.log("Log de game : " + this+", step num :" + this.time);
    this.time = this.time+1;
    this.move(); //nouveau mouvement
    this.drawTiles();
    this.score ++;
    this.setscore();
    return this.grille;
  }

  turn(e){
    if (e == this.snake.getBodyDir()){
        this.sound(2);
        return;
    }
    switch(e){
      case 1:
      if(this.snake.direction == 3){
        // console.log('et non');
        this.sound(2);
      }else{
        this.snake.direction = 1;
        this.sound(3)
      }
      break;
      case 2:
      if(this.snake.direction == 4){
        // console.log('et non');
        this.sound(2);
      }else{
        this.snake.direction = 2;
        this.sound(3)
      }
      break;
      case 3:
      if(this.snake.direction == 1){
        // console.log('et non');
        this.sound(2);
      }else{
        this.snake.direction = 3;
        this.sound(3)
      }
      break;
      case 4:
      if(this.snake.direction == 2){
        // console.log('et non');
        this.sound(2);
      }else{
        this.snake.direction = 4;
        this.sound(3)
      }
      break;
    }


  }
  move(){//deplace le serpent
    var head;
    switch(this.snake.direction){ //calcul des coords de la prochaine tete selon la direction
      case 1 :
      head = [this.snake.liste[0][0]-1, this.snake.liste[0][1]]
      break;
      case 2 :
      head = [this.snake.liste[0][0], this.snake.liste[0][1]-1]
      break;
      case 3 :
      head = [this.snake.liste[0][0]+1, this.snake.liste[0][1]]
      break;
      case 4 :
      head = [this.snake.liste[0][0], this.snake.liste[0][1]+1]
      break;
    }
    // console.log("case a check : "+head[0]+" "+head[1]);


    let lose1 = this.checkWall(head[0], head[1]);
    let lose2 = this.checkBody(head[0], head[1]);
    if(lose1 == 1 || lose2 == 1){
      this.mort = 1;
      return 0;
    }

    let found = this.checkFruit(head[0], head[1])// on passe les tests de collision
    this.removeSnake();
    this.snake.liste.unshift(head); //on ajoute une nouvelle tête au debut
    if(found == 0){ //si on a pas trouvé de fruit
      this.snake.getListe().pop(); //on supprime le dernier element
    }
    // console.log(this.snake.liste);
    this.setSnake();
    // console.log("dir :"+this.snake.direction);
  }



  checkWall(x, y){
    if(x >= this.sizex || y>= this.sizey || x < 0 || y < 0){
      // console.log("PERDU")
      this.sound(2)
      console.log("Mort de mur coord : " +x + ":" + y);
      return 1;
    }
  }

  checkBody(x, y){
    //vérifie si la nouvelle tête rencontre le body

    if(this.getTile(x,y) == 2){
      this.sound(2)
      console.log("Mort d'auto bouffage coord : "+x + ":" + y);
      return 1;
    }

  }
  checkFruit(x, y){
    //vérifie si on mange un fruit
    if(this.grille[x][y] ==  3){
      // console.log("fruit trouvé");
      this.score = this.score + 100
      this.sound(1);
      this.addFruit();
      return 1;
    }else{
      return 0;
    }
  }


  sound(id){// joue un son donné
    var bruit = new Audio();
    switch(id){
      case 1:
      bruit.src = "son/yea.wav"
      break;
      case 2:
      bruit.src = "son/blbl.wav"
      break;
      case 3:
      bruit.src = "son/gr.wav"
      break;
    }
    bruit.play();
  }

reset(){
  this.resetScore();
  this.deleteFruit();
  this.removeSnake();
  this.snake.resetBody(this.sizex,this.sizey);
  this.mort=0;
  this.addFruit();

}

}
