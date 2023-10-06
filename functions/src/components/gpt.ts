import { OpenAI } from "langchain/llms/openai"
import { APIChain } from "langchain/chains"
import { PromptTemplate } from "langchain/prompts"

export class GPT {

    private question: string;
    private DOC = `
        Dane o produktach: https://www.ceneo.pl/OpenSearch/SuggestHtmlJqueryJson?q={nazwa produktu}
        
        Parametry:
        nazwa produktu: string - nazwa produktu
        `

        // Korzystając z tej dokumentacji, wygeneruj pełny adres URL do wywołania w celu odpowiedzi na pytanie użytkownika.
        // Powinieneś zbudować adres URL w taki sposób, aby uzyskać odpowiedź możliwie jak najkrótszą, jednocześnie uzyskując niezbędne informacje do odpowiedzi na pytanie.
        // Zwróć uwagę, aby celowo pomijać wszelkie zbędne fragmenty danych podczas wywołania.

    API_URL_RAW_PROMPT_TEMPLATE = `
        {api_docs}

        Korzystając z tej dokumentacji, wygeneruj pełny adres URL do wywołania w celu znalezienia danych produktu pasującego do pytania użytkownika.
        Jeśli pytanie dotyczy najnowszego/nowego/ostatniego/tegorocznego produktu, odpytaj API o produkt bez podania modelu, API zwróci listę najnowszych produktów.

        Pytanie:{question}
        API url:
        `;

    API_URL_PROMPT_TEMPLATE = /* #__PURE__ */ new PromptTemplate({
        inputVariables: ["api_docs", "question"],
        template: this.API_URL_RAW_PROMPT_TEMPLATE,
    });

    API_RESPONSE_RAW_PROMPT_TEMPLATE = `
        
        ${this.API_URL_RAW_PROMPT_TEMPLATE}
        
        {api_url}

        Odpowiedz na pytanie użytkownika następnie na podstawie danych o produkcie:

        {api_response}

        Zaproponuj maksymalnie trzy produkty pasujące do pytania użytkownika, jeśli pytanie dotyczy jednego produktu, zaproponuj tylko ten produkt.
        Do każdego produktu dodaj zdanie zachęcające do zakupu, jeśli produkt posiada cenę umieść ją w opisie.
        W odpowiedzi umieść link do kategorii w której można znaleźć produkt, link powinien być umieszczony w osobnym tagu HTML <a>nazwa kategorii</a> z atrybutem href ustawionym na link do kategorii zaczynając od https://www.ceneo.pl/
        Produkt powinien być umieszczony w osobnym tagu HTML <a>nazwa produktu</a> z atrybutem href ustawionym na link do produktu zaczynając od https://www.ceneo.pl/

        Odpowiedź:`;


    API_RESPONSE_PROMPT_TEMPLATE = /* #__PURE__ */ new PromptTemplate({
        inputVariables: ["api_docs", "question", "api_url", "api_response"],
        template: this.API_RESPONSE_RAW_PROMPT_TEMPLATE,
    });

    constructor(question: string) {
        this.question = question;
    }

    private openai: OpenAI = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo",
        temperature: 0.1,
    });

    private chain: APIChain =  APIChain.fromLLMAndAPIDocs(this.openai, this.DOC, {
        headers: {

        },
        apiUrlPrompt: this.API_URL_PROMPT_TEMPLATE,
        apiResponsePrompt: this.API_RESPONSE_PROMPT_TEMPLATE,
    })

    public async getAnswer() {
        return await this.chain.call({question: this.question});
    }
}