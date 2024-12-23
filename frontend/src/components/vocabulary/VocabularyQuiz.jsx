// frontend/src/components/vocabulary/VocabularyQuiz.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Collapse
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import vocabularyService from '../../services/vocabularyService';

const VocabularyQuiz = ({ bookId }) => {
  console.log('VocabularyQuiz component rendering with bookId:', bookId);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log('Fetching quiz for bookId:', bookId);
        const quizData = await vocabularyService.getQuizForBook(bookId);
        console.log('Quiz data received:', quizData);
        if (quizData.questions) {
          setQuestions(quizData.questions);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchQuiz();
    }
  }, [bookId]);

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading quiz questions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No vocabulary words found for this book. Add some vocabulary words to take a quiz!
      </Alert>
    );
  }

  if (quizCompleted) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Score: {score} out of {questions.length}
        </Typography>
        <Typography variant="body1">
          Percentage: {((score / questions.length) * 100).toFixed(1)}%
        </Typography>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Typography variant="subtitle1">
            Score: {score}
          </Typography>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          {currentQuestion?.question}
        </Typography>

        <RadioGroup
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          sx={{ my: 2 }}
        >
          {currentQuestion?.options?.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
              sx={{ mb: 1 }}
              disabled={showFeedback}
            />
          ))}
        </RadioGroup>

        <Collapse in={showFeedback}>
          <Alert 
            severity={answeredCorrectly ? "success" : "error"}
            icon={answeredCorrectly ? <CheckCircle /> : <Cancel />}
            sx={{ mb: 2 }}
          >
            {answeredCorrectly 
              ? "Correct! Well done!" 
              : `Incorrect. The correct answer is: ${currentQuestion?.correctAnswer}`
            }
          </Alert>
        </Collapse>

        <Button
          variant="contained"
          onClick={showFeedback ? handleNextQuestion : handleAnswerSubmit}
          disabled={!selectedAnswer && !showFeedback}
          fullWidth
        >
          {showFeedback 
            ? (currentQuestionIndex + 1 === questions.length ? "Complete Quiz" : "Next Question")
            : "Submit Answer"
          }
        </Button>
      </Card>
    </Box>
  );
};

export default VocabularyQuiz;