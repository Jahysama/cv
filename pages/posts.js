import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import OldSite from '../public/images/contents/old_site.jpg'

const Posts = () => (
  <Layout title="Posts">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Posts
      </Heading>

      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="My old terrible website"
            thumbnail={OldSite}
            href="https://kodomo.fbb.msu.ru/~kosar/"
          />
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Posts
