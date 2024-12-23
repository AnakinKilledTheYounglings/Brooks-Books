// backend/src/config/neo4j.js
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Test the connection
const testConnection = async () => {
  const session = driver.session();
  try {
    await session.run('RETURN 1');
    console.log('Successfully connected to Neo4j');
  } catch (error) {
    console.error('Neo4j connection error:', error);
  } finally {
    await session.close();
  }
};

// Initialize connection on startup
testConnection();

export default driver;