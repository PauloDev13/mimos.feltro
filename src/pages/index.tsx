import type {NextPage} from 'next';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <ul>
          <li>Product 1</li>
          <li>Product 1</li>
          <li>Product 1</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Home;
