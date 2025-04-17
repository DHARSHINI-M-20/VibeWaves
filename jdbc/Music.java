import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class Music {
    private static final String URL = "jdbc:mysql://localhost:3307/musicdb";
    private static final String USER = "root";
    private static final String PASSWORD = "Dharsh@2005";

    public static Connection connect() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            connection.setAutoCommit(true); // Ensure auto-commit is enabled
            System.out.println("Database connected successfully!");
            return connection;
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found. Ensure the driver is added to the classpath.");
            e.printStackTrace();
            return null;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void insertSong(String title, String artist, int duration) {
        String query = "INSERT INTO songs (title, artist, duration) VALUES (?, ?, ?)";
        try (Connection connection = connect();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, title);
            preparedStatement.setString(2, artist);
            preparedStatement.setInt(3, duration);
            int rowsInserted = preparedStatement.executeUpdate();
            System.out.println(rowsInserted + " row(s) inserted.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void updateSong(int id, String title, String artist, int duration) {
        String query = "UPDATE songs SET title = ?, artist = ?, duration = ? WHERE id = ?";
        try (Connection connection = connect();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, title);
            preparedStatement.setString(2, artist);
            preparedStatement.setInt(3, duration);
            preparedStatement.setInt(4, id);
            int rowsUpdated = preparedStatement.executeUpdate();
            System.out.println(rowsUpdated + " row(s) updated.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void deleteSong(int id) {
        String query = "DELETE FROM songs WHERE id = ?";
        try (Connection connection = connect();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, id);
            int rowsDeleted = preparedStatement.executeUpdate();
            System.out.println(rowsDeleted + " row(s) deleted.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void readSongs() {
        String query = "SELECT * FROM songs";
        try (Connection connection = connect();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query)) {
            System.out.println("ID | Title | Artist | Duration");
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String title = resultSet.getString("title");
                String artist = resultSet.getString("artist");
                int duration = resultSet.getInt("duration");
                System.out.println(id + " | " + title + " | " + artist + " | " + duration);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\nChoose an operation:");
            System.out.println("1. Insert a song");
            System.out.println("2. Update a song");
            System.out.println("3. Delete a song");
            System.out.println("4. Read all songs");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter song title: ");
                    String title = scanner.nextLine();
                    System.out.print("Enter artist name: ");
                    String artist = scanner.nextLine();
                    System.out.print("Enter duration (in seconds): ");
                    int duration = scanner.nextInt();
                    insertSong(title, artist, duration);
                    break;
                case 2:
                    System.out.print("Enter song ID to update: ");
                    int updateId = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    System.out.print("Enter new song title: ");
                    String newTitle = scanner.nextLine();
                    System.out.print("Enter new artist name: ");
                    String newArtist = scanner.nextLine();
                    System.out.print("Enter new duration (in seconds): ");
                    int newDuration = scanner.nextInt();
                    updateSong(updateId, newTitle, newArtist, newDuration);
                    break;
                case 3:
                    System.out.print("Enter song ID to delete: ");
                    int deleteId = scanner.nextInt();
                    deleteSong(deleteId);
                    break;
                case 4:
                    readSongs();
                    break;
                case 5:
                    System.out.println("Exiting program...");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }
}
