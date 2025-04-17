import java.io.FileInputStream;
import java.util.Scanner;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.*;
import javazoom.jl.player.Player;

public class Main {
    private static Player musicPlayer;
    private static Thread musicThread;

    public static void main(String[] args) {
        try {
            // Parse layout.xml
            File layoutFile = new File("layout.xml");
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(layoutFile);

            // Get title from layout.xml
            NodeList titleNode = doc.getElementsByTagName("title");
            String title = titleNode.item(0).getTextContent();
            System.out.println(title);

            // Get buttons from layout.xml
            NodeList buttons = doc.getElementsByTagName("button");
            System.out.println("Available buttons:");
            for (int i = 0; i < buttons.getLength(); i++) {
                Element button = (Element) buttons.item(i);
                System.out.println("- " + button.getTextContent());
            }

            // Simulate button functionality
            System.out.println("Enter command (play, pause, exit):");
            Scanner scanner = new Scanner(System.in);
            String command;
            while (!(command = scanner.nextLine()).equalsIgnoreCase("exit")) {
                if (command.equalsIgnoreCase("play")) {
                    playMusic("s1.mp3");
                } else if (command.equalsIgnoreCase("pause")) {
                    pauseMusic();
                } else {
                    System.out.println("Invalid command. Use: play, pause, exit");
                }
                System.out.print("Command: ");
            }
            System.out.println("Goodbye from VibeWaves!");
            scanner.close();
            stopMusic();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // Play music
    private static void playMusic(String filePath) {
        if (musicPlayer != null) {
            System.out.println("Music is already playing.");
            return;
        }
        try {
            FileInputStream fileInputStream = new FileInputStream(filePath);
            musicPlayer = new Player(fileInputStream);
            musicThread = new Thread(() -> {
                try {
                    musicPlayer.play();
                } catch (Exception e) {
                    System.out.println("Error playing music: " + e.getMessage());
                }
            });
            musicThread.start();
            System.out.println("Playing music...");
        } catch (Exception e) {
            System.out.println("Error loading music file: " + e.getMessage());
        }
    }

    // Pause music
    private static void pauseMusic() {
        System.out.println("Pause functionality is not supported with JLayer.");
    }

    // Stop music
    private static void stopMusic() {
        if (musicPlayer != null) {
            musicPlayer.close();
            musicPlayer = null;
            musicThread = null;
            System.out.println("Music stopped.");
        }
    }
}
