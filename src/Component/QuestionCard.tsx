import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, CardContent, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Word } from "./Word";
import { Answer } from "./Answer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { equal, notEqual } from "assert";

const QuestionCard = React.memo(({ word, OnChangeAnswer, style }: { word: Word; OnChangeAnswer: (answer: Answer) => void; style: object; }) => {
  const [answer, setAnswer] = useState<Answer>({
    id: word.ID,
    color: "black",
    text: "未回答",
    value: "",
    isAnswer: false,
    isCorrect: false,
  });

  const checkAnswerColor = useCallback((newValue: string) => {
    const answerStr = newValue.trim().toLowerCase();
    const correctStr = word.Japanese.toLowerCase();

    const newAnswer = (answerStr === correctStr)
      ? { ...answer, color: "green", text: "✔ 正解！", value: newValue, isCorrect: true, isAnswer: true }
      : (correctStr.includes(answerStr) && newValue !== "")
      ? { ...answer, color: "purple", text: "🔺 部分正解", value: newValue, isCorrect: false, isAnswer: true }
      : { ...answer, color: "red", text: "❌ 不正解", value: newValue, isCorrect: false, isAnswer: true };

    if (JSON.stringify(answer) !== JSON.stringify(newAnswer)) { // ✅ 前回値と比較
      setAnswer(newAnswer);
    }
  }, [answer, OnChangeAnswer]);

  return (
    <Card style={style}>
      <CardContent>
        <Typography variant="h6">単語: {word.English}</Typography>
        <TextField
          fullWidth
          value={answer.value}
          onBlur={() =>{OnChangeAnswer(answer);}}
          onChange={(e) => checkAnswerColor(e.target.value)}
        />
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">答えを表示</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1">{word.Japanese}</Typography>
            </AccordionDetails>
        </Accordion>
        <Typography variant="body1" color={answer.color}>
          {answer ? (answer.text) : ""}
        </Typography>
      </CardContent>
    </Card>
  );
});

export default QuestionCard;