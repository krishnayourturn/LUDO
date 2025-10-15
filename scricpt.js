const board = document.getElementById('board');
const info = document.getElementById('info');
const colors = ['red','green','yellow','blue'];
let turn = 0;
let diceValue = 0;

// Token structure
let tokens = { red:[], green:[], yellow:[], blue:[] };

// Simple path coordinates (linear simplified)
const path = [
  [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[5,6],[4,6],[3,6],[2,6],
  [0,6],[0,7],[0,8],[2,8],[3,8],[4,8],[5,8],[6,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
  [7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[8,8],[9,8],[10,8],[11,8],[12,8],[14,8],
  [14,7],[12,6],[11,6],[10,6],[9,6]
];

// Create board cells
for(let r=0;r<15;r++){
  for(let c=0;c<15;c++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }
}

// Initialize 1 token per player for simplicity
colors.forEach(color=>{
  for(let i=0;i<1;i++){
    const token = document.createElement('div');
    token.classList.add('token',color);
    token.textContent=i+1;
    board.appendChild(token);
    tokens[color].push({element:token,pos:-1});
    setTokenPos(tokens[color][i]);
  }
});

function setTokenPos(t){
  if(t.pos<0) t.element.style.transform=`translate(${colors.indexOf(t.element.classList[1])*50}px,0px)`;
  else {
    const [r,c] = path[t.pos];
    t.element.style.transform=`translate(${c*40}px,${r*40}px)`;
  }
}

// Dice roll
function rollDice(){
  diceValue = Math.floor(Math.random()*6)+1;
  info.textContent=`${colors[turn]}'s turn rolled ${diceValue}`;
  moveToken(colors[turn]);
}

// Move token
function moveToken(color){
  const t = tokens[color][0];
  if(t.pos<0 && diceValue===6) t.pos=0;
  else if(t.pos>=0) t.pos+=diceValue;
  if(t.pos>=path.length) t.pos=path.length-1;
  setTokenPos(t);

  // Check win
  if(t.pos===path.length-1){
    alert(`${color.toUpperCase()} wins! 🎉`);
    return;
  }

  // Next turn (AI moves automatically)
  turn=(turn+1)%4;
  info.textContent=`${colors[turn]}'s turn`;

  // Auto move AI after 0.5s if not human
  if(turn!==0){
    setTimeout(()=>rollDice(),500);
  }
}
