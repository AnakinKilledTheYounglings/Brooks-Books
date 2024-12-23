// backend/src/utils/graphSync.js
import Book from '../models/Book.js';
import graphService from '../services/graphService.js';
import driver from '../config/neo4j.js';

export const syncBooksToGraph = async () => {
  const session = driver.session();
  try {
    // First, clear existing book nodes (but keep Author, Genre, and Tag nodes)
    await session.writeTransaction(tx =>
      tx.run('MATCH (b:Book) DETACH DELETE b')
    );

    // Get all books from MongoDB
    const books = await Book.find({});
    console.log(`Found ${books.length} books to sync`);

    // Add each book to Neo4j
    for (const book of books) {
      try {
        await graphService.addBook(book);
        console.log(`Synced book: ${book.title}`);
      } catch (error) {
        console.error(`Error syncing book ${book.title}:`, error);
      }
    }

    console.log('Graph sync completed');
  } catch (error) {
    console.error('Error during graph sync:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export const updateBookInGraph = async (bookId) => {
  try {
    // Get updated book data from MongoDB
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Remove existing book node and relationships
    const session = driver.session();
    try {
      await session.writeTransaction(tx =>
        tx.run('MATCH (b:Book {id: $bookId}) DETACH DELETE b', { bookId: bookId.toString() })
      );
    } finally {
      await session.close();
    }

    // Add updated book data
    await graphService.addBook(book);
    console.log(`Updated book in graph: ${book.title}`);
  } catch (error) {
    console.error(`Error updating book ${bookId} in graph:`, error);
    throw error;
  }
};