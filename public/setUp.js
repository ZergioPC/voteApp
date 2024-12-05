(function (){
    if(sessionStorage.getItem('name') != "admin"){
        const div = document.createElement("div");
            div.classList.add("blocker");

        document.body.appendChild(div);
        alert("No tiene permiso para ingresar");
        location.href = "index.html";
    }else{
        alert('Admin');
    }
})();

let optionCount = 0;
const optionArray = []

const secOptions = document.getElementById("options")
const txtArea = document.getElementById("quest")

const btnMore = document.getElementById("btnMore");
const btnLess = document.getElementById("btnLess");
const btnVotar = document.getElementById("btnVotar")

const printQuest = document.getElementById("printQuest");
const printList = document.getElementById("printOpt");
const printDate = document.getElementById("printDate");

function setTime(){
    const date = new Date();

    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const fecha = `Votación realizada el ${dia}-${mes}-${year} a las ${hours}:${minutes}`;

    return fecha;
}

function imprimir(preguntas){
    printQuest.innerText = txtArea.value;
    preguntas.forEach(item => {
        const li = document.createElement('li');
            li.innerText = item;
        printList.appendChild(li);
    });
    printDate.innerText = setTime()
}

function createItem(n){
    const p = document.createElement("p");
        p.innerText = `${n.toString()}. `
    const input = document.createElement("input");
        input.type = "text";

    const div = document.createElement("div");
        div.classList.add("itemOption");
        div.appendChild(p);
        div.appendChild(input);
    
    return div;
};

btnMore.addEventListener("click",()=>{
    optionCount++;
    const nodo = createItem(optionCount);
    optionArray.push(nodo);
    secOptions.appendChild(optionArray[optionCount-1]);
});

btnLess.addEventListener("click",()=>{
    if(optionCount<=2){
        alert("Deben existir almenos dos opciones")
    }else{
        secOptions.removeChild(optionArray[optionCount-1]);
        optionArray.pop()
        optionCount--;
    }
});

btnVotar.addEventListener("click",()=>{
    if(optionCount < 2){
        alert("Se necesitan dos opciones minimo");
    }else{
        const nodeList = document.querySelectorAll(".itemOption");
        const questList = []

        nodeList.forEach(input => {
            questList.push(input.childNodes[1].value);
        });
        imprimir(questList)
        fetch("/quests/data",{
            method:"post",
            headers:{
                "Content-Type":"application/json"   
            },
            body:JSON.stringify({
                quest:txtArea.value,
                options:questList
            })
        }).then(function(req,res){
            print();
            location.href = "resultados.html";
        });
    }
})

