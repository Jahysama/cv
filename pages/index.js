import NextLink from 'next/link'
import Head from 'next/head'
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
	<Head>
        <meta name="yandex-verification" content="7f159ff75782b5a5" />
      </Head>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={3}
        textAlign="center"
        bg={useColorModeValue('whigreenpha.500', 'whigreenpha.200')}
      >
        Hello, Hallo, Привет, こんにちは! I&apos;m a Datascientist and Bioinformatician based in Yerevan, Armenia
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Egor Kosaretsky
          </Heading>
          <p> Bioinformatician / Data Scientist </p>
	<NextLink href="../cv.pdf">
		<p>Download one page CV</p>
          </NextLink>
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
          Hi again! I'm a student at Lomonosov Moscow State University. I'm passionate about Machine learning and often hang out on kaggle searching for new datasets. I also like to apply my skills in computational and structural biology. In a free time i make simple indie games using python. Linux enthusiast and open source software contributor(I use Void btw).
        </Paragraph>
      </Section>

<Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Work at DevSect
        </Heading>
        <Paragraph>
         Building AI infrastructure from ground up with help of Docker, AirFlow/Langchain, Kubernetes, PostgreSQL and FastAPI. Responsible for researching, finetuning Llama and other LLMs, text classificators to develop most efficient talking head pipeline enhancing user engaging in chatbot mobile app.
          </Paragraph>
        <Box align="center" my={4}>
          <NextLink href="https://sect.dev/">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              DevSect
            </Button>
          </NextLink>
        </Box>
      </Section>

<Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Work at GENXT
        </Heading>
        <Paragraph>
         I have developed and held responsible for testing of pipeline of pedigree simulation with unrelated founders, relatedness degrees estimation and compare between true and estimated degrees. In my work I actively use ERSA, KING, IBIS, Ped-Sim with samtools inside Snakemake. Important part of my work is also pipeline speed enhancement, which requires computing power estimation and optimization. I'm also involved in Federated machine learning engine research for phenotype prediction based on SNV data. Working with XGBoost, Random Forest and MLP models fine tuning.
          </Paragraph>
        <Box align="center" my={4}>
          <NextLink href="https://genxt.network/">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              GENXT
            </Button>
          </NextLink>
        </Box>
        <Box align="center" my={4}>
          <NextLink href="/posts">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              My Publications
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
	Working as a junior manager at Wanta Group.
        </BioSection>
	<BioSection>
          <BioYear>2021-2023</BioYear>
	Working as a bioinformatician at GENXT.
        </BioSection>
	<BioSection>
          <BioYear>2023-present</BioYear>
	Working as a Ml- and Data- Engineer at DevSect.
        </BioSection>
        <BioSection>
          <BioYear>2021</BioYear>
          Max Delbrück Center for Molecular Medicine: Online course Computational Genomics: Hands-on course on Machine Learning for Genomics, Computational Genomics in R
        </BioSection>
        <BioSection>
          <BioYear>2018-2025</BioYear>
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
         <b>Russian: </b>Native, <b>German: </b>Upper-intermediate, <b>English: </b>Upper-intermediate, <b>Japanese: </b>Basic.
        </Paragraph>
        <Paragraph>
        <i><b>Programming skills and languages:</b></i>
        </Paragraph>
	<Paragraph>
	<b>Python:</b> Pytorch, NumPy, Pandas, Polars, scikit-learn, PyMol, SeaBorn, Luigi, Snakemake, FastAPI
	</Paragraph>
	<Paragraph>
	<b>Cloud and Databases:</b> Google cloud, Yandex cloud, Docker, Kubernetes, PostgreSQL, Airflow, Luigi, Hadoop, Mlflow
	</Paragraph>
        <Paragraph>
         <b>R:</b> tidyverse, ggplot2, caret
        </Paragraph>
	<Paragraph>
	<b>Web:</b> HTML, CSS, JavaScript, FastAPI
	</Paragraph>

        <Box align="center" my={4}>
          <NextLink href="/works">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="green">
              Works
            </Button>
          </NextLink>
        </Box>

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
        </List>
        </Section>


      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Contact me
        </Heading>
        <List>
          <ListItem>
            <Link href="mailto:egor@kosaretsky.co.uk" target="_blank">
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
