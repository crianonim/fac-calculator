window.addEventListener("load",init);

function init(){
    document.querySelectorAll('main button').forEach(el=>el.addEventListener("click",handleButton))
}

function handleButton(event){
    let input=event.target.innerText;
    let inputObj=analyseInput(input);
    console.log(inputObj)
}

function analyseInput(input){
    let inputObj={input};

    return inputObj;
}