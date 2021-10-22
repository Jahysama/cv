import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Image,
  SimpleGrid,
  Button,
  List,
  ListItem,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoMailSharp,
  SiUpwork,
  SiBuymeacoffee
} from 'react-icons/io5'

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={3}
        textAlign="center"
        bg={useColorModeValue('whigreenpha.500', 'whigreenpha.200')}
      >
        Hello, Hallo, Привет, こんにちは! I&apos;m a Junior Datascientist and Bioinformatics student based in Moscow, Russia OwO/
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Egor Kosaretskiy
          </Heading>
          <p> Bioinformatician / Data Scientist / ?Game developer?</p>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          textAlign="center"
        >
          <Image
            borderColor="whigreenpha.800"
            borderWidth={2}
            borderStyle="solid"
            maxWidth="100px"
            display="inline-block"
            borderRadius="full"
            src="/images/egor.jpg"
            alt="Profile image"
          />
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          Bio
        </Heading>
        <Paragraph>
          Hi again! I'm a student at Lomonosov Moscow State University. I'm passionate about Machine learning and often hang out on kaggle searching for new datasets. I also like to apply my skills in computational and structural biology. In a free time i make simple indie games using python.
        </Paragraph>
      </Section>

<Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Lab
        </Heading>
        <Paragraph>
         Currently studying Tenebrio bugs digestive enzymes. Buildings de novo protein structures and finding ligand interactions with PyMol and docking tools. Previously worked with MutS protein wich is part of DNA reparation system.
          </Paragraph>
        <Box align="center" my={4}>
          <NextLink href="/works">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              My works
            </Button>
          </NextLink>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
         Work and Education
        </Heading>
        <BioSection>
          <BioYear>2019</BioYear>
	Working as junior manager at Wanta Group.
        </BioSection>
        <BioSection>
          <BioYear>2021</BioYear>
          Max Delbrück Center for Molecular Medicine: Online course Computational Genomics: Hands-on course on Machine Learning for Genomics, Computational Genomics in R
        </BioSection>
        <BioSection>
          <BioYear>2018-2024</BioYear>
          Studying at Lomonosov Moscow State University faculty of Bioengineering and Bioinformatics.
        </BioSection>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          My skills
        </Heading>

        <Paragraph>
        <i><b>Languages:</b></i>
        </Paragraph>
        <Paragraph>
         <b>Russian:</b>Native, <b>German:</b> Upper-intermediate, <b>English:</b> Upper-intermediate, <b>Japanese:</b> Basic.
        </Paragraph>
        <Paragraph>
        <i><b>Programming skills and languages:</b></i>
        </Paragraph>
        <Paragraph>
         <b>Python:</b> (Pytorch, NumPy, Pandas. PyMol, SeaBorn, Luigi), <b>R:</b>(tidyverse, ggplot2, caret), HTML, CSS, JavaScript, SQL, Google and Yandex cloud.
        </Paragraph>
      </Section>
      
      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Hire me
        </Heading>
        <List>
          <ListItem>
            <Link href="https://hh.ru/resume/702a5896ff073a7d210039ed1f574966645048" target="_blank">
              <Button
                variant="ghost"
                colorScheme="green"
                
              >
                Head Hunter
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.upwork.com/freelancers/~01c39f9ac5439b8645" target="_blank">
              <Button
                variant="ghost"
                colorScheme="green"
                
              >
                UpWork
              </Button>
            </Link>
          </ListItem>
        </List>
        </Section>


      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Contact me
        </Heading>
        <List>
          <ListItem>
            <Link href="mailto:megametagross@outlook.de" target="_blank">
              <Button
                variant="ghost"
                colorScheme="green"
                leftIcon={<Icon as={IoMailSharp} />}
              >
                Mail
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.linkedin.com/in/egor-kosaretskiy-841789223" target="_blank">
              <Button
                variant="ghost"
                colorScheme="green"
                leftIcon={<Icon as={IoLogoLinkedin} />}
              >
                Egor Kosaretskiy
              </Button>
            </Link>
          </ListItem>
        </List>

        <Box align="center" my={4}>
          <NextLink href="/posts">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              Posts
            </Button>
          </NextLink>
        </Box>

	<Box align="center" my={4}>
          <NextLink href="https://www.buymeacoffee.com/kosar">
            <Button colorScheme="yellow">
              Donate me
            </Button>
          </NextLink>
        </Box>

      </Section>
    </Container>
  </Layout>
)

export default Home
