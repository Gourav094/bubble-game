// get canvas element from HTML element
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

// define circle configurations like colour,radius,border
var circleRadius = 30
var circleBorderWidth = 1;
var circleColors = ['yellow', 'powderblue', 'red', 'lightgreen']

// cicle initial position
var circleX = 70;
var initialY = 50;
var circleSpacing = 70;

var arrowWidth = 10
var arrowSpeed = 5
var isArrowMoving = false;

// Arrays to store circle and arrow positions
var circlePositions = [];
var arrowPositions = [];

var clickedCircle = -1

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
initialisation()

function drawArrows(){
    for (let i = 0; i < arrowPositions.length; i++) {
        drawArrow(arrowPositions[i].x, arrowPositions[i].y, arrowPositions[i].endX, arrowPositions[i].y);
    }
}


function drawArrow(fromx, fromy, tox, toy){

    var width = arrowWidth
    var angle = Math.atan2(toy - fromy, tox - fromx);

    var headlen = 6;
    // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
    tox -= Math.cos(angle) * ((width * 1.15));
    toy -= Math.sin(angle) * ((width * 1.15));
    
    //starting path of the arrow from the start square to the end square and drawing the stroke
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.strokeStyle = "black";
    context.lineWidth = width;
    context.stroke();
    
    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
    
    //path from the side point of the arrow, to the other side point
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
    
    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    context.fillStyle = "black";
    // context.strokeStyle = "#cc0000";
    context.lineWidth = width;
    context.stroke();
    // context.fillStyle = "#cc0000";
    context.fill();
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    drawArrows();
}


function animateArrow(clickedCircleIndex) {
    isArrowMoving = true;
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
            isArrowMoving = false;
            // Change circle color immediately
            circleColors[clickedCircleIndex] = getRandomColor(); // Change to desired color
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
    if(!isArrowMoving){
        circleColors = ['yellow', 'powderblue', 'red', 'lightgreen'];
        arrowPositions.forEach(function (arrow, index) {
            arrow.x = canvas.width - 50;
            arrow.endX = canvas.width - circleRadius - 100;
        });
        isArrowMoving = false;
        draw();
    }
}

canvas.addEventListener('click', function (event) {
    if (!isArrowMoving) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        for (var i = 0; i < circlePositions.length; i++) {
            var circle = circlePositions[i];
            if (Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2) <= circleRadius) {
                // if (clickedCircle !== i) {
                    animateArrow(i);
                    // clickedCircle = i;
                // }
                break;
            }
        }
    }
});

document.getElementById('reset-button').addEventListener('click', function () {
    console.log("clicked reset button")
    reset();
});


draw()



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}