const boardElement = document.getElementById('ludoBoard');
const diceElement = document.getElementById('dice');
const info = document.getElementById('info');

const colors = ['red','green','yellow','blue'];
let turn = 0; // 0-red,1-green,2-yellow,3-blue
let diceValue = 0;

// Tokens for each player
let tokens = { red:[], green:[], yellow:[], blue:[] };

// Board paths for each color (simplified linear paths)
const paths = {
  red: [[4,0],[4,1],[4,2],[4,3],[4,4],[5,4],[6,4],[6,5],[6,6],[5,6],[4,6],[4,7],[4,8],[5,8],[6,8],[6,9],[6,10],[5,10],[4,10],[4,11],[4,12],[4,13],[4,14]],
  green: [[0,10],[1,10],[2,10],[3,10],[4,10],[4,9],[4,8],[5,8],[6,8],[6,7],[6,6],[7,6],[8,6],[8,7],[8,8],[9,8],[10,8],[10,9],[10,10],[11,10],[12,10],[13,10],[14,10]],
  yellow:[[10,0],[10,1],[10,2],[10,3],[10,4],[9,4],[8,4],[8,5],[8,6],[9,6],[10,6],[10,7],[10,8],[9,8],[8,8],[8,9],[8,10],[9,10],[10,10],[10,11],[10,12],[10,13],[10,14]],
  blue: [[10,10],[10,11],[10,12],[10,13],[10,14],[9,14],[8,14],[8,13],[8,12],[7,12],[6,12],[6,11],[6,10],[5,10],[4,10],[4,11],[4,12],[5,12],[6,12],[6,13],[6,14],[7,14],[8,14]]
};

// Initialize board and tokens
function initBoard(){
  boardElement.innerHTML='';
  for(let r=0;r<15;r++){
    for(let c=0;c<15;c++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row=r;
      cell.dataset.col=c;
      boardElement.appendChild(cell);
    }
  }
  initTokens();
}

// Initialize tokens
function initTokens(){
  const homePositions = {
    red: [[1,1],[1,3],[3,1],[3,3]],
    green:[[1,11],[1,13],[3,11],[3,13]],
    yellow:[[11,1],[11,3],[13,1],[13,3]],
    blue:[[11,11],[11,13],[13,11],[13,13]]
  };
  colors.forEach(color=>{
    homePositions[color].forEach((pos,i)=>{
      const token = document.createElement('div');
      token.classList.add('token',color);
      token.textContent=i+1;
      boardElement.appendChild(token);
      tokens[color].push({element:token,row:pos[0],col:pos[1],home:true,steps:0,index:i});
      updateToken(tokens[color][i]);
    });
  });
}

// Update token position visually
function updateToken(token){
  token.element.style.transform=`translate(${token.col*40}px, ${token.row*40}px)`;
}

// Roll dice
diceElement.addEventListener('click',()=>{
  diceValue = Math.floor(Math.random()*6)+1;
  diceElement.textContent = '🎲 '+diceValue;
  info.textContent = `Current turn: ${colors[turn]} (rolled ${diceValue})`;
});

// Move token (first movable token automatically)
function moveToken(color){
  const playerTokens = tokens[color];
  let moved=false;
  for(let t of playerTokens){
    if(t.home && diceValue===6){
      t.home=false; t.steps=1; [t.row,t.col]=paths[color][0]; updateToken(t); moved=true; break;
    } else if(!t.home){
      const nextStep = t.steps + diceValue;
      if(nextStep<=paths[color].length){
        t.steps=nextStep;
        [t.row,t.col] = paths[color][t.steps-1];
        updateToken(t);
        moved=true;
        break;
      }
    }
  }
  if(!moved && diceValue!==6) turn=(turn+1)%4;
  checkCapture(color);
  checkWin(color);
  info.textContent = `Current turn: ${colors[turn]}`;
}

// Capture logic
function checkCapture(color){
  const allTokens = [].concat(tokens.red,tokens.green,tokens.yellow,tokens.blue);
  const playerTokens = tokens[color];
  for(let t of playerTokens){
    for(let ot of allTokens){
      if(ot!==t && !isSafe(ot) && ot.row===t.row && ot.col===t.col){
        ot.home=true; ot.steps=0; resetHome(ot); 
      }
    }
  }
}

// Reset token to home
function resetHome(token){
  const homes = {
    red:[[1,1],[1,3],[3,1],[3,3]],
    green:[[1,11],[1,13],[3,11],[3,13]],
    yellow:[[11,1],[11,3],[13,1],[13,3]],
    blue:[[11,11],[11,13],[13,11],[13,13]]
  };
  [token.row,token.col]=homes[token.element.classList[1]][token.index];
  updateToken(token);
}

// Safe zone detection
function isSafe(token){
  const safeCells=[[4,4],[4,10],[10,4],[10,10]];
  return safeCells.some(s=>s[0]===token.row && s[1]===token.col);
}

// Check win
function checkWin(color){
  const finished = tokens[color].filter(t=>t.steps===paths[color].length);
  if(finished.length===4){
    setTimeout(()=>alert(`${color.toUpperCase()} wins!`),100);
  }
}

// Board click to move token
boardElement.addEventListener('click',()=>{
  moveToken(colors[turn]);
});

// Start game
initBoard();
