let spritesheet; // references the spritesheet image
let spritedata; // references the spritesheet json file which relates coordinates and values to spritesheet

var canvas; // p5 canvas 
var startX = 500; // offset for cards to be drawn at
var startY = 350;
var cardHeight = 190; // fixed card dimension variables
var cardWidth = 140;
var numOfCards = 6; // how many cards on screen to be selected from

let choice = 0; // changed depending on what half of the card is clicked, top half for higher(0) bottom half for lower(1).
var onCard = false; // is the mouse ontop of a pickable card

var score = 0; // score of correct answers
var totalRevealed = 0; // how many have been selected in total

var debug1 = "";
var debug2 = "";

var cards;

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
  
  start();
}

function start(){
  getCardsFromSprite();

  for(i=0; i< numOfCards; i++){
    cards.insertPickableCard();
  }

  for(let i = 0; i < cards.cardSelection.length; i++){
    var card = cards.cardSelection[i];
    card.locX = startX+(cardWidth*i)+i*10;
    card.locY = startY; 
  }
  print(cards.cardSelection)

  //var firstCard = cards.cardSelection[Math.floor(Math.random() * cards.cardSelection.length)];
  var firstCard = cards.cardSelection[0];
  cards.pickCard(firstCard);

}

function getCardsFromSprite(){  
  cards = new Cards();
  for(var i in spritedata){
    var card = new Card(spritedata[i].name, spritedata[i].x, spritedata[i].y, int(spritedata[i].name.substring(1,3)), spritesheet.get(spritedata[i].x, spritedata[i].y, cardWidth, cardHeight));
    cards.addCard(card);
  }
}


function draw() {
  clear();
  drawBG();

  if(totalRevealed == numOfCards){
    cards.allCards = [];
    cards.cardSelection = [];
    cards.clickedCards = [];
    totalRevealed = 0;
    start();
  }

  fill(255,255,255);
  textSize(50);       
  strokeWeight(3);
  textFont("Rockwell Nova")
  stroke('rgba(187,187,187,1)');
  text('Score: '+score, startX, startY-30);
  text('Lives: '+score, startX, startY+cardHeight+60);

  for(let i = 0; i < cards.cardSelection.length; i++){
    var card = cards.cardSelection[i];
    card.display();
  }

  cards.scanHover();
}


function mouseClicked() {
  if(onCard){
    if(getCard(mouseX, mouseY) !=null){
      var card = getCard(mouseX, mouseY);
      if(!card.locked){
        
        let a = cards.clickedCards;
        a.push(card);

        var l = a.length;
        if(a[l-2].weight < a[l-1].weight && choice == 1){
          score += 1;
        }else if(a[l-2].weight > a[l-1].weight && choice == 2){
          score += 1;
        }
        cards.pickCard(card);
      }
    }
  }
}

function getCard(x,y){
  for(i in cards.cardSelection){
    x1 = cards.cardSelection[i].locX;
    y1 = cards.cardSelection[i].locY;
    if (x >= x1 &&         // right of the left edge AND
      x <= x1 + cardWidth &&    // left of the right edge AND
      y >=  y1 &&         // below the top AND
      y <=  y1 + cardHeight) {  
      return cards.cardSelection[i];
    }
  }
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


//debug1 = onCard;
//debug2 = totalRevealed;

// function debug(){
//   fill(0,0,20);
//   textSize(10);       
//   strokeWeight(3);
//   text('1: '+debug1,20,10);
//   text('2: '+debug2, 20,50);
// }

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

class Cards {
  allCards = [];
  cardSelection = [];
  clickedCards = [];
  lastSelected; 

  constructor(){
    
  }

  addCard(card){
    this.allCards.push(card)
  }

  insertPickableCard(){
    let rand = Math.floor(Math.random() * this.allCards.length);
    let card = this.allCards[rand];
    this.cardSelection.push(card);
    this.allCards.splice(rand, 1);
    //print(this.allCards.length+ " : "+this.cardSelection.length)
  }

  pickCard(card){
    this.clickedCards.push(card);
    this.lastSelected = this.clickedCards[this.clickedCards.length-1];
    card.revealCard();
    print("Card Clicked: "+this.lastSelected.name)
  }

  scanHover(){
    if(onCard && getCard(mouseX, mouseY) == null){

      for(let i = 0; i < this.allCards.length; i++){
        var card = this.allCards[i];
        //card.visible = true;
      }
      onCard = false;

    }else{

      for(let i = 0; i < this.cardSelection.length; i++){
        var card = this.cardSelection[i];
        if(isOverCard(card.locX,card.locY)){
          onCard = true;
          //card.visible = true;
        }
      }
    }
  }
}

class Card {
  constructor(name, spriteX, spriteY, weight, img){
    this.name = name;
    this.spriteX = spriteX;
    this.spriteY = spriteY; 
    this.weight = weight;
    this.img = img;

    this.selected = false;
    this.revealed = false;
    this.locked = false;
  }

  display(){
    image(this.img, this.locX, this.locY)

    if(!this.revealed){
      image(cardHigherLower, this.locX,this.locY)

      strokeWeight(1);
      if (mouseX >= this.locX &&         // right of the left edge AND
        mouseX <= this.locX + cardWidth &&    // left of the right edge AND
        mouseY >=  this.locY &&         // below the top AND
        mouseY <=  this.locY  + cardHeight/2) {    // above the bottom
        stroke('rgba(0,255,0,1)');
        choice = 1;
      }else{
        stroke('rgba(0,255,0,0.15)');
      }

      let c = color(241,241,241);
      // stroke('rgba(0,255,0,0.25)');
      noFill();
      rect(this.locX, this.locY, cardWidth, cardHeight/2,5)

      if (mouseX >= this.locX &&         // right of the left edge AND
        mouseX <= this.locX + cardWidth &&    // left of the right edge AND
        mouseY >=  this.locY +(cardHeight/2) &&         // below the top AND
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
      this.revealed = true;
    }
    
  }
  
  revealCard(){
    this.revealed = true;
    totalRevealed += 1;
  }
  
}
