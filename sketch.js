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

var debug1 = "";
var debug2 = "";

function preload(){
  spritedata = loadJSON('json/sprites.json');
  spritesheet = loadImage('assets/Spritesheets/playingCards.png');
  cardHigherLower = loadImage('assets/PNG/Cards/cardHigherLower.png');
  cardback = loadImage('assets/PNG/Cards/cardBack_blue4.png');
  //cardHigherLower = loadImage('assets/PNG/Cards/cardHigherLower.png');
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  let width = cardWidth;
  let height = cardHeight;
  getAllCards();
  start();
}


function getAllCards(){
  cards = [];
  for(var i in spritedata){
    //let card = new Card(spritedata[i].name,spritedata[i].x,spritedata[i].y);
    var card = {
      name: spritedata[i].name,
      spritex: spritedata[i].x,
      spritey: spritedata[i].y,
      weight : int(spritedata[i].name.substring(1,3)),
      visible : true,
      revealed : false,
      locked : false,
      set : int(spritedata[i].name.substring(0,1)),
      img : spritesheet.get(spritedata[i].x, spritedata[i].y, cardWidth, cardHeight),
    }
    cards.push(card);
}

}
function start(){
  lastSelected.push(cards[0]);
  firstSelected = Math.floor(Math.random() * numOfCards);

  console.log(cards)

  for(i=0; i< numOfCards; i++){
    cardsSelected.push(displayRandom());
  }

  revealCard(cardsSelected[firstSelected]);
  clickedCard.push(cardsSelected[firstSelected]);
}

function draw() {
  clear();
  drawBG();

  // if(totalRevealed == numOfCards){
  //   cardsSelected = [];
  //   totalRevealed = 0;
  //   getAllCards();
  //   start();
  // }
  //debug1 = onCard;
  //debug2 = totalRevealed;

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
    setAtLocation(cardsSelected[i],startX+(width*i)+i*10,startY)
  }

  if(onCard && getCard(mouseX, mouseY) == null){
    for(i in cardsSelected){
      setVisible(cardsSelected[i],true);
    }
    onCard = false;
  }else{
      for(i=0; i< cardsSelected.length; i++){
      x = cardsSelected[i].locX + startX +i*10;
      y = startY;
      if(isOverCard(cardsSelected[i].locX,cardsSelected[i].locY)){
        onCard = true;
        setVisible(getCard(mouseX, mouseY));
      }
    }
  }
  //debug();
}

function debug(){
  fill(0,0,20);
  textSize(10);       
  strokeWeight(3);
  text('1: '+debug1,20,10);
  text('2: '+debug2, 20,50);
}

function drawBG(){
  let c = color(228,228,228);
  background(c);
  c = color(105,150,180); 
  noStroke(); 
  fill(c); 
  ellipse(1720, 1080, 1805, 1805); 

  c = color(241,241,241);
  fill(c);
  ellipse(0, 0, 1800, 1800);

  c = color(255, 204, 0);
  fill(c); 
  ellipse(-100, -250, 805, 805); 
}

function mouseClicked() {
  if(onCard && getCard(mouseX, mouseY) !=null && !isLocked(getCard(mouseX, mouseY))){
    clickedCard.push(getCard(mouseX, mouseY));
    var l = clickedCard.length;
    if(clickedCard[l-2].weight < clickedCard[l-1].weight && choice == 1){
      score += 1;
    }else if(clickedCard[l-2].weight > clickedCard[l-1].weight && choice == 2){
      score += 1;
    }
    if(getCard(mouseX, mouseY) !=null){
      revealCard(getCard(mouseX, mouseY));
    }
  }
}

function displayRandom(){
  let rand = cards[Math.floor(Math.random() * cards.length)];
  return rand;
}

function isOverCard(x,y){
  if (mouseX >= x &&         
    mouseX <= x + cardWidth &&    
    mouseY >=  y &&        
    mouseY <=  y + cardHeight) {    
    return true;
  }
  return false;
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

function setAtLocation(card,x,y){
  card.locX = x;
  card.locY = y;
  display(card);
}

function setVisible(card,bool){
  card.visible = bool;
}

function setRevealed(card,bool){
  card.revealed = bool;
}

function isVisible(card){
  return card.visible;
}

function setLocked(card,bool){
  card.locked = bool;
}

function isLocked(card){
  return card.locked;
}

function display(card){
  if(isVisible(card)&& !isLocked(card)&&!card.revealed){
    image(cardback, card.locX,card.locY)
  }else{
    image(card.img,card.locX,card.locY)
    if(!card.revealed){
      image(cardHigherLower, card.locX,card.locY)

      strokeWeight(1);
      if (mouseX >= card.locX &&         // right of the left edge AND
        mouseX <= card.locX + cardWidth &&    // left of the right edge AND
        mouseY >=  card.locY &&         // below the top AND
        mouseY <=  card.locY + cardHeight/2) {    // above the bottom
        stroke('rgba(0,255,0,1)');
        choice = 1;
      }else{
        stroke('rgba(0,255,0,0.15)');
      }

      let c = color(241,241,241);
      // stroke('rgba(0,255,0,0.25)');
      noFill();
      rect(card.locX,card.locY,cardWidth,cardHeight/2,5)

      if (mouseX >= card.locX &&         // right of the left edge AND
        mouseX <= card.locX + cardWidth &&    // left of the right edge AND
        mouseY >=  card.locY+(cardHeight/2) &&         // below the top AND
        mouseY <=  card.locY + cardHeight) {    // above the bottom
        stroke('rgba(255,0,0,1)');
        choice = 2;
      }else{
        stroke('rgba(255,0,0,0.15)');
      }
      c = color(241,241,241);
      // stroke('rgba(255,0,0,0.25)');
      rect(card.locX,card.locY+(cardHeight/2),cardWidth,cardHeight/2,5)

    }else{
      setLocked(card,true);
    }
  }

}

function revealCard(card){
  card.revealed = true;
  totalRevealed += 1;
}

function getImage(card){
  return card.img;
}