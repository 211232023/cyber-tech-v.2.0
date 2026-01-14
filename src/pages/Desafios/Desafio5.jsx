import React, { useState, useEffect } from "react";
import "./Desafio.css";
import { db, auth } from "../../../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Desafio5() {
  const total = 5;
  const corretas = ["b", "b", "a", "a", "a"];

  const [pontuacao, setPontuacao] = useState(0);
  const [respondidas, setRespondidas] = useState(Array(total).fill(false));
  const [feedbacks, setFeedbacks] = useState(Array(total).fill(""));
  const [valores, setValores] = useState(Array(total).fill(""));
  const [salvo, setSalvo] = useState(false);

  const atualizarPlacar = () => `Pontuação: ${pontuacao} / ${total}`;

  const verificar = (num, alternativa) => {
    if (respondidas[num]) return;

    const novasRespondidas = [...respondidas];
    const novosFeedbacks = [...feedbacks];
    const novosValores = [...valores];

    novosValores[num] = alternativa;

    if (alternativa === corretas[num]) {
      novosFeedbacks[num] = "Correto!";
      setPontuacao((prev) => prev + 1);
    } else {
      novosFeedbacks[num] = "Resposta incorreta. (sem nova tentativa)";
    }

    novasRespondidas[num] = true;
    setValores(novosValores);
    setFeedbacks(novosFeedbacks);
    setRespondidas(novasRespondidas);
  };

  const verificarFim = respondidas.every((r) => r);
  const porcentagem = Math.round((pontuacao / total) * 100);

  let msg = "Precisa praticar mais...";
  if (porcentagem >= 85) msg = "Excelente!";
  else if (porcentagem >= 60) msg = "Bom trabalho!";

  useEffect(() => {
    if (verificarFim && !salvo && auth.currentUser) {
      const salvarNoBanco = async () => {
        try {
          await addDoc(collection(db, "pontuacoes"), {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            nome: auth.currentUser.displayName || "Usuário",
            desafio: "Desafio 4 - Funções (Dia e Noite)",
            nota: pontuacao,
            total: total,
            data: new Date().toISOString(),
          });
          setSalvo(true);
        } catch (error) {
          console.error("Erro ao salvar nota:", error);
        }
      };
      salvarNoBanco();
    }
  }, [verificarFim, salvo, pontuacao]);

  const desafios = [
    {
      titulo: "Saudação do Dia",
      codigo: `Qual função retorna "Bom dia!" se a hora for menor que 12, e "Boa noite!" caso contrário?`,
      alternativas: {
        a: `def saudacao():\n    if hora < 12:\n        return "Boa noite!"\n    else:\n        return "Bom dia!"`,
        b: `def saudacao(hora):\n    if hora < 12:\n        return "Bom dia!"\n    else:\n        return "Boa noite!"`,
        c: `def saudacao():\n    print("Bom dia!")`,
        d: `saudacao(hora):\n    return "Bom dia!"`,
      },
    },
    {
      titulo: "Verificar se é Dia",
      codigo: `Qual função retorna True se for dia (entre 6h e 18h) e False se for noite?`,
      alternativas: {
        a: `def eh_dia(hora):\n    return hora < 6`,
        b: `def eh_dia(hora):\n    return hora >= 6 and hora < 18`,
        c: `def eh_dia(hora):\n    print("Dia" if hora < 18)`,
        d: `def eh_dia():\n    return hora >= 6`,
      },
    },
    {
      titulo: "Nascer do Sol",
      codigo: `O que será impresso?\n\ndef nascer_do_sol():\n    return "O sol está nascendo!"\n\nmensagem = nascer_do_sol()\nprint(mensagem)`,
      alternativas: {
        a: `O sol está nascendo!`,
        b: `mensagem`,
        c: `None`,
        d: `Erro`,
      },
    },
    {
      titulo: "Função com parâmetro",
      codigo: `Qual função imprime "É dia claro!" antes das 18h e "Boa noite!" depois?`,
      alternativas: {
        a: `def tempo(hora):\n    if hora < 18:\n        print("É dia claro!")\n    else:\n        print("Boa noite!")`,
        b: `def tempo():\n    if hora < 18:\n        return "É dia claro!"`,
        c: `tempo(hora):\n    print("É dia claro!")`,
        d: `def tempo(hora):\n    print("Boa tarde!")`,
      },
    },
    {
      titulo: "Função sem retorno",
      codigo: `O que acontece?\n\ndef boa_noite():\n    print("Boa noite!")\n\nresultado = boa_noite()\nprint(resultado)`,
      alternativas: {
        a: `Boa noite!\nNone`,
        b: `None`,
        c: `Boa noite!\nBoa noite!`,
        d: `Erro`,
      },
    },
  ];

  return (
    <div className="pagina-desafios">
      {/* PLACAR */}
      <div className="scoreboard">{atualizarPlacar()}</div>

      <h1>Capítulo 01 — Funções: Dia e Noite</h1>
      <p className="subtitle">Assista à aula, veja os materiais e responda os desafios</p>

      {/* 🎥 VÍDEO */}
      <section className="video-container">
        <video
          className="video-player"
          controls
          src="/videos/aula-dia-noite.mp4"
        >
          Seu navegador não suporta vídeo.
        </video>
      </section>

      {/* 📊 SLIDES */}
      <section className="section-two">
        <div className="materiais">
          <h3>Materiais:</h3>
          <iframe
            title="Slides Funções Dia e Noite"
            src="https://www.slideshare.net/slideshow/embed_code/key/4hRTNbQIfzYxpZ"
            width="427"
            height="356"
            scrolling="no"
            allowFullScreen
          />
        </div>
      </section>

      {/* 🧠 DESAFIOS */}
      {desafios.map((d, i) => (
        <div key={i} className="challenge-container">
          <h2>{`Desafio ${i + 1} — ${d.titulo}`}</h2>
          <pre>{d.codigo}</pre>

          <div className="alternativas">
            {Object.entries(d.alternativas).map(([letra, texto]) => (
              <button
                key={letra}
                className={`alternativa-btn ${
                  valores[i] === letra ? "selecionada" : ""
                } ${respondidas[i] ? "bloqueada" : ""}`}
                onClick={() => verificar(i, letra)}
                disabled={respondidas[i]}
              >
                <strong>{letra.toUpperCase()}.</strong>
                <pre>{texto}</pre>
              </button>
            ))}
          </div>

          <div
            className={`feedback ${
              feedbacks[i].includes("Correto") ? "correct" : "incorrect"
            }`}
          >
            {feedbacks[i]}
          </div>
        </div>
      ))}

      {/* 🏁 RESULTADO FINAL */}
      {verificarFim && (
        <div className="final-score">
          {msg} Sua nota final é {pontuacao}/{total} ({porcentagem}%).
          {salvo && (
            <p style={{ color: "green", marginTop: "5px" }}>
              Nota salva com sucesso!
            </p>
          )}
        </div>
      )}

      <div className="navigation-links">
        <Link to="/desafios" className="back-link">⬅ Voltar</Link>
        <Link to="/desafios" className="menu-link">☰ Menu</Link>
        <Link to="/desafios" className="next-link">Próximo ➡</Link>
      </div>
    </div>
  );
}
