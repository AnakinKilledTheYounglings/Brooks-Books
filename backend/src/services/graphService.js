// backend/src/services/graphService.js
import driver from '../config/neo4j.js';


class GraphService {
async addBook(bookData) {
    const session = driver.session();
    try {
      const result = await session.writeTransaction(async tx => {
        const bookQuery = `
          // Create book node
          CREATE (b:Book {
            id: $bookId,
            title: $title,
            author: $author
          })
          
          // Create or merge author and create relationship
          MERGE (a:Author {name: $author})
          CREATE (b)-[:WRITTEN_BY]->(a)
          
          // Create genre relationships
          WITH b
          UNWIND $genres as genre
          MERGE (g:Genre {name: genre})
          CREATE (b)-[:IN_GENRE]->(g)
          
          // Create tag relationships
          WITH b
          UNWIND $tags as tag
          MERGE (t:Tag {name: tag})
          CREATE (b)-[:HAS_TAG]->(t)
          
          RETURN b
        `;

        return await tx.run(bookQuery, {
          bookId: bookData._id.toString(),
          title: bookData.title,
          author: bookData.author,
          genres: bookData.genres || [],
          tags: bookData.tags || []
        });
      });

      return result.records[0];
    } finally {
      await session.close();
    }
  }

  async findSimilarBooks(bookId) {
    const session = driver.session();
    try {
      const result = await session.readTransaction(async tx => {
        // Find books with similar genres and tags
        const query = `
          MATCH (b:Book {id: $bookId})
          MATCH (b)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(other:Book)
          WHERE b <> other
          WITH other, count(g) as commonGenres
          MATCH (b)-[:HAS_TAG]->(t:Tag)<-[:HAS_TAG]-(other)
          WITH other, commonGenres, count(t) as commonTags
          RETURN other.title as title,
                 other.id as id,
                 commonGenres,
                 commonTags,
                 (commonGenres * 2 + commonTags) as similarity
          ORDER BY similarity DESC
          LIMIT 5
        `;

        return await tx.run(query, { bookId });
      });

      return result.records.map(record => ({
        title: record.get('title'),
        id: record.get('id'),
        similarityScore: record.get('similarity')
      }));
    } finally {
      await session.close();
    }
  }

  async findBooksByTag(tag) {
    const session = driver.session();
    try {
      const result = await session.readTransaction(async tx => {
        const query = `
          MATCH (b:Book)-[:HAS_TAG]->(t:Tag {name: $tag})
          RETURN b.title as title, b.id as id
        `;
        return await tx.run(query, { tag });
      });

      return result.records.map(record => ({
        title: record.get('title'),
        id: record.get('id')
      }));
    } finally {
      await session.close();
    }
  }

  async getBookRecommendations(userId) {
    const session = driver.session();
    try {
      const result = await session.readTransaction(async tx => {
        // Find books based on user's reading history and preferences
        const query = `
          MATCH (u:User {id: $userId})-[:READ]->(b:Book)-[:IN_GENRE]->(g:Genre)
          MATCH (g)<-[:IN_GENRE]-(rec:Book)
          WHERE NOT (u)-[:READ]->(rec)
          WITH rec, count(DISTINCT g) as commonGenres
          RETURN rec.title as title,
                 rec.id as id,
                 commonGenres as score
          ORDER BY score DESC
          LIMIT 10
        `;

        return await tx.run(query, { userId });
      });

      return result.records.map(record => ({
        title: record.get('title'),
        id: record.get('id'),
        score: record.get('score').toNumber()
      }));
    } finally {
      await session.close();
    }
  }


async getFullGraph(filters = {}) {
    const session = driver.session();
    try {
      console.log('Starting graph query with filters:', filters);
      const result = await session.readTransaction(async tx => {
        // Modified query to properly handle node collection and transformation
        const query = `
          // Match nodes based on filters
          MATCH (n)
          WHERE CASE
            WHEN $nodeType IS NOT NULL THEN labels(n)[0] = $nodeType
            ELSE true
          END
          AND CASE
            WHEN $filterValue IS NOT NULL 
            THEN (n.title = $filterValue OR n.name = $filterValue)
            ELSE true
          END
          
          // First collect all matching nodes
          WITH collect(n) as allNodes
          
          // Unwind nodes to get relationships
          UNWIND allNodes as n
          OPTIONAL MATCH (n)-[r]-(m)
          WHERE m IN allNodes
          
          // Collect everything with proper node formatting
          WITH collect(DISTINCT {
            id: toString(id(n)),
            type: labels(n)[0],
            name: CASE labels(n)[0]
              WHEN 'Book' THEN n.title
              WHEN 'Author' THEN n.name
              WHEN 'Genre' THEN n.name
              WHEN 'Tag' THEN n.name
              ELSE coalesce(n.name, n.title, 'Unknown')
            END,
            properties: properties(n)
          }) as nodes,
          collect(DISTINCT CASE WHEN r IS NOT NULL
            THEN {
              source: toString(id(startNode(r))),
              target: toString(id(endNode(r))),
              type: type(r)
            }
          END) as rels
          
          // Return final result
          RETURN {
            nodes: [node in nodes WHERE node IS NOT NULL],
            links: [rel in rels WHERE rel IS NOT NULL]
          } as graph
        `;

        const params = {
          nodeType: filters.nodeType || null,
          filterValue: filters.value || null
        };

        console.log('Executing query with params:', params);
        return await tx.run(query, params);
      });

      if (!result.records || !result.records[0]) {
        console.warn('No records returned from query');
        return { nodes: [], links: [] };
      }

      const graphData = result.records[0].get('graph');
      console.log('Raw graph data:', JSON.stringify(graphData, null, 2));

      // Transform data for visualization
      const transformedData = {
        nodes: graphData.nodes.map(node => ({
          ...node,
          color: this.getNodeColor(node.type)
        })),
        links: graphData.links.map(link => ({
          ...link,
          value: 1
        }))
      };

      console.log(`Transformed data: ${transformedData.nodes.length} nodes, ${transformedData.links.length} links`);
      return transformedData;

    } catch (error) {
      console.error('Detailed error in getFullGraph:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

findNode(nodes, id) {
    return nodes.find(node => node.id === id);
  }

  getNodeColor(nodeType) {
    const colors = {
      'Book': '#4287f5',    // blue
      'Author': '#42f554',  // green
      'Genre': '#f54242',   // red
      'Tag': '#f5d742'      // yellow
    };
    return colors[nodeType] || '#999999';
  }
  
  // Add this new method to get different colors for different relationship types
  getLinkColor(relationshipType) {
    const colors = {
      'WRITTEN_BY': '#666666',  // Dark gray for author relationships
      'IN_GENRE': '#999999',    // Medium gray for genre relationships
      'HAS_TAG': '#CCCCCC'      // Light gray for tag relationships
    };
    return colors[relationshipType] || '#EEEEEE';
  }


}

export default new GraphService();

