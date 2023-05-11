import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import GRAPE from '../public/images/contents/grape.jpg'
import MUTS from '../public/images/contents/muts.jpg'
import CONF from '../public/images/contents/conf.jpg'
import FED from '../public/images/contents/FED.jpg'

const Publications = () => (
  <Layout title="Publications">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Publications
      </Heading>

        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <Section>
          <GridItem
            title="Genomic Relatedness Detection Pipeline"
            thumbnail={GRAPE}
            href="https://www.biorxiv.org/content/10.1101/2022.03.11.483988v1"
          />
         </Section>

          <Section>
          <GridItem
            title="A Promising Tool for the Crosslinking of the MutS Protein Preserving Its Functional Activity"
            thumbnail={MUTS}
            href="https://link.springer.com/article/10.1134/S1068162021020205"
          />
         </Section>

          <Section>
          <GridItem
            title="Computational biology and artificial intelligence for personalized medicine-2022"
            thumbnail={CONF}
            href="https://doi.org/10.14341/CBAI-2022-44"
          />
         </Section>
          <Section>
          <GridItem
            title="Efficacy of federated learning on genomic data: a study on the UK Biobank and the 1000 Genomes Project"
            thumbnail={FED}
            href="https://www.medrxiv.org/content/10.1101/2023.01.24.23284898v2"
          />
         </Section>
        </SimpleGrid>
    </Container>
  </Layout>
)

export default Publications
