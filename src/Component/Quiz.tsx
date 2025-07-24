import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Word } from "./Word";
import { Answer } from "./Answer";
import QuestionCard from "./QuestionCard";
import { apiURL } from "./ConstConfig";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Word[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const fetchQuestions = async () => {
        const response = await fetch(`${apiURL}/quiz`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "rawPath": "/quiz",
              "method": "POST"
            }),
          });
        console.log("クイズ情報取得完了");
        const data: Word[] = await response.json();
        console.log("クイズ情報整理中");
        console.log(data);
        setQuestions(data);
        //answer初期化
        const answersList: Answer[] = [];
        data.forEach(element => {
          answersList.push({id: element.ID, color:"", text:"", value:"", isAnswer: false, isCorrect: false} as Answer);
        });
        setAnswers(answersList);
        setIsLoad(true);
     }

  //更新関数
  const AnswerUpdater = async (answer: Answer)=>{
    console.log("回答更新:");
    console.log(answer);
    const newAnswerList : Answer[] = answers;
    newAnswerList.push(answer);
    setAnswers(newAnswerList);
  }

  //提出
  const handleSubmit = async () => {
    try {
      var targetWords = [] as Array<Word>
      //正解していないし、回答してもないものを残す
      var targetIdList = answers.filter(x => x.isCorrect).map(x => x.id);
      console.log(targetIdList);
      console.log(questions);
      //残したものはこれからも復習する
      questions.forEach(x => {
        if(targetIdList.includes(x.ID)){
           targetWords.push(x)
        }
      })
      console.log(targetWords);

      const response = await fetch(`${apiURL}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({answers : targetWords, rawPath : '/submission', method: 'POST' }),
      });

      if (response.ok) {
        alert("送信成功！ページを更新します。");
        //window.location.reload();
      } else {
        alert("送信失敗...");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("エラーが発生しました");
    }
  };
  if(isLoad){
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        英単語テスト
      </Typography>
      {questions.map((q, index) => (
        <QuestionCard style={{margin: "10px 20px",}} key={index} word={q} OnChangeAnswer={AnswerUpdater} />
      ))}
    <Button
        onClick={handleSubmit}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        提出
    </Button>
    </Container>
  );
  }else{
    return(
    <Button
        onClick={fetchQuestions}
        style={{
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        テスト開始
    </Button>
    );
  }

};

export default Quiz;
