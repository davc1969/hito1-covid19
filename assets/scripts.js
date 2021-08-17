
window.onload =  async function(){

    try {
        const response = await fetch('http://localhost:3000/api/total');
        const {data}   = await response.json()

        if (data) {
            console.log("onLoad: ", data);
            
            const filteredData = data.filter(item => {return item.confirmed >= 1000000})
            console.log("filtrada: ", filteredData);
            const chartData = formatDataToChart(filteredData);
            createChart(chartData,"chartCanvas");
            fillTable(data, "tableBody");
        }
    } 
    catch (err) {
        localStorage.clear()
        console.error(`Error: ${err}`)
    }

};

function formatDataToChart(data) {
    let newData = [{
        type: "column",
        name: "Casos Activos",
        showInLegend: true,
        yValueFormatString: "0 casos",
        dataPoints: []
    }, 
    {
        type: "column",
        name: "Fallecidos",
        showInLegend: true,
        yValueFormatString: "0 casos",
        dataPoints: []
    }];

    data.forEach(element => {
        newData[0].dataPoints.push(
            {label : element.location,
             y : element.confirmed
            }
        )
        newData[1].dataPoints.push(
            {label : element.location,
             y : element.deaths
            }
        )
    });
    console.log("format:", newData);
    return newData
}


function createChart(dataGraph, idLocation) {


    var chart = new CanvasJS.Chart("chartContainer", {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "Países con mas de 1.000.000 casos activos de Covid19"
        },
        toolTip: {
            shared: true
        },
        data: dataGraph
    });

    console.log("chart:", idLocation, dataGraph);
    chart.render();

}

function createChartCountry(dataGraph, idLocation) {


    var chart = new CanvasJS.Chart("chartCountry", {
        animationEnabled: true,
        width: 450,
        height: 300,
        title:{
            text: "confirmados y fallecidos"
        },
        toolTip: {
            shared: true
        },
        data: dataGraph
    });

    console.log("chart:", idLocation, dataGraph);
    chart.render();

}

{/* <tr>
    <th scope="row">1</th>
    <td>Mark</td>
    <td>Otto</td>
    <td>@mdo</td>
    <td><a href="">Ver detalle</a></td>
</tr> */}

function fillTable(data, idLocation) {
    let tableToBeFilled = document.getElementById(idLocation);
    console.log("fillTable: ", data);
    data.forEach( (element, index) => {
        let row = document.createElement('tr')
        let dataTD = ""
        dataTD += `  <td scope="row">${index + 1}</td>`;
        dataTD += `  <td>${element.location}</td>`;
        dataTD += `  <td>${element.confirmed}</td>`;
        dataTD += `  <td>${element.deaths}</td>`;
        dataTD += `  <td><button onclick=callModal("${element.location}")>Ver detalle</button></td>`;
        row.innerHTML = dataTD;
        tableToBeFilled.appendChild(row)
    });
    
}

const callModal = async (country) => { 
    
    let modal1 = document.getElementById("modalCountry");
    document.getElementById("modalTitle").innerText = `Casos Covid19: ${country}`

    try {
        const urlCountry = `http://localhost:3000/api/countries/${country}`;
        
        const response = await fetch(urlCountry);
        console.log("callModal response ", response);
        
        const {data}   = await response.json();
        console.log("callModal data ", data);

        if (data) {
           
            let dataChartCountry = [{

                type: "column",
                yValueFormatString: "0 casos",
                dataPoints: [{
                    label: "Confirmados",
                    y : data.confirmed},
                    {label : "Fallecidos",
                    y : data.deaths }
                ]
            }]

            console.log("callModal datachart", dataChartCountry);
            createChartCountry(dataChartCountry,"chartCountry");
        }
        else { 
            console.log("error 333333");
            throw 404;
        }
    } 
    catch (err) {
        alert ("Información no disponible para el país seleccionado");
        console.error(`Error: ${err}`)
    }


    $("#modalCountry").modal('show');



}