/*(function (){
    if(sessionStorage.getItem('name') != "admin"){
        const div = document.createElement("div");
            div.classList.add("blocker");

        document.body.appendChild(div);
        alert("No tiene permiso para ingresar");
        location.href = "index.html";
    }else{
        sessionStorage.removeItem("name")
    }
})();*/

const btnGrap = document.getElementById('btnGrap');

const canvasPolar = document.getElementById("grPolar");
    canvasPolar.classList.add('hide');
const canvasBar = document.getElementById("grBar");
    canvasBar.classList.add('hide');
    canvasBar.classList.toggle('hide');

const btnData = document.getElementById("getData");
const chkAnonim = document.getElementById("anominCheck");

const pregunta = document.getElementById('pregunta');
const fecha = document.getElementById("fecha");

const secLog = document.getElementById("historico");

const printQuest = document.getElementById('printQuest');
const printOpt = document.getElementById('printOpt');
const printLog = document.getElementById('printLog');
const printDate = document.getElementById('printDate');

const btnPrint = document.getElementById('btnImprimir');

let resultados = [];
let historial = [];
let preguntas = ['',[]];

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

/* GRAFICOS */
function drawGraficoPolar(){
    const ctx = canvasPolar.getContext('2d');
    const etiquetaPlugin = {
        id: 'etiquetaPlugin',
        beforeDraw(chart) {
            const { ctx, data, chartArea: { width, height } } = chart;
            ctx.save();
            const meta = chart.getDatasetMeta(0);
            meta.data.forEach((segmento, index) => {
                const posicion = segmento.tooltipPosition();
                const texto = data.labels[index];
                ctx.font = '12px Arial'; 
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(texto, posicion.x, posicion.y);
            });
            ctx.restore();
        }
    };

    new Chart(ctx,{
        type:'polarArea',
        data:{
            labels:preguntas[1], //Preguntas
            datasets: [{
                label: 'Cantidad de votos',
                data: resultados, // Votos
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resultados de las votaciones'
                }
            }
        },
        plugins: [etiquetaPlugin]
    });
};

function drawGraficoBarra(){
    const ctx = canvasBar.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: preguntas[1], // Preguntas
            datasets: [{
                label: 'Cantidad de votos',
                data: resultados, // Votos
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false 
                },
                title: {
                    display: true,
                    text: 'Resultados de las votaciones'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Propuestas' 
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de votos'
                    }
                }
            }
        }
    });
};

/* Historial */

function historialVotos(){
    secLog.replaceChildren();
    const ul = document.createElement('ul');
    historial.forEach(voto => {
        const p1 = document.createElement('p');
            p1.innerText = `${voto.user}`
        const p2 = document.createElement('p');
            p2.innerHTML = `vota por <b>${preguntas[1][parseInt(voto.voto)]}</b>`
        
        const li = document.createElement('li');
            li.classList.add('listVotos');
            if(!chkAnonim.checked){
                li.appendChild(p1);  
            }
            li.appendChild(p2);
        ul.appendChild(li);
    });
    secLog.appendChild(ul);
}

/* Llamado de Resultados */

btnData.addEventListener("click",()=>{
    fetch('/resultados')
        .then(response => response.json())
        .then(data => {
            resultados = data.rta;
            historial = data.logh;
            preguntas = data.quest;
            
            historialVotos();
            drawGraficoPolar();
            drawGraficoBarra();

            fecha.innerText = setTime()
        })
        .catch(error => {
            console.error('Error al obtener la IP:', error);
        });
});

btnGrap.addEventListener('click',()=>{
    if(btnGrap.innerText == "Barras"){
        btnGrap.innerText = "Pastel";
    }else{
        btnGrap.innerText = "Barras";
    }
    canvasBar.classList.toggle('hide');
    canvasPolar.classList.toggle('hide');
})

btnPrint.addEventListener('click',()=>{
    printDate.innerText = setTime();
    printQuest.innerText = preguntas[0];

    printOpt.replaceChildren();
    printLog.replaceChildren();

    for (let i = 0; i < preguntas[1].length; i++) {
        const li = document.createElement('li');
            li.innerText = `${preguntas[1][i]} recibe ${resultados[i]} votos.`;
        printOpt.appendChild(li);
    }

    historial.forEach(voto=>{
        const li = document.createElement("li");
            li.innerText = `${voto.user} vota por ${preguntas[1][parseInt(voto.voto)]}`;
        printLog.appendChild(li);
    });

    print();
    location.href = "index.html"
})
