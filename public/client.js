const socket = io()
const addAlgorithmBtn = document.getElementById('addAlgorithmBtn')
const startRaceBtn = document.getElementById('startRace')

let algorithms = []
let selectedAlgorithms = []
let chartInstance = null

function addAlgorithm(){
    let input = document.getElementById('algoSearch')
    let value = input.value.trim()

    const algoObj = algorithms.find(a => a.label == value)

    if(!algoObj){
        alert('Такого алгоритму не існує, виберіть алгоритм зі списку')
        return
    }

    if(selectedAlgorithms.find(a => a.key == algoObj.key)){
        input.value = ''
        alert('Цей алгоритм вже доданий')
        return
    }

    if(selectedAlgorithms.length >= 3){
        input.value = ''
        alert('Обрана максимальна кількість алгоритмів')
        return
    }

    selectedAlgorithms.push(algoObj)
    renderSelectedList()
    input.value = ''
    value = ''
}

function deleteAlgoFromList(key){
    selectedAlgorithms = selectedAlgorithms.filter(a => a.key != key)
    renderSelectedList()
}

function renderSelectedList(){
    const listContainer = document.getElementById('selected-list')
    listContainer.innerHTML = ''

    if (selectedAlgorithms.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center text-muted p-3 bg-light rounded border border-dashed small">
                Список порожній. Додайте алгоритми вище.
            </div>`
        return
    }

    selectedAlgorithms.forEach(algo => {
        const item = document.createElement('div')
        item.className = 'list-group-item d-flex justify-content-between align-items-center animate-fade'

        item.innerHTML = 
        `
            <span class="fw-bold" style="color: #333;">${algo.label}</span>
            <button class="btn btn-sm btn-outline-danger border-0 delbtn" onclick="deleteAlgoFromList('${algo.key}')" title="Видалити">
                ✕
            </button>
        `

        listContainer.appendChild(item)
    })
}

function initAlgoOptionsList(){
    const algoOptions = document.getElementById('algoOptions')
    algoOptions.innerHTML = ''

    algorithms.forEach(algo => {
        const option = document.createElement('option')
        option.value = algo.label

        algoOptions.append(option)
    })
}

function initChart(){
    const ctx = document.getElementById('raceChart').getContext('2d')

    chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '# of Votes',
        data: [],
        borderWidth: 1
      }]
    },
    options: {
        animation: {
                duration: 500, 
                easing: 'linear' 
            },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

function startRace(){
    const range = document.getElementById('inputRange').value

    if(selectedAlgorithms < 2){
        alert('Спочатку оберіть агоритми (min. 2)')
        return
    }

    chartInstance.data.labels = selectedAlgorithms.map(a => a.label)
    chartInstance.data.datasets[0].backgroundColor = selectedAlgorithms.map(a => a.color)
    chartInstance.data.datasets[0].data = new Array(selectedAlgorithms.length).fill(0)

    chartInstance.update()

    selectedAlgorithms.forEach(algo => {
        socket.emit('start-race', { algorithm: algo.key, range: range })
    })

}

socket.on('race-result', (data) => {    
    const index = selectedAlgorithms.findIndex(a => a.key == data.algorithm)

    chartInstance.data.datasets[0].data[index] = data.timeTaken
    chartInstance.update()
})

startRaceBtn.onclick = () => {
    startRace()
}

addAlgorithmBtn.onclick = () => {
    addAlgorithm()
}

document.addEventListener('DOMContentLoaded', () =>{
    initChart()
})

socket.on('init-config', (serverConfig) => {
    algorithms = serverConfig

    initAlgoOptionsList()
})