import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  height: 10px;
  line-height: 10px;
  padding: 13px;

  &:hover img {
    transform: scale(0.9);
  }
`

const Logo = () => {
  const FrogImg = `/images/frog${useColorModeValue('', '-dark')}.gif`

  return (
    <Link href="/">
      <a>
        <LogoBox>
          <Image src={FrogImg} width={40} height={40} alt="logo" />
          <Text
            color={useColorModeValue('gray.800', 'whiteAlpha.900')}
            fontFamily='M PLUS Rounded 1c", sans-serif'
            fontWeight="bold"
            ml={3}
          >
            Egor Kosaretsky
          </Text>
        </LogoBox>
      </a>
    </Link>
  )
}

export default Logo
