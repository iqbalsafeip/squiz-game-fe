import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Auth from './pages/auth';
import io from 'socket.io-client'
import boku from './boku.mp3'



import { FullScreen, useFullScreenHandle } from "react-full-screen";


import { PhoneIcon, AddIcon, WarningIcon, BellIcon, ChatIcon, CheckCircleIcon, StarIcon } from '@chakra-ui/icons'

import {
  ChakraProvider, VStack, Container, HStack, Box, Flex, Spacer, Heading, Input, Button, Text, BeatLoader, FormControl, FormLabel, Select, Skeleton, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Progress,
  InputGroup,
  InputRightElement,
  extendTheme,
  SimpleGrid
} from '@chakra-ui/react'


const theme = extendTheme({
  fonts: {
    heading: "Comfortaa",
    body: "Comfortaa",
  },
})


const socket = io('/')

const audio = new Audio(boku)

function App() {

  const screen2 = useFullScreenHandle();

  const [isAuth, setIsAuth] = useState(false)
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isReady, setIsReady] = useState(false)
  const [notif, setNotif] = useState([]);
  const [isRM, setRM] = useState(false);
  const [soal, setSoal] = useState(null)
  const [dollState, setDollState] = useState('normal')
  const [page, setPage] = useState(1);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState([])
  const [peringkat, setPeringkat] = useState([])
  const [ldperingkat, setLdperingkat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: mOpen, onOpen: mOnOpen, onClose: mClose } = useDisclosure()
  const [pesan, setPesan] = useState('')
  const [roomDetail, setRoomDetail] = useState({})
  const [loadPertanyaan, setLoadPertanyaan] = useState(false)
  const [phase, setPhase] = useState(1);


  const [countDown, setCountDown] = useState(0)
  const [timeleft, setTime] = useState(0);
  const [interval, setIntorpol] = useState(null)

  const [_final, _setFinal] = useState(null);

  useEffect(() => {

    socket.on('username', value => {
      setUsername(value)
      console.log(value);
    })

    socket.on('room', value => {
      setRoom(value)
      console.log(value);
    })



    socket.on('notif', value => {
      setNotif([...notif, value])
      console.log(value);
    })

    socket.on('rm', () => {
      setRM(true)
    })

    socket.on('game-dimulai', (value) => {
      setDollState('tutup')
      audio.play();
      const DURATION = 8;
      setLoadPertanyaan(true);
      setSoal(value.question)
      setTime(0);
      setCountDown(value.duration)
      console.log(value);
      setIsReady(true)
      setTimeout(() => {
        setPhase(2)
        setLoadPertanyaan(false);
        setDollState('normal')

        setIntorpol(setInterval(() => {
          setTime((state) => (state + 0.1));
        }, 100))



      }, 1000 * DURATION)
      // setIsReady(true)
    })


    socket.on('round-end', function(){
      setIsReady(false)
      _setFinal(null)
      setPhase(1);
      setDollState('normal')
    })

  

    // io.to(e.socketMaster).emit('next-round')  


    socket.on('pertanyaan', (value) => {
      setSoal(value)
    })

    socket.on('success-join', code => {
      setCode(code);
      setRoom(code)
      setPage(2);
    })

    socket.on('peringkat', peringkat => {
      setPeringkat(peringkat);
      setLdperingkat(false)
      console.log(peringkat);
    })

    // socket.on('init-pertanyaan', qst => {
    //   console.log(qst);
    // })

    socket.on('msg', msg => {
      console.log(msg);
      setMessage(prevMsg => ([...prevMsg, msg]))

    })

    socket.on('rm', () => {
      setRM(true)
    })


    socket.on('initRoom', (room) => {
      setRoomDetail(room)
    })


  }, [])

  useEffect(() => {
    if (timeleft >= countDown) {
      console.log('anggresan');
      clearInterval(interval)
    }
  }, [timeleft])


  // useEffect(()=>{
  //   window.setInterval(()=>{
  //     setCountDown(state => state + 0.01)
  //   }, 10)

  //   return ()=> {
  //     window.clearInterval()
  //   }
  // },[])


  // useEffect(()=>{
  //   if(page === 2 ){
  //   socket.emit('initlogs')


  //   }
  // }, [page])

  const getDollByState = () => {
    switch (dollState) {
      case 'normal': return <div className="doll-buka" />
      case 'tutup': return <div className="doll-tutup" />
      case 'marah': return <div className="doll-marah" />
      case 'senyum': return <div className="doll-senyum" />
    }
  }

  useEffect(() => {
    if (isOpen) {
      setLdperingkat(true)
      socket.emit('peringkat')
    }
  }, [isOpen])


  const mulaiGame = () => {
    socket.emit('mulai-game')
  }

  const handlePesan = () => {
    socket.emit('msg', { text: pesan })
    setPesan('')
  }

  const doAnswer = (keyAnswer) => {
    _setFinal(keyAnswer)
    if (keyAnswer == soal.key) {
      console.log('betolll');
      setDollState('senyum')
      socket.emit('betul', { timeleft, countDown })
    } else {
      console.log('salaahhh');
      setDollState('marah');
      socket.emit('salah');
    }
  }

  useEffect(() => {

  }, [mOpen])


  return (
    <ChakraProvider theme={theme} >
      {page === 1 && <Auth socket={socket} setUsername={setUsername} setRoom={setRoom} />}
      {page === 2 && (
        <React.Fragment>
          <Container minHeight="full"  >
            <Flex  >
              <Box color="white" bg="#2C3024" borderRadius="xl" padding="5" shadow="lg" width="480px" mt="4"  >
                <HStack justify="space-between" width="max-content" width="100%" >
                  <Button
                    loadingText="Memasuki Room"
                    colorScheme="blackAlpha"
                    fontSize="sm"
                    onClick={onOpen}
                  >
                    Peringkat
                  </Button>
                  <Spacer />
                  <div>
                    <Text fontWeight="bold" colorScheme="blackAlpha" >{room}#{username}</Text>
                    <HStack justify="flex-end" >
                      <i className="bi bi-heart-fill"></i>
                      <i className="bi bi-heart-fill"></i>
                    </HStack>
                  </div>

                </HStack>
              </Box>

            </Flex>
            <Flex>
              <Box color="white" bg="blackAlpha.800" borderRadius="xl" padding="5" shadow="xl" width="480px" mt="4" onClick={mOnOpen} >
                <HStack justify="space-between" width="max-content" width="100%" >
                  <Text fontWeight="bold" colorScheme="blackAlpha" textAlign="center" >{message[message.length - 1]?.type === 'notif' ? <Icon as={BellIcon} /> : <Icon as={ChatIcon} />} {message[message.length - 1]?.text}</Text>
                </HStack>
              </Box>
            </Flex>

            <VStack mt="5px" >
              <Text textColor="white" >{isReady ? timeleft >= countDown ? 'Waktu Berakhir' : 'Dimulai' : 'Belum Mulai!'}</Text>
              <Progress size="md" value={timeleft} colorScheme="blackAlpha" width="full" max={countDown} borderRadius="md" />
              <button onClick={e => setTime(state => state + 1)} >awd</button>
            </VStack>
            <Flex direction="column" alignItems="center" justifyContent="center" >
              {getDollByState('normal')}
              <Box color="white" bg="#2C3024" padding="5" shadow="lg" width="480px" position="absolute" bottom="0px" minHeight="30vh"  >
                {
                  phase === 1 && !loadPertanyaan && (
                    <VStack justifyContent="center" alignItems="center" width="max-content" width="100%"   >
                      <Text>Total Pemain {roomDetail?.players?.length}/10</Text>
                      {isRM ? (
                        <Button
                          loadingText="Memasuki Room"
                          colorScheme="blackAlpha"
                          fontSize="sm"
                          onClick={mulaiGame}
                        >
                          Mulai Game
                        </Button>
                      ) : (
                        <Text>Room Master Belum Memulai Game</Text>
                      )}

                    </VStack>
                  )
                }
                {
                  phase === 2 && !loadPertanyaan && (
                    <Container justifyContent="center" alignItems="center" width="max-content" width="100%" >
                      <Text fontSize="12px" >{soal?.pertanyaan}</Text>
                      <SimpleGrid columns={2} spacing={3} marginTop={3}>
                        {soal?.answer?.map((p, i) => (
                          <Button
                            loadingText="Memasuki Room"
                            colorScheme={_final === i ? dollState === 'senyum' ? 'green' : 'red' : 'blackAlpha'}
                            fontSize="12px"
                            key={i}
                            onClick={e => doAnswer(i)}
                            disabled={_final || timeleft >= countDown}
                          >
                            {p}
                          </Button>
                        ))}

                      </SimpleGrid>
                    </Container>
                  )
                }
                {
                  loadPertanyaan && (
                    <Container>
                      <Text>Loading..</Text>
                    </Container>
                  )
                }

              </Box>
            </Flex>




          </Container>

        </React.Fragment>
      )}
      {/* <div className="game-container">
        <div className="header shadow">
          <button className="btn-game shadow">Peringkat</button>
          <div className="own">
            <div className="nick">
              <span>{room}</span>
              <span>#{username}</span>
              <span>#2</span>
            </div>
            <progress />
          </div>
        </div>
        {notif.length > 0 && <div className="notif">
          <div>Notif :<span>{notif[notif.length - 1]}</span></div>
        </div>} */}
      {/* <div className="countdown">
        <p>Permainan Belum Dimulai</p>
      </div> */}
      {/* {getDollByState()} */}
      {/* <div className="user-count">
        3 dari 10 Orang tersisa!
      </div> */}

      {/* {isRM && !isReady && <div className="game-box">
          <button onClick={mulaiGame} >Mulai Game</button>
        </div>}

        {!isRM && !isReady && <div className="game-box" >Room Master Belum memulai game</div>}
        {isReady && <div className="game-box" >Game Dimulai</div>}

        {soal && <div className="game-box">
          <div className="question">
            <p>{soal.pertanyaan}</p>
          </div>
          <div className="answer-box">
            {soal.answer.map(ans => (
              <button className="btn-answer">{ans}</button>
            ))}
          </div>
        </div>}
      </div> */}
      <Modal isOpen={isOpen} onClose={onClose} colorScheme="blackAlpha" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Peringkat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {ldperingkat ? (
              <VStack spacing="10px">
                {Array(10).fill([]).map((_, i) => (
                  <Skeleton width="sm" height="40px" key={i} />
                ))}
              </VStack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Username</Th>
                    <Th>Score</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {peringkat.map((d, i) => (
                    <Tr key={i}>
                      <Td>{i + 1}</Td>
                      <Td>{d.name} {d.isRM && <Icon as={StarIcon} />}</Td>
                      <Td >{d.score}</Td>
                    </Tr>
                  ))}
                </Tbody>

              </Table>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blackAlpha" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={mOpen} onClose={mClose} colorScheme="blackAlpha" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pesan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {message.length === 0 ? (
              <VStack spacing="10px" color="black" >
                <Text>Belum Ada Pesan</Text>
              </VStack>
            ) : (
              <VStack justifyContent="flex-start" alignItems="flex-start" maxHeight="50vh" minHeight="50vh" overflowY="scroll"  >
                {message.map((m, i) => (
                  <Box key={i} >{m.type === 'notif' ? <Icon as={BellIcon} /> : <Icon as={ChatIcon} />} {m.text}</Box>
                ))}
              </VStack>
            )}
            <InputGroup size="md" mt="3" >
              <Input
                pr="4.5rem"
                placeholder="Masukan Pesan"
                onChange={e => setPesan(e.target.value)}
                value={pesan}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handlePesan} >
                  Kirim
                </Button>
              </InputRightElement>
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blackAlpha" onClick={mClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default App;
