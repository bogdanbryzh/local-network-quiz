import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBible } from '@fortawesome/free-solid-svg-icons';

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
  const [usernameGot, setUsernameGot] = useState(false);

  // User info
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(parseInt(cookies.get('userScore')) || 0);
  const [resultID, setResultID] = useState(cookies.get('resultID') || null);

  // Questions
  const [presentInCache, setPresentInCache] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false);

  // Quiz activities
  const [currentQuestion, setCurrentQuestion] = useState(
    parseInt(cookies.get('current-question')) || 0
  );

  const [logs, setLogs] = useState('');
  const [loader, setLoader] = useState('loader');

  // get user states
  useEffect(() => {
    setUsername(quizStorage.getItem('username') || '');

    console.log(username);
    if (username) {
      setLogged(true);
    }
  }, [username]);

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

    clearTimeout(window.nextQ);
    window.nextQ = setTimeout(() => {
      console.log('currr', currentQuestion);
      if (currentQuestion !== 0) {
        console.log('currrr', currentQuestion, typeof currentQuestion);
        if (currentQuestion === 99) {
          setIsAlreadyFinished(true);
        } else {
          setCurrentQuestion(currentQuestion + 1);
        }
      }
    }, 40000);
  }, [currentQuestion]);

  useEffect(() => {
    setLoader('empty');

    setTimeout(() => {
      setLoader('loader');
    }, 10);
  }, [currentQuestion]);

  useEffect(() => {
    if (username && score > 0) {
      if (resultID) {
        setLogs(`sending ${score} to ${resultID}`);
        axios.put(`/results/${resultID}`, {
          username,
          score,
        });
      } else {
        axios
          .post('/results', {
            username,
            score,
          })
          .then(response => {
            setResultID(response.data._id);
            cookies.set('resultID', response.data._id);
          })
          .catch(err => console.log(err));
      }
    }
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
        axios
          .put(`/results/${resultID}`, {
            username,
            score,
          })
          .catch(err => console.log(err));
      }
    }
  }, [isAlreadyFinished, username, score]);

  // Login activity
  // const handleInput = event => {
  //   setUsername(event.target.value);
  // };

  // const handleLogin = event => {
  //   event.preventDefault();
  //   if (username.length > 0) {
  //     setLogged(true);
  //     cookies.set('username', username.trim());
  //     cookies.set('userLogged', true);
  //   }
  // };

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

  // const cleanUp = e => {
  //   e.preventDefault();
  //   const allCookies = cookies.getAll();
  //   for (const cookie in allCookies) {
  //     cookies.remove(cookie);
  //   }
  //   quizStorage.clear();
  // };

  return (
    <>
      {/* <div className='dev'>
        <button onClick={cleanUp}>log out</button>
      </div> */}
      <div className='logo'>
        <FontAwesomeIcon icon={faBible} size='lg' />
        <p>Біблійна сотня</p>
      </div>
      <div className='console'>
        <p id='logger'>{logs}</p>
      </div>
      {logged ? (
        <>
          {isAlreadyFinished ? (
            <>
              <div className='center-vert'>
                {score / questions.length < 0.33 ? (
                  <>
                    <h1>Що ж... Наступного разу пощастить{')'}</h1>
                    <p>
                      Набрано {score} балів зі {questions.length}.
                    </p>
                  </>
                ) : (
                  <>
                    <h1>Чудовий раунд!</h1>
                    <p>
                      Набрано {score} балів зі {questions.length}!
                    </p>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {loader && (
                <div className='progress-bar'>
                  <div className={loader}></div>
                </div>
              )}
              <h1>Привіт, {username}!</h1>
              <div className='qw'>
                <section className='questions'>
                  {isQuestionsLoaded ? (
                    questions.length > 0 ? (
                      <>
                        <p className='count'>
                          <span>{currentQuestion + 1}</span>/{questions.length}
                        </p>
                        <p className='question'>
                          {questions[currentQuestion].question}
                        </p>
                        {
                          <div className='answers'>
                            {shuffleArray(
                              questions[currentQuestion].answers
                            ).map(answer => (
                              <button
                                key={Math.random().toString(36).substring(2)}
                                onClick={() => handleAnswer(answer.isAnswer)}
                              >
                                {answer.text}
                              </button>
                            ))}
                          </div>
                        }
                      </>
                    ) : (
                      <>
                        <h1>Доволі пусто, хммм</h1>
                      </>
                    )
                  ) : (
                    <>
                      <p>Завантаження...</p>
                    </>
                  )}
                </section>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className='center-vert'>
            <h1>Вітаємо!</h1>
            {/* <form onSubmit={handleLogin}>
              <input
                type='text'
                // placeholder='Твоє ймення'
                // onChange={handleInput}
              />
              <input type="text"/>
              <input type='submit' value='Поїхали!' />
            </form> */}
          </div>
        </>
      )}
    </>
  );
};

export default Quiz;
