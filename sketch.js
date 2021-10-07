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

var scoreA; 

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  let width = cardWidth;
  let height = cardHeight;
  
  startX = window.innerWidth - cardWidth*10

  cards = new Cards();
  getCardsFromSprite();
  start();

  scoreA = new anim();
  jokerA = new anim();

  jokerA.start();
  jokerA.tick= window.height+50;
}

function start(){

  // cards.allCards.forEach(function(item, index, object) {
  //   if (cards.isClicked(item.name)) {
  //     object.splice(index, 1);
  //   }
  // });

  for(i=0; i< numOfCards; i++){
    cards.insertPickableCard();
  }
  
  //print(cards.cardSelection)
  //print(cards.allCards.length)



  //var firstCard = cards.cardSelection[Math.floor(Math.random() * cards.cardSelection.length)];
  var firstCard = cards.cardSelection[0];
  firstCard.pickCard();
  //print(cards.getClicked())


  for(let i = 0; i < cards.cardSelection.length; i++){
    var card = cards.cardSelection[i];
    card.locX = startX+(cardWidth*i)+i*10;
    card.locY = startY; 
  }

}

function getCardsFromSprite(){  
  for(var i in spritedata){
    var card = new Card(spritedata[i].name, spritedata[i].x, spritedata[i].y, int(spritedata[i].name.substring(1,3)),spritedata[i].name.charAt(0),spritesheet.get(spritedata[i].x, spritedata[i].y, cardWidth, cardHeight));
    cards.addCard(card);
  }
}


function draw() {
  clear();
  drawBG();

  for(let i = 0; i < cards.getClicked().length; i++){
    var card = cards.getClicked()[i];

    yOffset = card.offset-1;
    card.displayMini(50, (cardHeight)*yOffset + 50+(yOffset*50));
  }

  if(totalRevealed == numOfCards){
    // cards.allCards = [];
    cards.cardSelection = [];
    //cards.clickedCards = [];
    totalRevealed = 0;
    start();
  }

  fill(255,255,255);
  textSize(50);       
  strokeWeight(3);
  textFont("Rockwell Nova")
  stroke('rgba(187,187,187,1)');
  textAlign(CENTER, CENTER);
  text('Score: '+score, width/2, startY-40);
  text('Lives: '+score, width/2, startY+cardHeight+50);


  if(scoreA.running()){
    if(scoreA.tick <= 60){
      scoreA.tick+=2;
    }else{
      scoreA.tick = -100;
      scoreA.stop();
    }
  }

  // if(jokerA.running()){
  //   if(jokerA.tick >= window.height - 50){
  //     print(jokerA);
  //     jokerA -= 2;
  //   }else{
  //     jokerA.tick = window.height - 50;
  //     //jokerA.stop();
  //   }
  // }

  if(!cards.score){
    fill(255,0,0);
    stroke('rgba(200,0,0,1)');
    textAlign(CENTER, CENTER);
    text("-1", window.innerWidth/2, scoreA.tick)
  }
  if(cards.score){
    fill(0,255,0);
    stroke('rgba(0,200,0,1)');
    textAlign(CENTER, CENTER);
    text("+1", window.innerWidth/2, scoreA.tick)
  }

  if(cards.joker){
    fill(255,255,0);
    stroke('rgba(200,200,0,1)');
    textAlign(CENTER, CENTER);
    text("JOKER", window.innerWidth/2, jokerA.tick)
  }

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
        card.pickCard();
        if(card.weight == 0){
          //print("jokerrr");
        }else{
          var l = cards.getClicked().length;
          var lastcard = cards.getClicked()[cards.getClicked().length-2]


          print(lastcard.weight+" : "+card.weight)
          if(lastcard.weight < card.weight && choice == 1){
            score += 1;
            cards.score = true;
            scoreA.start();
          }else if(lastcard.weight > card.weight && choice == 2){
            score += 1;
            cards.score = true;
            scoreA.start();
          }else{
            score -= 1;
            cards.score = false;
            scoreA.start();
          }
        }
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
  
  
  noStroke(); 
  if(scoreA.running()){
    if(cards.score){
      c = color(0, 204, 0);
    }else{
      c = color(204, 0, 0);
    }
  }else{
    c = color(105,150,180); 
  }
  
  fill(c); 
  ellipse(1720, 1080, 1805, 1805); 

  c = color(241,241,241);
  fill(c);
  ellipse(0, 0, 1800, 1800);

  if(scoreA.running()){
    if(cards.score){
      c = color(0, 204, 0);
    }else{
      c = color(204, 0, 0);
    }
  }else{
    c = color(255, 204, 0);
  }
  
  fill(c); 
  ellipse(-100, -250, 805, 805); 
}

class Cards {
  allCards = [];
  cardSelection = [];
  lastSelected; 
  allClicked = [];

  score = false;
  joker = true;
  scoreChange = false;

  hTotal = 0;
  cTotal = 0;
  sTotal = 0;
  dTotal = 0;

  constructor(){
    
  }

  addCard(card){
    this.allCards.push(card)
  }

  insertPickableCard(){
    let rand = Math.floor(Math.random() * this.allCards.length);
    let card = this.allCards[rand];
    if(card.click == true || card.selected == true){    
      cards.insertPickableCard();
    }else{
      card.selected = true;
      this.cardSelection.push(card);
    }
  }


  getClicked(){
    return this.allClicked;
  }

  getAvailible(){
    return this.allAvalible;
  }

  // isClicked(name){
  //   //print(this.clickedCards.length)
  //   // // print(name+" ")
  //   this.clickedCards.forEach((entry) => {
  //     if(!entry.name == name){
  //       return false;
  //     }else{
  //       return true;
  //     }
  //   });
  // }


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
  constructor(name, spriteX, spriteY, weight, suit, img){
    this.name = name;
    this.spriteX = spriteX;
    this.spriteY = spriteY; 
    this.weight = weight;
    this.img = img;

    this.selected = false;
    this.revealed = false;
    this.locked = false;
    this.click = false;

    this.locX = 0; 
    this.locY = 0;

    this.suit = suit;
    this.offset = 20;
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

  displayMini(x, y){
    scale(0.25);

    var yOffset;
    switch(this.suit) {
      case "C":
        yOffset = 0;
        break;
      case "S":
        yOffset = 1;
        break;
      case "H":
        yOffset = 2;
        break;
      case "D":
        yOffset = 3;
        break;
      default: 
        yOffset = 10;
    }
    image(this.img, x + (yOffset*cardWidth), y);
    scale(4);
  }
  
  revealCard(){
    this.revealed = true;
    totalRevealed += 1;
  }
  
  pickCard(){
    this.click = true;
    cards.allClicked.push(this);
    cards.lastSelected = cards.getClicked()[cards.getClicked().length-1];
    this.revealCard();

    switch(this.suit) {
      case "C":
        cards.cTotal += 1;
        this.offset = cards.cTotal;
        break;
      case "S":
        cards.sTotal += 1;
        this.offset = cards.sTotal;
        break;
      case "H":
        cards.hTotal += 1;
        this.offset = cards.hTotal;
        break;
      case "D":
        cards.dTotal += 1;
        this.offset = cards.dTotal;
        break;
      default: 
        yOffset = 10;
    }
  }

}

class anim{

  constructor(){
    this.animActive = false;
    this.tick = -20;
  }

  start(){
    this.animActive = true;
  }

  stop(){
    this.animActive = false;
  }

  running(){
    return this.animActive;
  }
}
