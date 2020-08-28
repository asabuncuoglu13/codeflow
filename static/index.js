class CodeP5 {
    constructor() {
        this.p5_obj = {};
        this.initcode =
    "{0}\n" +
    "simpleTriangle = function(x,y,w,h){\n" +
    "    triangle(x,y, x+w/2, y-h, x+w, y);\n" +
    "};\n" +
    "gridLines = function(){\n" +
    "  fill(212);\n" +
    "  stroke(232);\n" +
    "  for (var i = 0; i < width; i += 50) {\n" +
    "    line(i, 0, i, height);\n" +
    "    text(i, i + 1, 10);\n" +
    "  }\n" +
    "  for (var i = 0; i < height; i += 50) {\n" +
    "    line(0, i, width, i);\n" +
    "    text(i, 0, i - 1);\n" +
    "  }\n" +
    "};\n" +
    "drawThings = function(){\n" +
    " {1}\n" +
    " {2}\n" +
    "};\n" +
    "setup = function() {\n" +
    " var myCanvas = createCanvas(windowWidth,windowHeight);\n" +
    " myCanvas.parent('myContainer');\n" +
    " gridLines();\n" +
    "};\n" +
    "draw = function() {\n" +
    " drawThings();\n" +
    " {3}\n" +
    "};";

    }

    runCode() {
        try {
            let code = p5code.format(functionBlocks.join(' '), variableBlocks.join(' '), drawBlocks.join(' '), loopBlocks.join());
            let s = new Function("p", code);
            if (debug) console.log(code);
            this.p5_obj = new p5(s);
        } catch (e) {
            alert(e);
        }
    }

}