import { Box, Button, Img, Text, useColorModeValue, VStack } from '@chakra-ui/react'

import { useNavigate } from 'react-router-dom';
import { Card } from 'components/Card';
import "./style.css"

const PromotionsPage = () =>{
  const navigate = useNavigate();

  const handleCatalogue = () => {
    navigate('/catalogue');
  }

  return (
    <VStack marginY="50px" marginX="auto" maxW="xl" spacing={8}>
      <Card
        w="full"
        backgroundImage={"url(data:image/png;base64,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)"}
        backgroundRepeat="no-repeat"
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        px={{ base: '300', md: '350' }}
      >
        <VStack color="white" fontSize={30} spacing={10} alignItems="center">

            <Box>
              <Text fontSize="42px" textAlign="center" fontWeight="normal" fontFamily="mono">COMERCIALIZADORA <br /> SAN JOSE</Text>
              <hr></hr>
            </Box>

            <VStack marginY="auto" marginX="auto" maxW="x1" spacing={10}>
                <Card
                  w="full"
                  bg={useColorModeValue('rgba(255, 255, 51, 0.8)', 'gray.700')}
                  px={{ base: '100', md: '100' }}
                >
                  <Box>
                    <Text textAlign="center" 
                    textColor="black" 
                    fontWeight="medium" 
                    fontFamily="mono"
                    fontSize="40px"
                    padding="10px"
                    >
                      ¡PROMOCIONES!
                    </Text>
                  </Box>
                  <div className='contenedor'>
                    <VStack marginY="auto" marginX="auto" maxW="x1" spacing={10} >
                      <Card
                        w="fit-content"
                        bg={useColorModeValue('#efeddc', 'gray.700')}
                        px={{ base: '2', md: '10' }}
                      >
                        <Box>
                          <Img src='http://cdn.shopify.com/s/files/1/0378/4212/4937/articles/soya_texturizada.png?v=1633109801'></Img>
                          <Text textColor="black" textAlign="center" fontFamily="mono" fontSize="16px">Soya después de 15 Bts.</Text>
                          <Text textColor="red" textAlign="center" fontFamily="mono" fontSize="16px">$13.80</Text>
                        </Box>                      
                      </Card>

                      <Card
                        w="fit-content"
                        bg={useColorModeValue('#efeddc', 'gray.700')}
                        px={{ base: '2', md: '10' }}
                      >
                      <Box>
                          <Img src='https://www.laranitadelapaz.com.mx/images/thumbs/0005159_arroz-morelos-sos-azul-1-kg-bolsa_510.jpeg'></Img>
                          <Text textColor="black" textAlign="center" fontFamily="mono" fontSize="16px">Arroz S.O.S después de 15 Bts.</Text>
                          <Text textColor="red" textAlign="center" fontFamily="mono" fontSize="16px">$18.20</Text>
                      </Box>                    
                      </Card>

                      <Card
                        w="fit-content"
                        bg={useColorModeValue('#efeddc', 'gray.700')}
                        px={{ base: '2', md: '10' }} 
                      >
                      <Box>
                          <Img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpKStSpI82s0qYwm4B0XAsegjBks6wxTe5J7_JIcKdSdPpTOdtY5Wm0m6pCjpDibkmxDg&usqp=CAU'></Img>
                          <Text textColor="black" textAlign="center" fontFamily="mono" fontSize="16px">Papas "LA PAPERIA" por cada caja.</Text>
                          <Text textColor="red" textAlign="center" fontFamily="mono" fontSize="16px">1/2 kilo de regalo</Text>
                      </Box>                    
                      </Card>

                      <Card
                        w="fit-content"
                        bg={useColorModeValue('#efeddc', 'gray.700')}
                        px={{ base: '2', md: '10' }} 
                      >
                      <Box>
                          <Img src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Botella_La_Botanera_370g.jpg/220px-Botella_La_Botanera_370g.jpg'></Img>
                          <Text textColor="black" textAlign="center" fontFamily="mono" fontSize="16px">Salsa botanera después de 6 cajas.</Text>
                          <Text textColor="red" textAlign="center" fontFamily="mono" fontSize="16px">$43.00</Text>
                      </Box>                    
                      </Card>
                    </VStack>
                  </div>
                    <Box>
                      <Text textAlign="center" 
                      textColor="black" 
                      fontWeight="medium" 
                      fontFamily="mono"
                      fontSize="40px"
                      padding="10px"
                      >
                        ¡PROMOCIONES!
                      </Text>
                    </Box>
                </Card>
            </VStack>

            <VStack marginY="auto" marginX="auto" maxW="x1" spacing={10}>
                <Button
                  onClick={handleCatalogue}
                  colorScheme="black"
                  backgroundColor="rgba(255, 255, 51, 0.8)"
                  textColor="black"
                  fontSize="40px"
                  fontWeight="medium"
                  textAlign="center"
                  fontFamily="mono"
                  height="80px"
                  width="500px"
                >
                  CATÁLOGO
                </Button>
            </VStack>

        </VStack>
      </Card>
    </VStack>
  );
}

export default PromotionsPage;