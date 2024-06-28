import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Stack,
    Spinner,
    Grid,
    Text,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image as ChakraImage,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [personagens, setPersonagens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    const navigate = useNavigate();

    const buscarPersonagens = async () => {
        setCarregando(true);
        try {
            const response = await axios.get('https://thesimpsonsquoteapi.glitch.me/quotes?count=50');
            
            const personagensUnicos = [];
            const personagensVistos = {};

            response.data.forEach(personagem => {
                if (!personagensVistos[personagem.character]) {
                    personagensUnicos.push(personagem);
                    personagensVistos[personagem.character] = true;
                }
            });

            setPersonagens(personagensUnicos);
            setCarregando(false);
        } catch (error) {
            setErro('Erro ao carregar personagens. Por favor, tente novamente mais tarde.');
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarPersonagens();
    }, []);

    const handleChangeBusca = (event) => {
        setTermoBusca(event.target.value);
    };

    const abrirModalPersonagem = (personagem) => {
        setPersonagemSelecionado(personagem);
    };

    const fecharModalPersonagem = () => {
        setPersonagemSelecionado(null);
    };

    const handlePaginaAnterior = () => {
        setPaginaAtual(prevPagina => Math.max(prevPagina - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(prevPagina => Math.min(prevPagina + 1, Math.ceil(personagensFiltrados.length / itensPorPagina)));
    };

    const personagensFiltrados = personagens.filter(personagem =>
        personagem.character.toLowerCase().includes(termoBusca.toLowerCase()) ||
        personagem.quote.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const indexUltimoPersonagem = paginaAtual * itensPorPagina;
    const indexPrimeiroPersonagem = indexUltimoPersonagem - itensPorPagina;
    const personagensExibidos = personagensFiltrados.slice(indexPrimeiroPersonagem, indexUltimoPersonagem);

    return (
        <Box className="pagina-lista" bg="gray.100" minH="100vh" py="50px">
            <Container maxW="800px" bg="white" borderRadius="10px" boxShadow="lg" p="20px">
                <Heading as="h1" mb="20px" textAlign="center">Personagens dos Simpsons</Heading>
                <Stack mb="20px" direction="row" spacing="10px" justify="center" align="center">
                    <Input
                        type="text"
                        value={termoBusca}
                        onChange={handleChangeBusca}
                        placeholder="Buscar por nome do personagem ou citação"
                        w="300px"
                    />
                    <Button colorScheme="blue" onClick={() => setTermoBusca('')}>
                        Limpar
                    </Button>
                </Stack>
                {carregando ? (
                    <Stack justify="center" align="center" py="50px">
                        <Spinner size="xl" color="red.500" />
                    </Stack>
                ) : erro ? (
                    <Text color="red.500" textAlign="center">{erro}</Text>
                ) : (
                    <>
                        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="20px">
                            {personagensExibidos.map(personagem => (
                                <Box key={personagem.character} p="10px" boxShadow="md" borderRadius="8px" cursor="pointer" onClick={() => abrirModalPersonagem(personagem)}>
                                    <Stack p="10px" align="center">
                                        <ChakraImage src={personagem.image} alt={personagem.character} borderRadius="full" boxSize="150px" mb="10px" />
                                        <Text fontSize="lg" fontWeight="bold">{personagem.character}</Text>
                                        <Text fontSize="sm" color="gray.400">Clique para mais informações</Text>
                                    </Stack>
                                </Box>
                            ))}
                        </Grid>
                        <Stack direction="row" spacing="10px" justify="center" align="center" mt="20px">
                            <Button colorScheme="blue" onClick={handlePaginaAnterior} isDisabled={paginaAtual === 1}>
                                Página Anterior
                            </Button>
                            <Text>{`Página ${paginaAtual} de ${Math.ceil(personagensFiltrados.length / itensPorPagina)}`}</Text>
                            <Button colorScheme="blue" onClick={handleProximaPagina} isDisabled={paginaAtual === Math.ceil(personagensFiltrados.length / itensPorPagina)}>
                                Próxima Página
                            </Button>
                        </Stack>
                    </>
                )}
                <Stack mt="20px" direction="row" spacing="10px" justify="center" align="center">
                    <Button colorScheme="blue" onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                </Stack>
            </Container>

            <Modal isOpen={personagemSelecionado !== null} onClose={fecharModalPersonagem} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{personagemSelecionado?.character}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ChakraImage src={personagemSelecionado?.image} alt={personagemSelecionado?.character} borderRadius="full" boxSize="150px" mb="10px" />
                        <Text fontSize="lg">Citação: {personagemSelecionado?.quote}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={fecharModalPersonagem}>Fechar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Home;
