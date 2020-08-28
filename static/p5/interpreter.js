const p5code =
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

let condOnProgress = false;
let variableNames = [];
let variableBlocks = [];
let functionBlocks = [];
let drawBlocks = [];
let loopBlocks = [];
let condCodeType = 1;
let debug = true;
let ct = 3;
let fuse;
let inDrawLoop = false;

function initInterpreter() {
    const fuseOptions = {
        keys: ['title'],
        shouldSort: true,
        includeScore: true
    };
    fuse = new Fuse(codeList, fuseOptions);
}

function addCodeInput(codeInput, codeType) {
    let parsedText = parse(codeInput);
    ct = (typeof codeType !== 'undefined') ? codeType : parsedText[1];
    if (inDrawLoop) {
        loopBlocks.push(parsedText[0]);
    } else {
        if (ct === 1)
            variableBlocks.push(parsedText[0]);
        else if (ct === 2)
            functionBlocks.push(parsedText[0]);
        else if (ct === 3)
            drawBlocks.push(parsedText[0]);
    }

    if (debug) runP5Code();
}

function undo() {
    if (ct === 1)
        variableBlocks.pop();
    else if (ct === 2)
        functionBlocks.pop();
    else if (ct === 3)
        drawBlocks.pop();

    runP5Code();
}

function parse(code_text) {
    let code_sub = "";
    if (code_text.indexOf("\n") > 0) {
        code_sub = code_text.substring(0, code_text.indexOf("\n"));
    } else {
        code_sub = code_text;
    }
    code_sub = code_sub.toLowerCase();
    code_sub = code_sub.replace(/\s+/g, " ").trim();
    let result = fuse.search(code_sub.replace(/\s+/g, " ").trim().substring(0, (code_sub.indexOf(':') > 0) ? code_sub.indexOf(':') : code_sub.length));
    let resultCode = result[0].item.code;
    if (result[0].score > 0.35) { // 0 is complete match, 1 is complete mismatch
        return ["", undefined];
    }
    let inputs = [];
    let codeType = condOnProgress ? condCodeType : result[0].item.code_type;
    if (result[0].item.input === "numeric") {
        inputs.push(code_sub.match(/\d+/g).map(Number));
        resultCode = resultCode.format(inputs);
    } else if (result[0].item.input === "color") {
        let c_index = code_sub.indexOf("c:");
        let c = code_sub.substring(c_index + 2, code_sub.length).trim();
        resultCode = resultCode.format("'" + c + "'");
    } else if (result[0].item.input === "string") {
        let index = code_sub.indexOf(":");
        resultCode = resultCode.format(code_sub.substring(index + 1, code_sub.length).trim());
    } else if (result[0].item.input === "music") {
        if (result[0].item.no_in === 0) {
            resultCode = result[0].item.code;
        } else if (result[0].item.no_in === 1) {
            resultCode = resultCode.format(code_sub.substring(code_sub.lastIndexOf(" ") + 1, code_sub.length));
        }
        eval(resultCode);
    } else if (result[0].item.input === "call") {
        resultCode = resultCode.format(code_sub.substring(code_sub.indexOf(":") + 1, code_sub.length).trim().replace(/\s/g, '_'));
    } else if (result[0].item.input === "cond") {
        condOnProgress = true;
        condCodeType = result[0].item.code_type;
        if (result[0].item.no_in === 0) {
            resultCode = result[0].item.code;
        } else if (result[0].item.no_in === 1) {
            resultCode = resultCode.format(code_sub.substring(code_sub.indexOf(":") + 1, code_sub.length).trim());
        }
    } else if (result[0].item.input === "end") {
        resultCode = result[0].item.code;
        condOnProgress = false;
    } else if (result[0].item.input === "loop") {
        inDrawLoop = !inDrawLoop;
    } else if (result[0].item.input === "variable") {
        let n_index = code_sub.indexOf("n:");
        let v_index = code_sub.indexOf("v:");
        let var_name = code_sub.substring(n_index + 2, v_index - 1);
        if (variableNames.includes(var_name) && result[0].item.code_type === 1) {
            resultCode = "";
        } else {
            resultCode = resultCode.format(var_name, code_sub.substring(v_index + 2, code_sub.length));
            variableNames.push(var_name);
        }
    } else if (result[0].item.input === "shape") {
        let x_index = code_sub.indexOf("x:");
        let x = code_sub.substring(x_index + 2, code_sub.length).trim();
        resultCode = resultCode.format(x);
    } else if (result[0].item.input === "text") {
        code_sub = code_sub.replace(/\s+/g, " ").trim();
        let t_index = code_sub.indexOf("t:");
        let x_index = code_sub.indexOf("x:");
        let t = code_sub.substring(t_index + 2, x_index - 1).trim();
        let x = code_sub.substring(x_index + 2, code_sub.length).trim();
        resultCode = resultCode.format(s, x);
    }
    return [resultCode, codeType];
}

function runP5Code() {
    let codeP5 = new CodeP5();
    if (!condOnProgress) {
        codeP5.runCode();
    }
}