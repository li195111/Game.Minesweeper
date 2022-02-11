document.addEventListener('DOMContentLoaded', ()=>{
    // 'use strict'
    const grid = document.querySelector('.grid');
    const restarts = document.querySelectorAll('.restart');
    const modal = document.querySelector('.modal');
    const score_element = document.querySelector('.score');
    const close_modal = document.querySelector('.close-modal');

    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let matches = [];
    let score = 0;

    close_modal.addEventListener('click',()=>{
        if (modal.classList.contains('active')){
            modal.classList.remove('active');
        }
    })

    // create board
    function createBoard(){
        // get shuffled game array with random bombs
        // 取得隨機排序的炸彈遊戲陣列
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(()=>Math.random() - 0.5);
        
        for(let i=0; i < width*width; i++){
            const squareBox = document.createElement('div');
            const square = document.createElement('div');
            const squareSallow = document.createElement('div');

            squareBox.setAttribute('id',i);
            squareBox.classList.add(shuffledArray[i]);
            squareBox.classList.add('squareBox');
            
            square.classList.add('square');

            squareSallow.classList.add('squareShallow');

            squareBox.appendChild(square);
            squareBox.appendChild(squareSallow);

            grid.appendChild(squareBox);
            squares.push(squareBox);

            // normal click
            squareBox.addEventListener('click', function(e){
                click(squareBox);
            })

            // cntrl and left click
            squareBox.oncontextmenu = function(e){
                e.preventDefault();
                addFlag(squareBox);
            }
        }

        // add numbers
        for(let i = 0; i < squares.length; i++){
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width-1);

            if (squares[i].classList.contains('valid')){
                // Left
                if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')){
                    total++;
                }
                // Top Right
                if (i > 9 && !isRightEdge && squares[i+1-width].classList.contains('bomb')){
                    total++;
                }
                // Top
                if(i > 10 && squares[i-width].classList.contains('bomb')){
                    total++;
                }
                // Top Left
                if (i > 11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')){
                    total++;
                }
                // Right
                if (i < 98 && !isRightEdge && squares[i+1].classList.contains('bomb')){
                    total++;
                }
                // Left Bottom
                if (i < 90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')){
                    total++;
                }
                // Right Bottom
                if (i < 88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')){
                    total++;
                }
                // Bottom
                if (i < 89 && squares[i+width].classList.contains('bomb')){
                    total++;
                }
                squares[i].setAttribute('data',total);
            }
        }
    }

    createBoard();

    for(let restart of restarts){
        restart.addEventListener('click',()=>{
            squares.map(square => {
                grid.removeChild(square);
            });
            squares =[];
            createBoard();
            isGameOver = false;
            if (modal.classList.contains('active')){
                modal.classList.remove('active');
            }
        });
        restart.addEventListener('mousedown',()=>{
            restart.classList.add('restart-click');
        })
        restart.addEventListener('mouseup',()=>{
            restart.classList.remove('restart-click');
        })
    }

    // add Flag with right click
    function addFlag(square){
        if (isGameOver) {return;}
        if (!square.classList.contains('checked') && (flags < bombAmount)){
            if (!square.classList.contains('flag')){
                square.classList.add('flag');
                square.querySelector('.square').innerHTML += '🚩';
                flags++;
                checkForWin();
            }else{
                square.classList.remove('flag');
                square.querySelector('.square').innerHTML = '';
                flags--;
            }
        }
    }

    // click on square actions
    function click(square){
        let currentId = square.id;
        if (isGameOver) {return;}
        if (square.classList.contains('checked') || square.classList.contains('flag')){return;}
        if (square.classList.contains('bomb')){
            gameOver(square);
        }else{
            let total = square.getAttribute('data');
            if (total != 0){
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(currentId);
            square.innerHTML = '';
        }
        square.classList.add('checked');
    }

    // check neoighboring squares once square is checked
    function checkSquare(currentId){
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width-1);
        setTimeout(()=>{
            if (currentId > 0 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10){
                const newId = squares[parseInt(currentId)-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 98 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89){
                const newId = squares[parseInt(currentId)+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        },10)
    }

    // Game Over
    function gameOver(square){
        score = matches.reduce((p,c)=>p+c);
        score_element.innerHTML = `${score}/${bombAmount}`;
        if (!modal.classList.contains('active')){
            modal.classList.add('active');
        }
        
        isGameOver = true;

        // show All the bombs
        squares.forEach(square=>{
            if (square.classList.contains('bomb')){
                if (square.classList.contains('flag')){
                    square.querySelector('.square').style.backgroundColor = 'green';
                }
                else{
                    square.innerHTML = '💣'
                }
            }
        })
    }

    // check for win
    function checkForWin(){
        for (let i = 0; i<squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches[i] = 1;
            }
            else{
                matches[i] = 0;
            }
            if (matches === bombAmount){
                console.log('YOU WIN!');
                isGameOver = true;
            }
        }
        score = matches.reduce((p,c)=>p+c);
        score_element.innerHTML = `${score}/${bombAmount}`;
    }
})