const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown",keydown);

let img = new Image();
const imgSelect = [
    "img/breakout_main_1.png",
    "img/board_2.png",
    "img/board_3.png",
    "img/can.png"
]
img.src = imgSelect[0];
let suprizImg = new Image();
suprizImg.src = imgSelect[3];

let interval;
let oyunBasladiMi = false;

const height = canvas.height;
const width = canvas.width; 
let x = width / 2;
let y = height - 30;

let dx = 1;
let dy = -1;

let barWidth = 75;
let barHeight = 20;
let barX = (width-barWidth)/2;
let barY = (height-barHeight);

let can = 3;
let score = 0;
let speed = 7;
let isGameOver = false;


let brickLine = 7;
let brickColumn = 6;
let brickCount = 0;
const brickWidth = 75;
const brickHeight = 20;
const brickOffSetTop = 30;
const brickOffSetLeft = 40;
const brickPadding = 10;
let brickImg = new Image();
const brickImgSelect = [
    "",
    "img/brick_1.png",
    "img/brick_2.png",
    "img/brick_3.png"
]
brickImg.src = brickImgSelect[0];
const bricks = [];
let dusenSuprizler = [];
let surprizSayisi = 3;
let surprizVerildi = 0;
for (let k = 0; k < brickColumn; k++) {
    bricks[k] = [];
    for (let s = 0; s < brickLine; s++) {
        let surpriz = false;
        if (surprizVerildi < surprizSayisi && Math.random() < 0.1) { // %10 olasılıkla süpriz ver
            surpriz = true;
            surprizVerildi++;
        }
        bricks[k][s] = { x: 0, y: 0, status: 1, surpriz: surpriz };
        const randomBrick = Math.floor(Math.random() * 3) + 1;
        console.log(randomBrick);
        brickImg.src = brickImgSelect[randomBrick];
    }
}


let setballColor = [
    "#0095DD",
    "#c300ff",
    "#fff",
    "#ff7b00",
    "#ff0000",
    "#5eff00"
]
let ballColor = setballColor[2];

//arrow function
const oyunuCiz = () => {
    tahtayiTemizle();
    barCiz();
    getHeart();
    topuCiz();
    topunKonumunuDegistir();
    tuglalariCiz();
    tuglayaCarptiMi();
    suprizleriCiz();
    scoreCiz();
}

function tahtayiTemizle(){
    ctx.clearRect(0, 0, width, height);
}

const topuCiz = () => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

const topunKonumunuDegistir = () => {
    if(x + dx > width - 10 || x + dx < 10){
        dx = -dx;
    }
    if(y + dy < 10){//yukarı çarptığında
        dy = -dy;
    }
    else if(y + dy > barY - 10 && y + dy < barY + 10 && 
    x > barX && x < barX + barWidth){//çubuğa çarptığında
        dy = -dy;
    }
    else if(y + dy > height - 10){//aşağı çarptığında
        can--;
        barWidth = 75;
        barHeight = 20;
        if(can === 0){
            ctx.font = "25px Verdena";
            ctx.fillStyle = "white";
            ctx.fillText("Game Over!", width/2 - 50, height - 100);
            clearInterval(interval);
            isGameOver = true;
            oyunBasladiMi = false;
            // return;
        }
        if(score > 200){
            speed = 5;
        }
        if(score >= 50){
            score-=50;
        }
        else if(score < 50){
            score=0;
        }
        
        dy = -dy;
    }
    // if(y + dy > height - 30 || y + dy < 10){
    //     dy = -dy;
    // }
    x += dx;
    y += dy;
}

const barCiz = () => {
    ctx.beginPath();
    ctx.drawImage(img, barX, barY, barWidth, barHeight);
    ctx.closePath();
}

const tuglalariCiz = () => {
    for(let column = 0; column < brickColumn; column++){
        for(let line = 0; line < brickLine; line++){
            if(bricks[column][line].status === 1){
                const brickX = column * (brickWidth + brickPadding) + brickOffSetLeft;
                const brickY = line * (brickHeight + brickPadding) + brickOffSetTop;

                bricks[column][line].x = brickX;
                bricks[column][line].y = brickY;
                
                ctx.beginPath();
                ctx.drawImage(brickImg, brickX, brickY, brickWidth, brickHeight);
                ctx.closePath();
            }
        }
    }
}

const tuglayaCarptiMi = () => {
    for(let column = 0; column < brickColumn; column++){
        for(let line = 0; line < brickLine; line++){
            const brick = bricks[column][line];
            if(brick.status === 1){
                if(x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight + 10){
                    dy = -dy;
                    brickCount++
                    // if(brickCount === 3){
                    //     brick.status = 0;
                    //     brickCount = 0;
                    // }
                    brick.status = 0;
                    score += 10;

                    // Süprizi kontrol et
                    if (brick.surpriz) {
                        dusenSuprizler.push({x: brick.x + brickWidth / 2, y: brick.y + brickHeight / 2, status: 1});
                    }

                    if(score === brickLine * brickColumn *10){
                        clearInterval(interval);
                        ctx.font = "25px Verdena";
                        ctx.fillStyle = "white";
                        ctx.fillText("You Win!", width/2 -50, height/2);
                        oyunBasladiMi = false;
                        isGameOver = true;
                    }
                    if(score > 100){
                        speed = 1;
                    }
                }
            }
        }
    }
}

const suprizleriCiz = () => {
    for (let i = 0; i < dusenSuprizler.length; i++) {
        const supriz = dusenSuprizler[i];
        if (supriz.status === 1) {
            ctx.beginPath();
            ctx.drawImage(suprizImg, supriz.x, supriz.y, 25, 25); // 10x10 boyutunda bir kare olarak süprizi çiziyoruz.
            ctx.closePath();

            // Süprizi aşağı doğru hareket ettirelim.
            supriz.y += 1;

            // Eğer süpriz, çubuğa çarparsa:
            if (supriz.y >= barY && supriz.y <= barY + barHeight &&
                supriz.x >= barX && supriz.x <= barX + barWidth) {
                
                supriz.status = 0; // Süprizi devre dışı bırakalım.

                // Çubuğu ya büyütelim ya da küçültebiliriz. Rastgele bir seçim yapalım.
                const buyut = Math.random() >= 0.5;  // 0.5'ten büyük ya da eşitse true, küçükse false döner.

                if (buyut && barWidth <= 100) {  // Çubuğu büyütmeyi sınırlayalım.
                    barWidth =  barWidth * 2;
                } else if (!buyut && can<3) {  // Çubuğu küçültmeyi sınırlayalım.
                    // barWidth = barWidth / 2;
                    can++;
                }
            }
        }
    }
}

const scoreCiz = () => {
    document.getElementById("score").innerText = `Score: ${score}`;
}

oyunuCiz();

const oyunuBaslat = () => {
    if(oyunBasladiMi === false){
        if(isGameOver){
            document.location.reload();
        }
        else{
            interval = setInterval(oyunuCiz, speed);
            oyunBasladiMi = true;
        }
        
    }
    else{
        clearInterval(interval);
        oyunBasladiMi = false;
        ctx.fillStyle = "#fff";
        ctx.font = "20px Poppins";
        ctx.fillText('Stop' , width/2-20, height/2);
    }
}

function getHeart(){
    if(can === 3){
        document.getElementById("health").innerHTML = '<img id="imgHeart" class="heart" src="img/icons8-health-32.png"><img id="imgHeart" class="heart" src="img/icons8-health-32.png"><img id="imgHeart" class="heart" src="img/icons8-health-32.png">';
    }
    if(can === 2){
        document.getElementById("health").innerHTML = '<img id="imgHeart" class="heart" src="img/icons8-health-32.png"><img id="imgHeart" class="heart" src="img/icons8-health-32.png">';
    }
    if(can === 1){
        document.getElementById("health").innerHTML = '<img id="imgHeart" class="heart" src="img/icons8-health-32.png">';
    }
}

function getBar(){
    const bar0 = document.getElementById("bar0");
    const bar1 = document.getElementById("bar1");
    const bar2 = document.getElementById("bar2");

    bar0.addEventListener("click", function(){
        img.src = imgSelect[0];
    });

    bar1.addEventListener("click", function(){
        img.src = imgSelect[1];
    });

    bar2.addEventListener("click", function(){
        img.src = imgSelect[2];
    });
}

function getBall(){
    const ball0 = document.getElementById("ball0");
    const ball1 = document.getElementById("ball1");
    const ball2 = document.getElementById("ball2");
    const ball3 = document.getElementById("ball3");
    const ball4 = document.getElementById("ball4");
    const ball5 = document.getElementById("ball5");


    ball0.addEventListener("click", function(){
        ballColor = setballColor[0];
    });

    ball1.addEventListener("click", function(){
        ballColor = setballColor[1];
    });

    ball2.addEventListener("click", function(){
        ballColor = setballColor[2];
    });

    ball3.addEventListener("click", function(){
        ballColor = setballColor[3];
    });

    ball4.addEventListener("click", function(){
        ballColor = setballColor[4];
    });

    ball5.addEventListener("click", function(){
        ballColor = setballColor[5];
    });
}

function keydown(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        if(barX + 5 > width - barWidth){
            return;
        }
        barX += 20;

    }
    else if(e.key === "Left" || e.key === "ArrowLeft"){
        if(barX - 5 < 0){
            return;
        }
        barX -= 20;
    }
}
