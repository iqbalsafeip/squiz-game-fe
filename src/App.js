import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Auth from './pages/auth';
import io from 'socket.io-client'
import boku from './boku.mp3'
import tiktok from './tiktok.mp3';
import beresSound from './beres.mp3';
import salahSound from './false.mp3';
import benarSound from './true.mp3';
import winSound from './win.mp3'
import bgmSound from './bgm.mp3';

import { BellIcon, ChatIcon, StarIcon } from '@chakra-ui/icons'

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

  Icon,
  Progress,
  InputGroup,
  InputRightElement,
  extendTheme,
  SimpleGrid,
  Avatar
} from '@chakra-ui/react'


import bapa from './profile/bapa.png'
import ibu from './profile/ibu.png'
import aa from './profile/aa.png'
import tth from './profile/tth.png'

const getAvatar = (id) => {
  switch (id) {
    case 0: return bapa;
    case 1: return ibu;
    case 2: return aa;
    case 3: return tth;
    default: return bapa;
  }
}


const theme = extendTheme({
  fonts: {
    heading: "Comfortaa",
    body: "Comfortaa",
  },
})


const socket = io('/')

const audio = new Audio(boku);
const tiktokSound = new Audio(tiktok);
const benar = new Audio(benarSound);
const salah = new Audio(salahSound);
const beres = new Audio(beresSound);
const win = new Audio(winSound);
const bgm = new Audio(bgmSound);


function App() {

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
  const [avatar, setAvatar] = useState(0);


  const [countDown, setCountDown] = useState(0)
  const [timeleft, setTime] = useState(0);
  const [interval, setIntorpol] = useState(null)

  const [_final, _setFinal] = useState(null);


  



  useEffect(() => {
    bgm.play();

    socket.on('initSelfData', value => {
      setUsername(value.username)
      setAvatar(value.avatar)
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
      setLoadPertanyaan(true);
      setSoal(value.question)
      setTime(0);
      setCountDown(value.duration)
      console.log(value);
      setIsReady(true)
      bgm.pause()
      bgm.currentTime = 0;

      // setIsReady(true)
    })


    socket.on('round-end', function () {
      setIsReady(false)
      _setFinal(null)
      setPhase(1);
      setDollState('normal')
      tiktokSound.pause();
      tiktokSound.currentTime = 0;
      beres.play();
    })

    socket.on('countdown', val => {
      console.log(val);
      setTime((time) => val);
    })

    socket.on('round-start', () => {
      tiktokSound.play();
      setPhase(2)
      setLoadPertanyaan(false);
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

    socket.on('game-end', () => {
      onOpen(true);
      setPhase(5)
      win.play();
      tiktokSound.pause()
      tiktokSound.currentTime = 0
    })


  }, [])

  // useEffect(() => {
  //   if (timeleft >= countDown) {
  //     console.log('anggresan');
  //     clearInterval(interval)
  //   }
  // }, [timeleft])


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
      benar.play();
      socket.emit('betul', { timeleft, countDown })
    } else {
      console.log('salaahhh');
      setDollState('marah');
      socket.emit('salah');
      salah.play();
    }
  }

  const doOutRoom = () => {
    socket.emit('keluar-room')
    setRoom(null)
    setRoomDetail(null)
    setRM(false)
    setPage(1)
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
            </VStack>
            <Flex direction="column" alignItems="center" justifyContent="center" >
              {getDollByState('normal')}
              <Box color="white" bg="#2C3024" padding="5" shadow="lg" width="480px" position="absolute" bottom="0px" minHeight="30vh"  >
                {
                  phase === 1 && !loadPertanyaan && (
                    <VStack justifyContent="center" alignItems="center" width="max-content" width="100%"   >
                      <Text>Total Pemain {roomDetail?.players?.length}/{roomDetail.max}</Text>
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
                        <React.Fragment>
                          <Text>Room Master Belum Memulai Game</Text>
                          {/* <Button onClick={doOutRoom} >Keluar Room</Button> */}
                        </React.Fragment>
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
                            disabled={_final !== null || timeleft >= countDown}
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
        <ModalContent backgroundColor={'blackAlpha'} >
          <ModalHeader>Peringkat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <React.Fragment>
              <HStack justifyContent={'space-evenly'} alignItems={'flex-end'} marginBottom={4} >
                <VStack textAlign={'center'} justifyContent={'center'} alignItems={'center'}>
                  <Avatar size='xl' src={getAvatar(peringkat[1]?.avatar)} />
                  <Text fontSize={18} fontWeight={'bold'}  >No. 2</Text>
                  <Text fontSize={16} fontWeight={'bold'}  >{peringkat[1]?.name || 'Kosong'}</Text>
                  <Text fontSize={14}>{peringkat[1]?.score || '0'}</Text>
                </VStack>
                <VStack textAlign={'center'} justifyContent={'center'} alignItems={'center'}  >
                  <Avatar size='2xl' src={getAvatar(peringkat[0]?.avatar)} border={'5px'} borderStyle={'solid'} borderColor={'green.200'} />
                  <Text fontSize={20} fontWeight={'bold'}  >No. 1</Text>
                  <Text fontSize={18} fontWeight={'bold'} >{peringkat[0]?.name || 'Kosong'}</Text>
                  <Text fontSize={16}>{peringkat[0]?.score || '0'}</Text>
                </VStack>
                <VStack textAlign={'center'} justifyContent={'center'} alignItems={'center'}>
                  <Avatar size='xl' src={getAvatar(peringkat[2]?.avatar)} />
                  <Text fontSize={18} fontWeight={'bold'}  >No. 3</Text>
                  <Text fontSize={16} fontWeight={'bold'}  >{peringkat[2]?.name || 'Kosong'}</Text>
                  <Text fontSize={14}>{peringkat[2]?.score || '0'}</Text>
                </VStack>
              </HStack>
              {ldperingkat ? (
                'membuat..'
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr >
                      <Th>No</Th>
                      <Th>Username</Th>
                      <Th>Score</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {peringkat.map((d, i) => !([0, 1, 2].includes(i)) && (
                      <Tr key={i}  >
                        <Td>{i + 1}</Td>
                        <Td>
                          <HStack justifyContent={'flex-start'} spacing={5} alignItems={'center'}  >
                            <Avatar size='sm' src={getAvatar(d.avatar)} />
                            <Text>{d.name} {d.isRM && <Icon as={StarIcon} />}</Text>
                          </HStack>
                        </Td>
                        <Td >{d.score}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </React.Fragment>
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
