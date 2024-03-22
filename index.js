// get canvas element from HTML element
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

// define circle configurations like colour,radius,border
var circleRadius = 30
var circleBorderWidth = 1;
var circleColors = ['#F6D471', '#1D8ECE', '#CE1D1D', '#49BD4E']

// cicle initial position
var circleX = 70;
var initialY = 50;
var circleSpacing = 70;

// define arrows configuration
var arrowWidth = 10
var arrowSpeed = 5

// Arrays to store circle and arrow positions
var circlePositions = [];
var arrowPositions = [];
var arrayMoving = [false,false,false,false]

// initialise arrow points 
function initialisation(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < circleColors.length; i++) {
        var circleY = initialY + (circleRadius * 2 + circleSpacing) * i;
        var arrowStartX = canvas.width - 50;
        var arrowStartY = circleY;
        var arrowEndX = canvas.width - circleRadius - 100

        circlePositions.push({ x: circleX, y: circleY });
        arrowPositions.push({ x: arrowStartX, y: arrowStartY ,endX:arrowEndX });
    }
}

function drawCircles(){
    for (let i = 0; i < circleColors.length; i++) {
        // Draw cicles
        context.beginPath();
        context.arc(circleX, initialY + (circleRadius * 2 + circleSpacing) * i, circleRadius, 0, Math.PI * 2);
        context.fillStyle = circleColors[i];
    
        context.fill();
        context.strokeStyle = 'black'; // Border color for circles
        context.lineWidth = circleBorderWidth; // Border width
        context.stroke(); // Draw circle border
        context.closePath();
    }
}

function drawArrows(){
    for (let i = 0; i < arrowPositions.length; i++) {
        drawArrow(arrowPositions[i].x, arrowPositions[i].y, arrowPositions[i].endX, arrowPositions[i].y);
    }
}

function drawArrow(fromx, fromy, tox, toy){
    var width = arrowWidth
    var angle = Math.atan2(toy - fromy, tox - fromx);

    var headlen = 6;
    tox -= Math.cos(angle) * ((width * 1.15));
    toy -= Math.sin(angle) * ((width * 1.15));
    
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.strokeStyle = "black";
    context.lineWidth = width;
    context.stroke();
    
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
    
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
    
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    context.fillStyle = "black";
    context.lineWidth = width;
    context.stroke();
    context.fill();
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    drawArrows();
}

function animateArrow(clickedCircleIndex) {
    arrayMoving[clickedCircleIndex] = true
    var arrowIndex = clickedCircleIndex;
    var targetCircleX = circleX;
    var targetCircleY = initialY + (circleRadius * 2 + circleSpacing) * clickedCircleIndex;

    var arrow = arrowPositions[arrowIndex];
    var dx = (targetCircleX + circleRadius) - arrow.x;
    var dy = targetCircleY - arrow.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    var velocityX = (dx / distance) * arrowSpeed;
    var velocityY = (dy / distance) * arrowSpeed;

    var interval = setInterval(function () {
        // since arrow length is 100 so stop the moving arrow after touching circle boundary
        if (distance < 100) {
            clearInterval(interval);
            arrayMoving[clickedCircleIndex] = false

            // Change circle color
            circleColors[clickedCircleIndex] = getRandomColor(); 
        }
        console.log(distance)
        // Update arrow position
        arrow.x += velocityX;
        arrow.y += velocityY;
        distance -= arrowSpeed;
        var circleBoundary = circleRadius + targetCircleX
        arrowPositions[arrowIndex].endX = distance >  circleBoundary ? distance : circleBoundary
        // Redraw canvas
        draw();
    }, 20);
}

function reset() {
    const isMoving = arrayMoving.some(function (isMoving) {
        return isMoving;
    }) 

    if(isMoving){
        return
    }

    // Reset colour and positions
    circleColors = ['#F6D471', '#1D8ECE', '#CE1D1D', '#49BD4E']
    arrowPositions.forEach(function (arrow, index) {
        arrow.x = canvas.width - 50;
        arrow.endX = canvas.width - circleRadius - 100;
    });

    arrayMoving = [false,false,false,false];
    draw();
}

canvas.addEventListener('click', function (event) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        for (var i = 0; i < circlePositions.length; i++) {
            var circle = circlePositions[i];
            if (Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2) <= circleRadius) {
                    if(!arrayMoving[i]){
                        animateArrow(i);
                        arrayMoving[i] = true
                    }
                break;
            }
        }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.getElementById('reset-button').addEventListener('click', function () {
    console.log("clicked reset button")
    reset();
});

initialisation()

draw()