
const dateInput = document.querySelector('#dateInput');
// Campo de input onde o usuário insere uma data ou timestamp para conversão

const dateOutput = document.querySelector('#dateOutput');
// Div onde o resultado da conversão será exibido

const btnConv = document.querySelector('#btnConv');
// Botão que inicia a conversão da data/timestamp ao ser clicado

const date1 = document.querySelector('#date1');
// Campo de input para a primeira data na comparação

const date2 = document.querySelector('#date2');
// Campo de input para a segunda data na comparação

const btnCompare = document.querySelector('#btnCompare');
// Botão que inicia a comparação das duas datas ao ser clicado

const diffResult = document.querySelector('#diffResult');
// Div onde o resultado da comparação de datas será exibido

btnConv.addEventListener('click', () => {
    const input = dateInput.value;
    // Pega o valor digitado pelo usuário no campo de input

    fetch(`/api/${encodeURIComponent(input)}`)
    // Faz uma requisição GET para a rota /api/<input>, onde <input> é a data ou timestamp codificada na URL

        .then(response => response.json())
        // Converte a resposta da API para JSON

        .then(data => {
            // Verifica se a API retornou um erro ou dados válidos
            dateOutput.innerHTML = data.error ? 
                `<span class="error">${data.error}</span>` :
                `<strong>Unix:</strong> ${data.unix}<br>
                 <strong>UTC:</strong> ${data.utc}`;
            // Exibe o resultado formatado na página (Unix e UTC), ou a mensagem de erro
        })
        .catch(() => {
            // Caso ocorra algum erro na requisição
            dateOutput.innerHTML = `<span class="error">Erro ao processar a requisição</span>`;
        });
});


btnCompare.addEventListener('click', () => {
    const d1 = encodeURIComponent(date1.value);
    const d2 = encodeURIComponent(date2.value);
    // Captura os valores dos campos e codifica para que possam ser usados na URL

    fetch(`/api/diff/${d1}/${d2}`)
    // Faz uma requisição GET para a rota /api/diff/<d1>/<d2>, onde d1 e d2 são as datas codificadas

        .then(response => response.json())
        // Converte a resposta da API para JSON

        .then(data => {
            // Verifica se há erro ou se os dados da diferença foram retornados com sucesso
            diffResult.innerHTML = data.error ? 
                `<span class="error">${data.error}</span>` :
                `<strong>Diferença:</strong><br>
                 ${data.days} dias, ${data.hours} horas,
                 ${data.minutes} minutos, ${data.seconds} segundos`;
            // Exibe a diferença de tempo entre as datas na página, formatada
        })
        .catch(() => {
            // Exibe erro se a requisição falhar
            diffResult.innerHTML = `<span class="error">Erro ao processar a requisição</span>`;
        });
});