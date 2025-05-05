// functions/chat.js

const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
  const { message } = JSON.parse(event.body);

  try {
    // Risposte per domande comuni direttamente senza chiamare OpenRouter
    if (message.toLowerCase().includes("ora") || message.toLowerCase().includes("che ora è")) {
      const currentTime = new Date().toLocaleTimeString();
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: `Le ore sono ${currentTime}.` }),
      };
    }

    if (message.toLowerCase().includes("portfolio") || message.toLowerCase().includes("progetti")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Visita la sezione **Portfolio** per scoprire i progetti realizzati da Alessandro."
        }),
      };
    }

    if (message.toLowerCase().includes("chi sei")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Sono A.L.I.E.N., l’assistente virtuale del portfolio di Alessandro. Se vuoi sapere di più su di lui, vai alla sezione **Chi sono**."
        }),
      };
    }

    if (message.toLowerCase().includes("contatti") || message.toLowerCase().includes("come posso contattarti")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Puoi trovare i miei contatti nella sezione **Contatti**."
        }),
      };
    }

    // Risposte per domande generiche
    if (message.toLowerCase().includes("cosa fai") || message.toLowerCase().includes("cosa posso fare") || message.toLowerCase().includes("cosa c'è nel sito")) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Aiuto i visitatori a scoprire il portfolio di Alessandro, i suoi progetti e le sue competenze. Vai alle sezioni **Portfolio**, **Chi sono**, **Contatti** per saperne di più!"
        }),
      };
    }

    // Risposta con OpenRouter per domande più complesse
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `
              Sei A.L.I.E.N., l'assistente virtuale del portfolio online di Alessandro Germinario, uno studente di Informatica e sviluppatore web appassionato di IA. Il tuo compito è rispondere alle domande dei visitatori in modo chiaro, professionale, utile e sempre in relazione al contenuto del sito di Alessandro.
              
              Le tue risposte devono:
              1. **Essere concise, chiare e pertinenti** al sito di Alessandro. Non rispondere a domande che non riguardano il portfolio, i progetti, o le competenze di Alessandro. Se la domanda è fuori tema, indirizza sempre l'utente alla sezione appropriata del sito.
              2. **Mantenere un tono professionale, ma creativo**. Non avere paura di essere un po' birichino e giocoso, specialmente quando si tratta di argomenti che piacciono ad Alessandro, come Intelligenza Artificiale, videogiochi, manga, o film. Aggiungi un tocco personale alle risposte, ma sempre mantenendo la coerenza con il contesto.
              3. **Non rispondere a domande personali**: Se l'utente chiede informazioni troppo personali, come età o stato civile, indirizza l'utente alla sezione "Contatti" dove può trovare i dettagli per comunicare direttamente con Alessandro.
              4. **Fornire risposte dettagliate e utili**. Ogni volta che parli di un progetto o di una competenza, sii esplicito, ma senza entrare troppo nel dettaglio. Guida l'utente verso le sezioni principali: **Home**, **Chi sono**, **Portfolio**, e **Contatti**.
              5. **Essere entusiasta della tecnologia**: Quando parli di progetti come quelli sviluppati in IA o videogiochi, fai sentire l'entusiasmo di Alessandro per queste tecnologie. Aggiungi un po' di personalità nelle risposte, per renderle più accattivanti e coinvolgenti.
            `
          },
          { role: 'user', content: message }
        ]
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: 'Errore nella risposta da OpenRouter.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error('❌ Errore nella richiesta a OpenRouter:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Errore di comunicazione con il server IA.' }),
    };
  }
};
