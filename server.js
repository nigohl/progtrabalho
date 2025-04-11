const express = require('express');
const path = require('path'); 
const app = express();


app.get('/api/:date?', (req, res) => {  // Define qual a rota (endpoint, caminho, ou qualquer coisa assim) para acessar os valores atraves do get 
    // /api/: Parte fixa do caminho da URL.
    // :date: Um parâmetro dinâmico que pode ser qualquer valor (por exemplo, /api/2023-10-01 ou /api/1696118400000).
    // ?: Indica que o parâmetro :date é opcional. Se não for fornecido, a rota ainda funcionará (por exemplo, /api/).

    let dateParam = req.params.date; // Pega o valor da URL (do app.get ali de cima), que pode ser uma data (o 2023-10-01 do UTC) ou timestamp (os numero todo estranho).
    let timezone = req.query.tz || 'UTC'; // Pega o valor do timezone (ou seja, o fuso horário) que ta na URL (ou seja, o ?tz=UTC) e se não tiver nada, vai ser UTC (padrão).
    let date; // Cria a variavel
    
    if (!dateParam) {
        date = new Date(); // Se não digitarem nada, pega a data atual
    } else if (!isNaN(dateParam)) {
        date = new Date(parseInt(dateParam)); // Se for só numero vai converter para data
        console.log("Else if");
    } else {
        date = new Date(dateParam); // Se for uma string (tipo 2023-10-01) vai converter pra data (ou seja, se for UTC vira timestamp)
        console.log("Else");
    }

    if (isNaN(date.getTime())) { // Verifica se a data é inválida 
        return res.json({ error: "Invalid Date" }); // Caso for, vai dar erro e dizer que a data é inválida
    }

    function getDiaDaSemana(date) {
        const diasDaSemana = ["Dom", "Seg", "Ter", "Quar", "Qui", "Sex", "Sáb"];
        const data = new Date(date);
        const diaDaSemana = data.getDay();
        return diasDaSemana[diaDaSemana];
    }
    const diaDaSemana = getDiaDaSemana(date); // Chama a função getDiaDaSemana (que ta ali em cima) pra pegar o dia da semana (segunda, terça, etc) e passa a data pra função

    const response = { // Cria um objeto com os dados, horarios, como queira chamar, que vão ser enviados como resposta
        unix: date.getTime(), // Pega o timestamp da data
        utc: date.toUTCString(), // Pega a data no formato UTC (2025-04-01) e transforma em string
        diaSemana: diaDaSemana, 
        utclocal: date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    };
    
    res.json(response); // Envia a resposta em formato JSON
    const now = new Date();
});


app.get('/api/diff/:date1/:date2', (req, res) => { // Define a rota para calcular a diferença entre duas datas
    const parseDate = (param) => { // Função para converter o parâmetro em um objeto Date
        const num = parseInt(param);    // Tenta converter o parametro para um numero
        return isNaN(num) ? new Date(param) : new Date(num); // Se for NaN vai converter para data, e se não for NaN vai converter para data também
    };

    const date1 = parseDate(req.params.date1); // Cria as variáveis date1 e date2, e chama a função parseDate pra converter o parametro em um objeto Date
    const date2 = parseDate(req.params.date2); 

    if (isNaN(date1) || isNaN(date2)) { // Verifica se as datas são inválidas
        return res.json({ error: "Invalid Date(s)" });
    }

    const diff = Math.abs(date2 - date1); // Faz a diferença das duas datas, mas pega o valor absoluto(positivo)
    const seconds = Math.floor(diff / 1000); // tira os milissegundos (convertendo pra segundos) e arredondando pra baixo
    
    res.json({              // Faz os cálculo da diferença entre as datas e manda a resposta em JSON 
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60
    });
});

app.use(express.static(path.join(__dirname, 'public'))); // uma pasta public e coloca os arquivos la dentro, e o express.static faz funcionar 

Resumo:
app.get('/', (req, res) => { // Define a rota principal (ou seja, o caminho que vai abrir quando você entar no site) e vai enviar o index.html (o arquivo que tem o html, css e js)
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Envia o arquivo index.html (o arquivo que tem o html, css e js) para o navegador (ou seja, o que vai aparecer na tela quando você acessar o site)
});

// Iniciar o servidor, qual a porta e da a mensagem do servidor rodando, isso deve ta suave pra entender
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});