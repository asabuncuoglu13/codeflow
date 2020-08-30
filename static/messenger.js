const jsCode =     
  "{0}\n" +
  " {1}\n" +
  "function setup() {\n" +
    " createCanvas(windowWidth, windowHeight);\n" +
  "};\n" +
  "function draw() {\n" +
    " {2}\n" +
    " {3}\n" +
  "};";
const dfMessenger = document.querySelector('df-messenger');
dfMessenger.addEventListener('df-response-received', function (event) {
  console.log(event);
  const params = event.detail.response.queryResult.parameters;
  const action = event.detail.response.queryResult.action;
  console.log(params);
  const codestr = 'addCodeInput("{0}")';
  var codein = '';
  if(action === "draw.shape"){
    if (params.shape.length > 1) {
    if (params.number.length === 4) {
      codein = codestr.format(params.shape + ' x: '+ params.number[0] + ',' + params.number[1] +',' + params.number[2] + ',' + params.number[3]);
    } else if(params.number.length === 3){
      codein = codestr.format(params.shape + ' x: '+ params.number[0] + ',' + params.number[1] +',' + params.number[2] + ', 100');
    } else if(params.number.length === 2){
      codein = codestr.format(params.shape + ' x: '+ params.number[0] + ',' + params.number[1] + ', 100, 100');
    } else if(params.number.length === 1){
      codein = codestr.format(params.shape + ' x: '+ params.number[0] + ', 100,100, 100');
    } else {
      codein = codestr.format(params.shape + ' x: 100, 100, 100, 100');
    }
    }
  }
  if(action === "attr.color") {
    var col = params.color;
    var colcom = params.colorcommand;
    if(col.length > 1 && colcom.length > 1)
      codein = codestr.format(colcom + " c: " + col);
  }
  if(action === "anim.move") {
    var dir = params.direction;
    var num = params.number;
    if(dir.length > 1 && num.length > 1)
      codein = codestr.format("move " + dir + " : " + num);
  }
  if(action === "variable.define") {
    var varname = params.varname;
    var varval = params.varval;
    if(varname.length > 1 && varval.length > 1)
      codein = codestr.format("new variable n: " + varname + " v: " + varval);
  }
  if(action === "show.js") {
    document.getElementById("js-code").innerHTML = jsCode.format(functionBlocks.join(' '), variableBlocks.join(' '), drawBlocks.join(' '), loopBlocks.join());
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
      $( "#dialog" ).dialog( "open" );
    });
  }
  console.log(codein);
  eval(codein);
});