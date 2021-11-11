import React, { useEffect, useState } from 'react'

import { VStack, Container, HStack, Box, Flex, Spacer, Heading, Input, Button, Text, BeatLoader, FormControl, FormLabel, Select, Skeleton } from '@chakra-ui/react'



const Auth = props => {
    const [data, setData] = useState({
        username: '',
        isBuat: false,
        isJoin: false,
        isAuth: false,
        jml: undefined,
        roomName: '',
    });


    const [room, setRoom] = useState([]);

    const [isLoading, setLoading] = useState(false);

    const [step, setStep] = useState(1);

    const setUserName = () => {
        setLoading(true);
        props.socket.emit('setUsername', data.username);
    }

    const buatRoom = () => {
        props.socket.emit('buatRoom', data.jml)
    }

    const joinRoom = () => {
        props.socket.emit('joinRoom', data.roomName)
    }

    const masukRoom = code => {
        console.log(code);
        setRoom(state => {
            let temp = []
            temp = state.map(e => e.code === code ? {...e, isLoading: true, isDisabled: true} : {...e, isDisabled: true})
            return temp;
        })
        props.socket.emit('masukRoom', code);
    }



    React.useEffect(() => {
        if (step === 4) {
            setLoading(true)
            props.socket.emit('getAllRoom')
        }
    }, [step])

    React.useEffect(() => {
        props.socket.on('username', (d) => {
            setData({ ...data, username: d })
            console.log(d);
            setLoading(false);
            setStep(2);
            props.setUsername(d)

        })

        

        props.socket.on('sendRoom', room => {
            setLoading(false)
            setRoom(room);

        })
    }, [])

    return (
        <Container maxW="container.sm" minHeight="full" >
            <VStack align="center" justify="center" height="100vh" spacing="80px" >
                <Heading color="white" >Squiz Game</Heading>
                {
                    step === 1 && (
                        <Box color="white" bg="#2C3024" borderRadius="md" padding="5" shadow="xl" width="xs" >
                            <VStack spacing="10px" >
                                <Text fontSize="12" >Masukan Username Terlebih dahulu</Text>

                                <Input placeholder="Masukan Username.." size="sm" colorScheme="blackAlpha" onChange={(e) => setData({ ...data, username: e.target.value })} />
                                <Button
                                    isLoading={isLoading}
                                    loadingText="Masuk.."
                                    colorScheme="blackAlpha"
                                    fontSize="sm"
                                    onClick={setUserName}
                                    value={data.username}
                                >
                                    Masuk
                                </Button>
                            </VStack>
                        </Box>
                    )
                }

                {
                    step === 2 && (
                        <Box color="white" bg="#2C3024" borderRadius="md" padding="5" shadow="xl" width="xs">
                            <VStack spacing="10px" >
                                <Text>Hai {data.username}</Text>
                                <Button
                                    isLoading={isLoading}
                                    loadingText="Submitting"
                                    colorScheme="blackAlpha"
                                    fontSize="sm"
                                    onClick={() => setStep(3)}
                                    isFullWidth
                                >
                                    Buat Room
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    loadingText="Submitting"
                                    colorScheme="blackAlpha"
                                    fontSize="sm"
                                    onClick={() => setStep(4)}
                                    isFullWidth
                                >
                                    Masuk Room
                                </Button>
                            </VStack>
                        </Box>
                    )
                }

                {
                    step === 3 && (
                        <Box color="white" bg="#2C3024" borderRadius="md" padding="5" shadow="xl" width="xs" >
                            <Button
                                isLoading={isLoading}
                                loadingText="Submitting"
                                colorScheme="blackAlpha"
                                fontSize="sm"
                                onClick={() => setStep(2)}
                                mb="3"
                            >
                                Kembali
                            </Button>
                            <VStack spacing="10px" >
                                <FormControl >
                                    <FormLabel>Jumlah Pemain</FormLabel>
                                    <Select placeholder="Jumlah Pemain" variant="filled" color="black" >
                                        <option>3</option>
                                        <option>5</option>
                                        <option>10</option>
                                    </Select>
                                </FormControl>
                                <FormControl >
                                    <FormLabel>Kategori</FormLabel>
                                    <Select placeholder="Kategori" variant="filled" color="black" >
                                        <option>Umum</option>
                                        <option>Olahraga</option>
                                        <option>Film</option>
                                    </Select>
                                </FormControl>
                                <Button
                                    isLoading={isLoading}
                                    loadingText="Submitting"
                                    colorScheme="blackAlpha"
                                    fontSize="sm"
                                    onClick={() => setStep(4)}
                                >
                                    Buat Room
                                </Button>
                            </VStack>
                        </Box>
                    )
                }

                {
                    step === 4 && (
                        <Box color="white" bg="#2C3024" borderRadius="md" padding="5" shadow="xl" >
                            <Button
                                loadingText="Submitting"
                                colorScheme="blackAlpha"
                                fontSize="sm"
                                onClick={() => setStep(2)}
                                mb="3"
                            >
                                Kembali
                            </Button>
                            <VStack spacing="10px" maxHeight="50vh" overflowX="hidden" overflowY="scroll" overscrollY="none"  >
                                {isLoading ? (
                                    Array(3).fill([]).map((_, i) => (
                                        <Skeleton height="100px" width="xs" colorScheme="blackAlpha" shadow="xl" key={i} />
                                    ))
                                ) : (
                                    room.map((d,i)=> (
                                        <Box color="white" width="xs" bgColor="blackAlpha.300" borderRadius="md" padding="5" shadow="xl" key={i} >
                                            <VStack width="full" spacing="40px" >
                                                <HStack justify="space-between" width="max-content" width="100%" >
                                                    <Text>{d.name}</Text>
                                                    <Spacer />
                                                    <Text>{d.players.length}/{d.max}</Text>
                                                </HStack>
                                                <HStack justify="space-between" width="max-content" width="100%" >
                                                    <Text>Kategori : {d.category}</Text>
                                                    <Button
                                                        isLoading={d.isLoading}
                                                        loadingText="Memasuki Room"
                                                        colorScheme="blackAlpha"
                                                        fontSize="sm"
                                                        onClick={() => masukRoom(d.code)}
                                                        disabled={d.isDisabled}
                                                    >
                                                        Masuk Room
                                                    </Button>
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    ))
                                )}

                            </VStack>
                        </Box>
                    )
                }

            </VStack>
        </Container>
    )
}

export default Auth