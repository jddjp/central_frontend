import { Avatar, AvatarProps, Flex, FlexProps } from '@chakra-ui/react'

interface CardWithAvatarProps extends FlexProps {
  avatarProps: AvatarProps
}

export const CardWithAvatar = (props: CardWithAvatarProps) => {
  const { avatarProps, children, ...rest } = props

  return (
    <Flex
      position="relative"
      direction="column"
      align={{ base: 'center' }}
      shadow={{ base: 'base' }}
      rounded={{ sm: 'lg' }}
      px={{ base: '6', md: '8' }}
      pb={{ base: '6', md: '8' }}
      {...rest}
    >
      <Avatar
        mt="-10"
        borderWidth="6px"
        size="2xl"
        {...avatarProps}
      />
      {children}
    </Flex>
  )
}