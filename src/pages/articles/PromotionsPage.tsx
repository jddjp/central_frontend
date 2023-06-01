import { Box, Image, Text } from '@chakra-ui/react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import { getPromotions } from 'services/api/promotions';
import { useQuery } from 'react-query';
import "./style.css"
const BASE_URL = 'http://54.165.25.186:1380' 

const PromotionsPage = () => {

  const { data: promotionsMedia } = useQuery(['promotions'], getPromotions)

  return (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Text fontSize='30px' fontWeight='bold' width='100%' textAlign='center' mb='5rem'>Promociones</Text>
      <Splide options={{
          type: 'loop',
          perPage: 4,
          width: '90%',
          height: '18rem',
          lazyLoad: true,
          arrows: false,
        }}>
        {promotionsMedia?.map((promo: any) => (
          <SplideSlide key={promo.hash}>
            <Image src={`${BASE_URL}${promo.formats.thumbnail.url}`} alt={promo.hash} height='100%' objectFit='cover' borderRadius='none'/>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
}

export default PromotionsPage;