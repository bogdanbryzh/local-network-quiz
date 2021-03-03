import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const quizStorage = window.localStorage;

const Quiz = () => {
  // Defining app states
  const [logged, setLogged] = useState(false);
  const [isAlreadyFinished, setIsAlreadyFinished] = useState(false);

  // User info
  const [username, setUsername] = useState(cookies.get('username') || '');
  const [score, setScore] = useState(parseInt(cookies.get('userScore')) || 0);

  // Questions
  const [presentInCache, setPresentInCache] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false);

  // Quiz activities
  const [currentQuestion, setCurrentQuestion] = useState(
    parseInt(cookies.get('current-question')) || 0
  );

  // get user states
  useEffect(() => {
    setLogged(cookies.get('userLogged') || false);
  }, []);

  useEffect(() => {
    setIsAlreadyFinished(!!cookies.get('isAlreadyFinished'));
  }, []);

  useEffect(() => {
    const cachedQuiz = quizStorage.getItem('originalQuiz');
    if (cachedQuiz) {
      setPresentInCache(true);
      setIsQuestionsLoaded(true);
      setQuestions(JSON.parse(cachedQuiz));
    } else {
      setPresentInCache(false);
    }
  }, []);

  useEffect(() => {
    cookies.set('current-question', currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    cookies.set('userScore', score);
  }, [score]);

  // Loading question
  useEffect(() => {
    !presentInCache &&
      axios
        .get('/questions')
        .then(res => {
          const questionsShuffled = shuffleArray(res.data);
          quizStorage.setItem(
            'originalQuiz',
            JSON.stringify(questionsShuffled)
          );
          setQuestions(questionsShuffled);
          setIsQuestionsLoaded(true);
        })
        .catch(err => console.log(err));
  }, [presentInCache]);

  // Submit result
  useEffect(() => {
    if (isAlreadyFinished) {
      if (!cookies.get('submitted')) {
        cookies.set('submitted', true);
        console.log('finishing....');
        console.log(score);
        axios.post('/results/submit', {
          username,
          score,
        });
      }
    }
  }, [isAlreadyFinished, username, score]);

  // Login activity
  const handleInput = event => {
    setUsername(event.target.value);
  };

  const handleLogin = event => {
    event.preventDefault();
    if (username.length > 0) {
      setLogged(true);
      cookies.set('username', username.trim());
      cookies.set('userLogged', true);
    }
  };

  // Quiz activity
  const handleFinishQuiz = () => {
    cookies.set('isAlreadyFinished', true);
    cookies.set('userScore', score);
    setIsAlreadyFinished(true);
  };

  const handleAnswer = isAnswer => {
    if (isAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      handleFinishQuiz();
    }
  };

  // Dev

  const clearCookies = () => {
    const allCookies = cookies.getAll();
    for (const cookie in allCookies) {
      cookies.remove(cookie);
    }
  };

  const clearStorage = () => {
    quizStorage.clear();
  };

  return (
    <>
      <div className='dev'>
        <button onClick={clearCookies}>Clear cookies</button>
        <button onClick={clearStorage}>Clear storage</button>
      </div>
      {logged ? (
        <>
          {isAlreadyFinished ? (
            <>
              <div className='center-vert'>
                {score / questions.length < 0.33 ? (
                  <h1>Well...</h1>
                ) : (
                  <h1>Nice game!</h1>
                )}
                <p>
                  You got {score} points out of {questions.length} questions!
                </p>
              </div>
            </>
          ) : (
            <>
              <h1>Hello, {username}!</h1>
              <section className='questions'>
                {isQuestionsLoaded ? (
                  (console.log(questions.length),
                  questions.length > 0 ? (
                    <>
                      <p className='count'>
                        <span>{currentQuestion + 1}</span>/{questions.length}
                      </p>
                      <p className='question'>
                        {questions[currentQuestion].question}
                      </p>
                      <div className='answers'>
                        {shuffleArray(questions[currentQuestion].answers).map(
                          answer => (
                            <button
                              key={Math.random().toString(36).substring(2)}
                              onClick={() => handleAnswer(answer.isAnswer)}
                            >
                              {answer.text}
                            </button>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h1>Nothing here</h1>
                    </>
                  ))
                ) : (
                  <>
                    <p>Loading...</p>
                  </>
                )}
              </section>
            </>
          )}
        </>
      ) : (
        <>
          <div className='center-vert'>
            <h1>Welcome!</h1>
            <form onSubmit={handleLogin}>
              <input
                type='text'
                placeholder='Your name'
                onInput={handleInput}
              />
              <input type='submit' value='Go ahead!' />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Quiz;
