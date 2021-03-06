import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import { GridItem } from '../components/grid-item'

import Fuuka from '../public/images/works/Fuuka.png'
import BoardGames from '../public/images/works/board.jpg'
import WrongGen from '../public/images/works/wrongen.jpeg'
import CompTech from '../public/images/works/comp.png'


const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <GridItem href="https://github.com/Jahysama/Fuuka" title="Fuuka discord bot" thumbnail={Fuuka}>
            A Deep Learning chat bot that can generate various pictures and talk to people.
          </GridItem>
        </Section>
        <Section>
          <GridItem href="https://github.com/comptech-winter-school/genetic-potioncraft" title="Genetic Potion" thumbnail={CompTech}>
            Scikit-learn ML enhancer based on genetic algorithms.
          </GridItem>
        </Section>
     
      </SimpleGrid>

      <Section delay={0.2}>
        <Divider my={6} />

        <Heading as="h3" fontSize={20} mb={4}>
          Highlighted Kaggle Notebooks
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.3}>
          <GridItem
            href = "https://www.kaggle.com/jahysama/i-was-born-in-a-wrong-generation"
            thumbnail={WrongGen}
            title="I wAs BoRn iN a WrOnG GeNeRaTiOn"
          >
            Top 5000 Albums of All Time analysis with clustering and visualisation in R
          </GridItem>
        </Section>
        <Section delay={0.3}>
          <GridItem href="https://www.kaggle.com/jahysama/quick-eda-in-r" thumbnail={BoardGames} title="Board Games Analysis">
            BoardGamesGeek all games analysis in R
          </GridItem>
        </Section>
      </SimpleGrid>

    </Container>
  </Layout>
)

export default Works
