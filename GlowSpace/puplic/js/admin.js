

    
function start(){
    window.addEventListener('switchMode()', false)
}
time = new Date();
hours = time.getHours();
seconds = time.getSeconds();
if(hours<12){
    document.writeln("<h1>good morning! time now is: "+hours+":"+seconds+" pm </h1>")
}
else if(hours>12 & hours<15){
    document.writeln("<h1>good afternoon! time now is: "+hours+":"+seconds+" am </h1>")
}
else{
    document.writeln("<h1>good evening! time now is: "+hours+":"+seconds+" am </h1>")
}

function drawTable() {
var rows= parseInt(window.prompt("Enter number of rows: "));
var columns = parseInt(window.prompt("Enter number of columns: "));
const bookingTable = document.getElementsByClassName("bookingTable")[0];

for (var i = 0; i < rows; i++) {
    
    var tr = document.createElement("tr");
    for(var j=0; j< columns; j++){
        var td = document.createElement("td");
        var text = document.createTextNode("cell");
        td.appendChild(text);
        tr.appendChild(td);
    }
    bookingTable.appendChild(tr);
    
}

    
}

function showMenu(){
    var spand = document.getElementById("spandButton").getAttribute('value');
    if(spand == "notspand"){
        document.getElementById("spandButton").setAttribute("value",'spand')
        document.getElementById("spandButton").setAttribute("class",'bi bi-dash-lg')
        
        var menu = document.getElementById("managmentTool")
        menu.style.display = "flex"
        menu.style.flexDirection = "column";
        menu.style.backgroundColor = "#d3d3d3";
        menu.style.margin = "10px";
    }
    else if(spand == "spand"){
        document.getElementById("spandButton").setAttribute("value",'notspand')
        document.getElementById("spandButton").setAttribute("class",'bi bi-plus-lg')
         var menu = document.getElementById("managmentTool")
        menu.style.display = "none"
    }
    
}



// var gradeCounter = 1;
// var total =0;
// var grdaeValue;
// var average;
// var grade;
// numberofCourses = prompt("Enter number of courses you want to calculate: ");
// numberofCourses = parseInt(numberofCourses);
// while (gradeCounter <numberofCourses){
//     grdaeValue = prompt("Enter the grade: ");
//     grdaeValue = parseFloat(grdaeValue);
//     total = total+grdaeValue;
//     gradeCounter+=1;
// }
// average = total/numberofCourses

// document.writeln("<h1> your grade average"+average+"</h1>")