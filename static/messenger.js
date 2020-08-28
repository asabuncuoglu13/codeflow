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
  console.log(codein);
  eval(codein);
});