let spritesheet;
let spritedata;
let cards = [];
let cardsSelected = [];
let clickedCard = [];
var canvas;
var lastSelected = [];
let choice = 0;
var startX = 500;
var startY = 300;
var rects = [];
var onCard = false;
var score = 0;
var cardHeight = 190;
var cardWidth = 140;
var firstSelected;
var numOfCards = 6;
var totalRevealed = 0;

function preload(){
  spritedata = loadJSON('json/sprites.json');
  spritesheet = loadImage('assets/Spritesheets/playingCards.png');
  cardHigherLower = loadImage('assets/PNG/Cards/cardHigherLower.png');
  cardback = loadImage('assets/PNG/Cards/cardBack_blue4.png');
  //cardHigherLower = loadImage('assets/PNG/Cards/cardHigherLower.png');
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  for(var i in spritedata){
      let card = new Card(spritedata[i].name,spritedata[i].x,spritedata[i].y);
      cards.push(card);
  }
  let width = cardWidth;
  let height = cardHeight;
  
  lastSelected.push(cards[0]);
  firstSelected = Math.floor(Math.random() * numOfCards);


  for(i=0; i< numOfCards; i++){
    cardsSelected.push(displayRandom());
    //displayRandom().setAtLocation(startX+(width*i)+i*10,startY);
  }

  cardsSelected[firstSelected].revealCard();
  clickedCard.push(cardsSelected[firstSelected]);
}

function draw() {
  // if(totalRevealed==numOfCards){
  //   cardsSelected = [];
  //   clickedCard = [];
  //   //console.log(cardsSelected)
  //   for(i=0; i< numOfCards; i++){
  //     cardsSelected.push(displayRandom());
  //     //displayRandom().setAtLocation(startX+(width*i)+i*10,startY);
  //   }
  //   totalRevealed = 0;
  //   console.log(cardsSelected)
  //   console.log(cardsSelected)
  // }

  clear();
  drawBG();

  fill(255,255,255);
  textSize(50);       
  strokeWeight(3);
  textFont("Rockwell Nova")
  stroke('rgba(187,187,187,1)');
  text('Score: '+score, startX, startY-30);
  text('Lives: '+score, startX, startY+cardHeight+60);

  for(i in cardsSelected){
    let width = cardWidth;
    let height = cardHeight;
    cardsSelected[i].setAtLocation(startX+(width*i)+i*10,startY)
    //displayRandom().setAtLocation(startX+(width*i)+i*10,startY);
  }

  if(!onCard){
    for(i=0; i< numOfCards; i++){
      x = cards[i].x + startX +i*10;
      y =  startY;
      var over = false;
      if (mouseX >= this.x &&         // right of the left edge AND
        mouseX <= this.x + cardWidth &&    // left of the right edge AND
        mouseY >=  this.y &&         // below the top AND
        mouseY <=  this.y + cardHeight) {    // above the bottom
        over = true;
      }
    
      if(over){
        onCard = true;
        getCard(mouseX, mouseY).setVisible(false);
      }
    }
  }else if(getCard(mouseX, mouseY) == null){
    for(i in cardsSelected){
      cardsSelected[i].setVisible(true);
    }
    onCard = false;
  }
  
}

function drawBG(){
  let c = color(228,228,228);
  background(c);
  c = color(105,150,180); // Define color 'c'
  noStroke(); 
  fill(c); // Use color variable 'c' as fill color
  ellipse(1720, 1080, 1805, 1805); // Draw left circle

  c = color(241,241,241);
  fill(c);
  ellipse(0, 0, 1800, 1800);

  c = color(255, 204, 0); // Define color 'c'
  fill(c); // Use color variable 'c' as fill color
  ellipse(-100, -250, 805, 805); // Draw left circle
}

function mouseClicked() {
  if(onCard && getCard(mouseX, mouseY) !=null){
    clickedCard.push(getCard(mouseX, mouseY));
    var l = clickedCard.length;
    if(clickedCard[l-2].weight < clickedCard[l-1].weight && choice == 1){
      score += 1;
    }else if(clickedCard[l-2].weight > clickedCard[l-1].weight && choice == 2){
      score += 1;
    }
    if(getCard(mouseX, mouseY) !=null){
      getCard(mouseX, mouseY).revealCard();
    }
  }
}

// window.onresize = function() {
//   var w = window.innerWidth;
//   var h = window.innerHeight;  
//   canvas.size(w,h);
//   width = w;
//   height = h;
  
// };

function displayRandom(){
  let rand = cards[Math.floor(Math.random() * cards.length)];
  return rand;
}

function getCard(x,y){
  for(i in cardsSelected){
    x1 = cardsSelected[i].locX;
    y1 = cardsSelected[i].locY;
    name = cardsSelected[i].name;
    if (x >= x1 &&         // right of the left edge AND
      x <= x1 + cardWidth &&    // left of the right edge AND
      y >=  y1 &&         // below the top AND
      y <=  y1 + cardHeight) {  
      //console.log(cardsSelected[i])  
      return cardsSelected[i];
    }
  }
}

function isCard(x,y){
  for(i in cardsSelected){
    x1 = cardsSelected[i].locX;
    y1 = cardsSelected[i].locY;
    name = cardsSelected[i].name;
    if (x >= x1 &&         // right of the left edge AND
      x <= x1 + cardWidth &&    // left of the right edge AND
      y >=  y1 &&         // below the top AND
      y <=  y1 + cardHeight) {  
      //console.log(cardsSelected[i])  
      return true;
    }else{
      return false;
    }
  }
}

class Card {
  constructor(name, x, y){
    this.name = name;
    this.x = x;
    this.y = y;
    this.visible = true;
    this.revealed = false;
    this.set = int(this.name.substring(0,1));
    this.weight = int(this.name.substring(1,3));

    this.img = spritesheet.get(this.x, this.y, cardWidth, cardHeight);
  }

  setAtLocation(x,y){
    this.locX = x;
    this.locY = y;
    this.display();
  }

  setVisible(bool){
    this.visible = bool;
  }
  
  isVisible(){
    return this.visible;
  }

  setLocked(bool){
    this.locked = bool;
  }
  
  isLocked(){
    return this.locked;
  }

  display(){
    if(this.isVisible()&& !this.isLocked()&&!this.revealed){
      image(cardback, this.locX,this.locY)
    }else{
      image(this.img,this.locX,this.locY)
      if(!this.revealed){
        image(cardHigherLower, this.locX,this.locY)

        strokeWeight(1);
        if (mouseX >= this.locX &&         // right of the left edge AND
          mouseX <= this.locX + cardWidth &&    // left of the right edge AND
          mouseY >=  this.locY &&         // below the top AND
          mouseY <=  this.locY + cardHeight/2) {    // above the bottom
          stroke('rgba(0,255,0,1)');
          choice = 1;
        }else{
          stroke('rgba(0,255,0,0.15)');
        }

        let c = color(241,241,241);
        // stroke('rgba(0,255,0,0.25)');
        noFill();
        rect(this.locX,this.locY,cardWidth,cardHeight/2,5)

        if (mouseX >= this.locX &&         // right of the left edge AND
          mouseX <= this.locX + cardWidth &&    // left of the right edge AND
          mouseY >=  this.locY+(cardHeight/2) &&         // below the top AND
          mouseY <=  this.locY + cardHeight) {    // above the bottom
          stroke('rgba(255,0,0,1)');
          choice = 2;
        }else{
          stroke('rgba(255,0,0,0.15)');
        }
        c = color(241,241,241);
        // stroke('rgba(255,0,0,0.25)');
        rect(this.locX,this.locY+(cardHeight/2),cardWidth,cardHeight/2,5)

      }else{
        this.setLocked(true);
      }
    }
  
  }

  revealCard(){
    this.revealed = true;
    totalRevealed += 1;
  }

  getImage(){
    return this.img;
  }
}