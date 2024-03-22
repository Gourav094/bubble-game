// get canvas element from HTML element
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

// define circle configurations like colour,radius,border
var circleRadius = 30
var circleBorderWidth = 1;
var circleColors = ['yellow', 'powderblue', 'red', 'green']

// cicle initial position
var circleX = 70;
var initialY = 50;
var circleSpacing = 70;

var arrowWidth = 10

// Arrays to store circle and arrow positions
var circlePositions = [];
var arrowPositions = [];

function draw(){
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Adjust circle to left side of canvas
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
        
        var circleY = initialY + (circleRadius * 2 + circleSpacing) * i;
        var arrowEndX = canvas.width - circleRadius - 100
        var arrowEndY = circleY
        var arrowStartX = canvas.width - 50
        var arrowStartY = circleY

        circlePositions.push({x:circleX,y:circleY})
        arrowPositions.push({x:arrowStartX,y:arrowStartY})
        
        drawArrow(arrowStartX,arrowStartY,arrowEndX,arrowEndY)
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


draw()